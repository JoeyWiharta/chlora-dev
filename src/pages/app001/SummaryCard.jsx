import { Flower2, MessageCircleWarning, TrendingUp, TrendingDown, ClockAlert, ChevronRight, FileExclamationPoint } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useState } from "react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import PropTypes from "prop-types";
import { formatTimeStampFull } from "@/components/common/Regex";


const SummaryCard = (props) => {
    console.log("Check latest anomaly data :", props.latestAnomalyData)
    return (


        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 bg-amber-200">

            {/* Card Pot Overview */}
            <Card className="rounded-2xl border border-border shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 justify-center py-5">
                <CardContent className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Pot Overview</span>
                        <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-success/10">
                            <Flower2 size={16} className="text-success" />
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <div>
                            <p className="text-xl font-semibold leading-none">{props.potOnline ?? 0}</p>
                            <span className="text-xs text-muted-foreground">Online</span>
                        </div>
                        <div className="h-3/4 w-px bg-border" />
                        <div>
                            <p className="text-xl font-semibold leading-none">{props.potOffline ?? 0}</p>
                            <span className="text-xs text-muted-foreground">Offline</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Daily Anomaly */}
            <Card className="rounded-2xl border border-border shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200  justify-center py-5">
                <CardContent className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Daily Anomaly</span>
                        <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-warning/10">
                            <MessageCircleWarning size={16} className="text-warning" />
                        </div>
                    </div>
                    <div className="flex items-end gap-4">
                        <p className="text-xl font-semibold leading-none">
                            {props.dailyAnomalyCurrent ?? 0}
                        </p>
                        <span className={`flex items-center gap-1 text-xs px-2 py-1 rounded-lg font-medium ${props.dailyAnomalyGrowth > 0 ? "bg-danger/10 text-danger" :
                            props.dailyAnomalyGrowth < 0 ? "bg-success/10 text-success" :
                                "bg-muted text-muted-foreground"
                            }`}>
                            {props.dailyAnomalyGrowth > 0 ? <TrendingUp size={12} /> :
                                props.dailyAnomalyGrowth < 0 ? <TrendingDown size={12} /> :
                                    <span className="w-3 h-px bg-muted-foreground rounded" />}
                            {props.dailyAnomalyGrowth === 0
                                ? "No change today"
                                : `${props.dailyAnomalyGrowth > 0 ? "+" : ""}${props.dailyAnomalyGrowth} since yesterday`}
                        </span>
                    </div>
                </CardContent>
            </Card>

            {/* Weekly Anomaly */}
            <Card className="rounded-2xl border border-border shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200  justify-center py-5">
                <CardContent className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Weekly Anomaly</span>
                        <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-info/10">
                            <FileExclamationPoint size={16} className="text-info" />
                        </div>
                    </div>
                    <div className="flex items-end gap-4">
                        <p className="text-xl font-semibold leading-none">
                            {props.weeklyAnomalyCurrent ?? 0}
                        </p>
                        <span className={`flex items-center gap-1 text-xs px-2 py-1 rounded-lg font-medium ${props.weeklyAnomalyGrowth > 0 ? "bg-danger/10 text-danger" :
                            props.weeklyAnomalyGrowth < 0 ? "bg-success/10 text-success" :
                                "bg-muted text-muted-foreground"
                            }`}>
                            {props.weeklyAnomalyGrowth > 0 ? <TrendingUp size={12} /> :
                                props.weeklyAnomalyGrowth < 0 ? <TrendingDown size={12} /> :
                                    <span className="w-3 h-px bg-muted-foreground rounded" />}
                            {props.weeklyAnomalyGrowth === 0
                                ? "No change this week"
                                : `${props.weeklyAnomalyGrowth > 0 ? "+" : ""}${props.weeklyAnomalyGrowth} since last week`}
                        </span>
                    </div>
                </CardContent>
            </Card>

            {/* Latest Anomaly*/}
            <Card className="rounded-2xl border border-border shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200  justify-center py-5">
                <CardContent className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Latest Anomaly</span>
                        <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-danger/10">
                            <ClockAlert size={16} className="text-danger" />
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex gap-5 items-end">
                            <div>
                                <span className="text-xs text-muted-foreground">Location</span>
                                <p className="text-sm font-semibold leading-tight">
                                    {props.latestAnomalyData?.potName ?? "-"}
                                </p>
                            </div>
                            <div className="h-8 w-px bg-border" />
                            <div>
                                <span className="text-xs text-muted-foreground">Time</span>
                                <p className="text-sm font-semibold leading-tight">
                                    {formatTimeStampFull(props.latestAnomalyData?.timestamp ?? "-")}
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
        </div>
    )
}

SummaryCard.propTypes = {
    potOnline: PropTypes.any,
    potOffline: PropTypes.any,

};

export default SummaryCard