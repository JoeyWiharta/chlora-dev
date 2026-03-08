"use client";
import React from "react";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import SmallIcon from "@/assets/images/SmallIcon.png";
import { Sprout } from "lucide-react";
import Brand from "../../assets/images/Brand.png"

const AppSidebarHeader = () => {
    const { state } = useSidebar();
    const isCollapsed = state === "collapsed";

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton
                    asChild
                    size="lg"
                    className="cursor-default hover:bg-transparent focus-visible:ring-0 active:bg-transparent"
                >
                    <div className="flex items-center justify-center">
                        {isCollapsed
                            ? <img src={SmallIcon} className="h-auto w-auto" />
                            : <img src={Brand} className="h-10 w-40" />
                        }
                    </div>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
    );
};

export default AppSidebarHeader;