"use client"
import React, { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import MenuRoutes from "@/routes/MenuRoutes"
import { ChevronRight } from "lucide-react"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    useSidebar
} from "@/components/ui/sidebar"
import { useAuth } from "@/context/AuthContext"


const AppSidebarContent = () => {
    const { user } = useAuth()
    const userRole = user?.role
    const mainMenu = MenuRoutes
        .filter(menu => menu.section === "main")
        .filter(menu => !menu.role || menu.role.includes(userRole))
    const otherMenu = MenuRoutes
        .filter(menu => menu.section === "others")
        .filter(menu => !menu.role || menu.role.includes(userRole))
    const location = useLocation()
    const { state } = useSidebar()
    const isCollapsed = state === "collapsed"

    const getActiveParent = () => {
        const active = MenuRoutes.find(menu =>
            menu?.sub?.some(sub => sub.path === location.pathname)
        )
        return active?.title || null
    }
    const [openMenu, setOpenMenu] = useState(getActiveParent)


    useEffect(() => {
        const active = MenuRoutes.find(menu =>
            menu?.sub?.some(sub => sub.path === location.pathname)
        )
        if (active) setOpenMenu(active.title)
    }, [location.pathname])

    useEffect(() => {
        setOpenMenu(getActiveParent())
    }, [state])

    return (
        <>
            <SidebarGroup>
                <SidebarGroupLabel>Main</SidebarGroupLabel>
                <SidebarMenu>
                    {mainMenu.map((item) => {
                        const hasChild = item?.sub?.length > 0
                        return hasChild ? (
                            <Collapsible
                                key={item.title}
                                open={openMenu === item.title}
                                onOpenChange={(open) => setOpenMenu(open ? item.title : null)}
                                className="group/collapsible"
                            >
                                <SidebarMenuItem>
                                    <CollapsibleTrigger asChild>
                                        <SidebarMenuButton
                                            tooltip={item.title}
                                            isActive={isCollapsed && item?.sub?.some(sub => sub.path === location.pathname)}
                                        >
                                            {item.icon && <item.icon />}
                                            <span>{item.title}</span>
                                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                        </SidebarMenuButton>
                                    </CollapsibleTrigger>

                                    <CollapsibleContent>
                                        <SidebarMenuSub>
                                            {item.sub?.map((subItem) => (
                                                <SidebarMenuSubItem key={subItem.path}>
                                                    <SidebarMenuSubButton
                                                        asChild
                                                        isActive={location.pathname === subItem.path}
                                                    >
                                                        <Link to={subItem.path}>
                                                            {subItem.title}
                                                        </Link>
                                                    </SidebarMenuSubButton>
                                                </SidebarMenuSubItem>
                                            ))}
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                </SidebarMenuItem>
                            </Collapsible>
                        ) : (
                            <SidebarMenuItem key={item.path}>
                                <SidebarMenuButton
                                    asChild
                                    tooltip={item.title}
                                    isActive={location.pathname === item.path}
                                >
                                    <Link to={item.path}>
                                        {item.icon && <item.icon />}
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        )
                    })}
                </SidebarMenu>
            </SidebarGroup>

            <SidebarGroup>
                {/* <SidebarGroupLabel>Others</SidebarGroupLabel> */}
                <SidebarMenu>
                    {otherMenu.map((item) => {
                        return (
                            <SidebarMenuItem key={item.path}>
                                <SidebarMenuButton
                                    asChild
                                    tooltip={item.title}
                                    isActive={location.pathname === item.path}
                                >
                                    <Link to={item.path}>
                                        {item.icon && <item.icon />}
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        )
                    })}
                </SidebarMenu>
            </SidebarGroup>
        </>
    )
}
export default AppSidebarContent