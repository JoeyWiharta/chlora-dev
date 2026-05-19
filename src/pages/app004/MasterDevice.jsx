import React, { useState, useEffect, useCallback, useMemo } from "react";
import RootPageCustom from "../../components/common/RootPageCustom";
import TableCustom from "../../components/common/TableCustom";
import { getDevice, deleteDevice, getComboPot } from "../../utils/ListApi";
import PopupDeleteAndRestore from "../../components/common/PopupDeleteAndRestore";
import { Trash2, SquarePen, Plus, Search } from "lucide-react";
import MasterDeviceEdit from "./MasterDeviceEdit";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToasterCustom } from "@/components/common/ToasterCustom";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { handleApiError } from "@/utils/ErrorHandler";

const statusOptions = [
    { value: "ONLINE", label: "Online" },
    { value: "OFFLINE", label: "Offline" },
]

const MasterDevice = () => {
    const [loading, setLoading] = useState(false);
    const [modalEditOpen, setModalEditOpen] = useState(false);
    const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
    const [app004DeviceData, setApp004DeviceData] = useState([]);
    const [app004DeviceTotalData, setApp004DeviceTotalData] = useState(0)
    const [app004TotalPage, app004SetTotalPage] = useState(0)
    const [search, setSearch] = useState("")
    const [status, setStatus] = useState("")
    const [pot, setPot] = useState("")
    const [potOption, setPotOption] = useState([
        { label: "Unassigned", value: "UNASSIGNED" }
    ])
    const [app004DeviceEditData, setApp004DeviceEditData] = useState(null);
    const [app004DeviceDeleteData, setApp004DeviceDeleteData] = useState(null)

    const [app004DeviceDataParam, setApp004DeviceDataParam] = useState(
        {
            page: 1,
            size: 10,
            sort: "",
            order: "asc",
            search: "",
            status: "",
            potId: "",
        }
    )

    const app004DeviceColumns = useMemo(() => [
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
            dataField: "potName",
            text: "Pot Name",
            sort: true,
            headerAlign: "left",
            bodyAlign: 'left',
            formatter: (cellContent) => {
                switch (cellContent) {
                    case null:
                        return "Unassigned"
                    default:
                        return cellContent
                }
            }
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
            bodyAlign: 'center',
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
    ], []);

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

    const fetchDevice = useCallback(async (param) => {
        setLoading(true);
        try {
            const response = await getDevice(param);
            setApp004DeviceData(response?.data?.devices ?? []);
            setApp004DeviceTotalData(response?.data?.totalElements ?? 0);
            app004SetTotalPage(response?.data?.totalPages ?? 0);
        } catch (error) {
            if (handleApiError(error)) return
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDevice(app004DeviceDataParam);
    }, [app004DeviceDataParam]);

    // List Combo Pot 
    const fetchPot = useCallback(async () => {
        try {
            const response = await getComboPot();
            setPotOption([
                { label: "Unassigned", value: "UNASSIGNED" },
                ...(response?.data?.list ?? [])
            ]);
        } catch (error) {
            if (handleApiError(error)) return
        }
    }, []);

    useEffect(() => {
        fetchPot()
    }, [])

    const handleSearchState = () => {
        setApp004DeviceDataParam(prev => ({
            ...prev,
            page: 1,
            search: search
        }))
    }

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

    const handlePotChange = (e) => {
        const switchValue = e === "all" ? "" : e
        setPot(e)
        setSearch("")
        setApp004DeviceDataParam(prev => ({
            ...prev,
            "page": 1,
            "potId": switchValue,
            "search": ""
        }))
    }

    const refreshTable = useCallback(() => {
        setSearch("");
        setPot("")
        setStatus("")
        setApp004DeviceDataParam({
            page: 1,
            size: 10,
            sort: "",
            order: "asc",
            search: "",
            status: "",
            potId: ""
        });
    }, []);

    const handleModalEditOpen = (obj) => {
        setModalEditOpen(true)
        setApp004DeviceEditData(obj)
    }

    const handleModalDeleteOpen = (obj) => {
        setModalDeleteOpen(true)
        setApp004DeviceDeleteData(obj)
    }

    const deleteDeviceAction = useCallback(async (param) => {
        setLoading(true)
        try {
            await ToasterCustom.promise(
                deleteDevice(param.deviceId), {
                loading: "Loading...",
                success: "Device deleted successfully.",
                error: (err) => err?.response?.data?.message || "System is unavailable, please try again later."
            }
            )
            refreshTable()
        } catch (error) {
            console.log(error)
        } finally {
            setModalDeleteOpen(false)
            setLoading(false)
        }
    }, [])

    const app004HandleDeleteDevice = () => { app004DeviceDeleteData?.deviceId && deleteDeviceAction(app004DeviceDeleteData) }

    return (
        <RootPageCustom
            title={"Device Management"}
            desc={"Manage and monitor registered devices"}
        >
            <div className="flex flex-col gap-2 flex-1">
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

                            <Select value={pot} onValueChange={handlePotChange}>
                                <SelectTrigger className="flex-1 sm:w-36 sm:flex-none">
                                    <SelectValue placeholder="All Pot" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="all">All Pot</SelectItem>
                                        {potOption.map((item) => (
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
                            loadingData={loading}
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
            </div >

            {
                modalEditOpen && (
                    <MasterDeviceEdit
                        modalEditOpen={modalEditOpen}
                        setModalEditOpen={setModalEditOpen}
                        refreshTable={refreshTable}
                        app004DeviceEditData={app004DeviceEditData}
                        potOption={potOption}
                        statusOption={statusOptions}
                    />
                )
            }

            {
                modalDeleteOpen && (
                    <PopupDeleteAndRestore
                        status={"delete"}
                        modalOpen={modalDeleteOpen}
                        modalClose={() => setModalDeleteOpen(false)}
                        loading={loading}
                        onClick={app004HandleDeleteDevice}
                    />
                )
            }

        </RootPageCustom >
    );
}

export default MasterDevice;