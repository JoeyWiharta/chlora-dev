import React, { useEffect, useState, useMemo } from "react";
import PropTypes from "prop-types";
// import Sidebar from "../components/layoutComponent/Sidebar/Sidebar";
import Header from "../components/layoutComponent/Header/Header";
import Footer from "../components/layoutComponent/Footer";
import { SidebarProvider, Sidebar, SidebarHeader, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import AppSidebar from "./layoutComponent/AppSidebar";

// Migrate to Shadcn and Tailwind
// import { IconButton, Box, useTheme, useMediaQuery, Backdrop, Drawer, Typography } from "@mui/material";

// Constant Value
const SIDEBAR_COLLAPSE_WIDTH = 60;
const SIDEBAR_WIDTH = 250;
const HEADER_HEIGHT = 60;

const AuthLayout = (props) => {
    // const theme = useTheme();
    // const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setMobileOpen] = useState(false);

    // useEffect(() => {
    //     if (isMobile) {
    //         setMobileOpen(false)
    //         setIsCollapsed(false)
    //     }
    // }, [isMobile])


    // const toggleSidebar = () => {
    //     if (isMobile) {
    //         setMobileOpen(!isMobileOpen)
    //     } else {
    //         setIsCollapsed(!isCollapsed);
    //     }
    // };

    // const handleMobileClose = () => {
    //     setMobileOpen(false);
    // };

    debugger
    const userData = useMemo(() => {
        const data = localStorage.getItem("user");
        return data ? JSON.parse(data) : null;
    }, []);
    console.log(userData)

    // const drawerWidth = isCollapsed ? SIDEBAR_COLLAPSE_WIDTH : SIDEBAR_WIDTH;

    return (
        <SidebarProvider>
            <AppSidebar userData={userData} />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="ml-1" />
                        <Separator
                            orientation="vertical"
                            className="mr-2 data-[orientation=vertical]:h-4"
                        />
                    </div>
                </header>
            </SidebarInset>
        </SidebarProvider>



        // <Box className="auth-layout-root">
        //     <Drawer
        //         variant={isMobile ? "temporary" : "permanent"}
        //         open={isMobile ? isMobileOpen : true}
        //         onClose={handleMobileClose}
        //         slotProps={{
        //             paper: {
        //                 elevation: 4,
        //             },
        //         }}
        //         sx={{
        //             zIndex: theme.zIndex.drawer + 1,

        //             ...(!isMobile && {
        //                 width: drawerWidth,
        //                 flexShrink: 0,
        //             }),

        //             "& .MuiDrawer-paper": {
        //                 width: drawerWidth,
        //                 transition: theme.transitions.create("width", {
        //                     duration: theme.transitions.duration.standard,
        //                 }),
        //             },
        //         }}
        //     >
        //         <Sidebar
        //             userData={userData}
        //             heightHeader={HEADER_HEIGHT}
        //             drawerWidth={drawerWidth}
        //             isCollapsed={isCollapsed}
        //             isMobileOpen={isMobileOpen}
        //             handleMobileClose={handleMobileClose}
        //             toggleSidebar={toggleSidebar}
        //         />
        //     </Drawer>


        //     {!isMobile && (
        //         <IconButton
        //             onClick={toggleSidebar}
        //             className={isCollapsed ? "shadow-sm" : undefined}
        //             sx={{
        //                 position: "fixed",
        //                 top: HEADER_HEIGHT / 2,
        //                 left: drawerWidth,
        //                 transform: "translate(-50%, -50%)",
        //                 ml: isCollapsed ? 0 : -3,
        //                 width: 28,
        //                 height: 28,
        //                 borderRadius: "50%",
        //                 backgroundColor: isCollapsed ? "background.paper" : "transparent",
        //                 border: isCollapsed ? "1px solid" : "",
        //                 borderColor: "divider",
        //                 zIndex: theme.zIndex.drawer + 10,
        //                 transition: "all 0.3s ease",
        //                 "&:hover": {
        //                     backgroundColor: "background.paper",
        //                 },
        //             }}
        //         >
        //             {isCollapsed ?
        //                 <ArrowForwardIosIcon sx={{
        //                     fontSize: 14,
        //                     color: "text.secondary",
        //                     ml: 0.1,
        //                     "&:hover": {
        //                         color: 'primary.main'
        //                     },
        //                 }} /> :
        //                 <ArrowBackIosIcon sx={{
        //                     fontSize: 14,
        //                     color: "text.secondary",
        //                     ml: 0.5,
        //                     "&:hover": {
        //                         color: 'primary.main'
        //                     },
        //                 }} />
        //             }
        //         </IconButton>
        //     )}

        //     <Box className="auth-layout-wrapper-main">
        //         <Header
        //             toggleSidebar={toggleSidebar}
        //             userData={userData}
        //             drawerWidth={isMobile ? 0 : drawerWidth}
        //             headerHeight={HEADER_HEIGHT}
        //             isMobile={isMobile}
        //         />

        //         <Box component="main" className="auth-layout-content" py={2} px={3}>
        //             {props.children}
        //         </Box>

        //         <Footer />
        //     </Box>
        // </Box>
    );
};

AuthLayout.propTypes = {
    children: PropTypes.any,
};

export default AuthLayout;