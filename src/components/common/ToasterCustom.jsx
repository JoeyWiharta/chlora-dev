import { Toaster } from "react-hot-toast"
import { useThemeMode } from "@/context/ThemeContext"

export const ToasterCustom = () => {
    const { mode } = useThemeMode()
    const isDark = mode === "dark" ||
        (mode === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)

    return (
        <Toaster
            position="top-right"
            toastOptions={{
                style: {
                    background: isDark ? 'oklch(0.205 0 0)' : 'oklch(1 0 0)',
                    color: isDark ? 'oklch(0.985 0 0)' : 'oklch(0.145 0 0)',
                    border: `1px solid ${isDark ? 'oklch(1 0 0 / 10%)' : 'oklch(0.922 0 0)'}`,
                    wordBreak: 'break-word',
                },
            }}
        />
    )
}