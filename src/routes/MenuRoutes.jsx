import LazyLoadRoutes from "./LazyLoadRoutes";
import {
    LayoutDashboard,
    Layers,
    ClipboardList,
    Headset,
    CircleAlert
} from "lucide-react"

const MenuRoutes = [
    {
        path: "/app001/dashboard",
        title: "Dashboard",
        icon: LayoutDashboard,
        component: LazyLoadRoutes(() => import("../pages/app001/Dashboard")),
        section: "main"
    },
    {
        title: "Master Data",
        icon: Layers,
        section: "main",
        sub: [
            { path: "/app002/master/users", title: "Master User", component: LazyLoadRoutes(() => import("../pages/app002/MasterUser")) },
            { path: "/app003/master/clusters", title: "Master Cluster", component: LazyLoadRoutes(() => import("../pages/app003/MasterCluster")) },
            { path: "/app004/master/devices", title: "Master Device", component: LazyLoadRoutes(() => import("../pages/app004/MasterDevice")) },
        ],
    },
    // {
    //     title: "Reports",
    //     icon: ClipboardList,
    //     section: "main",
    //     sub: [
    //         { path: "/reports/table", title: "Table Report", component: LazyLoadRoutes(() => import("../pages/app002/MasterUser")), },
    //         { path: "/reports/graph", title: "Graph Report", component: LazyLoadRoutes(() => import("../pages/app002/MasterUser")), },
    //     ],
    // },
    // {
    //     title: "Support",
    //     path: "/support",
    //     icon: Headset,
    //     section: "others",
    //     component: LazyLoadRoutes(() => import("../pages/app002/MasterUser")),
    // },
    // {
    //     title: "About",
    //     path: "/about",
    //     icon: CircleAlert,
    //     section: "others",
    //     component: LazyLoadRoutes(() => import("../pages/app002/MasterUser")),
    // },

]

export default MenuRoutes;
