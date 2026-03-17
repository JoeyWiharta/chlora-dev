import React, { useState, useEffect, useCallback, useMemo } from "react";
import RootPageCustom from "../../components/common/RootPageCustom";
import TableCustom from "../../components/common/TableCustom";
import { getCluster, deleteCluster } from "../../utils/ListApi";
import MasterClusterAdd from "./MasterClusterAdd";
import MasterClusterEdit from "./MasterClusterEdit";
import PopupDeleteAndRestore from "../../components/common/PopupDeleteAndRestore";
import { Trash2, SquarePen, Plus, Search } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const MasterCluster = () => {
    const [loading, setLoading] = useState(false)
    const [modalAddOpen, setModalAddOpen] = useState(false);
    const [modalEditOpen, setModalEditOpen] = useState(false);
    const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
    const [app003ClusterEditData, setApp003ClusterEditData] = useState(null);
    const [app003ClusterDeleteData, setApp003ClusterDeleteData] = useState(null)
    const [app003ClusterData, setApp003ClusterData] = useState([]);
    const [app003ClusterTotalData, setApp003ClusterTotalData] = useState(0)
    const [app003TotalPage, app003SetTotalPage] = useState(0)
    const [search, setSearch] = useState("")
    const [app003ClusterDataParam, setApp003ClusterDataParam] = useState(
        {
            page: 1,
            size: 10,
            sort: "",
            order: "asc",
            search: "",
        }
    )

    const app003ClusterColumns = useMemo(() => [
        {
            dataField: "clusterId",
            text: "Cluster ID",
            sort: true,
            headerAlign: "center",
            bodyAlign: 'center',
        },
        {
            dataField: "clusterName",
            text: "Cluster Name",
            sort: true,
            headerAlign: "center",
            bodyAlign: 'center',
        },
        {
            dataField: "totalDevices",
            text: "Total Device",
            sort: true,
            headerAlign: "center",
            bodyAlign: 'center',
        },
        {
            dataField: "action",
            text: "Action",
            headerAlign: "center",
            bodyAlign: 'left',
            formatter: (cellContent, app003ClusterData) => (
                <div className="flex items-center justify-center gap-2">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="outline"
                                size="icon-sm"
                                onClick={() => handleModalEditOpen(app003ClusterData)}
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
                                onClick={() => handleModalDeleteOpen(app003ClusterData)}
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
    ], []);

    const handleChangePage = (newPage) => {
        setApp003ClusterDataParam(prev => ({
            ...prev,
            page: newPage + 1
        }));
    };

    const handleChangeRowsPerPage = (newRowsPerPage) => {
        setApp003ClusterDataParam(prev => ({
            ...prev,
            size: newRowsPerPage,
            page: 1
        }));
    };

    const handleRequestSort = (property, order) => {
        setApp003ClusterDataParam(prev => ({
            ...prev,
            sort: property,
            order: order,
            page: 1
        }));
    };

    // Data From API Active Cluster
    const fetchCluster = useCallback(async (param) => {
        setLoading(true);
        try {
            const response = await getCluster(param);
            setApp003ClusterData(response?.data?.clusters ?? []);
            setApp003ClusterTotalData(response?.data?.countData ?? 0);
            app003SetTotalPage(response?.data?.totalPages ?? 0);
        } catch (error) {
            toast.error("System is unavailable, please try again later.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCluster(app003ClusterDataParam);
    }, [app003ClusterDataParam]);

    const handleSearchState = () => {
        setApp003ClusterDataParam(prev => ({
            ...prev,
            page: 1,
            search: search
        }))

    }

    const refreshTable = useCallback(() => {
        setSearch("");
        setApp003ClusterDataParam({
            page: 1,
            size: 10,
            sort: "",
            order: "asc",
            search: "",
        });
    }, []);

    // Form Edit Modal
    const handleModalEditOpen = (obj) => {
        setModalEditOpen(true)
        setApp003ClusterEditData(obj)
    }

    // Form Delete Modal
    const handleModalDeleteOpen = (obj) => {
        setModalDeleteOpen(true)
        setApp003ClusterDeleteData(obj)
    }

    const deleteClusterAction = useCallback(async (param) => {
        const toastId = toast.loading("Loading...")
        setLoading(true)
        try {
            const response = await deleteCluster(param.clusterId)
            if (response?.status === 204 || response?.status === 200) {
                toast.success("Cluster deleted successfully.", { id: toastId })
                refreshTable();
            } else {
                toast.error("Failed to delete Cluster.", { id: toastId })
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "System is unavailable, please try again later.", { id: toastId })
        } finally {
            setModalDeleteOpen(false)
            setLoading(false)
        }
    }, [])

    const app003HandleDeleteCluster = () => { app003ClusterDeleteData?.clusterId && deleteClusterAction(app003ClusterDeleteData) }


    return (
        <RootPageCustom>
            <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between px-6 mb-2">
                    <div>
                        <h1 className="text-xl font-semibold">Cluster Management</h1>
                        <p className="text-sm text-muted-foreground">Manage and monitor system clusters</p>
                    </div>
                    <Button
                        size="sm"
                        onClick={() => setModalAddOpen(true)}
                    >
                        <Plus />
                        <span className="hidden sm:inline">Add Cluster</span>
                    </Button>
                </div>

                <Card>
                    <CardContent>
                        <div className="flex items-center justify-end mb-4">
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
                        </div>

                        <TableCustom
                            keyField="clusterId"
                            loadingData={loading}
                            columns={app003ClusterColumns}
                            appdata={app003ClusterData}
                            appdataTotal={app003ClusterTotalData}
                            totalPage={app003TotalPage}
                            rowsPerPageOption={[5, 10, 20, 25]}
                            page={app003ClusterDataParam.page - 1}
                            rowsPerPage={app003ClusterDataParam.size}
                            sortField={app003ClusterDataParam.sort}
                            sortOrder={app003ClusterDataParam.order}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            onRequestSort={handleRequestSort}
                        />
                    </CardContent>
                </Card>
            </div>

            {modalAddOpen && (
                <MasterClusterAdd
                    modalAddOpen={modalAddOpen}
                    setModalAddOpen={setModalAddOpen}
                    refreshTable={refreshTable}
                />
            )}

            {modalEditOpen && (
                <MasterClusterEdit
                    modalEditOpen={modalEditOpen}
                    setModalEditOpen={setModalEditOpen}
                    refreshTable={refreshTable}
                    app003ClusterEditData={app003ClusterEditData}
                />
            )}

            {modalDeleteOpen && (
                <PopupDeleteAndRestore
                    status={"delete"}
                    modalOpen={modalDeleteOpen}
                    modalClose={() => setModalDeleteOpen(false)}
                    loading={loading}
                    onClick={app003HandleDeleteCluster}
                />
            )}

        </RootPageCustom>
    );
}

export default MasterCluster;