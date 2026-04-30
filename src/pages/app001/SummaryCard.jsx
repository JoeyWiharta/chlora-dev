import { Leaf, AlertTriangle, TrendingUp, TrendingDown, CalendarDays, Clock, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useState } from "react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import PropTypes from "prop-types";


const SummaryCard = (props) => {

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

            {/* Card Pot Overview */}
            <Card className="rounded-2xl border border-border shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
                <CardContent className="p-5 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Pot Overview</span>
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-success/10">
                            <Leaf size={18} className="text-success" />
                        </div>
                    </div>
                    <div className="flex items-end gap-6">
                        <div>
                            <p className="text-3xl font-semibold leading-none">{props.potOnline ?? 0}</p>
                            <span className="text-xs text-muted-foreground">Online</span>
                        </div>
                        <div className="h-8 w-px bg-border" />
                        <div>
                            <p className="text-3xl font-semibold leading-none">{props.potOffline ?? 0}</p>
                            <span className="text-xs text-muted-foreground">Offline</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Daily Anomaly */}
            <Card className="rounded-2xl border border-border shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
                <CardContent className="p-5 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Daily Anomaly</span>
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-warning/10">
                            <AlertTriangle size={18} className="text-warning" />
                        </div>
                    </div>
                    <div className="flex items-end gap-4">
                        <p className="text-3xl font-semibold leading-none">
                            {props.dailyAnomalyCurrent ?? 0}
                        </p>
                        <span className={`flex items-center gap-1 text-xs px-2 py-1 rounded-lg font-medium ${props.dailyAnomalyGrowth > 0 ? "bg-danger/10 text-danger" :
                            props.dailyAnomalyGrowth < 0 ? "bg-success/10 text-success" :
                                "bg-muted text-muted-foreground"
                            }`}>
                            {props.dailyAnomalyGrowth > 0 ? <TrendingUp size={12} /> :
                                props.dailyAnomalyGrowth < 0 ? <TrendingDown size={12} /> :
                                    <span className="w-3 h-px bg-muted-foreground rounded" />}
                            {props.dailyAnomalyGrowth == 0 ? "Same as yesterday" : `${props.dailyAnomalyGrowth} from yesterday`}
                        </span>
                    </div>
                </CardContent>
            </Card>

            {/* Weekly Anomaly */}
            <Card className="rounded-2xl border border-border shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
                <CardContent className="p-5 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Weekly Anomaly</span>
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-info/10">
                            <CalendarDays size={18} className="text-info" />
                        </div>
                    </div>
                    <div className="flex items-end gap-4">
                        <p className="text-3xl font-semibold leading-none">
                            {props.weeklyAnomalyCurrent ?? 0}
                        </p>
                        <span className={`flex items-center gap-1 text-xs px-2 py-1 rounded-lg font-medium ${props.weeklyAnomalyGrowth > 0 ? "bg-danger/10 text-danger" :
                            props.weeklyAnomalyGrowth < 0 ? "bg-success/10 text-success" :
                                "bg-muted text-muted-foreground"
                            }`}>
                            {props.weeklyAnomalyGrowth > 0 ? <TrendingUp size={12} /> :
                                props.weeklyAnomalyGrowth < 0 ? <TrendingDown size={12} /> :
                                    <span className="w-3 h-px bg-muted-foreground rounded" />}
                            {props.weeklyAnomalyGrowth == 0 ? "Same as yesterday" : `${props.weeklyAnomalyGrowth} from last week`}
                        </span>
                    </div>
                </CardContent>
            </Card>

            {/* Latest Anomaly*/}
            <Card className="rounded-2xl border border-border shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
                <CardContent className="p-5 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Latest Anomaly</span>
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-danger/10">
                            <Clock size={18} className="text-danger" />
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex gap-5 items-center">
                            <div>
                                <span className="text-xs text-muted-foreground">Location</span>
                                <p className="text-base font-semibold leading-tight">
                                    {props.latestAnomalyData?.potName ?? "-"}
                                </p>
                            </div>
                            <div className="h-8 w-px bg-border" />
                            <div>
                                <span className="text-xs text-muted-foreground">Time</span>
                                <p className="text-base font-semibold leading-tight">
                                    {props.latestAnomalyData?.lastDetected
                                        ? new Date(props.latestAnomalyData.lastDetected).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                                        : "-"}
                                </p>
                            </div>
                        </div>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="outline" size="icon" className="shrink-0">
                                    <ChevronRight size={16} />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <span className="text-xs">View More</span>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                </CardContent>
            </Card>



            {/* <Card className=" flex justify-center ">
                <CardContent className="flex flex-row items-center gap-6">
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-amber-500/10">
                        <AlertTriangle className="text-amber-400" />
                    </div>
                    <div className="flex flex-1 flex-col justify-center gap-2">
                        <CardTitle>Daily Anomaly</CardTitle>
                        <div className="flex flex-row gap-8 items-center">
                            <div className="flex flex-row items-center gap-4">
                                <span className="text-2xl font-bold">
                                    {dailyAnomalyData?.today?.current}
                                </span>

                                <CardDescription
                                    className={`flex gap-2 rounded-xl p-2 items-center ${dailyAnomalyGrowthFlag === "increase" ? "text-red-400 bg-red-400/10" :
                                        dailyAnomalyGrowthFlag === "decrease" ? "text-green-400 bg-green-400/10" :
                                            "text-gray-400 bg-gray-400/10"
                                        }`}
                                >
                                    {dailyAnomalyGrowthFlag === "increase" ? <TrendingUp size={14} /> :
                                        dailyAnomalyGrowthFlag === "decrease" ? <TrendingDown size={14} /> :
                                            <span className="w-3.5 h-0.5 bg-gray-400 rounded" />}

                                    {dailyAnomalyGrowthFlag === "neutral"
                                        ? "Same as yesterday"
                                        : `${Math.abs(dailyAnomalyGrowth)} from yesterday`}
                                </CardDescription>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className=" flex justify-center ">
                <CardContent className="flex flex-row items-center gap-6">
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-green-500/10">
                        <CalendarDays className="text-green-400" />
                    </div>
                    <div className="flex flex-1 flex-col justify-center gap-2">
                        <CardTitle>Weekly Anomaly</CardTitle>
                        <div className="flex flex-row gap-8 items-center">
                            <div className="flex flex-row items-center gap-4">
                                <span className="text-2xl font-bold">
                                    {anomaliesLastWeek.week}
                                </span>

                                <CardDescription
                                    className={`flex gap-2 rounded-xl p-2 items-center ${isIncreaseWeek ? "text-red-400 bg-red-400/10" : "text-green-400 bg-green-400/10"}`}
                                >
                                    {isIncreaseWeek ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                    {Math.abs(anomaliesLastWeek.lastWeekPercent)}% from last week
                                </CardDescription>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className=" flex justify-center ">
                <CardContent className="flex flex-row items-center gap-6">
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-orange-500/10">
                        <Clock className="text-orange-400" />
                    </div>
                    <div className="flex flex-1 flex-col justify-center gap-2">
                        <CardTitle>Latest Anomaly</CardTitle>

                        <div className="flex flex-row justify-between items-center">
                            <div className="flex flex-row gap-8">
                                <div className="flex flex-col">
                                    <CardDescription>Location</CardDescription>
                                    <span className="text-lg font-medium">{latestAnomaly.potId}</span>
                                </div>

                                <Separator
                                    orientation="vertical"
                                    className="data-[orientation=vertical]:h-10"
                                />

                                <div className="flex flex-col">
                                    <CardDescription>TIme</CardDescription>
                                    <span className="text-lg font-medium">{latestAnomaly.time}</span>
                                </div>
                            </div>

                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="outline" size="icon-lg">
                                        <ChevronRight />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <span className="text-xs font-medium">View More</span>
                                </TooltipContent>
                            </Tooltip>

                        </div>
                    </div>
                </CardContent>
            </Card> */}
        </div>
    )
}

SummaryCard.propTypes = {
    potOnline: PropTypes.any,
    potOffline: PropTypes.any,

};

export default SummaryCard