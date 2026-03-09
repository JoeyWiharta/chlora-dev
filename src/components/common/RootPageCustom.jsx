import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Container, Box, Paper, Stack, Typography } from "@mui/material";
import AlertMessage from "./AlertMessage";
import BreadCrumb from "./BreadcrumbCustom";

const RootPageCustom = (props) => {
    useEffect(() => {
        if (props.setFirstRender != null) {
            props.setFirstRender(true)
        }
    }, [])

    return (
        <React.Fragment>
            <div>
                {props.children}
            </div>
            {/* <Container disableGutters maxWidth={false}>
                <AlertMessage
                    msg={props.msgStateGet}
                    stateData={props.msgStateSet}
                    msgStatus={props.msgStateGetStatus}
                />
                <Stack direction={props.isMobile ? "column" : "row"} spacing={props.isMobile ? 1 : 0} className="rootpagecustom-head-wrapper" >
                    <Stack direction={"row"} gap={1} px={2} py={1} className="rootpagecustom-title-wrapper" >
                        {props.icon}
                        <Typography variant="h6" fontWeight="medium" noWrap> {props.title}</Typography>
                    </Stack>
                </Stack>
                <Box component={Paper} elevation={4}>{props.children}</Box>
            </Container> */}
        </React.Fragment>
    )
}

RootPageCustom.propTypes = {
    children: PropTypes.any,
    msgStateGet: PropTypes.any,
    msgStateGetStatus: PropTypes.any,
    msgStateSet: PropTypes.any,
    setFirstRender: PropTypes.any,
    icon: PropTypes.node,
    breadCrumbItems: PropTypes.array,
    isMobile: PropTypes.bool,
};

export default RootPageCustom;