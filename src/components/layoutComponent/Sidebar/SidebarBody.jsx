import React, { useMemo } from "react";
import PropTypes from "prop-types";
import {
    Box,
    List,
    ListItemButton,
    ListItemText,
    ListItemIcon,
    Collapse,
    Typography,
    Tooltip,
    Fade,
} from "@mui/material";
import { Link } from "react-router-dom";
import SidebarPopover from "./SidebarPopover";
import { ExpandMoreIcon } from "../../../assets/Icon/muiIcon";

const parentButtonSx = (isCollapsed) => ({
    borderRadius: "15px",
    justifyContent: "space-between",
    transition: "all 0.3s ease",
    pr: 1,
    pl: 2,
    width: "100%",


    ...(isCollapsed && {
        justifyContent: "center",
        borderRadius: "10px",
        px: 0,
        width: "36px",
        height: "36px",
    }),

    "&.Mui-selected": {
        backgroundColor: "layout.sidebarActive",
        color: "primary.main",
    },

    "&.Mui-selected:hover": {
        backgroundColor: "layout.sidebarActive",
        color: "primary.main",
    },

    "&:hover": {
        color: "text.primary",
    },
});


const childButtonSx = {
    py: 0.5,
    pr: 1,
    pl: 2,
    transition: "all 0.3s ease",
    borderTopLeftRadius: "10px",
    borderBottomLeftRadius: "10px",

    // "&.Mui-selected, &:hover": { (Use this for hover effect)
    "&.Mui-selected": {
        bgcolor: "transparent",
        color: "primary.main",
        borderRight: "3px solid",
        borderColor: "primary.main",
    },

    "&:hover": {
        backgroundColor: "transparent",
        color: "text.primary",
    },

    "&.Mui-selected:hover": {
        bgcolor: "transparent",
        color: "primary.main",
    },
};


const SidebarBody = (props) => {

    const handleItemClick = (e, item, index) => {
        const isParent = Boolean(item.sub);
        if (isParent) {
            return props.isCollapsed ? props.handleOpenPopover(e, index) : props.handleToggleMenu(index);
        }
        if (props.isMobileOpen && props.handleMobileClose) {
            props.handleMobileClose();
        }
    };

    const parentSx = useMemo(
        () => parentButtonSx(props.isCollapsed),
        [props.isCollapsed]
    );

    return (
        <>
            <Box className="sidebar-body-container" py={2} px={props.isCollapsed ? 0 : 2}>
                <Box>
                    <Typography className="sidebar-body-title" variant="caption" fontWeight={"bold"} letterSpacing={0.7} justifyContent={props.isCollapsed ? 'center' : 'left'} px={1}>
                        {props.isCollapsed ? "MAIN" : "MAIN NAVIGATION"}
                    </Typography>

                    <List className="sidebar-body-parent" sx={{ gap: 1, justifyContent: props.isCollapsed ? 'center' : 'flex-start', alignItems: props.isCollapsed ? 'center' : 'flex-start' }}>
                        {props.menuItems.map((item, index) => {
                            const isParent = !!item.sub;
                            const isSelected = (!isParent && props.location.pathname === item.path) || (isParent && props.isChildSelected(item));
                            return (
                                <React.Fragment key={item.path || item.text}>
                                    <Tooltip
                                        title={props.isCollapsed ? item.text : ""}
                                        placement="right"
                                        arrow
                                        disableHoverListener={!props.isCollapsed}
                                        slots={{ transition: Fade }}
                                        slotProps={{
                                            tooltip: {
                                                sx: {
                                                    backgroundColor: "primary.main",
                                                    fontSize: '13px'
                                                }
                                            },
                                            arrow: {
                                                sx: {
                                                    color: 'primary.main',
                                                    fontSize: '13px'
                                                }
                                            },
                                            transition: { timeout: 300 },
                                        }}
                                    >
                                        <ListItemButton
                                            component={!isParent ? Link : "button"}
                                            to={!isParent ? item.path : undefined}
                                            onClick={(e) => handleItemClick(e, item, index)}
                                            selected={isSelected}
                                            sx={parentSx}
                                        >
                                            <Box display={"flex"} alignItems={"center"} gap={1.2}>
                                                <ListItemIcon
                                                    sx={{
                                                        color: 'inherit',
                                                        minWidth: "auto",
                                                        "& svg": { fontSize: "large", }
                                                    }}
                                                >
                                                    {item.icon}
                                                </ListItemIcon>

                                                {!props.isCollapsed && (
                                                    <ListItemText
                                                        primary={item.text}
                                                        sx={{
                                                            transition: "width 0.3s ease",
                                                            overflow: "hidden",
                                                            "& .MuiListItemText-primary": {
                                                                fontWeight: "600",
                                                            }
                                                        }}
                                                    />
                                                )}
                                            </Box>

                                            {isParent && !props.isCollapsed && (
                                                <ExpandMoreIcon
                                                    sx={{
                                                        fontSize: '18px',
                                                        transform: props.openMenuIndex === index ? "rotate(180deg)" : "rotate(0deg)",
                                                        transition: "transform 0.3s ease, opacity 0.3s ease",
                                                    }}
                                                />
                                            )}
                                        </ListItemButton>
                                    </Tooltip>

                                    {
                                        props.isCollapsed && (
                                            <SidebarPopover
                                                open={props.popoverParentIndex === index}
                                                anchorEl={props.anchorEl}
                                                onClose={props.handleClosePopover}
                                                item={item}
                                                location={props.location}
                                            />
                                        )
                                    }

                                    {
                                        isParent && !props.isCollapsed && (
                                            <Collapse in={props.openMenuIndex === index} timeout={"auto"} unmountOnExit className="sidebar-body-child">
                                                <List sx={{ display: 'flex', flexDirection: 'column', gap: 1, px: 1 }}>
                                                    {item.sub.map((sub, subIndex) => (
                                                        <ListItemButton
                                                            key={sub.path || sub.text}
                                                            component={Link}
                                                            to={sub.path}
                                                            selected={props.location.pathname === sub.path}
                                                            onClick={(e) => handleItemClick(e, sub, null)}
                                                            sx={childButtonSx}
                                                        >

                                                            <ListItemText
                                                                primary={sub.text}
                                                                sx={{
                                                                    transition: "opacity 0.3s ease, width 0.3s ease",
                                                                    "& .MuiListItemText-primary": {
                                                                        fontWeight: "600",
                                                                    },
                                                                }}
                                                            />
                                                        </ListItemButton>
                                                    ))}
                                                </List>
                                            </Collapse>
                                        )
                                    }
                                </React.Fragment>
                            );
                        })}
                    </List>
                </Box >
            </Box >
        </>
    )
}
export default SidebarBody;