import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BatteryFull, BatteryLow, BatteryMedium, Droplet, Sprout, Thermometer } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend } from "@/components/ui/chart";
import { getGraph } from "@/utils/ListApi";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";

// --------------- Constant Value and Default Value --------------- //
const DEFAULT_TIME_RANGE = "24h";
const DEFAULT_ACTIVE_LINE = { temperature: true, humidity: true, soilMoisture: true };
const TIME_RANGE = [
    { label: "5M", value: "5m" },
    { label: "1H", value: "1h" },
    { label: "6H", value: "6h" },
    { label: "24H", value: "24h" },
    { label: "7D", value: "7d" },
];

const SERIES = [
    { key: "temperature", label: "Temperature", unit: "°C", icon: Thermometer, iconClass: "text-warning", bgClass: "bg-warning/10" },
    { key: "humidity", label: "Humidity", unit: "%", icon: Droplet, iconClass: "text-info", bgClass: "bg-info/10" },
    { key: "soilMoisture", label: "Soil Moisture", unit: "%", icon: Sprout, iconClass: "text-success", bgClass: "bg-success/10" },
];

const chartConfig = {
    temperature: { label: "Temperature", color: "var(--color-warning)", unit: "°C" },
    humidity: { label: "Humidity", color: "var(--color-info)", unit: "%" },
    soilMoisture: { label: "Soil Moisture", color: "var(--color-success)", unit: "%" },
};

const parseTime = (timeStr) => {
    const [timePart, datePart] = timeStr.split(" ");
    return { timePart, datePart };
};

const formatXAxis = (timeStr) => {
    if (timeStr.includes(" ")) return timeStr.split(" ")[0];
    return timeStr;
};
// --------------- Constant Value and Default Value --------------- //


// --------------- Custom Tooltip  --------------- //
const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;

    const is7d = label.includes(" "); // "20:00 19-05-2026" vs "20:00"

    let header;
    if (is7d) {
        const [timePart, datePart] = label.split(" ");
        const [day, month, year] = datePart.split("-");
        const formattedDate = new Date(`${year}-${month}-${day}`).toLocaleDateString("id-ID", {
            day: "numeric", month: "long", year: "numeric",
        });
        header = `${formattedDate} (${timePart})`;
    } else {
        header = label; // "20:00"
    }

    return (
        <div className="rounded-lg border bg-background px-3 py-2 shadow-md text-xs flex flex-col gap-1.5 min-w-40">
            <span className="font-medium text-foreground">{header}</span>
            {payload.map((entry) => (
                <div key={entry.dataKey} className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-1.5">
                        <div
                            className="h-2 w-2 rounded-full shrink-0"
                            style={{ background: `var(--color-${entry.dataKey})` }}
                        />
                        <span className="text-muted-foreground">
                            {chartConfig[entry.dataKey]?.label}
                        </span>
                    </div>
                    <span className="font-semibold tabular-nums">
                        {entry.value}{chartConfig[entry.dataKey]?.unit}
                    </span>
                </div>
            ))}
        </div>
    );
};
// --------------- Custom Tooltip  --------------- //


