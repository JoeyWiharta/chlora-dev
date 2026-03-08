"use client"
import React from 'react';
import { useThemeMode } from "@/context/ThemeContext"
import { Button } from '@/components/ui/button';
import PropTypes from 'prop-types';
import { Moon, Sun, Monitor } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const themeOptions = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
]

const NonAuthLayout = ({ children }) => {
    const { mode, setMode } = useThemeMode()
    const ThemeIcon = mode === "light" ? Sun : mode === "dark" ? Moon : Monitor

    return (
        <>
            <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-end px-6 py-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-full">
                            <ThemeIcon className="size-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-36">
                        {themeOptions.map((item) => {
                            const Icon = item.icon
                            return (
                                <DropdownMenuItem
                                    key={item.value}
                                    onClick={() => setMode(item.value)}
                                    className={`my-1 ${mode === item.value ? "bg-accent" : ""}`}
                                >
                                    <Icon className="size-4" />
                                    <span>{item.label}</span>
                                </DropdownMenuItem>
                            )
                        })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">

                <div className="flex w-full max-w-sm flex-col gap-6">
                    {children}
                </div>
            </div>
        </>
    )
}

NonAuthLayout.propTypes = {
    children: PropTypes.any,
};

export default NonAuthLayout;