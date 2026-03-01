import React, { useState, useEffect, useCallback, act } from "react";
import {
    Container,
    Typography,
    Grid,
    TextField,
    IconButton,
    Stack,
    Autocomplete,
    Tooltip,
    Button,
    Box,
    useTheme,
    useMediaQuery,
    Paper,
    Select,
    MenuItem,
} from "@mui/material";
import RootPageCustom from "../../components/common/RootPageCustom";
import TableCustom from "../../components/common/TableCustom";
import { getDevice, deleteDevice, getCluster } from "../../utils/ListApi";
import PopupDeleteAndRestore from "../../components/common/PopupDeleteAndRestore";
import { Trash2, SquarePen, Plus, Search, RotateCcw } from "lucide-react";
import MasterDeviceAdd from "./MasterDeviceAdd";
import MasterDeviceEdit from "./MasterDeviceEdit";
import { AddIcon, MemoryIcon, SearchIcon } from "../../assets/Icon/muiIcon";

const MasterDevice = () => {
    // State First Page, Message, and Loading Effect
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const breadCrumbItems = [{ label: "Home", path: "/" }, { label: "Master Data" }, { label: "Master Device" }]
    const [firstRender, setFirstRender] = useState(false)
    const [app004p01Page, setApp004p01Page] = useState(true);

    const [app004Msg, setApp004setMsg] = useState("");
    const [app004MsgStatus, setApp004setMsgStatus] = useState("");
    const [loadingData, setLoadingData] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false)

    // State Data Device, Filtering, and Param
    const [search, setSearch] = useState("")
    const [app004DeviceData, setApp004DeviceData] = useState([]);
    const [app004DeviceTotalData, setApp004DeviceTotalData] = useState(0)
    const [app004TotalPage, app004SetTotalPage] = useState(0)
    const [app004DeviceDataParam, setApp004DeviceDataParam] = useState(
        {
            page: 1,
            size: 10,
            sort: "deviceId",
            order: "asc",
            search: "",
            status: "",
            clusterId: "",
        }
    )
    // Param for a while (Cluster doesnt need param for dropdown list)
    const [app004ClusterDataParam, setApp004ClusterDataParam] = useState(
        {
            page: 1,
            size: 10,
            sort: "",
            order: "asc",
            search: "",
        }
    )


    // State Add, Edit, and Delete Device
    const [modalAddOpen, setModalAddOpen] = useState(false);
    const [modalEditOpen, setModalEditOpen] = useState(false);
    const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
    const [app004DeviceEditData, setApp004DeviceEditData] = useState(null);
    const [app004DeviceDeleteData, setApp004DeviceDeleteData] = useState(null)

    // Table Configuration Active Device (Header Table, Handle Page and Rows, Handle Sort)
    const app004DeviceColumns = [
        {
            dataField: "device_id",
            text: "Device ID",
            sort: true,
            headerAlign: "center",
            bodyAlign: 'center',
        },
        {
            dataField: "device_name",
            text: "Device Name",
            sort: true,
            headerAlign: "center",
            bodyAlign: 'center',
        },
        {
            dataField: "device_type",
            text: "Device Type",
            sort: true,
            headerAlign: "center",
            bodyAlign: 'center',
        },
        {
            dataField: "cluster_name",
            text: "Cluster Name",
            sort: true,
            headerAlign: "center",
            bodyAlign: 'center',
        },
        {
            dataField: "status",
            text: "Status",
            sort: true,
            headerAlign: "center",
            bodyAlign: 'center',
        },
        {
            dataField: "action",
            text: "Action",
            headerAlign: "center",
            bodyAlign: 'left',
            formatter: (cellContent, app004DeviceData) => (
                <>
                    <Stack direction="row" spacing={1} justifyContent="center">
                        <Tooltip title="Update Device" placement="top">
                            <IconButton
                                aria-label="edit"
                                size="small"
                                onClick={() => handleModalEditOpen(app004DeviceData)}
                                color="info"
                            >
                                <SquarePen size={18} />
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Delete Device" placement="top">
                            <IconButton
                                aria-label="delete"
                                size="small"
                                onClick={() => handleModalDeleteOpen(app004DeviceData)}
                                color="error"
                            >
                                <Trash2 size={18} />
                            </IconButton>
                        </Tooltip>
                    </Stack>
                </>
            ),
        },
    ];

    const handleChangePage = (newPage) => {
        setApp004DeviceDataParam(prev => ({
            ...prev,
            page: newPage + 1
        }));
    };

    const handleChangeRowsPerPage = (newRowsPerPage) => {
        setApp004DeviceDataParam(prev => ({
            ...prev,
            size: newRowsPerPage,
            page: 1
        }));
    };

    const handleRequestSort = (property, order) => {
        setApp004DeviceDataParam(prev => ({
            ...prev,
            sort: property,
            order: order,
            page: 1
        }));
    };

    // Data From API Active Device
    const getAllDevice = useCallback(async (param) => {
        setLoadingData(true);
        try {
            const response = await getDevice(param);
            console.table(response.data.devices)
            setApp004DeviceData(response?.data?.devices ? response.data.devices : []);
            setApp004DeviceTotalData(response?.data?.count_data ? response.data.count_data : 0);
            app004SetTotalPage(response?.data?.total_pages ? response.data?.total_pages : 0);


        } catch (error) {
            console.error("Gagal mengambil data:", error);

        } finally {
            setLoadingData(false);
        }
    });

    useEffect(() => {
        if (app004p01Page) {
            getAllDevice(app004DeviceDataParam);
        }
    }, [app004DeviceDataParam]);

    // State and Function for Dropdown Cluster
    const [clusterOption, setClusterOption] = useState([])
    const [deviceTypeOption, setDeviceTypeOption] = useState([
        { value: "ACTUATOR", label: "Actuator" },
        { value: "Sensor", label: "Sensor" },
    ])
    const [statusOptions, setStatusOptions] = useState([
        { value: "ONLINE", label: "Online" },
        { value: "OFFLINE", label: "Offline" },
    ])
    const getAllCluster = useCallback(async (param) => {
        debugger
        setLoadingData(true);
        try {
            const response = await getCluster(param);
            debugger
            setClusterOption(response?.data?.clusters ? response.data.clusters.map(cluster => ({
                value: cluster.cluster_id,
                label: cluster.cluster_name,
            })) : []);
        } catch (error) {
            console.error("Gagal mengambil data:", error);

        } finally {
            setLoadingData(false);
        }
    });

    useEffect(() => {
        debugger
        getAllCluster(app004ClusterDataParam)
    }, [])

    // Search and Filtering (Free Text)
    const handleSearchState = () => {
        setApp004DeviceDataParam(prev => ({
            ...prev,
            page: 1,
            search: search
        }))

    }

    // Status Filtering
    const [status, setStatus] = useState("")

    const handleStatusChange = (event) => {
        setStatus(event)
        setSearch("")

        setApp004DeviceDataParam(prev => ({
            ...prev,
            "page": 1,
            "status": event,
            "search": ""
        }))
    }

    // Cluster Filtering
    const [cluster, setCluster] = useState("")

    const handleClusterChange = (event) => {
        setCluster(event)
        setSearch("")

        setApp004DeviceDataParam(prev => ({
            ...prev,
            "page": 1,
            "clusterId": event,
            "search": ""
        }))
    }

    // Refresh Table Function
    const refreshTable = useCallback(() => {
        setSearch("");
        setCluster("")
        setStatus("")
        setApp004DeviceDataParam({
            page: 1,
            size: 10,
            sort: "",
            order: "asc",
            search: "",
            status: "",
            clusterId: ""
        });
    });

    // Form Add Modal
    const handleModalAddOpen = () => {
        setApp004setMsg("")
        setModalAddOpen(true)
    }

    // Form Edit Modal
    const handleModalEditOpen = (obj) => {
        setApp004setMsg("")
        setModalEditOpen(true)
        setApp004DeviceEditData(obj)
    }

    // Form Delete Modal
    const handleModalDeleteOpen = (obj) => {
        setApp004setMsg("")
        setModalDeleteOpen(true)
        setApp004DeviceDeleteData(obj)
    }
    const app004HandleDeleteDevice = () => {
        if (app004DeviceDeleteData.device_id) {
            deleteDeviceAction(app004DeviceDeleteData)
        }
    }
    const deleteDeviceAction = useCallback(async (param) => {
        try {
            setLoadingDelete(true)
            const response = await deleteDevice(param.device_id)

            if (response.status === 204 || response.status === 200) {
                setApp004setMsg("Device Has Been Successfully Deleted.")
                setApp004setMsgStatus("success")
            } else {
                setApp004setMsg("Failed to delete Device.")
                setApp004setMsgStatus("error")
            }
        } catch (error) {
            debugger
            console.log(error)
            setApp004setMsg(error?.response?.data?.detail || "System is Unavailable. Please Try Again Later.")
            setApp004setMsgStatus("error")
        } finally {
            setModalDeleteOpen(false)
            setLoadingDelete(false)
            refreshTable();
        }
    })

    return (
        <React.Fragment>
            <RootPageCustom
                msgStateGet={app004Msg}
                msgStateSet={setApp004setMsg}
                msgStateGetStatus={app004MsgStatus}
                setFirstRender={setFirstRender}
                title="Devices Management"
                icon={<MemoryIcon fontSize="medium" />}
                breadCrumbItems={breadCrumbItems}
                isMobile={isMobile}
            >
                <Container
                    maxWidth={false}
                    hidden={!app004p01Page}
                    disableGutters
                    component={Paper}
                    sx={{ overflow: "hidden", borderTopRightRadius: '0px', borderTopLeftRadius: isMobile ? "0px" : "10px" }}
                >
                    <Box display={"flex"} flexDirection={"column"} gap={2} px={2} py={3}>
                        <Stack>
                            <Grid container spacing={2} alignItems={"center"}>
                                <Grid size={{ xs: 12, sm: 12, md: 3 }}>
                                    <TextField
                                        fullWidth
                                        placeholder="Search"
                                        value={search}
                                        onChange={(e) => { setSearch(e.target.value) }}
                                        onKeyDown={(e) => { if (e.key === 'Enter') { handleSearchState() } }}
                                        size="small"
                                        slotProps={{
                                            input: {
                                                endAdornment: (
                                                    <IconButton
                                                        onClick={handleSearchState}
                                                        edge="end"
                                                        size="small"
                                                        disableRipple

                                                    >
                                                        <SearchIcon fontSize="small" />
                                                    </IconButton>
                                                ),
                                            }
                                        }}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                    <Select
                                        fullWidth
                                        size="small"
                                        value={status}
                                        displayEmpty
                                        onChange={(e) => { handleStatusChange(e.target.value) }}
                                        renderValue={(selected) => {
                                            if (!selected) return "All Status";
                                            return statusOptions.find((opt) => opt.value === selected)?.label;
                                        }}
                                    >
                                        <MenuItem value="">All Status</MenuItem>
                                        {statusOptions.map((opt) => (
                                            <MenuItem key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </MenuItem>
                                        ))}

                                    </Select>
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                    <Select
                                        fullWidth
                                        size="small"
                                        value={cluster}
                                        displayEmpty
                                        onChange={(e) => { handleClusterChange(e.target.value) }}
                                        renderValue={(selected) => {
                                            if (!selected) return "All Clusters";
                                            return clusterOption.find((opt) => opt.value === selected)?.label;
                                        }}
                                    >
                                        <MenuItem value="">All Clusters</MenuItem>
                                        {statusOptions.map((opt) => (
                                            <MenuItem key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </MenuItem>
                                        ))}

                                    </Select>
                                </Grid>

                                <Grid size={{ xs: 12, sm: 12, md: 3 }} sx={{ display: 'flex', justifyContent: "flex-end" }}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleModalAddOpen}
                                        fullWidth={isMobile ? true : false}
                                        startIcon={<AddIcon fontSize="small" />}
                                        sx={{ px: !isMobile ? 4 : 0 }}
                                    >
                                        Add
                                    </Button>
                                </Grid>
                            </Grid>
                        </Stack>

                        <Stack>
                            <TableCustom
                                keyField="device_id"
                                loadingData={loadingData}
                                columns={app004DeviceColumns}
                                appdata={app004DeviceData}
                                appdataTotal={app004DeviceTotalData}
                                totalPage={app004TotalPage}
                                rowsPerPageOption={[5, 10, 20, 25]}

                                page={app004DeviceDataParam.page - 1}
                                rowsPerPage={app004DeviceDataParam.size}
                                sortField={app004DeviceDataParam.sort}
                                sortOrder={app004DeviceDataParam.order}


                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                                onRequestSort={handleRequestSort}
                            />
                        </Stack>
                    </Box>
                </Container>

                {modalAddOpen && (
                    <MasterDeviceAdd
                        modalAddOpen={modalAddOpen}
                        setModalAddOpen={setModalAddOpen}
                        refreshTable={refreshTable}
                        // Props for message
                        app004Msg={app004Msg}
                        setApp004setMsg={setApp004setMsg}
                        app004MsgStatus={app004MsgStatus}
                        setApp004setMsgStatus={setApp004setMsgStatus}

                        // Option Cluster
                        clusterOption={clusterOption}
                        deviceTypeOption={deviceTypeOption}
                    >
                    </MasterDeviceAdd>
                )}

                {modalEditOpen && (
                    <MasterDeviceEdit
                        modalEditOpen={modalEditOpen}
                        setModalEditOpen={setModalEditOpen}
                        refreshTable={refreshTable}

                        // Props for message and data
                        app004DeviceEditData={app004DeviceEditData}
                        app004Msg={app004Msg}
                        setApp004setMsg={setApp004setMsg}
                        app004MsgStatus={app004MsgStatus}
                        setApp004setMsgStatus={setApp004setMsgStatus}
                        clusterOption={clusterOption}
                        deviceTypeOption={deviceTypeOption}
                        statusOption={statusOptions}
                    />
                )}

                {modalDeleteOpen && (
                    <PopupDeleteAndRestore
                        status={"delete"}
                        modalOpen={modalDeleteOpen}
                        modalClose={() => setModalDeleteOpen(false)}
                        loading={loadingDelete}
                        onClick={app004HandleDeleteDevice}
                    />
                )}

            </RootPageCustom>
        </React.Fragment >
    );
}

export default MasterDevice;