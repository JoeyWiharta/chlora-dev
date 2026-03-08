"use client"
import {
    BadgeCheck,
    Bell,
    ChevronsUpDown,
    SunMoon,
    LogOut,
    Moon,
    Sun,
    Monitor,
    User
} from "lucide-react"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent
} from "@/components/ui/dropdown-menu"
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
import { useThemeMode } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext"
import { useState } from "react"

const AppSidebarFooter = (props) => {
    const { mode, setMode } = useThemeMode();
    const { logout } = useAuth()
    const { isMobile } = useSidebar()
    const [roleUser, setRoleUser] = useState(props.userData?.role || "")
    const [nameUser, setNameUser] = useState(props.userData?.name || "")

    const initialName = (name) => {
        if (name) {
            const words = name.trim().split(" ").filter(Boolean);
            if (words.length === 1) {
                return words[0][0].toUpperCase();
            } else {
                const first = words[0][0];
                const last = words[words.length - 1][0];
                return (first + last).toUpperCase();
            }
        } else {
            if (!name) return ""
        }
    };

    const formatRole = (role) => {
        if (!role) return ""
        return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()
    }




    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton size="lg"
                            className="data-[active=true]:!bg-sidebar-accent data-[active=true]:!text-sidebar-foreground data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        >
                            <Avatar className="h-8 w-8 rounded-lg">
                                <AvatarFallback className="rounded-lg">{initialName(nameUser)}</AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium">{nameUser}</span>
                                <span className="truncate text-xs">{formatRole(roleUser)}</span>
                            </div>
                            <ChevronsUpDown className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                        side={isMobile ? "bottom" : "right"}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                <Avatar className="h-8 w-8 rounded-lg">
                                    <AvatarFallback className="rounded-lg">{initialName(nameUser)}</AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-medium">{nameUser}</span>
                                    <span className="truncate text-xs">{formatRole(roleUser)}</span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem>
                                <User />
                                Account Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Bell />
                                Notifications
                            </DropdownMenuItem>

                            <DropdownMenuSub>
                                <DropdownMenuSubTrigger>
                                    <SunMoon />
                                    Theme
                                </DropdownMenuSubTrigger>

                                <DropdownMenuSubContent>
                                    <DropdownMenuItem onClick={() => setMode("light")}>
                                        <Sun />
                                        Light
                                    </DropdownMenuItem>

                                    <DropdownMenuItem onClick={() => setMode("dark")}>
                                        <Moon />
                                        Dark
                                    </DropdownMenuItem>

                                    <DropdownMenuItem onClick={() => setMode("system")}>
                                        <Monitor />
                                        System
                                    </DropdownMenuItem>
                                </DropdownMenuSubContent>
                            </DropdownMenuSub>

                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-500 data-highlighted:text-red-500"
                            onClick={logout}
                        >
                            <LogOut className="text-red-500" />
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )

}
export default AppSidebarFooter