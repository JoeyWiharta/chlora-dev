import React, { useState, useEffect, useCallback } from "react";
import RootPageCustom from "../../components/common/RootPageCustom";
import TableCustom from "../../components/common/TableCustom";
import { getUser, deleteUser, getUserDeleted, restoreUser } from "../../utils/ListApi";
import MasterUserAdd from "./MasterUserAdd";
import MasterUserEdit from "./MasterUserEdit";
import PopupDeleteAndRestore from "../../components/common/PopupDeleteAndRestore";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { UserRoundCheck, UserRoundX, Search, Plus, RotateCcw, SquarePen, Trash2 } from "lucide-react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { DUMMY_ACTIVE_USERS, DUMMY_DELETED_USERS } from "./DummyDataUser";



const MasterUser = () => {
    // State First Page, Message, and Loading Effect
    const [firstRender, setFirstRender] = useState(false)
    const [app002p01Page, setApp002p01Page] = useState(true);
    const [selectedTab, setSelectedTab] = useState("active")
    const handleTabChange = (param) => {
        setSelectedTab(param);
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
                <div className="flex items-center justify-center gap-2">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="outline"
                                size="icon-sm"
                                onClick={() => handleModalEditOpen(app002UserData)}
                            >
                                <SquarePen className="text-blue-500" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Edit</p>
                        </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="outline"
                                size="icon-sm"
                                onClick={() => handleModalDeleteOpen(app002UserData)}
                            >
                                <Trash2 className="text-red-500" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Delete</p>
                        </TooltipContent>
                    </Tooltip>
                </div>
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
                <div className="flex items-center justify-center">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon-sm"
                                onClick={() => handleModalRestoreOpen(app002UserDeletedData)}
                            >
                                <RotateCcw className="text-blue-500" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Restore</p>
                        </TooltipContent>
                    </Tooltip>
                </div>
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
    // const getAllUser = useCallback(async (param) => {
    //     setLoadingData(true);
    //     try {
    //         const response = await getUser(param);
    //         console.table(response.data.users)
    //         setApp002UserData(response?.data?.users ? response.data.users : []);
    //         setApp002UserTotalData(response?.data?.count_data ? response.data.count_data : 0);
    //         app002SetTotalPage(response?.data?.total_pages ? response.data?.total_pages : 0);


    //     } catch (error) {
    //         console.error("Gagal mengambil data:", error);

    //     } finally {
    //         setLoadingData(false);
    //     }
    // });

    const getAllUser = useCallback(async (param) => {
        setLoadingData(true);

        setTimeout(() => {
            let filtered = [...DUMMY_ACTIVE_USERS];

            if (param.search) {
                filtered = filtered.filter(user =>
                    user.name.toLowerCase().includes(param.search.toLowerCase()) ||
                    user.email.toLowerCase().includes(param.search.toLowerCase())
                );
            }

            if (param.role) {
                filtered = filtered.filter(user => user.role === param.role);
            }

            if (param.sort) {
                filtered.sort((a, b) => {
                    if (a[param.sort] < b[param.sort]) return param.order === "asc" ? -1 : 1;
                    if (a[param.sort] > b[param.sort]) return param.order === "asc" ? 1 : -1;
                    return 0;
                });
            }

            const start = (param.page - 1) * param.size;
            const end = start + param.size;
            const paginated = filtered.slice(start, end);

            setApp002UserData(paginated);
            setApp002UserTotalData(filtered.length);
            app002SetTotalPage(Math.ceil(filtered.length / param.size));

            setLoadingData(false);
        }, 500);
    }, []);

    useEffect(() => {
        if (app002p01Page && selectedTab == "active") {
            getAllUser(app002UserDataParam);
        }
    }, [app002UserDataParam, selectedTab]);

    // Data From API Deleted User
    // const getAllDeletedUser = useCallback(async (param) => {
    //     setLoadingData(true);
    //     try {
    //         const response = await getUserDeleted(param);
    //         console.table(response.data.users)
    //         setApp002UserDeletedData(response?.data?.users ? response.data.users : []);
    //         setApp002UserDeletedTotalData(response?.data?.count_data ? response.data.count_data : 0);
    //         app002SetTotalPageDeleted(response?.data?.total_pages ? response.data?.total_pages : 0);
    //     } catch (error) {
    //         console.error("Gagal mengambil data:", error);
    //     } finally {
    //         setLoadingData(false);
    //     }
    // });

    const getAllDeletedUser = useCallback(async (param) => {
        setLoadingData(true);

        setTimeout(() => {
            let filtered = [...DUMMY_DELETED_USERS];

            if (param.search) {
                filtered = filtered.filter(user =>
                    user.name.toLowerCase().includes(param.search.toLowerCase())
                );
            }

            if (param.role) {
                filtered = filtered.filter(user => user.role === param.role);
            }

            if (param.sort) {
                filtered.sort((a, b) => {
                    if (a[param.sort] < b[param.sort]) return param.order === "asc" ? -1 : 1;
                    if (a[param.sort] > b[param.sort]) return param.order === "asc" ? 1 : -1;
                    return 0;
                });
            }

            const start = (param.page - 1) * param.size;
            const end = start + param.size;
            const paginated = filtered.slice(start, end);

            setApp002UserDeletedData(paginated);
            setApp002UserDeletedTotalData(filtered.length);
            app002SetTotalPageDeleted(Math.ceil(filtered.length / param.size));

            setLoadingData(false);
        }, 500);
    }, []);

    useEffect(() => {
        if (app002p01Page && selectedTab == "inactive") {
            getAllDeletedUser(app002UserDeletedDataParam);
        }
    }, [app002UserDeletedDataParam, selectedTab]);

    // Search and Filtering (Free Text and Role)
    const roleOptions = [
        { value: "ADMIN", label: "Admin" },
        { value: "USER", label: "User" },
        { value: "STAFF", label: "Staff" },
    ];

    const handleRoleChange = (e) => {
        const switchValue = e === "all" ? "" : e
        setRole(e)
        setSearch("")

        if (selectedTab == "active") {
            setApp002UserDataParam(prev => ({
                ...prev,
                "page": 1,
                "role": switchValue,
                "search": ""
            }))
        } else if (selectedTab == "inactive") {
            setApp002UserDeletedDataParam(prev => ({
                ...prev,
                "page": 1,
                "role": switchValue,
                "search": ""
            }))
        }
    }

    const handleSearchState = () => {
        if (selectedTab == "active") {
            setApp002UserDataParam(prev => ({
                ...prev,
                page: 1,
                search: search
            }))
        } else if (selectedTab == "inactive") {
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
                setFirstRender={setFirstRender}
            // msgStateGet={app002Msg}
            // msgStateSet={setApp002setMsg}
            // msgStateGetStatus={app002MsgStatus}
            >
                <div className={`${app002p01Page ? "flex" : "hidden"} flex-col gap-2`}>

                    {/* Page Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-xl font-semibold">User Management</h1>
                            <p className="text-sm text-muted-foreground">Manage and monitor system user accounts</p>
                        </div>
                        <Button
                            size="sm"
                            onClick={handleModalAddOpen}
                            className={selectedTab === "active" ? "flex" : "hidden"}
                            variant="primary"
                        >
                            <Plus className="h-4 w-4" />
                            <span className="hidden sm:inline">Add User</span>
                        </Button>
                    </div>

                    {/* Card Content */}
                    <Card>
                        <CardContent>
                            <Tabs value={selectedTab} onValueChange={handleTabChange}>

                                {/* Toolbar: Tabs + Filter */}
                                <div className="flex flex-col gap-2 mb-4">

                                    {/* Baris 1: Tabs */}
                                    <div className="flex items-center justify-between gap-2">
                                        <TabsList className="w-full sm:w-fit">
                                            <TabsTrigger value="active" className="flex-1 sm:flex-none">
                                                <UserRoundCheck className="mr-1 h-4 w-4" />Active
                                            </TabsTrigger>
                                            <TabsTrigger value="inactive" className="flex-1 sm:flex-none">
                                                <UserRoundX className="mr-1 h-4 w-4" />Inactive
                                            </TabsTrigger>
                                        </TabsList>

                                        {/* Search + Role desktop sejajar tabs */}
                                        <div className="hidden sm:flex items-center gap-2">
                                            <div className="relative">
                                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    placeholder="Search..."
                                                    value={search}
                                                    onChange={(e) => setSearch(e.target.value)}
                                                    onKeyDown={(e) => { if (e.key === "Enter") handleSearchState() }}
                                                    className="pl-8 w-48"
                                                />
                                            </div>
                                            <Select value={role} onValueChange={handleRoleChange}>
                                                <SelectTrigger className="w-36">
                                                    <SelectValue placeholder="All Roles" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectItem value="all">All Roles</SelectItem>
                                                        {roleOptions.map((item) => (
                                                            <SelectItem key={item.value} value={item.value}>
                                                                {item.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    {/* Baris 2: Search || Role (mobile only) */}
                                    <div className="flex items-center gap-2 sm:hidden">
                                        <div className="relative flex-1">
                                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                placeholder="Search..."
                                                value={search}
                                                onChange={(e) => setSearch(e.target.value)}
                                                onKeyDown={(e) => { if (e.key === "Enter") handleSearchState() }}
                                                className="pl-8 w-full"
                                            />
                                        </div>
                                        <Select value={role} onValueChange={handleRoleChange}>
                                            <SelectTrigger className="w-32">
                                                <SelectValue placeholder="All Roles" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectItem value="all">All Roles</SelectItem>
                                                    {roleOptions.map((item) => (
                                                        <SelectItem key={item.value} value={item.value}>
                                                            {item.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                </div>


                                <TabsContent value="active">
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
                                </TabsContent>

                                <TabsContent value="inactive">
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
                                </TabsContent>

                            </Tabs>
                        </CardContent>
                    </Card>
                </div>

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
                        roleOptions={roleOptions}
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
                        roleOptions={roleOptions}
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