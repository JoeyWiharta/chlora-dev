"use client";
import React from "react";
import { SidebarProvider, Sidebar, SidebarInset, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter, SidebarRail } from "@/components/ui/sidebar"; // path Shadcn
import MenuRoutes from "@/routes/MenuRoutes";
import { Link } from "react-router-dom";
import SmallIcon from "../../assets/images/SmallIcon.png"
import { Sprout } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";

import AppSidebarHeader from "./AppSidebarHeader";
import AppSidebarContent from "./AppSidebarContent";
import AppSidebarFooter from "./AppSidebarFooter";

const AppSidebar = (props) => {
    const { state: sidebarState } = useSidebar();
    console.log("Check Data User Sidebar", props.dataUser)

    return (
        <Sidebar collapsible="icon" side="left" variant="sidebar">
            <SidebarHeader>
                <AppSidebarHeader />
            </SidebarHeader>

            <SidebarContent>
                <AppSidebarContent />
            </SidebarContent>

            <SidebarFooter>
                <AppSidebarFooter dataUser={props.dataUser} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
};

export default AppSidebar;