import React, { useState, useEffect, useCallback, useMemo } from "react";
import RootPageCustom from "../../components/common/RootPageCustom";
import TableCustom from "../../components/common/TableCustom";
import { BatteryFull, BatteryLow, BatteryMedium, CalendarDays, Droplet, Sprout, Thermometer, Clock, Timer } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { handleApiError } from "@/utils/ErrorHandler";
import { getComboPot, getTelemetryReport } from "../../utils/ListApi";
import { Badge } from "@/components/ui/badge";
import { formatTimeStampReadable } from "@/components/common/Regex";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";


const TelemetryReport = () => {
    const [loading, setLoading] = useState(false)
    const [app005TelemetryReportData, setApp005TelemetryReportData] = useState([]);
    const [app005TelemetryReportTotalData, setApp005TelemetryReportTotalData] = useState(0)
    const [app005TotalPage, app005SetTotalPage] = useState(0)
    const [potSelected, setPotSelected] = useState("")
    const [potOption, setPotOption] = useState([])
    const [dateRange, setDateRange] = useState({
        from: new Date(),
        to: new Date(),
    })

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

    // ------------------------ Filter Fetch Telemetry Report ------------------------ //
    const [app005TelemetryReportDataParam, setApp005TelemetryReportDataParam] = useState(
        {
            page: 1,
            size: 10,
            sort: "",
            order: "asc",
            dateFrom: format(dateRange.from, "yyyy-MM-dd"),
            dateTo: format(dateRange.to, "yyyy-MM-dd"),
        }
    )

    const handlePotChange = (e) => {
        const switchValue = e === "all" ? "" : e
        setPotSelected(e)
        setApp005TelemetryReportDataParam(prev => ({
            ...prev,
            "page": 1,
            "potId": switchValue,

        }))
    }

    const handleDateChange = (range) => {
        if (!range) return
        setDateRange(range)
        if (range?.from && range?.to) {
            setApp005TelemetryReportDataParam(prev => ({
                ...prev,
                page: 1,
                dateFrom: format(range.from, "yyyy-MM-dd"),
                dateTo: format(range.to, "yyyy-MM-dd"),
            }))
        }
    }
    // ------------------------ Filter Fetch Telemetry Report ------------------------ //

    // ------------------------ Paging Fetch Telemetry Report ------------------------ //
    const handleChangePage = (newPage) => {
        setApp005TelemetryReportDataParam(prev => ({
            ...prev,
            page: newPage + 1
        }));
    };

    const handleChangeRowsPerPage = (newRowsPerPage) => {
        setApp005TelemetryReportDataParam(prev => ({
            ...prev,
            size: newRowsPerPage,
            page: 1
        }));
    };

    const handleRequestSort = (property, order) => {
        setApp005TelemetryReportDataParam(prev => ({
            ...prev,
            sort: property,
            order: order,
            page: 1
        }));
    };
    // ------------------------ Paging Fetch Telemetry Report ------------------------ //

    // ------------------------ Column Telemetry Report ------------------------ //
    const app005TelemetryReportColumns = useMemo(() => [
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
            dataField: "temperature",
            text: (
                <div className="flex items-center justify-center gap-1.5">
                    <Thermometer size={14} className="text-warning shrink-0" />
                    <span>Temperature</span>
                </div>
            ),
            sort: false,
            headerAlign: "center",
            bodyAlign: 'center',
            formatter: (cellContent) => `${cellContent}°C`
        },
        {
            dataField: "humidity",
            text: (
                <div className="flex items-center justify-center gap-1.5">
                    <Droplet size={14} className="text-info shrink-0" />
                    <span>Humidity</span>
                </div>
            ),
            sort: false,
            headerAlign: "center",
            bodyAlign: 'center',
            formatter: (cellContent) => `${cellContent}%`
        },
        {
            dataField: "soilMoisture",
            text: (
                <div className="flex items-center justify-center gap-1.5">
                    <Sprout size={14} className="text-success shrink-0" />
                    <span>Soil Moisture</span>
                </div>
            ),
            sort: false,
            headerAlign: "center",
            bodyAlign: 'center',
            formatter: (cellContent) => `${cellContent}%`
        },
        {
            dataField: "batteryLevel",
            text: (
                <div className="flex items-center justify-center gap-1.5">
                    <BatteryFull size={14} className="text-muted-foreground shrink-0" />
                    <span>Battery</span>
                </div>
            ),
            sort: false,
            headerAlign: "center",
            bodyAlign: 'center',
            formatter: (cellContent) => `${cellContent}%`
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
            dataField: "latency",
            text: "Latency",
            sort: false,
            headerAlign: "center",
            bodyAlign: 'center',
            formatter: (cellContent) => `${cellContent} ms`
        },
    ], []);
    // ------------------------ Column Telemetry Report ------------------------ //

    // ------------------------ Fetch List Telemetry Report ------------------------ //
    const fetchTelemetryReport = useCallback(async (param) => {
        setLoading(true);
        try {
            const response = await getTelemetryReport(param);
            setApp005TelemetryReportData(response?.data?.contents ?? []);
            setApp005TelemetryReportTotalData(response?.data?.totalElements ?? 0);
            app005SetTotalPage(response?.data?.totalPages ?? 0);
        } catch (error) {
            if (handleApiError(error)) return
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTelemetryReport(app005TelemetryReportDataParam);
    }, [app005TelemetryReportDataParam]);
    // ------------------------ Fetch List Telemetry Report ------------------------ //

    return (
        <RootPageCustom
            title={"Telemetry Report"}
            desc={"View and analyze historical sensor data from all devices"}
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
                        </div>

                        <TableCustom
                            keyField="timestamp"
                            loadingData={loading}
                            columns={app005TelemetryReportColumns}
                            appdata={app005TelemetryReportData}
                            appdataTotal={app005TelemetryReportTotalData}
                            totalPage={app005TotalPage}
                            rowsPerPageOption={[5, 10, 20, 25]}
                            page={app005TelemetryReportDataParam.page - 1}
                            rowsPerPage={app005TelemetryReportDataParam.size}
                            sortField={app005TelemetryReportDataParam.sort}
                            sortOrder={app005TelemetryReportDataParam.order}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            onRequestSort={handleRequestSort}
                        />
                    </CardContent>
                </Card>
            </div>



        </RootPageCustom>
    );
}

export default TelemetryReport;