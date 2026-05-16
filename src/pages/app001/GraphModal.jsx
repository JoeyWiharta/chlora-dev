import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BatteryFull, BatteryLow, BatteryMedium, Droplet, Sprout, Thermometer } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { getGraph } from "@/utils/ListApi";
import { Separator } from "@/components/ui/separator";

const RANGES = ["5M", "1H", "6H", "24H", "7D"];

const rangeMap = {
    "5M": "5m",
    "1H": "1h",
    "6H": "6h",
    "24H": "24h",
    "7D": "7d",
};

const SERIES = [
    { key: "temperature", label: "Temperature", color: "#f59e0b", unit: "°C", icon: Thermometer, iconClass: "text-warning", bgClass: "bg-warning/10" },
    { key: "humidity", label: "Humidity", color: "#3b82f6", unit: "%", icon: Droplet, iconClass: "text-info", bgClass: "bg-info/10" },
    { key: "soilMoisture", label: "Soil Moisture", color: "#22c55e", unit: "%", icon: Sprout, iconClass: "text-success", bgClass: "bg-success/10" },
];

const GraphModal = (props) => {
    const [timeRange, setTimeRange] = useState("24H");
    const [historyData, setHistoryData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeSeries, setActiveSeries] = useState({
        temperature: true,
        humidity: true,
        soilMoisture: true,
    });

    useEffect(() => {
        if (!props.graphModal || !props.selectedPotDetail?.potId) return;
        fetchHistory();
    }, [props.graphModal, props.selectedPotDetail?.potId, timeRange]);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const res = await getGraph({
                potId: props.selectedPotDetail?.potId,
                range: rangeMap[timeRange],
            });
            setHistoryData([...(res?.data?.data || [])].reverse());
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const toggleSeries = (key) => {
        setActiveSeries((prev) => {
            const activeCount = Object.values(prev).filter(Boolean).length;
            if (prev[key] && activeCount === 1) return prev;
            return { ...prev, [key]: !prev[key] };
        });
    };

    const batteryIcon = (level) => {
        if (level <= 20) return <div className="rounded-lg bg-danger/10 p-1.5"><BatteryLow size={16} className="text-danger" /></div>;
        if (level <= 50) return <div className="rounded-lg bg-warning/10 p-1.5"><BatteryMedium size={16} className="text-warning" /></div>;
        return <div className="rounded-lg bg-success/10 p-1.5"><BatteryFull size={16} className="text-success" /></div>;
    };

    const batteryColor = (level) => {
        if (level <= 20) return "text-danger";
        if (level <= 50) return "text-warning";
        return "text-success";
    };

    const CustomTooltip = ({ active, payload, label }) => {
        if (!active || !payload?.length) return null;
        return (
            <div className="bg-background border border-border rounded-xl p-3 text-xs flex flex-col gap-2 shadow-lg">
                <span className="text-muted-foreground font-medium">{label}</span>
                {payload.map((entry) => {
                    const s = SERIES.find((s) => s.key === entry.dataKey);
                    const Icon = s?.icon;
                    return (
                        <div key={entry.dataKey} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
                            <span className="text-muted-foreground">{s?.label}</span>
                            <span className="font-semibold ml-auto">{entry.value}{s?.unit}</span>
                        </div>
                    );
                })}
            </div>
        );
    };

    const sensorCards = [
        {
            key: "temperature",
            label: "Temperature",
            value: `${props.selectedPotDetail?.temperature}°C`,
            icon: Thermometer,
            iconClass: "text-warning",
            bgClass: "bg-warning/10",
        },
        {
            key: "humidity",
            label: "Humidity",
            value: `${props.selectedPotDetail?.humidity}%`,
            icon: Droplet,
            iconClass: "text-info",
            bgClass: "bg-info/10",
        },
        {
            key: "soilMoisture",
            label: "Soil Moisture",
            value: `${props.selectedPotDetail?.soilMoisture}%`,
            icon: Sprout,
            iconClass: "text-success",
            bgClass: "bg-success/10",
        },
        {
            key: "battery",
            label: "Battery",
            value: `${props.selectedPotDetail?.battery}%`,
            customIcon: batteryIcon(props.selectedPotDetail?.battery),
            valueClass: batteryColor(props.selectedPotDetail?.battery),
        },
    ];

    return (
        <Dialog open={props.graphModal} onOpenChange={props.setGraphModal}>

            <DialogContent
                className="flex flex-col overflow-hidden"
                style={{ width: "90vw", maxWidth: "90vw", height: "90vh", maxHeight: "90vh" }}
            >

                <DialogHeader className="flex flex-col gap-1">
                    <DialogTitle>{props.selectedPotDetail?.potName}</DialogTitle>
                    <DialogDescription>Sensor readings over time</DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-4">

                    {/* First Row*/}
                    <div className="flex flex-col shrink-0">
                        <div className="grid grid-cols-4 gap-2">
                            {sensorCards.map((card) => {
                                const Icon = card.icon;
                                return (
                                    <div key={card.key} className="flex items-center gap-3 bg-muted/40 rounded-xl px-3 py-2.5 border border-border/50">
                                        {card.customIcon
                                            ? card.customIcon
                                            : (
                                                <div className={`rounded-lg ${card.bgClass} p-1.5 shrink-0`}>
                                                    <Icon size={16} className={card.iconClass} />
                                                </div>
                                            )
                                        }
                                        <div className="flex flex-col gap-0.5 min-w-0">
                                            <span className={`text-sm font-semibold ${card.valueClass ?? ""}`}>{card.value}</span>
                                            <span className="text-xs text-muted-foreground truncate">{card.label}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <Separator />

                    {/* Graph Section */}
                    <div className="flex flex-col shrink-0">
                        <div className="flex flex-row justify-between">
                            <div className="flex items-center gap-2 shrink-0">
                                {SERIES.map((s) => {
                                    const Icon = s.icon;
                                    return (
                                        <button
                                            key={s.key}
                                            onClick={() => toggleSeries(s.key)}
                                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${activeSeries[s.key]
                                                ? "bg-background border-border text-foreground shadow-sm"
                                                : "bg-transparent border-transparent text-muted-foreground opacity-30"
                                                }`}
                                        >
                                            <span
                                                className="w-2 h-2 rounded-full shrink-0 transition-all"
                                                style={{ backgroundColor: activeSeries[s.key] ? s.color : "currentColor" }}
                                            />
                                            {s.label}
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
                                {RANGES.map((range) => (
                                    <button
                                        key={range}
                                        onClick={() => setTimeRange(range)}
                                        className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${timeRange === range
                                            ? "bg-background text-foreground shadow-sm"
                                            : "text-muted-foreground hover:text-foreground"
                                            }`}
                                    >
                                        {range}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex-1 rounded-xl border bg-muted/20 p-4 overflow-hidden">
                            {loading ? (
                                <div className="w-full h-full flex items-center justify-center">
                                    <span className="text-xs text-muted-foreground animate-pulse">Loading data...</span>
                                </div>
                            ) : historyData.length === 0 ? (
                                <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                                    <span className="text-xs text-muted-foreground">No data available</span>
                                </div>
                            ) : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={historyData} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.1)" />
                                        <XAxis
                                            dataKey="time"
                                            tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                                            interval="preserveStartEnd"
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <YAxis
                                            tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                                            tickLine={false}
                                            axisLine={false}
                                            domain={["auto", "auto"]}
                                        />
                                        <Tooltip content={<CustomTooltip />} />
                                        {SERIES.map((s) =>
                                            activeSeries[s.key] ? (
                                                <Line
                                                    key={s.key}
                                                    type="monotone"
                                                    dataKey={s.key}
                                                    stroke={s.color}
                                                    strokeWidth={2}
                                                    dot={false}
                                                    activeDot={{ r: 3, strokeWidth: 0 }}
                                                />
                                            ) : null
                                        )}
                                    </LineChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </div>

                </div>

            </DialogContent>
        </Dialog>
    );
};

export default GraphModal;