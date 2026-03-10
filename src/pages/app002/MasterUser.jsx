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
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import toast from "react-hot-toast";

const MasterUser = () => {
    const [firstRender, setFirstRender] = useState(false)
    const [loading, setLoading] = useState(false)
    const [app002p01Page, setApp002p01Page] = useState(true);
    const [modalAddOpen, setModalAddOpen] = useState(false);
    const [modalEditOpen, setModalEditOpen] = useState(false);
    const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
    const [modalRestoreOpen, setModalRestoreOpen] = useState(false);
    const [app002UserData, setApp002UserData] = useState([]);
    const [app002UserTotalData, setApp002UserTotalData] = useState(0)
    const [app002TotalPage, app002SetTotalPage] = useState(0)
    const [selectedTab, setSelectedTab] = useState("active")
    const [search, setSearch] = useState("")
    const [role, setRole] = useState("")
    const [app002UserEditData, setApp002UserEditData] = useState(null);
    const [app002UserDeleteData, setApp002UserDeleteData] = useState(null)
    const [app002UserRestoreData, setApp002UserRestoreData] = useState(null)

    const roleOptions = [
        { value: "ADMIN", label: "Admin" },
        { value: "USER", label: "User" },
        { value: "STAFF", label: "Staff" },
    ];

    const handleTabChange = (param) => {
        setSelectedTab(param);
        setRole("")
        setSearch("")
        refreshTable()
    };

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
            headerAlign: "left",
            bodyAlign: "left",
        },
        {
            dataField: "email",
            text: "Email",
            sort: true,
            headerAlign: "left",
            bodyAlign: "left",
        },
        {
            dataField: "role",
            text: "Role",
            sort: true,
            headerAlign: "center",
            bodyAlign: "center",
            formatter: (cellContent) => {
                switch (cellContent) {
                    case "ADMIN":
                        return <Badge className="bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300">Admin</Badge>
                    case "USER":
                        return <Badge className="bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300">User</Badge>
                    case "STAFF":
                        return <Badge className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">Staff</Badge>
                    default:
                        return <Badge className="bg-muted text-muted-foreground">{cellContent}</Badge>
                }
            }
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
                                <SquarePen
                                    className="text-blue-500"
                                />
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
            headerAlign: "left",
            bodyAlign: "left",
        },
        {
            dataField: "email",
            text: "Email",
            sort: true,
            headerAlign: "left",
            bodyAlign: "left",
        },
        {
            dataField: "role",
            text: "Role",
            sort: true,
            headerAlign: "center",
            bodyAlign: "center",
            formatter: (cellContent) => {
                switch (cellContent) {
                    case "ADMIN":
                        return <Badge className="bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300">Admin</Badge>
                    case "USER":
                        return <Badge className="bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300">User</Badge>
                    case "STAFF":
                        return <Badge className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">Staff</Badge>
                    default:
                        return <Badge className="bg-muted text-muted-foreground">{cellContent}</Badge>
                }
            }
        },
        {
            dataField: "action",
            text: "Action",
            headerAlign: "center",
            formatter: (cellContent, app002UserData) => (
                <div className="flex items-center justify-center">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon-sm"
                                onClick={() => handleModalRestoreOpen(app002UserData)}
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

    // Data From API Active User
    const getAllUser = useCallback(async (param) => {
        setLoading(true);
        try {
            const response = await getUser(param);
            console.table(response.data.users)
            setApp002UserData(response?.data?.users ? response.data.users : []);
            setApp002UserTotalData(response?.data?.count_data ? response.data.count_data : 0);
            app002SetTotalPage(response?.data?.total_pages ? response.data?.total_pages : 0);


        } catch (error) {
            console.error("Gagal mengambil data:", error);

        } finally {
            setLoading(false);
        }
    });

    // const getAllUser = useCallback(async (param) => {
    //     setLoading(true);

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

    //         setLoading(false);
    //     }, 500);
    // }, []);



    // Data From API Deleted User

    const getAllDeletedUser = useCallback(async (param) => {
        setLoading(true);
        try {
            const response = await getUserDeleted(param);
            console.table(response.data.users)
            setApp002UserData(response?.data?.users ? response.data.users : []);
            setApp002UserTotalData(response?.data?.count_data ? response.data.count_data : 0);


            app002SetTotalPage(response?.data?.total_pages ? response.data?.total_pages : 0);
        } catch (error) {
            console.error("Gagal mengambil data:", error);
        } finally {
            setLoading(false);
        }
    });

    // const getAllDeletedUser = useCallback(async (param) => {
    //     setLoading(true);

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

    //         setApp002UserData(paginated);
    //         setApp002UserTotalData(filtered.length);
    //         app002SetTotalPage(Math.ceil(filtered.length / param.size));

    //         setLoading(false);
    //     }, 500);
    // }, []);

    useEffect(() => {
        if (app002p01Page) {
            if (selectedTab == "active") {
                getAllUser(app002UserDataParam);
            } else if (selectedTab == "inactive") {
                getAllDeletedUser(app002UserDataParam);
            }
        }
    }, [app002UserDataParam, selectedTab]);


    const handleRoleChange = (e) => {
        const switchValue = e === "all" ? "" : e
        setRole(e)
        setSearch("")

        setApp002UserDataParam(prev => ({
            ...prev,
            "page": 1,
            "role": switchValue,
            "search": ""
        }))
    }

    const handleSearchState = () => {
        setApp002UserDataParam(prev => ({
            ...prev,
            page: 1,
            search: search
        }))
    }

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
    }, []);

    // Form Add Modal
    const handleModalAddOpen = () => {
        setModalAddOpen(true)
    }

    // Form Edit Modal
    const handleModalEditOpen = (obj) => {
        setModalEditOpen(true)
        setApp002UserEditData(obj)
    }

    // Form and Function Delete Modal
    const handleModalDeleteOpen = (obj) => {
        setModalDeleteOpen(true)
        setApp002UserDeleteData(obj)
    }

    const app002HandleDeleteUser = () => {
        if (app002UserDeleteData.user_id) {
            toast.dismiss()
            deleteUserAction(app002UserDeleteData)
        }
    }

    const deleteUserAction = useCallback(async (param) => {
        const toastId = toast.loading("Loading...")
        try {
            setLoading(true)
            const response = await deleteUser(param.user_id)

            if (response.status === 204 || response.status === 200) {
                toast.success("User Has Been Successfully Deleted.", { id: toastId })
                refreshTable();
            } else {
                toast.error("Failed to delete user.", { id: toastId })
            }
        } catch (error) {
            toast.error(error?.response?.data?.detail || "System is Unavailable. Please Try Again Later.", { id: toastId })
        } finally {
            setModalDeleteOpen(false)
            setLoading(false)
        }
    })

    // Form and Function Restore Modal
    const handleModalRestoreOpen = (obj) => {
        setModalRestoreOpen(true)
        setApp002UserRestoreData(obj)
    }
    const app002HandleRestoreUser = () => {
        if (app002UserRestoreData.user_id) {
            toast.dismiss()
            restoreUserAction(app002UserRestoreData)
        }
    }
    const restoreUserAction = useCallback(async (param) => {
        const toastId = toast.loading("Loading...")
        try {
            setLoading(true)
            const response = await restoreUser(param.user_id)

            if (response.status === 201 || response.status === 200) {
                toast.success("User Has Been Successfully Restored.", { id: toastId })
                refreshTable();
            } else {
                toast.error(error?.response?.data?.detail || "Failed to restore user.", { id: toastId })
            }
        } catch (error) {
            toast.error(error?.response?.data?.detail || "System is Unavailable. Please Try Again Later.", { id: toastId })
        } finally {
            setModalRestoreOpen(false)
            setLoading(false)
        }
    })

    return (
        <React.Fragment>
            <RootPageCustom
                setFirstRender={setFirstRender}
            >
                <div className={`${app002p01Page ? "flex" : "hidden"} flex-col gap-2`}>
                    <div className="flex items-center justify-between px-6 mb-2">
                        <div>
                            <h1 className="text-xl font-semibold">User Management</h1>
                            <p className="text-sm text-muted-foreground">Manage and monitor system user accounts</p>
                        </div>
                        <Button
                            size="sm"
                            onClick={handleModalAddOpen}
                            className={selectedTab === "active" ? "flex" : "hidden"}
                        >
                            <Plus />
                            <span className="hidden sm:inline">Add User</span>
                        </Button>
                    </div>

                    <Card>
                        <CardContent>
                            <Tabs value={selectedTab} onValueChange={handleTabChange}>
                                <div className="flex flex-col gap-2 mb-4">
                                    <div className="flex items-center justify-between gap-2">
                                        <TabsList className="w-full sm:w-fit">
                                            <TabsTrigger value="active" className="flex-1 sm:flex-none">
                                                <UserRoundCheck className="mr-1 h-4 w-4" />Active
                                            </TabsTrigger>
                                            <TabsTrigger value="inactive" className="flex-1 sm:flex-none">
                                                <UserRoundX className="mr-1 h-4 w-4" />Inactive
                                            </TabsTrigger>
                                        </TabsList>
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
                                        loadingData={loading}
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
                                        loadingData={loading}
                                        columns={app002UserDeletedColumns}
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
                            </Tabs>
                        </CardContent>
                    </Card>
                </div>

                {modalAddOpen && (
                    <MasterUserAdd
                        modalAddOpen={modalAddOpen}
                        setModalAddOpen={setModalAddOpen}
                        refreshTable={refreshTable}
                        roleOptions={roleOptions}
                    />
                )}

                {modalEditOpen && (
                    <MasterUserEdit
                        modalEditOpen={modalEditOpen}
                        setModalEditOpen={setModalEditOpen}
                        refreshTable={refreshTable}
                        app002UserEditData={app002UserEditData}
                        roleOptions={roleOptions}
                    />
                )}

                {modalDeleteOpen && (
                    <PopupDeleteAndRestore
                        status={"delete"}
                        modalOpen={modalDeleteOpen}
                        modalClose={() => setModalDeleteOpen(false)}
                        loading={loading}
                        onClick={app002HandleDeleteUser}
                    />
                )}

                {modalRestoreOpen && (
                    <PopupDeleteAndRestore
                        status={"restore"}
                        modalOpen={modalRestoreOpen}
                        modalClose={() => setModalRestoreOpen(false)}
                        loading={loading}
                        onClick={app002HandleRestoreUser}
                    />
                )}
            </RootPageCustom>
        </React.Fragment >
    );
}

export default MasterUser;