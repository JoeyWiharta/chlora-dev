import React, { useState, useEffect, useCallback } from "react";
import RootPageCustom from "../../components/common/RootPageCustom";
import TableCustom from "../../components/common/TableCustom";
import { getDevice, deleteDevice, getCluster } from "../../utils/ListApi";
import PopupDeleteAndRestore from "../../components/common/PopupDeleteAndRestore";
import { Trash2, SquarePen, Plus, Search, RotateCcw } from "lucide-react";
import MasterDeviceAdd from "./MasterDeviceAdd";
import MasterDeviceEdit from "./MasterDeviceEdit";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import toast from "react-hot-toast";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const MasterDevice = () => {
    // State First Page, Message, and Loading Effect
    const [firstRender, setFirstRender] = useState(false)
    const [app004p01Page, setApp004p01Page] = useState(true);
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
            dataField: "deviceId",
            text: "Device ID",
            sort: true,
            headerAlign: "center",
            bodyAlign: 'center',
        },
        {
            dataField: "deviceName",
            text: "Device Name",
            sort: true,
            headerAlign: "left",
            bodyAlign: 'left',
        },
        {
            dataField: "deviceType",
            text: "Device Type",
            sort: true,
            headerAlign: "center",
            bodyAlign: 'center',
        },
        {
            dataField: "clusterName",
            text: "Cluster Name",
            sort: true,
            headerAlign: "left",
            bodyAlign: 'left',
        },
        {
            dataField: "status",
            text: "Status",
            sort: true,
            headerAlign: "center",
            bodyAlign: 'center',
            formatter: (cellContent) => {
                switch (cellContent) {
                    case "ONLINE":
                        return <Badge className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">Online</Badge>
                    case "OFFLINE":
                        return <Badge className="bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300">Offline</Badge>
                    default:
                        return <Badge className="bg-muted text-muted-foreground">{cellContent}</Badge>
                }
            }
        },
        {
            dataField: "action",
            text: "Action",
            headerAlign: "center",
            bodyAlign: 'left',
            formatter: (cellContent, app004DeviceData) => (
                <div className="flex items-center justify-center gap-2">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="outline"
                                size="icon-sm"
                                onClick={() => handleModalEditOpen(app004DeviceData)}
                            >
                                <SquarePen className="text-blue-500" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent><p>Edit</p></TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="outline"
                                size="icon-sm"
                                onClick={() => handleModalDeleteOpen(app004DeviceData)}
                            >
                                <Trash2 className="text-red-500" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent><p>Delete</p></TooltipContent>
                    </Tooltip>
                </div>
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
        toast.dismissAll()
        setLoadingData(true);
        try {
            const response = await getDevice(param);
            setApp004DeviceData(response?.data?.devices ? response.data.devices : []);
            setApp004DeviceTotalData(response?.data?.countData ? response.data.countData : 0);
            app004SetTotalPage(response?.data?.totalPages ? response.data?.totalPages : 0);
        } catch (error) {
            if (error.isUnauthorized) return;
            toast.error("System is unavailable, please try again later.");
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
        { value: "Actuator", label: "Actuator" },
        { value: "Sensor", label: "Sensor" },
    ])
    const [statusOptions, setStatusOptions] = useState([
        { value: "ONLINE", label: "Online" },
        { value: "OFFLINE", label: "Offline" },
    ])
    const getAllCluster = useCallback(async (param) => {
        // toast.dismissAll()
        setLoadingData(true);
        try {
            const response = await getCluster(param);
            setClusterOption(response?.data?.clusters ? response.data.clusters.map(cluster => ({
                value: cluster.clusterId,
                label: cluster.clusterName,
            })) : []);
        } catch (error) {
            console.log(error)
            // toast.error("System is unavailable, please try again later.");
        } finally {
            setLoadingData(false);
        }
    });

    useEffect(() => {
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

    const handleStatusChange = (e) => {
        const switchValue = e === "all" ? "" : e
        setStatus(e)
        setSearch("")

        setApp004DeviceDataParam(prev => ({
            ...prev,
            "page": 1,
            "status": switchValue,
            "search": ""
        }))
    }

    // Cluster Filtering
    const [cluster, setCluster] = useState("")

    const handleClusterChange = (e) => {
        const switchValue = e === "all" ? "" : e
        setCluster(e)
        setSearch("")

        setApp004DeviceDataParam(prev => ({
            ...prev,
            "page": 1,
            "clusterId": switchValue,
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
        setModalAddOpen(true)
    }

    // Form Edit Modal
    const handleModalEditOpen = (obj) => {
        setModalEditOpen(true)
        setApp004DeviceEditData(obj)
    }

    // Form Delete Modal
    const handleModalDeleteOpen = (obj) => {
        setModalDeleteOpen(true)
        setApp004DeviceDeleteData(obj)
    }
    const app004HandleDeleteDevice = () => {
        if (app004DeviceDeleteData.deviceId) {
            toast.dismissAll()
            deleteDeviceAction(app004DeviceDeleteData)
        }
    }
    const deleteDeviceAction = useCallback(async (param) => {
        const toastId = toast.loading("Loading...")
        try {
            setLoadingDelete(true)
            const response = await deleteDevice(param.deviceId)

            if (response.status === 204 || response.status === 200) {
                toast.success("Device Has Been Successfully Deleted.", { id: toastId })
                refreshTable();
            } else {
                toast.error("Failed to delete device.", { id: toastId })
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "System is Unavailable. Please Try Again Later.", { id: toastId })
        } finally {
            setModalDeleteOpen(false)
            setLoadingDelete(false)
        }
    })

    return (
        <React.Fragment>
            <RootPageCustom
                setFirstRender={setFirstRender}
            >
                <div className={`${app004p01Page ? "flex" : "hidden"} flex-col gap-2`}>
                    <div className="flex items-center justify-between px-6 mb-2">
                        <div>
                            <h1 className="text-xl font-semibold">Device Management</h1>
                            <p className="text-sm text-muted-foreground">Manage and monitor registered devices</p>
                        </div>
                        <Button
                            size="sm"
                            onClick={handleModalAddOpen}
                        >
                            <Plus />
                            <span className="hidden sm:inline">Add Device</span>
                        </Button>
                    </div>

                    <Card>
                        <CardContent>
                            <div className="flex flex-wrap items-center justify-end gap-2 mb-4">
                                <div className="relative w-full sm:w-48">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        onKeyDown={(e) => { if (e.key === "Enter") handleSearchState() }}
                                        className="pl-8"
                                    />
                                </div>

                                <Select value={cluster} onValueChange={handleClusterChange}>
                                    <SelectTrigger className="flex-1 sm:w-36 sm:flex-none">
                                        <SelectValue placeholder="All Cluster" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="all">All Cluster</SelectItem>
                                            {clusterOption.map((item) => (
                                                <SelectItem key={item.value} value={item.value}>
                                                    {item.label}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>

                                <Select value={status} onValueChange={handleStatusChange}>
                                    <SelectTrigger className="flex-1 sm:w-36 sm:flex-none">
                                        <SelectValue placeholder="All Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="all">All Status</SelectItem>
                                            {statusOptions.map((item) => (
                                                <SelectItem key={item.value} value={item.value}>
                                                    {item.label}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>

                            <TableCustom
                                keyField="deviceId"
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
                        </CardContent>
                    </Card>
                </div>

                {modalAddOpen && (
                    <MasterDeviceAdd
                        modalAddOpen={modalAddOpen}
                        setModalAddOpen={setModalAddOpen}
                        refreshTable={refreshTable}
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
                        app004DeviceEditData={app004DeviceEditData}
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