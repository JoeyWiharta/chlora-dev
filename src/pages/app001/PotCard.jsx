import { Card, CardContent } from "@/components/ui/card"
import { Battery, ChevronLeft, ChevronRight, Droplet, Sprout, Thermometer, Wifi } from "lucide-react"
import { Button } from "@/components/ui/button"
import potDashboard from "../../assets/images/potDashboard.webp"
import { useState } from "react"

const ITEMS_PER_PAGE = 4

const PotCard = ({ potData }) => {
    const [currentPage, setCurrentPage] = useState(1)
    const potList = potData ?? []

    const totalPages = Math.ceil(potList.length / ITEMS_PER_PAGE)
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const currentItems = potList.slice(startIndex, startIndex + ITEMS_PER_PAGE)

    const getPageNumbers = () => {
        if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1)
        if (currentPage <= 3) return [1, 2, 3, 4, "...", totalPages]
        if (currentPage >= totalPages - 2) return [1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
        return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages]
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 h-full overflow-y-auto bg-amber-200">

            {/* Grid Cards */}
            {currentItems.map((pot) => (
                <Card key={pot.id} className="flex w-full h-full">
                    <CardContent className="flex flex-col gap-2 pt-4 w-full">
                        <div className="flex justify-end">
                            <Wifi className={pot.status === "online" ? "text-green-500" : "text-gray-400"} />
                        </div>

                        <div className="flex justify-center">
                            <img src={potDashboard} className="h-35 w-25" />
                        </div>

                        <div className="text-center">
                            <p className="font-semibold text-sm">{pot.id}</p>
                            <p className="text-xs text-muted-foreground">{pot.status}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <Card className="flex flex-row items-center gap-2 px-3 py-2">
                                <Thermometer size={14} className="text-orange-400 shrink-0" />
                                <span className="text-xs">Temp</span>
                                <span className="text-xs font-medium ml-auto">{pot.temperature}°C</span>
                            </Card>
                            <Card className="flex flex-row items-center gap-2 px-3 py-2">
                                <Droplet size={14} className="text-blue-400 shrink-0" />
                                <span className="text-xs">Humidity</span>
                                <span className="text-xs font-medium ml-auto">{pot.humidity}%</span>
                            </Card>
                            <Card className="flex flex-row items-center gap-2 px-3 py-2">
                                <Sprout size={14} className="text-green-500 shrink-0" />
                                <span className="text-xs">Soil</span>
                                <span className="text-xs font-medium ml-auto">{pot.soilMoisture}%</span>
                            </Card>
                            <Card className="flex flex-row items-center gap-2 px-3 py-2">
                                <Battery size={14} className="text-yellow-400 shrink-0" />
                                <span className="text-xs">Battery</span>
                                <span className="text-xs font-medium ml-auto">{pot.battery}%</span>
                            </Card>
                        </div>

                        <Button variant="outline" className="w-full justify-between px-4">
                            View Detail
                            <ChevronRight size={14} />
                        </Button>
                    </CardContent>
                </Card>
            ))}

            {/* Pagination */}
            <div className="col-span-full flex items-center justify-between px-2">
                <p className="text-sm text-muted-foreground">
                    Showing {startIndex + 1}–{Math.min(startIndex + ITEMS_PER_PAGE, potList.length)} of {potList.length} pots
                </p>

                <div className="flex items-center gap-1">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setCurrentPage((p) => p - 1)}
                        disabled={currentPage === 1}
                    >
                        <ChevronLeft size={16} />
                    </Button>

                    {getPageNumbers().map((page, index) =>
                        page === "..." ? (
                            <span key={`ellipsis-${index}`} className="px-2 text-sm text-muted-foreground">...</span>
                        ) : (
                            <Button
                                key={page}
                                variant={currentPage === page ? "default" : "outline"}
                                size="icon"
                                onClick={() => setCurrentPage(page)}
                                className="w-8 h-8 text-sm"
                            >
                                {page}
                            </Button>
                        )
                    )}

                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setCurrentPage((p) => p + 1)}
                        disabled={currentPage === totalPages}
                    >
                        <ChevronRight size={16} />
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default PotCard