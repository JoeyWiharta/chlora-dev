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
        section: "main",
    },
    {
        title: "Master Data",
        icon: Layers,
        section: "main",
        role: ["ADMIN"],
        sub: [
            { path: "/app002/master/users", title: "Master User", component: LazyLoadRoutes(() => import("../pages/app002/MasterUser")) },
            { path: "/app003/master/pots", title: "Master Pots", component: LazyLoadRoutes(() => import("../pages/app003/MasterPot")) },
            { path: "/app004/master/devices", title: "Master Device", component: LazyLoadRoutes(() => import("../pages/app004/MasterDevice")) },
        ],
    },
    {
        title: "Analytics",
        icon: ClipboardList,
        section: "main",
        sub: [
            { path: "/app005/analytics/sensor", title: "Sensor Data", component: LazyLoadRoutes(() => import("../pages/app005/SensorData")) },
            { path: "/app006/analytics/anomaly", title: "Anomalies", component: LazyLoadRoutes(() => import("../pages/app006/AnomalyData")) },
        ],
    },
]

export default MenuRoutes;
