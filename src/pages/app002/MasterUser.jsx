import React, { useState, useEffect, useCallback, act } from "react";
import RootPageCustom from "../../components/common/RootPageCustom";
import TableCustom from "../../components/common/TableCustom";
import { getUser, deleteUser, getUserDeleted, restoreUser } from "../../utils/ListApi";
import MasterUserAdd from "./MasterUserAdd";
import MasterUserEdit from "./MasterUserEdit";
import PopupDeleteAndRestore from "../../components/common/PopupDeleteAndRestore";
import {
    Container,
    Typography,
    Grid,
    TextField,
    IconButton,
    Stack,
    Tooltip,
    Button,
    Tab,
    Tabs,
    Paper,
    MenuItem,
    Select,
    useTheme,
    useMediaQuery,
    Box
} from "@mui/material";
import {
    AddIcon,
    DeleteOutlinedIcon,
    EditOutlinedIcon,
    HowToRegIcon,
    PersonIcon,
    PersonRemoveOutlinedIcon,
    ReplayOutlinedIcon,
    SearchIcon
} from "../../assets/Icon/muiIcon";

const MasterUser = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const breadCrumbItems = [{ label: "Home", path: "/" }, { label: "Master Data" }, { label: "Master User" }]
    // State First Page, Message, and Loading Effect
    const [firstRender, setFirstRender] = useState(false)
    const [app002p01Page, setApp002p01Page] = useState(true);
    const [active, setActive] = useState("activeUser")
    const handleTabChange = (event, newValue) => {
        setActive(newValue);
        setRole("")
        setSearch("")
        refreshTable()
    };
    const [app002Msg, setApp002setMsg] = useState("");
    const [app002MsgStatus, setApp002setMsgStatus] = useState("");
    const [loadingData, setLoadingData] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false)
    const [loadingRestore, setLoadingRestore] = useState(false)

    // State Data User, Filtering, and Param
    const [search, setSearch] = useState("")
    const [role, setRole] = useState("")
    const [app002UserData, setApp002UserData] = useState([]);
    const [app002UserDeletedData, setApp002UserDeletedData] = useState([]);
    const [app002UserTotalData, setApp002UserTotalData] = useState(0)
    const [app002UserDeletedTotalData, setApp002UserDeletedTotalData] = useState(0)
    const [app002TotalPage, app002SetTotalPage] = useState(0)
    const [app002TotalPageDeleted, app002SetTotalPageDeleted] = useState(0)
    const [app002UserDataParam, setApp002UserDataParam] = useState(
        {
            page: 1,
            size: 10,
            sort: "",
            order: "asc",
            search: "",
            role: "",
        }
    )
    const [app002UserDeletedDataParam, setApp002UserDeletedDataParam] = useState(
        {
            page: 1,
            size: 10,
            sort: "",
            order: "asc",
            search: "",
            role: "",
        }
    )

    // State Add, Edit, and Delete User
    const [modalAddOpen, setModalAddOpen] = useState(false);
    const [modalEditOpen, setModalEditOpen] = useState(false);
    const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
    const [modalRestoreOpen, setModalRestoreOpen] = useState(false);
    const [app002UserEditData, setApp002UserEditData] = useState(null);
    const [app002UserDeleteData, setApp002UserDeleteData] = useState(null)
    const [app002UserRestoreData, setApp002UserRestoreData] = useState(null)

    // Table Configuration Active User (Header Table, Handle Page and Rows, Handle Sort)
    const app002UserColumns = [
        {
            dataField: "user_id",
            text: "User ID",
            sort: true,
            headerAlign: "center",
            bodyAlign: "center",
        },
        {
            dataField: "name",
            text: "Name",
            sort: true,
            headerAlign: "center",
            bodyAlign: "center",
        },
        {
            dataField: "role",
            text: "Role",
            sort: true,
            headerAlign: "center",
            bodyAlign: "center",
        },
        {
            dataField: "email",
            text: "Email",
            sort: true,
            headerAlign: "center",
            bodyAlign: "center",
        },
        {
            dataField: "action",
            text: "Action",
            headerAlign: "center",
            bodyAlign: 'center',
            formatter: (cellContent, app002UserData) => (
                <>
                    <Stack direction="row" spacing={1} justifyContent="center">
                        <Tooltip title="Update User" placement="top">
                            <IconButton
                                aria-label="edit"
                                size="small"
                                onClick={() => handleModalEditOpen(app002UserData)}
                                color="info"
                            >
                                <EditOutlinedIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Delete User" placement="top">
                            <IconButton
                                aria-label="delete"
                                size="small"
                                onClick={() => handleModalDeleteOpen(app002UserData)}
                                color="error"
                            >
                                <DeleteOutlinedIcon fontSize="small" />

                            </IconButton>
                        </Tooltip>
                    </Stack>
                </>
            ),
        },
    ];

    const handleChangePage = (newPage) => {
        setApp002UserDataParam(prev => ({
            ...prev,
            page: newPage + 1
        }));
    };

    const handleChangeRowsPerPage = (newRowsPerPage) => {
        setApp002UserDataParam(prev => ({
            ...prev,
            size: newRowsPerPage,
            page: 1
        }));
    };

    const handleRequestSort = (property, order) => {
        setApp002UserDataParam(prev => ({
            ...prev,
            sort: property,
            order: order,
            page: 1
        }));
    };

    // Table Configuration Deleted User (Header Table, Handle Page and Rows, Handle Sort)
    const app002UserDeletedColumns = [
        {
            dataField: "user_id",
            text: "User ID",
            sort: true,
            headerAlign: "center",
            bodyAlign: "center",
        },
        {
            dataField: "name",
            text: "Name",
            sort: true,
            headerAlign: "center",
            bodyAlign: "center",
        },
        {
            dataField: "role",
            text: "Role",
            sort: true,
            headerAlign: "center",
            bodyAlign: "center",
        },
        {
            dataField: "email",
            text: "Email",
            sort: true,
            headerAlign: "center",
            bodyAlign: "center",
        },
        {
            dataField: "action",
            text: "Action",
            headerAlign: "center",
            formatter: (cellContent, app002UserDeletedData) => (
                <>
                    <Stack direction="row" spacing={1} justifyContent="center">
                        <Tooltip title="Restore User" placement="top">
                            <IconButton
                                aria-label="restore"
                                size="small"
                                onClick={() => handleModalRestoreOpen(app002UserDeletedData)}
                                color="info"
                            >
                                <ReplayOutlinedIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </Stack>
                </>
            ),
        },
    ];

    const handleChangePageDeleted = (newPage) => {
        setApp002UserDeletedDataParam(prev => ({
            ...prev,
            page: newPage + 1
        }));
    };

    const handleChangeRowsPerPageDeleted = (newRowsPerPage) => {
        setApp002UserDeletedDataParam(prev => ({
            ...prev,
            size: newRowsPerPage,
            page: 1
        }));
    };

    const handleRequestSortDeleted = (property, order) => {
        setApp002UserDeletedDataParam(prev => ({
            ...prev,
            sort: property,
            order: order,
            page: 1
        }));
    };

    // Data From API Active User
    const getAllUser = useCallback(async (param) => {
        setLoadingData(true);
        try {
            const response = await getUser(param);
            console.table(response.data.users)
            setApp002UserData(response?.data?.users ? response.data.users : []);
            setApp002UserTotalData(response?.data?.count_data ? response.data.count_data : 0);
            app002SetTotalPage(response?.data?.total_pages ? response.data?.total_pages : 0);


        } catch (error) {
            console.error("Gagal mengambil data:", error);

        } finally {
            setLoadingData(false);
        }
    });

    // const getAllUser = useCallback(async (param) => {
    //     setLoadingData(true);

    //     setTimeout(() => {
    //         let filtered = [...DUMMY_ACTIVE_USERS];

    //         if (param.search) {
    //             filtered = filtered.filter(user =>
    //                 user.name.toLowerCase().includes(param.search.toLowerCase()) ||
    //                 user.email.toLowerCase().includes(param.search.toLowerCase())
    //             );
    //         }

    //         if (param.role) {
    //             filtered = filtered.filter(user => user.role === param.role);
    //         }

    //         if (param.sort) {
    //             filtered.sort((a, b) => {
    //                 if (a[param.sort] < b[param.sort]) return param.order === "asc" ? -1 : 1;
    //                 if (a[param.sort] > b[param.sort]) return param.order === "asc" ? 1 : -1;
    //                 return 0;
    //             });
    //         }

    //         const start = (param.page - 1) * param.size;
    //         const end = start + param.size;
    //         const paginated = filtered.slice(start, end);

    //         setApp002UserData(paginated);
    //         setApp002UserTotalData(filtered.length);
    //         app002SetTotalPage(Math.ceil(filtered.length / param.size));

    //         setLoadingData(false);
    //     }, 500);
    // }, []);

    useEffect(() => {
        if (app002p01Page && active == "activeUser") {
            getAllUser(app002UserDataParam);
        }
    }, [app002UserDataParam, active]);

    // Data From API Deleted User
    const getAllDeletedUser = useCallback(async (param) => {
        setLoadingData(true);
        try {
            const response = await getUserDeleted(param);
            console.table(response.data.users)
            setApp002UserDeletedData(response?.data?.users ? response.data.users : []);
            setApp002UserDeletedTotalData(response?.data?.count_data ? response.data.count_data : 0);
            app002SetTotalPageDeleted(response?.data?.total_pages ? response.data?.total_pages : 0);
        } catch (error) {
            console.error("Gagal mengambil data:", error);
        } finally {
            setLoadingData(false);
        }
    });

    // const getAllDeletedUser = useCallback(async (param) => {
    //     setLoadingData(true);

    //     setTimeout(() => {
    //         let filtered = [...DUMMY_DELETED_USERS];

    //         if (param.search) {
    //             filtered = filtered.filter(user =>
    //                 user.name.toLowerCase().includes(param.search.toLowerCase())
    //             );
    //         }

    //         if (param.role) {
    //             filtered = filtered.filter(user => user.role === param.role);
    //         }

    //         if (param.sort) {
    //             filtered.sort((a, b) => {
    //                 if (a[param.sort] < b[param.sort]) return param.order === "asc" ? -1 : 1;
    //                 if (a[param.sort] > b[param.sort]) return param.order === "asc" ? 1 : -1;
    //                 return 0;
    //             });
    //         }

    //         const start = (param.page - 1) * param.size;
    //         const end = start + param.size;
    //         const paginated = filtered.slice(start, end);

    //         setApp002UserDeletedData(paginated);
    //         setApp002UserDeletedTotalData(filtered.length);
    //         app002SetTotalPageDeleted(Math.ceil(filtered.length / param.size));

    //         setLoadingData(false);
    //     }, 500);
    // }, []);

    useEffect(() => {
        if (app002p01Page && active == "deletedUser") {
            getAllDeletedUser(app002UserDeletedDataParam);
        }
    }, [app002UserDeletedDataParam, active]);

    // Search and Filtering (Free Text and Role)
    const roleOptions = [
        { value: "ADMIN", label: "Admin" },
        { value: "USER", label: "User" },
        { value: "STAFF", label: "Staff" },
    ];

    const handleRoleChange = (event) => {
        setRole(event)
        setSearch("")

        if (active == "activeUser") {
            setApp002UserDataParam(prev => ({
                ...prev,
                "page": 1,
                "role": event,
                "search": ""
            }))
        } else if (active == "deletedUser") {
            setApp002UserDeletedDataParam(prev => ({
                ...prev,
                "page": 1,
                "role": event,
                "search": ""
            }))
        }
    }

    const handleSearchState = () => {
        if (active == "activeUser") {
            setApp002UserDataParam(prev => ({
                ...prev,
                page: 1,
                search: search
            }))
        } else if (active == "deletedUser") {
            setApp002UserDeletedDataParam(prev => ({
                ...prev,
                page: 1,
                search: search
            }))
        }
    }

    // Refresh Table Function
    const refreshTable = useCallback(() => {
        setSearch("");
        setRole("");
        setApp002UserDataParam({
            page: 1,
            size: 10,
            sort: "",
            order: "asc",
            search: "",
            role: "",
        });
        setApp002UserDeletedDataParam({
            page: 1,
            size: 10,
            sort: "",
            order: "asc",
            search: "",
            role: "",
        });
    });

    // Form Add Modal
    const handleModalAddOpen = () => {
        setApp002setMsg("")
        setModalAddOpen(true)
    }

    // Form Edit Modal
    const handleModalEditOpen = (obj) => {
        setApp002setMsg("")
        setModalEditOpen(true)
        setApp002UserEditData(obj)
    }

    // Form Delete Modal
    const handleModalDeleteOpen = (obj) => {
        setApp002setMsg("")
        setModalDeleteOpen(true)
        setApp002UserDeleteData(obj)
    }
    const app002HandleDeleteUser = () => {
        if (app002UserDeleteData.user_id) {
            deleteUserAction(app002UserDeleteData)
        }
    }
    const deleteUserAction = useCallback(async (param) => {
        try {
            setLoadingDelete(true)
            const response = await deleteUser(param.user_id)

            if (response.status === 204 || response.status === 200) {
                setApp002setMsg("User Has Been Successfully Deleted.")
                setApp002setMsgStatus("success")
            } else {
                setApp002setMsg("Failed to delete user.")
                setApp002setMsgStatus("error")
            }
        } catch (error) {
            debugger
            console.log(error)
            setApp002setMsg(error?.response?.data?.detail || "System is Unavailable. Please Try Again Later.")
            setApp002setMsgStatus("error")
        } finally {
            setModalDeleteOpen(false)
            setLoadingDelete(false)
            refreshTable();
        }
    })

    // Form Restore Modal
    const handleModalRestoreOpen = (obj) => {
        setApp002setMsg("")
        setModalRestoreOpen(true)
        setApp002UserRestoreData(obj)
    }
    const app002HandleRestoreUser = () => {
        if (app002UserRestoreData.user_id) {
            restoreUserAction(app002UserRestoreData)
        }
    }
    const restoreUserAction = useCallback(async (param) => {
        try {
            setLoadingRestore(true)
            const response = await restoreUser(param.user_id)

            if (response.status === 201 || response.status === 200) {
                setApp002setMsg("User Has Been Successfully Restored.")
                setApp002setMsgStatus("success")
            } else {
                setApp002setMsg("Failed to restore user.")
                setApp002setMsgStatus("error")
            }
        } catch (error) {
            debugger
            console.log(error)
            setApp002setMsg(error?.response?.data?.detail || "System is Unavailable. Please Try Again Later.")
            setApp002setMsgStatus("error")
        } finally {
            setModalRestoreOpen(false)
            setLoadingRestore(false)
            refreshTable();
        }
    })

    return (
        <React.Fragment>
            <RootPageCustom
                msgStateGet={app002Msg}
                msgStateSet={setApp002setMsg}
                msgStateGetStatus={app002MsgStatus}
                setFirstRender={setFirstRender}
                title="Users Management"
                icon={<PersonIcon fontSize="medium"/>}
                breadCrumbItems={breadCrumbItems}
                isMobile={isMobile}
            >


                <Container
                    maxWidth={false}
                    hidden={!app002p01Page}
                    disableGutters
                    component={Paper}
                    sx={{ overflow: "hidden", borderTopRightRadius: '0px', borderTopLeftRadius: isMobile ? "0px" : "10px" }}
                >

                    <Box display={"flex"} flexDirection={"column"} gap={2} py={1} px={2}>
                        <Stack>
                            <Tabs
                                value={active}
                                onChange={handleTabChange}
                                variant="scrollable"
                                scrollButtons={false}
                                allowScrollButtonsMobile
                            >
                                <Tab label="Active User"
                                    icon={<HowToRegIcon />}
                                    iconPosition="start"
                                    value="activeUser"
                                />
                                <Tab label="Deleted User"
                                    value="deletedUser"
                                    icon={<PersonRemoveOutlinedIcon />}
                                    iconPosition="start"
                                />
                            </Tabs>
                        </Stack>

                        <Stack>
                            <Grid container spacing={2} alignItems="center">
                                <Grid size={{ xs: 6, sm: 6, md: 3 }}>
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

                                <Grid size={{ xs: 6, sm: 6, md: 3 }}>
                                    <Select
                                        fullWidth
                                        size="small"
                                        value={role}
                                        displayEmpty
                                        onChange={(e) => handleRoleChange(e.target.value)}
                                        renderValue={(selected) => {
                                            if (!selected) return "All Roles";
                                            return roleOptions.find((opt) => opt.value === selected)?.label;
                                        }}
                                    >
                                        <MenuItem value="">All Roles</MenuItem>
                                        {roleOptions.map((opt) => (
                                            <MenuItem key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </Grid>

                                <Grid
                                    size={{ xs: 12, md: 6 }}
                                    display={"flex"}
                                    sx={{ justifyContent: "flex-end" }}
                                >
                                    {active !== "deletedUser" && (
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
                                    )}
                                </Grid>
                            </Grid>
                        </Stack>

                        <Stack>
                            {active === "activeUser" && (
                                <TableCustom
                                    keyField="user_id"
                                    loadingData={loadingData}
                                    columns={app002UserColumns}
                                    appdata={app002UserData}
                                    appdataTotal={app002UserTotalData}
                                    totalPage={app002TotalPage}
                                    rowsPerPageOption={[5, 10, 20, 25]}
                                    page={app002UserDataParam.page - 1}
                                    rowsPerPage={app002UserDataParam.size}
                                    sortField={app002UserDataParam.sort}
                                    sortOrder={app002UserDataParam.order}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                    onRequestSort={handleRequestSort}
                                />
                            )}

                            {active === "deletedUser" && (
                                <TableCustom
                                    keyField="user_id"
                                    loadingData={loadingData}
                                    columns={app002UserDeletedColumns}
                                    appdata={app002UserDeletedData}
                                    appdataTotal={app002UserDeletedTotalData}
                                    totalPage={app002TotalPageDeleted}
                                    rowsPerPageOption={[5, 10, 20, 25]}
                                    page={app002UserDeletedDataParam.page - 1}
                                    rowsPerPage={app002UserDeletedDataParam.size}
                                    sortField={app002UserDeletedDataParam.sort}
                                    sortOrder={app002UserDeletedDataParam.order}
                                    onPageChange={handleChangePageDeleted}
                                    onRowsPerPageChange={handleChangeRowsPerPageDeleted}
                                    onRequestSort={handleRequestSortDeleted}
                                />
                            )}

                        </Stack>
                    </Box>
                </Container>

                {modalAddOpen && (
                    <MasterUserAdd
                        modalAddOpen={modalAddOpen}
                        setModalAddOpen={setModalAddOpen}
                        refreshTable={refreshTable}
                        // Props for message
                        app002Msg={app002Msg}
                        setApp002setMsg={setApp002setMsg}
                        app002MsgStatus={app002MsgStatus}
                        setApp002setMsgStatus={setApp002setMsgStatus}
                    >
                    </MasterUserAdd>
                )}

                {modalEditOpen && (
                    <MasterUserEdit
                        modalEditOpen={modalEditOpen}
                        setModalEditOpen={setModalEditOpen}
                        refreshTable={refreshTable}

                        // Props for message and data
                        app002UserEditData={app002UserEditData}
                        app002Msg={app002Msg}
                        setApp002setMsg={setApp002setMsg}
                        app002MsgStatus={app002MsgStatus}
                        setApp002setMsgStatus={setApp002setMsgStatus}
                    />
                )}

                {modalDeleteOpen && (
                    <PopupDeleteAndRestore
                        status={"delete"}
                        modalOpen={modalDeleteOpen}
                        modalClose={() => setModalDeleteOpen(false)}
                        loading={loadingDelete}
                        onClick={app002HandleDeleteUser}
                    />
                )}

                {modalRestoreOpen && (
                    <PopupDeleteAndRestore
                        status={"restore"}
                        modalOpen={modalRestoreOpen}
                        modalClose={() => setModalRestoreOpen(false)}
                        loading={loadingRestore}
                        onClick={app002HandleRestoreUser}
                    />
                )}


            </RootPageCustom>
        </React.Fragment >
    );
}

export default MasterUser;