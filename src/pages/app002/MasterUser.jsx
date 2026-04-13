import React, { useState, useEffect, useCallback, useMemo } from "react";
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

const roleOptions = [
    { value: "ADMIN", label: "Admin" },
    { value: "USER", label: "User" },
    { value: "STAFF", label: "Staff" },
];

const MasterUser = () => {
    const [loading, setLoading] = useState(false)
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

    const handleTabChange = (param) => {
        setSelectedTab(param);
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

    const app002UserColumns = useMemo(() => [
        {
            dataField: "userId",
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
            formatter: (cellContent, row) => {
                switch (selectedTab) {
                    case "active":
                        return (
                            <div className="flex items-center justify-center gap-2">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="outline" size="icon-sm" onClick={() => handleModalEditOpen(row)}>
                                            <SquarePen className="text-blue-500" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent><p>Edit</p></TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="outline" size="icon-sm" onClick={() => handleModalDeleteOpen(row)}>
                                            <Trash2 className="text-red-500" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent><p>Delete</p></TooltipContent>
                                </Tooltip>
                            </div>
                        )
                    case "inactive":
                        return (
                            <div className="flex items-center justify-center">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="ghost" size="icon-sm" onClick={() => handleModalRestoreOpen(row)}>
                                            <RotateCcw className="text-blue-500" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent><p>Restore</p></TooltipContent>
                                </Tooltip>
                            </div>
                        )
                    default:
                        return null
                }
            }
        },
    ], [selectedTab]);

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

    const fetchUser = useCallback(async (tab, param) => {
        setLoading(true);
        try {
            const response = await (tab === "active" ? getUser(param) : getUserDeleted(param));
            setApp002UserData(response?.data?.content ?? []);
            setApp002UserTotalData(response?.data?.totalElements ?? 0);
            app002SetTotalPage(response?.data?.totalPages ?? 0);
        } catch {
            toast.error("System is unavailable, please try again later.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUser(selectedTab, app002UserDataParam);
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

    // Form Edit Modal
    const handleModalEditOpen = (obj) => {
        setModalEditOpen(true)
        setApp002UserEditData(obj)
    }

    // Form Additional Modal
    const handleModalDeleteOpen = (obj) => {
        setModalDeleteOpen(true)
        setApp002UserDeleteData(obj)
    }

    const handleModalRestoreOpen = (obj) => {
        setModalRestoreOpen(true)
        setApp002UserRestoreData(obj)
    }

    const handleUserAction = useCallback(async (type, param) => {
        const toastId = toast.loading("Loading...")
        setLoading(true)
        try {
            const response = await (type === "delete" ? deleteUser(param.userId) : restoreUser(param.userId))
            if (response?.status === 204 || response?.status === 200) {
                toast.success(`User ${type}d successfully.`, { id: toastId })
                refreshTable()
            } else {
                toast.error(`Failed to ${type} user.`, { id: toastId })
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "System is unavailable, please try again later.", { id: toastId })
        } finally {
            type === "delete" ? setModalDeleteOpen(false) : setModalRestoreOpen(false)
            setLoading(false)
        }
    }, [])

    const app002HandleDeleteUser = () => app002UserDeleteData?.userId && handleUserAction("delete", app002UserDeleteData)
    const app002HandleRestoreUser = () => app002UserRestoreData?.userId && handleUserAction("restore", app002UserRestoreData)

    return (
        <RootPageCustom
            title={"User Management"}
            desc={"Manage and monitor system user accounts"}
            setModalAddOpen={setModalAddOpen}
            buttonLabel={"Add User"}
        >
            <div className="flex flex-col gap-2">
                <Card>
                    <CardContent>
                        <Tabs value={selectedTab} onValueChange={handleTabChange}>
                            <div className="flex flex-col mb-2">
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
                                <div className="flex items-center gap-2 sm:hidden mt-2">
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
                                    keyField="userId"
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
                                    keyField="userId"
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
    );
}

export default MasterUser;