const GraphModal = (props) => {
    const [selectedTimeRange, setSelectedTimeRange] = useState(DEFAULT_TIME_RANGE);
    const [activeLine, setActiveLine] = useState(DEFAULT_ACTIVE_LINE);
    const [graphData, setGraphData] = useState([]);
    const [loadingData, setLoadingData] = useState(false);

    // --------------- Reset State On Modal Open --------------- //
    useEffect(() => {
        if (props.graphModal) {
            setActiveLine(DEFAULT_ACTIVE_LINE);
            setSelectedTimeRange(DEFAULT_TIME_RANGE);
            setGraphData([]);
        }
    }, [props.graphModal]);
    // --------------- Reset State On Modal Open --------------- //

    // --------------- Fetch Data --------------- //
    useEffect(() => {
        if (props.graphModal && props.selectedPotDetail?.potId) {
            fetchHistory();
        }
    }, [props.graphModal, props.selectedPotDetail?.potId, selectedTimeRange]);

    const fetchHistory = async () => {
        setLoadingData(true);
        try {
            const response = await getGraph({
                potId: props.selectedPotDetail?.potId,
                range: selectedTimeRange,
            });
            setGraphData([...(response?.data?.data || [])].reverse());
        } catch (e) {
            console.error(e);
        } finally {
            setLoadingData(false);
        }
    };
    // --------------- Fetch Data --------------- //


    // --------------- Battery Icon --------------- //
    const batteryIcon = (level) => {
        if (level <= 20) return <div className="rounded-lg bg-danger/10 p-1.5"><BatteryLow size={16} className="text-danger" /></div>;
        if (level <= 50) return <div className="rounded-lg bg-warning/10 p-1.5"><BatteryMedium size={16} className="text-warning" /></div>;
        return <div className="rounded-lg bg-success/10 p-1.5"><BatteryFull size={16} className="text-success" /></div>;
    };
    // --------------- Battery Icon --------------- //


    // --------------- Toggle Line --------------- //
    const toggleSeries = (key) => {
        setActiveLine((prev) => {
            const activeCount = Object.values(prev).filter(Boolean).length;
            if (prev[key] && activeCount === 1) return prev;
            return { ...prev, [key]: !prev[key] };
        });
    };
    // --------------- Toggle Line --------------- //

    return (
        <Dialog open={props.graphModal} onOpenChange={props.setGraphModal}>
            <DialogContent
                className="flex flex-col overflow-hidden p-4 sm:p-6"
                style={{ width: "95vw", maxWidth: "95vw", height: "95vh", maxHeight: "95vh" }}
            >
                <DialogHeader className="shrink-0">
                    <DialogTitle>{props.selectedPotDetail?.potName}</DialogTitle>
                    <DialogDescription>Sensor readings over time</DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-3 flex-1 overflow-y-auto min-h-0" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 shrink-0">
                        {SERIES.map((s) => (
                            <div key={s.key} className="flex items-center gap-2 sm:gap-3 bg-muted/40 rounded-xl p-2.5 sm:p-3 border">
                                <div className={`rounded-lg ${s.bgClass} p-1.5 shrink-0`}>
                                    <s.icon size={16} className={s.iconClass} />
                                </div>
                                <div className="flex flex-col gap-0.5 min-w-0">
                                    <span className="text-xs sm:text-sm font-semibold">
                                        {props.selectedPotDetail?.[s.key]}{s.unit}
                                    </span>
                                    <span className="text-xs text-muted-foreground truncate">{s.label}</span>
                                </div>
                            </div>
                        ))}

                        <div className="flex items-center gap-2 sm:gap-3 bg-muted/40 rounded-xl p-2.5 sm:p-3 border">
                            {batteryIcon(props.selectedPotDetail?.battery)}
                            <div className="flex flex-col gap-0.5 min-w-0">
                                <span className="text-xs sm:text-sm font-semibold">{props.selectedPotDetail?.battery}%</span>
                                <span className="text-xs text-muted-foreground truncate">Battery</span>
                            </div>
                        </div>
                    </div>

                    <Separator className="shrink-0" />

                    <div className="flex flex-col gap-2 flex-1 min-h-0">

                        <div className="flex justify-end shrink-0">
                            <ButtonGroup className="bg-muted p-1 rounded-4xl gap-1">
                                {TIME_RANGE.map((range) => (
                                    <Button
                                        key={range.value}
                                        variant={selectedTimeRange === range.value ? "default" : "ghost"}
                                        size="sm"
                                        onClick={() => setSelectedTimeRange(range.value)}
                                        className={`h-6 text-xs font-medium rounded-4xl! px-2 sm:px-3 ${selectedTimeRange !== range.value && "text-muted-foreground hover:text-foreground"
                                            }`}
                                    >
                                        {range.label}
                                    </Button>
                                ))}
                            </ButtonGroup>
                        </div>

                        <div className="rounded-xl border bg-muted/20 p-2 sm:p-4 flex-1 min-h-[280px]">
                            {loadingData ? (
                                <div className="w-full h-full flex items-center justify-center">
                                    <span className="text-sm sm:text-lg text-muted-foreground animate-pulse">Loading data...</span>
                                </div>
                            ) : graphData.length === 0 ? (
                                <div className="w-full h-full flex items-center justify-center">
                                    <span className="text-sm sm:text-lg text-muted-foreground">No data available</span>
                                </div>
                            ) : (
                                <ChartContainer config={chartConfig} className="h-full w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart
                                            data={graphData}
                                            margin={{ top: 8, right: 8, left: 0, bottom: 8 }}
                                        >
                                            <CartesianGrid vertical={false} />

                                            <XAxis
                                                dataKey="time"
                                                tickLine={false}
                                                axisLine={false}
                                                tickMargin={16}
                                                minTickGap={40}
                                                tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
                                                interval="preserveStartEnd"
                                                tickFormatter={formatXAxis}
                                            />

                                            <YAxis
                                                tickLine={false}
                                                axisLine={false}
                                                tickMargin={16}
                                                tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
                                                domain={["auto", "auto"]}
                                                width={50}
                                            />

                                            <ChartTooltip content={<CustomTooltip />} />

                                            {SERIES.map((s) =>
                                                activeLine[s.key] ? (
                                                    <Line
                                                        key={s.key}
                                                        type="monotone"
                                                        dataKey={s.key}
                                                        stroke={`var(--color-${s.key})`}
                                                        strokeWidth={2}
                                                        dot={false}
                                                        activeDot={{ r: 4, strokeWidth: 0 }}
                                                    />
                                                ) : null
                                            )}
                                        </LineChart>
                                    </ResponsiveContainer>
                                </ChartContainer>
                            )}
                        </div>
                        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap justify-center pt-1">
                            {SERIES.map((s) => (
                                <Button
                                    key={s.key}
                                    variant="outline"
                                    size="sm"
                                    onClick={() => toggleSeries(s.key)}
                                    className={`h-6 sm:h-7 text-xs font-medium transition-all px-2 sm:px-3 ${activeLine[s.key]
                                        ? "opacity-100"
                                        : "opacity-40 border-transparent bg-transparent"
                                        }`}
                                >
                                    <div
                                        className="h-2 w-2 rounded-full shrink-0"
                                        style={{ background: chartConfig[s.key].color }}
                                    />
                                    {chartConfig[s.key]?.label}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default GraphModal;