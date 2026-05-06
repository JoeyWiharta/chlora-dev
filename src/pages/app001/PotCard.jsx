import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { BatteryFull, BatteryLow, BatteryMedium, ChevronLeft, ChevronRight, Circle, Clock, Droplet, Sprout, Thermometer } from "lucide-react"
import { Button } from "@/components/ui/button"
import potDashboard from "../../assets/images/potDashboard.webp"
import PropTypes from "prop-types"
import { Swiper, SwiperSlide } from "swiper/react"
import { Pagination, Mousewheel } from "swiper/modules"
import "swiper/css"
import "swiper/css/pagination"
import { useRef } from "react"
import { formatTimeStampFull } from "@/components/common/Regex"
import { ToasterCustom } from "@/components/common/ToasterCustom"

const PotCard = (props) => {
    const potList = props.potData ?? []
    const swiperRef = useRef(null)

    const batteryIcon = (level) => {
        if (level <= 20) return (
            <div className="rounded-lg bg-danger/10 p-1.5">
                <BatteryLow size={20} className="text-danger shrink-0" />
            </div>
        )
        if (level <= 50) return (
            <div className="rounded-lg bg-warning/10 p-1.5">
                <BatteryMedium size={20} className="text-warning shrink-0" />
            </div>
        )
        return (
            <div className="rounded-lg bg-success/10 p-1.5">
                <BatteryFull size={20} className="text-success shrink-0" />
            </div>
        )
    }

    return (
        <div className="flex flex-col h-full gap-3">

            <div className="flex items-center justify-between px-2">
                <span className="text-base font-medium text-muted-foreground">Pot available</span>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={() => swiperRef.current?.slidePrev()}>
                        <ChevronLeft size={16} />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => swiperRef.current?.slideNext()}>
                        <ChevronRight size={16} />
                    </Button>
                </div>
            </div>

            <Swiper
                onSwiper={(swiper) => (swiperRef.current = swiper)}
                slidesPerView={1.1}
                centeredSlides={true}
                spaceBetween={16}
                breakpoints={{
                    640: { slidesPerView: 1, centeredSlides: false },
                    840: { slidesPerView: 2, centeredSlides: false },
                    1024: { slidesPerView: 3, centeredSlides: false },
                    1440: { slidesPerView: 4, centeredSlides: false },
                }}
                className="w-full swiper-cards-container"
                style={{ alignItems: "stretch" }}
                speed={500}
            >
                {potList.map((pot) => {
                    const isMonitored = !!pot.lastUpdated

                    return (
                        <SwiperSlide key={pot.potId} className="h-auto">
                            <Card className="flex flex-col w-full h-full rounded-2xl border border-border shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
                                <CardHeader className="flex flex-row justify-between items-center">
                                    {isMonitored ? (
                                        <div className="flex flex-row items-center gap-1.5 text-muted-foreground">
                                            <Clock size={12} className="shrink-0" />
                                            <span className="text-xs">Last updated {formatTimeStampFull(pot.lastUpdated)?.toLowerCase()}</span>
                                        </div>
                                    ) : (
                                        <span className="text-xs text-muted-foreground italic">Never connected</span>
                                    )}
                                    <div className="flex flex-row items-center gap-1.5">
                                        <Circle size={12} className={`shrink-0 ${isMonitored ? pot.isOnline ? "text-success fill-success" : "text-danger fill-danger" : "text-muted-foreground fill-muted-foreground"}`} />
                                        <span className={`text-xs font-medium ${isMonitored ? pot.isOnline ? "text-success" : "text-danger" : "text-muted-foreground"}`}>
                                            {isMonitored ? pot.isOnline ? "Online" : "Offline" : "Inactive"}
                                        </span>
                                    </div>
                                </CardHeader>

                                <CardContent className="flex flex-col gap-4 flex-1 justify-between pb-4">

                                    {/* Image + Name */}
                                    <div className="flex flex-col items-center gap-3 py-4">
                                        <img src={potDashboard} className="h-35 w-30" />
                                        <span className="font-semibold text-base text-center truncate w-full px-2">
                                            {pot.potName}
                                        </span>
                                    </div>

                                    {/* Stats */}
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="flex items-center gap-3 bg-muted/70 rounded-xl p-3 min-w-0">
                                            <div className="rounded-lg bg-warning/10 p-1.5">
                                                <Thermometer size={20} className="text-warning" />
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <span className="text-sm font-semibold truncate">{pot.temperature}°C</span>
                                                <span className="text-xs text-muted-foreground truncate">Temperature</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 bg-muted/70 rounded-xl p-3 min-w-0">
                                            <div className="rounded-lg bg-info/10 p-1.5">
                                                <Droplet size={20} className="text-info" />
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <span className="text-sm font-semibold truncate">{pot.humidity}%</span>
                                                <span className="text-xs text-muted-foreground truncate">Humidity</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 bg-muted/70 rounded-xl p-3 min-w-0">
                                            <div className="rounded-lg bg-success/10 p-1.5">
                                                <Sprout size={20} className="text-success" />
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <span className="text-sm font-semibold truncate">{pot.soilMoisture}%</span>
                                                <span className="text-xs text-muted-foreground truncate">Soil Moisture</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 bg-muted/70 rounded-xl p-3 min-w-0">
                                            {batteryIcon(pot.battery)}
                                            <div className="flex flex-col min-w-0">
                                                <span className="text-sm font-semibold truncate">{pot.battery}%</span>
                                                <span className="text-xs text-muted-foreground truncate">Battery</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Button */}
                                    <Button
                                        size="lg"
                                        variant="outline"
                                        className="w-full justify-between"
                                        onClick={() => ToasterCustom.warning("Feature will be available soon")}
                                    >
                                        View Detail
                                        <ChevronRight size={14} />
                                    </Button>

                                </CardContent>
                            </Card>
                        </SwiperSlide>
                    )
                })}
            </Swiper>
        </div>
    )
}

PotCard.propTypes = {
    potData: PropTypes.any,
};

export default PotCard