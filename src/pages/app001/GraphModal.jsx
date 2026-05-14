import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BatteryFull, BatteryLow, BatteryMedium, Droplet, Sprout, Thermometer } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { formatTimeStampReadable } from "@/components/common/Regex";

const GraphModal = ({ modalOpen, setModalOpen, potData }) => {

    const batteryIcon = (level) => {
        if (level <= 20) return <div className="rounded-lg bg-danger/10 p-1.5"><BatteryLow size={18} className="text-danger" /></div>
        if (level <= 50) return <div className="rounded-lg bg-warning/10 p-1.5"><BatteryMedium size={18} className="text-warning" /></div>
        return <div className="rounded-lg bg-success/10 p-1.5"><BatteryFull size={18} className="text-success" /></div>
    }

    return (
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
            <DialogContent className="w-[90vw] max-w-[90vw] max-h-[90vh] flex flex-col p-0 gap-0">

                {/* Header */}
                <div className="px-6 pt-6 pb-4 border-b">
                    <DialogHeader>
                        <DialogTitle>{potData?.potName}</DialogTitle>
                        <DialogDescription>{potData?.deviceName}</DialogDescription>
                    </DialogHeader>
                </div>

                {/* Scrollable Content */}
                <div className="-mx-0 no-scrollbar overflow-y-auto px-6 py-4">
                    <div className="flex flex-col gap-4">

                        {/* Environmental Data */}
                        <div className="flex flex-col gap-2">
                            <span className="text-sm font-semibold text-muted-foreground">Environmental Data</span>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="flex items-center gap-3 bg-muted/50 rounded-xl px-4 py-3 border">
                                    <div className="rounded-lg bg-warning/10 p-1.5">
                                        <Thermometer size={18} className="text-warning" />
                                    </div>
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-sm font-medium">{potData?.temperature}°C</span>
                                        <span className="text-xs text-muted-foreground">Temperature</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-muted/50 rounded-xl px-4 py-3 border">
                                    <div className="rounded-lg bg-info/10 p-1.5">
                                        <Droplet size={18} className="text-info" />
                                    </div>
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-sm font-medium">{potData?.humidity}%</span>
                                        <span className="text-xs text-muted-foreground">Humidity</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-muted/50 rounded-xl px-4 py-3 border">
                                    <div className="rounded-lg bg-success/10 p-1.5">
                                        <Sprout size={18} className="text-success" />
                                    </div>
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-sm font-medium">{potData?.soilMoisture}%</span>
                                        <span className="text-xs text-muted-foreground">Soil Moisture</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-muted/50 rounded-xl px-4 py-3 border">
                                    {batteryIcon(potData?.battery)}
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-sm font-medium">{potData?.battery}%</span>
                                        <span className="text-xs text-muted-foreground">Battery</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Placeholder Graph */}
                        <div className="flex flex-col gap-2">
                            <span className="text-sm font-semibold text-muted-foreground">Sensor History</span>
                            <div className="rounded-xl border bg-muted/30 h-48 flex items-center justify-center">
                                <span className="text-sm text-muted-foreground">Graph will be available soon</span>
                            </div>
                        </div>

                    </div>
                </div>

            </DialogContent>
        </Dialog>
    )
}

export default GraphModal;