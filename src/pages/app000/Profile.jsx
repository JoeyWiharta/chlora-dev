import React, { useState, useEffect, useCallback } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import RootPageCustom from "../../components/common/RootPageCustom";
import { changePassword, getProfile, updateProfile } from "../../utils/ListApi";
import PopupDeleteAndRestore from "../../components/common/PopupDeleteAndRestore";
import { CalendarClock, CalendarPlus, Check, Hash, KeyRound, Loader2, Mail, Pencil, ShieldCheck, User, User2, X, Eye, EyeOff, Lock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { handleApiError } from "@/utils/ErrorHandler";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import { ToasterCustom } from "@/components/common/ToasterCustom";
import { formatDate } from "@/components/common/Regex";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";


const Profile = () => {
    const { updateUser, logout } = useAuth()
    const [profileData, setProfileData] = useState({})
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loadingPassword, setLoadingPassword] = useState(false);


    // --------------------------- Fetch API Profile and Set Default Data to Validation Form --------------------------- //
    const fetchProfile = useCallback(async () => {
        setLoading(true);
        try {
            const response = await getProfile();
            setProfileData(response?.data)
        } catch (error) {
            if (handleApiError(error)) return;
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (profileData) {
            profileForm.setValues({
                userId: profileData.userId ?? "",
                email: profileData.email ?? "",
                name: profileData.name ?? "",
                role: profileData.role ?? "",
                createdAt: profileData.createdAt ?? "",
                updatedAt: profileData.updatedAt ?? "",
            });
        }
    }, [profileData])

    useEffect(() => {
        fetchProfile()
    }, [])
    // --------------------------- Fetch API Profile and Set Default Data to Validation Form --------------------------- //

    // --------------------------- Profile Form Validation --------------------------- //
    const profileForm = useFormik({
        initialValues:
        {
            userId: "",
            email: "",
            name: "",
            role: "",
            createdAt: "",
            updatedAt: "",
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .required("Email is required.")
                .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Please enter a valid email address."),
            name: Yup.string()
                .required("Name is required.")
                .min(4, "Name must be at least 4 characters.")
                .max(20, "Name must not exceed 20 characters.")
                .matches(/^[A-Za-z\s]+$/, "Name can only contain letters and spaces."),
        }),

        onSubmit: async (values, { setSubmitting }) => {
            setSubmitting(true);
            setLoading(true)
            await updateProfileAction(values)
            setSubmitting(false)
        },
    });
    // --------------------------- Profile Form Validation --------------------------- //

    // --------------------------- Profile Update Function --------------------------- //
    const updateProfileAction = useCallback(async (param) => {
        try {
            await ToasterCustom.promise(
                updateProfile({
                    email: param.email,
                    name: param.name,
                }),
                {
                    loading: "Saving changes...",
                    success: "Profile updated successfully.",
                    error: (err) => err?.response?.data?.message || "System is unavailable, please try again later."
                }
            )
            updateUser({ name: param.name, email: param.email });
            await fetchProfile();
            setIsEditing(false);
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }, [fetchProfile, updateProfile])
    // --------------------------- Profile Update Function --------------------------- //

    // --------------------------- Cancel Edit Profile Function --------------------------- //

    const handleCancelEditProfile = () => {
        profileForm.resetForm();
        fetchProfile();
        setIsEditing(false);
    };
    // --------------------------- Cancel Edit Profile Function --------------------------- //

    // --------------------------- Create Initial Profile --------------------------- //
    const initialProfileName = (name) => name ? name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) : "??";
    // --------------------------- Create Initial Profile --------------------------- //



    // --------------------------- Password Form Validation --------------------------- //
    const passwordForm = useFormik({
        initialValues: {
            oldPassword: "",
            newPassword: "",
            confirmNewPassword: "",
        },
        validationSchema: Yup.object({
            oldPassword: Yup.string()
                .required("Old password is required."),
            newPassword: Yup.string()
                .required("New password is required.")
                .min(8, "Password must be at least 8 characters.")
                .notOneOf([Yup.ref("oldPassword")], "New password must be different from old password."),
            confirmNewPassword: Yup.string()
                .required("Please confirm your new password.")
                .oneOf([Yup.ref("newPassword")], "Passwords do not match."),
        }),
        onSubmit: async (values, { setSubmitting }) => {
            setSubmitting(true);
            setLoadingPassword(true);
            await changePasswordAction(values);
            setSubmitting(false);
        },
    });
    // --------------------------- Password Form Validation --------------------------- //

    // --------------------------- Password Update Function --------------------------- //
    const changePasswordAction = useCallback(async (param) => {
        try {
            await ToasterCustom.promise(
                changePassword({
                    oldPassword: param.oldPassword,
                    newPassword: param.newPassword,
                    confirmNewPassword: param.confirmNewPassword,
                }),
                {
                    loading: "Changing password...",
                    success: "Password changed successfully.",
                    error: (err) => err?.response?.data?.message || "System is unavailable, please try again later."
                }
            );

            passwordForm.resetForm();
            ToasterCustom.info("Your password has been updated. Please log in again.", {
                icon: <KeyRound size={16} className="text-blue-500" />,
                duration: 2000,
            });
            setTimeout(() => logout(), 2000);
        } catch (error) {
            console.log(error);
        } finally {
            setLoadingPassword(false);
        }
    }, [logout]);
    // --------------------------- Password Update Function --------------------------- //




    return (
        <RootPageCustom
            title={"Profile"}
            desc={"Manage your account information and password"}
        >
            <div className="flex flex-col gap-4 flex-1">
                {/* Account Information */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div className="flex flex-row items-center gap-4">
                            <div className="bg-success/10 p-2 rounded-full">
                                <User size={20} className="text-success" />
                            </div>
                            <div className="flex-1">
                                <CardTitle>Account Information</CardTitle>
                                <CardDescription>Update your personal information</CardDescription>
                            </div>
                        </div>

                        <div className="flex flex-row items-center">
                            {!isEditing ? (
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="gap-2"
                                    onClick={() => setIsEditing(true)}
                                    disabled={loading}
                                >
                                    <Pencil />
                                    Edit
                                </Button>
                            ) : (
                                <div className="flex gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="gap-2"
                                        onClick={handleCancelEditProfile}
                                        disabled={loading}
                                    >
                                        <X />
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        form="profile-form"
                                        size="sm"
                                        className="gap-2"
                                        disabled={loading || !profileForm.dirty || !profileForm.isValid}
                                    >
                                        {loading
                                            ? <Loader2 className="animate-spin" />
                                            : <Check />
                                        }
                                        Save
                                    </Button>
                                </div>
                            )}
                        </div>
                    </CardHeader>

                    <CardContent className="flex flex-col gap-4">
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/40">

                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold shrink-0">
                                {initialProfileName(profileForm.values.name)}
                            </div>

                            <div className="flex flex-col gap-0.5 min-w-0">
                                <span className="font-medium text-base truncate">{profileForm.values.name || "-"}</span>
                                <span className="text-sm text-muted-foreground font-mono">{profileForm.values.userId || "-"}</span>
                            </div>

                            {profileForm.values.role === "ADMIN"
                                ? <Badge className="text-sm ml-auto bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">Admin</Badge>
                                : <Badge className="text-sm ml-auto bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300">User</Badge>
                            }
                        </div>

                        <form id="profile-form" onSubmit={profileForm.handleSubmit}>
                            <FieldGroup className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                                <Field className="gap-2">
                                    <FieldLabel>User ID</FieldLabel>
                                    <InputGroup className="overflow-hidden">
                                        <InputGroupAddon align="inline-start" className="text-muted-foreground/50">
                                            <Hash />
                                        </InputGroupAddon>
                                        <InputGroupInput
                                            id="userId"
                                            name="userId"
                                            type="text"
                                            value={profileForm.values.userId}
                                            disabled
                                        />
                                    </InputGroup>
                                </Field>

                                <Field className="gap-2">
                                    <FieldLabel>Role</FieldLabel>
                                    <InputGroup className="overflow-hidden">
                                        <InputGroupAddon align="inline-start" className="text-muted-foreground/50">
                                            <ShieldCheck />
                                        </InputGroupAddon>
                                        <InputGroupInput
                                            id="role"
                                            name="role"
                                            type="text"
                                            value={profileForm.values.role}
                                            disabled
                                        />
                                    </InputGroup>
                                </Field>

                                <Field className="gap-2">
                                    <FieldLabel>Name</FieldLabel>
                                    <InputGroup className={`overflow-hidden transition-all ${isEditing ? "ring-1 ring-primary/50 rounded-md" : ""}`}>
                                        <InputGroupAddon align="inline-start" className="text-muted-foreground/50">
                                            <User2 className={isEditing ? "text-primary" : "text-inherit"} />
                                        </InputGroupAddon>
                                        <InputGroupInput
                                            id="name"
                                            name="name"
                                            type="text"
                                            value={profileForm.values.name}
                                            onChange={profileForm.handleChange}
                                            onBlur={profileForm.handleBlur}
                                            aria-invalid={profileForm.touched.name && !!profileForm.errors.name}
                                            disabled={!isEditing}
                                            autoComplete="off"
                                        />
                                    </InputGroup>
                                    {profileForm.touched.name && profileForm.errors.name && (
                                        <FieldDescription className="text-xs text-destructive">
                                            {profileForm.errors.name}
                                        </FieldDescription>
                                    )}
                                </Field>

                                <Field className="gap-2">
                                    <FieldLabel className="flex items-center">Email</FieldLabel>
                                    <InputGroup className={`overflow-hidden transition-all ${isEditing ? "ring-1 ring-primary/50 rounded-md" : ""}`}>
                                        <InputGroupAddon align="inline-start" className="text-muted-foreground/50">
                                            <Mail className={isEditing ? "text-primary" : "text-inherit"} />
                                        </InputGroupAddon>
                                        <InputGroupInput
                                            id="email"
                                            name="email"
                                            type="text"
                                            value={profileForm.values.email}
                                            onChange={profileForm.handleChange}
                                            onBlur={profileForm.handleBlur}
                                            aria-invalid={profileForm.touched.email && !!profileForm.errors.email}
                                            disabled={!isEditing}
                                            autoComplete="off"
                                        />
                                    </InputGroup>
                                    {profileForm.touched.email && profileForm.errors.email && (
                                        <FieldDescription className="text-xs text-destructive">
                                            {profileForm.errors.email}
                                        </FieldDescription>
                                    )}
                                </Field>

                                <Field className="gap-2">
                                    <FieldLabel>Date Created</FieldLabel>
                                    <InputGroup className="overflow-hidden">
                                        <InputGroupAddon align="inline-start" className="text-muted-foreground/50">
                                            <CalendarPlus />
                                        </InputGroupAddon>
                                        <InputGroupInput
                                            id="createdAt"
                                            name="createdAt"
                                            type="text"
                                            value={formatDate(profileForm.values.createdAt)}
                                            disabled
                                        />
                                    </InputGroup>
                                </Field>

                                <Field className="gap-2">
                                    <FieldLabel>Last Updated</FieldLabel>
                                    <InputGroup className="overflow-hidden">
                                        <InputGroupAddon align="inline-start" className="text-muted-foreground/50">
                                            <CalendarClock />
                                        </InputGroupAddon>
                                        <InputGroupInput
                                            id="updatedAt"
                                            name="updatedAt"
                                            type="text"
                                            value={formatDate(profileForm.values.updatedAt)}
                                            disabled
                                        />
                                    </InputGroup>
                                </Field>

                            </FieldGroup>
                        </form>
                    </CardContent>
                </Card>

                {/* Password Changes */}
                <Card>
                    <CardHeader className="flex flex-row items-center gap-4">
                        <div className="bg-warning/10 p-2 rounded-full">
                            <KeyRound size={20} className="text-warning" />
                        </div>
                        <div className="flex-1">
                            <CardTitle>Change Password</CardTitle>
                            <CardDescription>Update your password to keep your account secure</CardDescription>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <form id="password-form" onSubmit={passwordForm.handleSubmit}>
                            <FieldGroup className="flex flex-col gap-4">

                                {/* Old Password — full width */}
                                <Field className="gap-2">
                                    <FieldLabel>Old Password</FieldLabel>
                                    <InputGroup className="overflow-hidden">
                                        <InputGroupAddon align="inline-start" className="text-muted-foreground/50">
                                            <Lock />
                                        </InputGroupAddon>
                                        <InputGroupInput
                                            id="oldPassword"
                                            name="oldPassword"
                                            type={showOldPassword ? "text" : "password"}
                                            value={passwordForm.values.oldPassword}
                                            onChange={passwordForm.handleChange}
                                            onBlur={passwordForm.handleBlur}
                                            aria-invalid={passwordForm.touched.oldPassword && !!passwordForm.errors.oldPassword}
                                            autoComplete="current-password"
                                        />
                                        <InputGroupAddon
                                            align="inline-end"
                                            className="text-muted-foreground/50 cursor-pointer hover:text-foreground transition-colors"
                                            onClick={() => setShowOldPassword(prev => !prev)}
                                        >
                                            {showOldPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </InputGroupAddon>
                                    </InputGroup>
                                    {passwordForm.touched.oldPassword && passwordForm.errors.oldPassword && (
                                        <FieldDescription className="text-xs text-destructive">
                                            {passwordForm.errors.oldPassword}
                                        </FieldDescription>
                                    )}
                                </Field>

                                <Field className="gap-2">
                                    <FieldLabel>New Password</FieldLabel>
                                    <InputGroup className="overflow-hidden">
                                        <InputGroupAddon align="inline-start" className="text-muted-foreground/50">
                                            <KeyRound />
                                        </InputGroupAddon>
                                        <InputGroupInput
                                            id="newPassword"
                                            name="newPassword"
                                            type={showNewPassword ? "text" : "password"}
                                            value={passwordForm.values.newPassword}
                                            onChange={passwordForm.handleChange}
                                            onBlur={passwordForm.handleBlur}
                                            aria-invalid={passwordForm.touched.newPassword && !!passwordForm.errors.newPassword}
                                            autoComplete="new-password"
                                        />
                                        <InputGroupAddon
                                            align="inline-end"
                                            className="text-muted-foreground/50 cursor-pointer hover:text-foreground transition-colors"
                                            onClick={() => setShowNewPassword(prev => !prev)}
                                        >
                                            {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </InputGroupAddon>
                                    </InputGroup>
                                    {passwordForm.touched.newPassword && passwordForm.errors.newPassword && (
                                        <FieldDescription className="text-xs text-destructive">
                                            {passwordForm.errors.newPassword}
                                        </FieldDescription>
                                    )}
                                </Field>

                                <Field className="gap-2">
                                    <FieldLabel>Confirm New Password</FieldLabel>
                                    <InputGroup className="overflow-hidden">
                                        <InputGroupAddon align="inline-start" className="text-muted-foreground/50">
                                            <KeyRound />
                                        </InputGroupAddon>
                                        <InputGroupInput
                                            id="confirmNewPassword"
                                            name="confirmNewPassword"
                                            type={showConfirmPassword ? "text" : "password"}
                                            value={passwordForm.values.confirmNewPassword}
                                            onChange={passwordForm.handleChange}
                                            onBlur={passwordForm.handleBlur}
                                            aria-invalid={passwordForm.touched.confirmNewPassword && !!passwordForm.errors.confirmNewPassword}
                                            autoComplete="new-password"
                                        />
                                        <InputGroupAddon
                                            align="inline-end"
                                            className="text-muted-foreground/50 cursor-pointer hover:text-foreground transition-colors"
                                            onClick={() => setShowConfirmPassword(prev => !prev)}
                                        >
                                            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </InputGroupAddon>
                                    </InputGroup>
                                    {passwordForm.touched.confirmNewPassword && passwordForm.errors.confirmNewPassword && (
                                        <FieldDescription className="text-xs text-destructive">
                                            {passwordForm.errors.confirmNewPassword}
                                        </FieldDescription>
                                    )}
                                </Field>

                            </FieldGroup>

                            <div className="flex justify-end mt-6">
                                <Button
                                    type="submit"
                                    form="password-form"
                                    size="sm"
                                    className="gap-2"
                                    disabled={loadingPassword || !passwordForm.dirty || !passwordForm.isValid}
                                >
                                    {loadingPassword
                                        ? <Loader2 className="animate-spin" />
                                        : <KeyRound size={14} />
                                    }
                                    Change Password
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div >

        </RootPageCustom >
    );
}

export default Profile;