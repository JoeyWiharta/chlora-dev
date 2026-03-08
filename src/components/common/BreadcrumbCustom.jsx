import React from "react";
import { Link, useLocation } from "react-router-dom";
import MenuRoutes from "@/routes/MenuRoutes";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const BreadcrumbCustom = () => {
    const location = useLocation()

    const buildItems = () => {
        const items = [{ label: "Home", path: "/app001/dashboard" }]
        const parent = MenuRoutes.find(menu => menu.path === location.pathname || menu.sub?.some(sub => sub.path === location.pathname))

        if (!parent) return items

        const child = parent.sub?.find(sub => sub.path === location.pathname)

        if (child) {
            items.push({ label: parent.title, path: parent.path || null })
            items.push({ label: child.title })
        } else {
            items.push({ label: parent.title })
        }

        return items
    }

    return (
        <Breadcrumb>
            <BreadcrumbList>
                {buildItems().map((item, index, arr) => (
                    <React.Fragment key={index}>
                        <BreadcrumbItem>
                            {index === arr.length - 1 ? (
                                <BreadcrumbPage className="font-medium">{item.label}</BreadcrumbPage>
                            ) : (
                                <BreadcrumbLink asChild>
                                    <Link to={item.path || "#"}>{item.label}</Link>
                                </BreadcrumbLink>
                            )}
                        </BreadcrumbItem>
                        {index < arr.length - 1 && <BreadcrumbSeparator />}
                    </React.Fragment>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    )
}

export default BreadcrumbCustom