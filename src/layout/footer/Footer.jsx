import React from "react"

const Footer = () => {
    return (
        <footer className="p-2 px-4">
            <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} Chlora. All rights reserved.
            </p>
        </footer>
    )
}

export default Footer
