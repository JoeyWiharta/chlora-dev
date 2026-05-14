import React, { useState, useEffect, useCallback, useMemo } from "react";
import RootPageCustom from "../../components/common/RootPageCustom";
import TableCustom from "../../components/common/TableCustom";
import { BatteryFull, CalendarDays, Droplet, Eye, Sprout, Thermometer } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { handleApiError } from "@/utils/ErrorHandler";
import { getAnomalyReport, getComboPot } from "../../utils/ListApi";
import { Badge } from "@/components/ui/badge";
import { formatTimeStampReadable } from "@/components/common/Regex";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import PopupAnomalyDetail from "./PopupAnomalyDetail";

const SEVERITY_OPTIONS = [
    { value: "LOW", label: "Low" },
    { value: "MEDIUM", label: "Medium" },
    { value: "HIGH", label: "High" },
    { value: "CRITICAL", label: "Critical" },
]


const AnomalyReport = () => {
    const [loading, setLoading] = useState(false)
    const [app006AnomalyReportData, setApp006AnomalyReportData] = useState([]);
    const [app006AnomalyReportTotalData, setApp006AnomalyReportTotalData] = useState(0)
    const [app006TotalPage, app006SetTotalPage] = useState(0)
    const [potSelected, setPotSelected] = useState("")
    const [potOption, setPotOption] = useState([])
    const [dateRange, setDateRange] = useState({ from: new Date(), to: new Date() })
    const [severitySelected, setSeveritySelected] = useState("")
    const [detailRow, setDetailRow] = useState(null)
    const [modalOpen, setModalOpen] = useState(false)

    // ------------------------ Function Drawer ------------------------ //
    const handleOpenModal = (row) => {
        setDetailRow(row)
        setModalOpen(true)
    }
    // ------------------------ Function Drawer ------------------------ //

    // ------------------------ List Combo Pot ------------------------ //
    const fetchPot = useCallback(async () => {
        try {
            const response = await getComboPot();
            setPotOption(response?.data?.list ?? []);
        } catch (error) {
            if (handleApiError(error)) return
        }
    }, []);

    useEffect(() => {
        fetchPot()
    }, [])
    // ------------------------ List Combo Pot ------------------------ //

    // ------------------------ Filter ------------------------ //
    const [app006AnomalyReportDataParam, setApp006AnomalyReportDataParam] = useState({
        page: 1,
        size: 10,
        sort: "",
        order: "desc",
        dateFrom: format(dateRange.from, "yyyy-MM-dd"),
        dateTo: format(dateRange.to, "yyyy-MM-dd"),
        severity: "",
    })

    const handlePotChange = (e) => {
        const switchValue = e === "all" ? "" : e
        setPotSelected(e)
        setApp006AnomalyReportDataParam(prev => ({ ...prev, page: 1, potId: switchValue }))
    }

    const handleDateChange = (range) => {
        if (!range) return
        setDateRange(range)
        if (range?.from && range?.to) {
            setApp006AnomalyReportDataParam(prev => ({
                ...prev,
                page: 1,
                dateFrom: format(range.from, "yyyy-MM-dd"),
                dateTo: format(range.to, "yyyy-MM-dd"),
            }))
        }
    }

    const handleSeverityChange = (e) => {
        const switchValue = e === "all" ? "" : e
        setSeveritySelected(e)
        setApp006AnomalyReportDataParam(prev => ({ ...prev, page: 1, severity: switchValue }))
    }
    // ------------------------ Filter ------------------------ //

    // ------------------------ Paging ------------------------ //
    const handleChangePage = (newPage) => {
        setApp006AnomalyReportDataParam(prev => ({ ...prev, page: newPage + 1 }));
    };

    const handleChangeRowsPerPage = (newRowsPerPage) => {
        setApp006AnomalyReportDataParam(prev => ({ ...prev, size: newRowsPerPage, page: 1 }));
    };

    const handleRequestSort = (property, order) => {
        setApp006AnomalyReportDataParam(prev => ({ ...prev, sort: property, order: order, page: 1 }));
    };
    // ------------------------ Paging ------------------------ //

    // ------------------------ Columns ------------------------ //
    const app006AnomalyReportColumns = useMemo(() => [
        {
            dataField: "potName",
            text: "Sensor Node",
            sort: false,
            headerAlign: "center",
            bodyAlign: 'center',
            formatter: (cellContent, row) => (
                <div className="flex flex-col text-center gap-1">
                    <span className="font-medium">{row.potName}</span>
                    <Badge variant="outline" className="text-xs text-muted-foreground border-muted-foreground">
                        {row.deviceName}
                    </Badge>
                </div>
            )
        },
        {
            dataField: "anomalyType",
            text: "Anomaly Type",
            sort: false,
            headerAlign: "center",
            bodyAlign: 'center',
        },
        {
            dataField: "severity",
            text: "Severity",
            sort: false,
            headerAlign: "center",
            bodyAlign: 'center',
            formatter: (cellContent) => {
                switch (cellContent) {
                    case "LOW":
                        return <Badge className="bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">Low</Badge>
                    case "MEDIUM":
                        return <Badge className="bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300">Medium</Badge>
                    case "HIGH":
                        return <Badge className="bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300">High</Badge>
                    case "CRITICAL":
                        return <Badge className="bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300">Critical</Badge>
                    default:
                        return <Badge variant="outline">{cellContent}</Badge>
                }
            }
        },
        {
            dataField: "anomalyScore",
            text: "Anomaly Score",
            sort: false,
            headerAlign: "center",
            bodyAlign: 'center',
        },
        {
            dataField: "timestamp",
            text: "Timestamp",
            sort: true,
            headerAlign: "center",
            bodyAlign: 'center',
            formatter: (cellContent) => formatTimeStampReadable(cellContent)
        },
        {
            dataField: "action",
            text: "Detail",
            sort: false,
            headerAlign: "center",
            bodyAlign: 'center',
            formatter: (cellContent, dailyAnomalyData) => (
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="outline" size="icon-sm" onClick={() => handleOpenModal(dailyAnomalyData)}>
                            <Eye size={14} />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent><p>View Detail</p></TooltipContent>
                </Tooltip>
            )
        },
    ], []);
    // ------------------------ Columns ------------------------ //

    // ------------------------ Fetch ------------------------ //
    const fetchAnomalyReport = useCallback(async (param) => {
        setLoading(true);
        try {
            const response = await getAnomalyReport(param);
            setApp006AnomalyReportData(response?.data?.contents ?? []);
            setApp006AnomalyReportTotalData(response?.data?.totalElements ?? 0);
            app006SetTotalPage(response?.data?.totalPages ?? 0);
        } catch (error) {
            if (handleApiError(error)) return
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAnomalyReport(app006AnomalyReportDataParam);
    }, [app006AnomalyReportDataParam]);
    // ------------------------ Fetch ------------------------ //

    return (
        <RootPageCustom
            title={"Anomaly Report"}
            desc={"View and analyze abnormal sensor readings from all devices"}
        >
            <div className="flex flex-col gap-2 flex-1">
                <Card>
                    <CardContent>
                        <div className="flex flex-wrap items-center justify-end gap-2 mb-4">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="justify-start px-2.5 font-normal flex-1 sm:w-64 sm:flex-none gap-3">
                                        <CalendarDays />
                                        {dateRange?.from ? (
                                            dateRange?.to ? (
                                                <>{format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}</>
                                            ) : (
                                                format(dateRange.from, "LLL dd, y")
                                            )
                                        ) : (
                                            <span>Pick a date</span>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="end">
                                    <Calendar
                                        mode="range"
                                        defaultMonth={dateRange?.from}
                                        selected={dateRange}
                                        onSelect={handleDateChange}
                                        numberOfMonths={1}
                                    />
                                </PopoverContent>
                            </Popover>

                            <Select value={potSelected} onValueChange={handlePotChange}>
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

                            <Select value={severitySelected} onValueChange={handleSeverityChange}>
                                <SelectTrigger className="flex-1 sm:w-36 sm:flex-none">
                                    <SelectValue placeholder="All Severity" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="all">All Severity</SelectItem>
                                        {SEVERITY_OPTIONS.map((item) => (
                                            <SelectItem key={item.value} value={item.value}>
                                                {item.label}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        <TableCustom
                            keyField="timestamp"
                            loadingData={loading}
                            columns={app006AnomalyReportColumns}
                            appdata={app006AnomalyReportData}
                            appdataTotal={app006AnomalyReportTotalData}
                            totalPage={app006TotalPage}
                            rowsPerPageOption={[5, 10, 20, 25]}
                            page={app006AnomalyReportDataParam.page - 1}
                            rowsPerPage={app006AnomalyReportDataParam.size}
                            sortField={app006AnomalyReportDataParam.sort}
                            sortOrder={app006AnomalyReportDataParam.order}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            onRequestSort={handleRequestSort}
                        />
                    </CardContent>
                </Card>
            </div>

            <PopupAnomalyDetail
                modalOpen={modalOpen}
                detailRow={detailRow}
                setModalOpen={setModalOpen}
            />

            {/* <Dialog open={drawerOpen} onOpenChange={setDrawerOpen}>
                <DialogContent className="overflow-y-auto w-[90vw] max-w-[90vw] max-h-[90vh]">
                    <DialogHeader>
                        <DialogTitle>Anomaly Detail</DialogTitle>
                    </DialogHeader>

                    <div className="flex flex-col gap-4">

                        <div className="flex flex-col items-center gap-1 mt-1">
                            <span className="font-medium">{selectedRow?.potName}</span>
                            <Badge variant="outline" className="text-xs text-muted-foreground w-fit">
                                {selectedRow?.deviceName}
                            </Badge>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <div className="flex items-center gap-3 bg-muted/70 rounded-xl p-3">
                                <div className="rounded-lg bg-warning/10 p-1.5">
                                    <Thermometer size={18} className="text-warning" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-semibold">{selectedRow?.temperature}°C</span>
                                    <span className="text-xs text-muted-foreground">Temperature</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 bg-muted/70 rounded-xl p-3">
                                <div className="rounded-lg bg-info/10 p-1.5">
                                    <Droplet size={18} className="text-info" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-semibold">{selectedRow?.humidity}%</span>
                                    <span className="text-xs text-muted-foreground">Humidity</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 bg-muted/70 rounded-xl p-3">
                                <div className="rounded-lg bg-success/10 p-1.5">
                                    <Sprout size={18} className="text-success" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-semibold">{selectedRow?.soilMoisture}%</span>
                                    <span className="text-xs text-muted-foreground">Soil Moisture</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 bg-muted/70 rounded-xl p-3">
                                <div className="rounded-lg bg-muted p-1.5">
                                    <BatteryFull size={18} className="text-muted-foreground" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-semibold">{selectedRow?.batteryLevel}%</span>
                                    <span className="text-xs text-muted-foreground">Battery</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 rounded-xl border p-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Anomaly Type</span>
                                <span className="font-medium">{selectedRow?.anomalyType}</span>
                            </div>
                            <div className="flex justify-between text-sm items-center">
                                <span className="text-muted-foreground">Severity</span>
                                {(() => {
                                    switch (selectedRow?.severity) {
                                        case "LOW": return <Badge className="bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">Low</Badge>
                                        case "MEDIUM": return <Badge className="bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300">Medium</Badge>
                                        case "HIGH": return <Badge className="bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300">High</Badge>
                                        case "CRITICAL": return <Badge className="bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300">Critical</Badge>
                                        default: return <Badge variant="outline">{selectedRow?.severity}</Badge>
                                    }
                                })()}
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Anomaly Score</span>
                                <span className="font-medium">{selectedRow?.anomalyScore}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Timestamp</span>
                                <span className="font-medium">{formatTimeStampReadable(selectedRow?.timestamp)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Latency</span>
                                <span className="font-medium">{selectedRow?.latency} ms</span>
                            </div>
                        </div>

                    </div>
                </DialogContent>
            </Dialog> */}

        </RootPageCustom>
    );
}

export default AnomalyReport;