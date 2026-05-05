import React, { useEffect, useState, useMemo } from "react";
import PropTypes from "prop-types";
import { SidebarProvider, Sidebar, SidebarHeader, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import AppSidebar from "./sidebar/AppSidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from "@/components/ui/breadcrumb";
import BreadcrumbCustom from "@/components/common/BreadcrumbCustom";
import AppHeader from "./header/AppHeader";
import Footer from "./footer/Footer";

const AuthLayout = (props) => {

    const userData = useMemo(() => {
        const data = localStorage.getItem("user");
        return data ? JSON.parse(data) : null;
    }, []);

    return (
        <SidebarProvider>
            <AppSidebar userData={userData} />

            {/* Content  */}
            <SidebarInset className="flex flex-col min-h-screen px-6 gap-4 overflow-x-hidden min-w-0">
                <AppHeader />
                <div className="flex flex-1 flex-col">
                    {props.children}
                </div>
                <Footer />
            </SidebarInset>
        </SidebarProvider>
    );
};

AuthLayout.propTypes = {
    children: PropTypes.any,
};

export default AuthLayout;