import { createContext, useContext, useState, useEffect, useRef } from "react";
import { logoutApi } from "../utils/ListApi";
import { setLogoutHandler } from "../utils/ApiHelper";
import { ToasterCustom } from "@/components/common/ToasterCustom";
import { toast, Toaster } from "sonner";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem("user");
        return saved ? JSON.parse(saved) : null;
    });

    const [loginStatus, setLoginStatus] = useState(() => {
        return localStorage.getItem("loginStatus") === "true";
    });

    const login = (userData) => {
        isAuthExpiredRef.current = false
        setUser(userData);
        setLoginStatus(true);
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("loginStatus", "true");
    };

    const updateUser = (updatedData) => {
        setUser(prev => {
            const newUser = { ...prev, ...updatedData };
            localStorage.setItem("user", JSON.stringify(newUser));
            return newUser;
        });
    };

    const logout = async () => {
        try {
            await ToasterCustom.promise(logoutApi(), {
                loading: "Logging out...",
                success: "Logout successfully.",
                error: (err) => err?.response?.data?.message || "System is unavailable, please try again later."
            })
        } catch (error) {
            console.log(error);
        } finally {
            setUser(null);
            setLoginStatus(false);
            localStorage.removeItem("user");
            localStorage.removeItem("loginStatus");
        }
    };

    const isAuthExpiredRef = useRef(false)
    const clearAuthState = () => {
        if (isAuthExpiredRef.current) return
        isAuthExpiredRef.current = true

        toast.dismiss()

        setUser(null);
        setLoginStatus(false);

        localStorage.removeItem("user");
        localStorage.removeItem("loginStatus");

        ToasterCustom.error("Token expired, please login to continue.", {
            id: "auth-expired"
        })
    }

    useEffect(() => {
        setLogoutHandler(clearAuthState);
    }, []);

    return (
        <AuthContext.Provider value={{ user, loginStatus, login, logout, clearAuthState, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook untuk pakai context
export const useAuth = () => useContext(AuthContext);
