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
const TIME_RANGE = [
    { label: "5M", value: "5m" },
    { label: "1H", value: "1h" },
    { label: "6H", value: "6h" },
    { label: "24H", value: "24h" },
    { label: "7D", value: "7d" },
];

const DEFAULT_TIME_RANGE = "24h";
const DEFAULT_ACTIVE_LINE = { temperature: true, humidity: true, soilMoisture: true };
// --------------- Constant Value and Default Value --------------- //


const SERIES = [
    { key: "temperature", label: "Temperature", color: "#f59e0b", unit: "°C", icon: Thermometer, iconClass: "text-warning", bgClass: "bg-warning/10" },
    { key: "humidity", label: "Humidity", color: "#3b82f6", unit: "%", icon: Droplet, iconClass: "text-info", bgClass: "bg-info/10" },
    { key: "soilMoisture", label: "Soil Moisture", color: "#22c55e", unit: "%", icon: Sprout, iconClass: "text-success", bgClass: "bg-success/10" },
];



const chartConfig = {
    temperature: { label: "Temperature", color: "#f59e0b" },
    humidity: { label: "Humidity", color: "#3b82f6" },
    soilMoisture: { label: "Soil Moisture", color: "#22c55e" },
};

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

    // --------------- Toggle Series --------------- //
    const toggleSeries = (key) => {
        setActiveLine((prev) => {
            const activeCount = Object.values(prev).filter(Boolean).length;
            if (prev[key] && activeCount === 1) return prev;
            return { ...prev, [key]: !prev[key] };
        });
    };
    // --------------- Toggle Series --------------- //

    // --------------- Function Battery Icon --------------- //
    const batteryIcon = (level) => {
        if (level <= 20) return <div className="rounded-lg bg-danger/10 p-1.5"><BatteryLow size={16} className="text-danger" /></div>;
        if (level <= 50) return <div className="rounded-lg bg-warning/10 p-1.5"><BatteryMedium size={16} className="text-warning" /></div>;
        return <div className="rounded-lg bg-success/10 p-1.5"><BatteryFull size={16} className="text-success" /></div>;
    };
    // --------------- Function Battery Icon --------------- //

    return (
        <Dialog open={props.graphModal} onOpenChange={props.setGraphModal}>
            <DialogContent
                className="flex flex-col overflow-hidden"
                style={{ width: "90vw", maxWidth: "90vw", height: "90vh", maxHeight: "90vh" }}
            >
                <DialogHeader className="flex flex-col gap-1 shrink-0">
                    <DialogTitle>{props.selectedPotDetail?.potName}</DialogTitle>
                    <DialogDescription>Sensor readings over time</DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-4 flex-1 overflow-hidden">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 shrink-0">
                        <div className="flex items-center gap-3 bg-muted/40 rounded-xl px-3 py-2.5 border border-border/50">
                            <div className="rounded-lg bg-warning/10 p-1.5 shrink-0">
                                <Thermometer size={16} className="text-warning" />
                            </div>
                            <div className="flex flex-col gap-0.5 min-w-0">
                                <span className="text-sm font-semibold">{props.selectedPotDetail?.temperature}°C</span>
                                <span className="text-xs text-muted-foreground truncate">Temperature</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 bg-muted/40 rounded-xl px-3 py-2.5 border border-border/50">
                            <div className="rounded-lg bg-info/10 p-1.5 shrink-0">
                                <Droplet size={16} className="text-info" />
                            </div>
                            <div className="flex flex-col gap-0.5 min-w-0">
                                <span className="text-sm font-semibold">{props.selectedPotDetail?.humidity}%</span>
                                <span className="text-xs text-muted-foreground truncate">Humidity</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 bg-muted/40 rounded-xl px-3 py-2.5 border border-border/50">
                            <div className="rounded-lg bg-success/10 p-1.5 shrink-0">
                                <Sprout size={16} className="text-success" />
                            </div>
                            <div className="flex flex-col gap-0.5 min-w-0">
                                <span className="text-sm font-semibold">{props.selectedPotDetail?.soilMoisture}%</span>
                                <span className="text-xs text-muted-foreground truncate">Soil Moisture</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 bg-muted/40 rounded-xl px-3 py-2.5 border border-border/50">
                            {batteryIcon(props.selectedPotDetail?.battery)}
                            <div className="flex flex-col gap-0.5 min-w-0">
                                <span className="text-sm font-semibold">{props.selectedPotDetail?.battery}%</span>
                                <span className="text-xs text-muted-foreground truncate">Battery</span>
                            </div>
                        </div>
                    </div>

                    <Separator className="shrink-0" />

                    {/* Graph Detail */}
                    <div className="flex flex-col gap-3 flex-1 overflow-hidden">
                        <div className="flex flex-row justify-end items-center shrink-0">
                            <ButtonGroup className="bg-muted p-1 rounded-4xl gap-1">
                                {TIME_RANGE.map((range) => (
                                    <Button
                                        key={range.value}
                                        variant={selectedTimeRange === range.value ? "default" : "ghost"}
                                        size="sm"
                                        onClick={() => setSelectedTimeRange(range.value)}
                                        className={`h-6 text-xs font-medium rounded-4xl! ${selectedTimeRange !== range.value && "text-muted-foreground hover:text-foreground"
                                            }`}
                                    >
                                        {range.label}
                                    </Button>
                                ))}
                            </ButtonGroup>
                        </div>

                        <div className="rounded-xl border bg-muted/20 p-4 flex-1 overflow-hidden">
                            {loadingData ? (
                                <div className="w-full h-full flex items-center justify-center">
                                    <span className="text-xs text-muted-foreground animate-pulse">Loading data...</span>
                                </div>
                            ) : graphData.length === 0 ? (
                                <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                                    <span className="text-xs text-muted-foreground">No data available</span>
                                </div>
                            ) : (
                                <ChartContainer config={chartConfig} className="h-full w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={graphData} margin={{ top: 16, right: 24, left: -8, bottom: 8 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.1)" />
                                            <XAxis
                                                dataKey="time"
                                                tick={{ fontSize: 10, fill: "var(--muted-foreground)", dy: 20 }}
                                                tickLine={false}
                                                axisLine={false}
                                                interval="preserveStartEnd"
                                            />
                                            <YAxis
                                                tick={{ fontSize: 10, fill: "var(--muted-foreground)", dx:-20  }}
                                                tickLine={false}
                                                axisLine={false}
                                                domain={["auto", "auto"]}
                                            />
                                            <ChartTooltip content={<ChartTooltipContent />} />
                                            {SERIES.map((s) =>
                                                activeLine[s.key] ? (
                                                    <Line
                                                        key={s.key}
                                                        type="monotone"
                                                        dataKey={s.key}
                                                        stroke={s.color}
                                                        strokeWidth={2}
                                                        dot={false}
                                                        activeDot={{ r: 4, strokeWidth: 0 }}
                                                    />
                                                ) : null
                                            )}
                                            <ChartLegend
                                                content={() => (
                                                    <div className="flex items-center gap-2 pt-4 flex-wrap justify-center">
                                                        {SERIES.map((s) => (
                                                            <button
                                                                key={s.key}
                                                                onClick={() => toggleSeries(s.key)}
                                                                className={`flex items-center gap-2 rounded-lg border px-3 py-1 text-xs transition-all ${activeLine[s.key]
                                                                    ? "bg-background border-border opacity-100"
                                                                    : "opacity-40 border-transparent"
                                                                    }`}
                                                            >
                                                                <div className="h-2 w-2 rounded-full" style={{ background: s.color }} />
                                                                {s.label}
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </ChartContainer>
                            )}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default GraphModal;