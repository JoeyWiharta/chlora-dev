import LazyLoadRoutes from "./LazyLoadRoutes";
import {
    mdiAccountOutline,
    mdiHomeThermometerOutline,
    mdiAccessPointNetwork,
    mdiChartBoxOutline,
    mdiFaceAgent,
    mdiInformationOutline
} from "@mdi/js";

import {
    DashboardIcon,
    LayersIcon,
    AssessmentIcon,
    SupportAgentOutlinedIcon,
    InfoOutlinedIcon
} from "../assets/Icon/muiIcon/index"

const MenuRoutes = [
    { path: "/app001/dashboard", text: "Dashboard", icon: <DashboardIcon />, component: LazyLoadRoutes(() => import("../pages/app001/Dashboard")), section: "main" },
    {
        text: "Master Data",
        icon: <LayersIcon />,
        section: "main",
        sub: [
            { path: "/app002/master/users", text: "Master User", component: LazyLoadRoutes(() => import("../pages/app002/MasterUser")) },
            { path: "/app003/master/clusters", text: "Master Cluster", component: LazyLoadRoutes(() => import("../pages/app003/MasterCluster")) },
            { path: "/app004/master/devices", text: "Master Device", component: LazyLoadRoutes(() => import("../pages/app004/MasterDevice")) },
        ],
    },
    // {
    //     text: "Reports",
    //     icon: <AssessmentIcon />,
    //     section: "main",
    //     sub: [
    //         { path: "/reports/table", text: "Table Report", icon: mdiChartBoxOutline, component: LazyLoadRoutes(() => import("../pages/app002/MasterUser")), },
    //         { path: "/reports/graph", text: "Graph Report", icon: mdiChartBoxOutline, component: LazyLoadRoutes(() => import("../pages/app002/MasterUser")), },
    //     ],
    // },
    { text: "Support", path: "/support", icon: <SupportAgentOutlinedIcon />, section: "footer", component: LazyLoadRoutes(() => import("../pages/app002/MasterUser")), },
    { text: "About", path: "/about", icon: <InfoOutlinedIcon />, section: "footer", component: LazyLoadRoutes(() => import("../pages/app002/MasterUser")), },
    { text: "About", path: "/about", icon: <InfoOutlinedIcon />, section: "footer", component: LazyLoadRoutes(() => import("../pages/app002/MasterUser")), },
    { text: "About", path: "/about", icon: <InfoOutlinedIcon />, section: "footer", component: LazyLoadRoutes(() => import("../pages/app002/MasterUser")), },
    { text: "About", path: "/about", icon: <InfoOutlinedIcon />, section: "footer", component: LazyLoadRoutes(() => import("../pages/app002/MasterUser")), },
    // { text: "About", path: "/about", icon: InfoOutlinedIcon, section: "footer", component: LazyLoadRoutes(() => import("../pages/app002/MasterUser")), },
    // { text: "About", path: "/about", icon: InfoOutlinedIcon, section: "footer", component: LazyLoadRoutes(() => import("../pages/app002/MasterUser")), },
    // { text: "About", path: "/about", icon: InfoOutlinedIcon, section: "footer", component: LazyLoadRoutes(() => import("../pages/app002/MasterUser")), },
    // { text: "About", path: "/about", icon: InfoOutlinedIcon, section: "footer", component: LazyLoadRoutes(() => import("../pages/app002/MasterUser")), },
    // { text: "About", path: "/about", icon: InfoOutlinedIcon, section: "footer", component: LazyLoadRoutes(() => import("../pages/app002/MasterUser")), },
    // { text: "About", path: "/about", icon: InfoOutlinedIcon, section: "footer", component: LazyLoadRoutes(() => import("../pages/app002/MasterUser")), },
    // { text: "About", path: "/about", icon: mdiInformationOutline, section: "footer", component: LazyLoadRoutes(() => import("../pages/app002/MasterUser")), },
]

export default MenuRoutes;
