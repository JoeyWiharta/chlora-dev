import { BatteryFull, BatteryLow, BatteryMedium, Cpu, Droplet, Flower2, Sprout, Thermometer } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatTimeStampReadable } from "@/components/common/Regex";
import { Separator } from "@/components/ui/separator";

const SeverityBadge = ({ severity }) => {
    switch (severity) {
        case "LOW": return <Badge className="bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">Low</Badge>
        case "MEDIUM": return <Badge className="bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300">Medium</Badge>
        case "HIGH": return <Badge className="bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300">High</Badge>
        case "CRITICAL": return <Badge className="bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300">Critical</Badge>
        default: return <Badge variant="outline">{severity}</Badge>
    }
}

const PopupAnomalyDetail = (props) => {

    const batteryIcon = (level) => {
        if (level <= 20) return (
            <div className="rounded-lg bg-danger/10 p-2">
                <BatteryLow size={18} className="text-danger" />
            </div>
        )
        if (level <= 50) return (
            <div className="rounded-lg bg-warning/10 p-2">
                <BatteryMedium size={18} className="text-warning" />
            </div>
        )
        return (
            <div className="rounded-lg bg-success/10 p-2">
                <BatteryFull size={18} className="text-success" />
            </div>
        )
    }

    return (
        <Dialog open={props.modalOpen} onOpenChange={props.setModalOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Anomaly Detail</DialogTitle>
                    <DialogDescription>Detail of anomaly detection result</DialogDescription>
                </DialogHeader>

                <div className="-mx-6 no-scrollbar max-h-[70vh] overflow-y-auto px-6 ">
                    <div className="flex flex-col gap-2">
                        <div className="flex flex-col gap-2">
                            <span className="text-sm font-semibold text-muted-foreground">Sensor Node</span>

                            <div className="grid grid-cols-2 gap-3">

                                <div className="flex items-center gap-3 px-4 py-3 rounded-xl border">
                                    <div className="rounded-lg bg-success/10 p-2">
                                        <Flower2 size={18} className="text-success" />
                                    </div>
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-xs text-muted-foreground">Pot</span>
                                        <span className="text-sm font-medium">{props.detailRow?.potName}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 px-4 py-3 rounded-xl border">
                                    <div className="rounded-lg bg-info/10 p-2">
                                        <Cpu size={18} className="text-info" />
                                    </div>
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-xs text-muted-foreground">Device</span>
                                        <span className="text-sm font-medium">{props.detailRow?.deviceName}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <span className="text-sm font-semibold text-muted-foreground">Environmental Data</span>

                            <div className="grid grid-cols-2 gap-3">

                                <div className="flex items-center gap-3 px-4 py-3 border rounded-xl">
                                    <div className="rounded-lg bg-warning/10 p-2">
                                        <Thermometer size={18} className="text-warning" />
                                    </div>
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-sm font-medium">{props.detailRow?.temperature}°C</span>
                                        <span className="text-xs text-muted-foreground">Temperature</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 px-4 py-3 border rounded-xl">
                                    <div className="rounded-lg bg-info/10 p-2">
                                        <Droplet size={18} className="text-info" />
                                    </div>
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-sm font-medium">{props.detailRow?.humidity}%</span>
                                        <span className="text-xs text-muted-foreground">Humidity</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 px-4 py-3 border rounded-xl">
                                    <div className="rounded-lg bg-success/10 p-2">
                                        <Sprout size={18} className="text-success" />
                                    </div>
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-sm font-medium">{props.detailRow?.soilMoisture}%</span>
                                        <span className="text-xs text-muted-foreground">Soil Moisture</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 px-4 py-3 border rounded-xl">
                                    {batteryIcon(props.detailRow?.batteryLevel)}
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-sm font-medium">{props.detailRow?.batteryLevel}%</span>
                                        <span className="text-xs text-muted-foreground">Battery</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <span className="text-sm font-semibold text-muted-foreground">Detection Summary</span>
                            <div className="flex flex-col rounded-xl border">
                                <div className="flex justify-between items-center px-4 py-3 text-sm">
                                    <span className="text-muted-foreground">Anomaly Type</span>
                                    <span className="font-medium">{props.detailRow?.anomalyType}</span>
                                </div>
                                <div className="flex justify-between items-center px-4 py-3 text-sm border-t">
                                    <span className="text-muted-foreground">Severity</span>
                                    <SeverityBadge severity={props.detailRow?.severity} />
                                </div>
                                <div className="flex justify-between items-center px-4 py-3 text-sm border-t">
                                    <span className="text-muted-foreground">Anomaly Score</span>
                                    <span className="font-medium font-mono">{props.detailRow?.anomalyScore}</span>
                                </div>
                                <div className="flex justify-between items-center px-4 py-3 text-sm border-t">
                                    <span className="text-muted-foreground">Timestamp</span>
                                    <span className="font-medium">{formatTimeStampReadable(props.detailRow?.timestamp)}</span>
                                </div>
                                <div className="flex justify-between items-center px-4 py-3 text-sm border-t">
                                    <span className="text-muted-foreground">Latency</span>
                                    <span className="font-medium">{props.detailRow?.latency} ms</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog >
    )
}

export default PopupAnomalyDetail;