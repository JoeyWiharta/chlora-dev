import { Flower2, MessageCircleWarning, TrendingUp, TrendingDown, ClockAlert, ChevronRight, FileExclamationPoint } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useEffect, useMemo, useState } from "react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import PropTypes from "prop-types";
import { formatTimeStampFull } from "@/components/common/Regex";
import { ChartContainer } from "@/components/ui/chart"
import { RadialBarChart, RadialBar, PolarAngleAxis, BarChart, Bar, ResponsiveContainer, XAxis, Tooltip as RechartsTooltip } from "recharts"

const SummaryCard = (props) => {
    // Pot Overview Memo
    const potOverViewData = useMemo(() => {
        const online = props.potOnline ?? 0
        const offline = props.potOffline ?? 0
        const percentage = Math.round(((online ?? 0) / ((online ?? 0) + (offline ?? 0) || 1)) * 100)

        return {
            potOnline: online,
            potOffline: offline,
            percentageBar: percentage
        }
    }, [props.potOnline, props.potOffline])

    // Daily Anomaly Memo
    const dailyAnomalyData = useMemo(() => {
        const current = props.dailyAnomalyCurrent ?? 0
        const previous = props.dailyAnomalyPrevious ?? 0
        const growth = current - previous

        return {
            today: current,
            badgeGrowth: growth > 0 ? (
                <span className="flex items-center gap-1.5 text-xs px-2 py-1 rounded-lg font-medium w-fit bg-danger/10 text-danger">
                    <TrendingUp size={12} /> +{growth} since yesterday
                </span>
            ) : growth < 0 ? (
                <span className="flex items-center gap-1.5 text-xs px-2 py-1 rounded-lg font-medium w-fit bg-success/10 text-success">
                    <TrendingDown size={12} /> {growth} since yesterday
                </span>
            ) : (
                <span className="flex items-center gap-1.5 text-xs px-2 py-1 rounded-lg font-medium w-fit bg-muted text-muted-foreground">
                    <span className="w-3 h-px bg-muted-foreground rounded" /> No change today
                </span>
            ),
            data: [
                {
                    name: "Yesterday",
                    value: previous,
                    color: "var(--muted-foreground)"
                },
                {
                    name: "Today",
                    value: current,
                    color: growth > 0 ? "var(--danger)" : growth < 0 ? "var(--success)" : "var(--muted-foreground)"
                }
            ],
        }
    }, [props.dailyAnomalyCurrent, props.dailyAnomalyPrevious])

    const weeklyAnomalyData = useMemo(() => {
        const current = props.weeklyAnomalyCurrent ?? 0
        const previous = props.weeklyAnomalyPrevious ?? 0
        const growth = current - previous

        return {
            today: current,
            badgeGrowth: growth > 0 ? (
                <span className="flex items-center gap-1.5 text-xs px-2 py-1 rounded-lg font-medium w-fit bg-danger/10 text-danger">
                    <TrendingUp size={12} /> +{growth} since last week
                </span>
            ) : growth < 0 ? (
                <span className="flex items-center gap-1.5 text-xs px-2 py-1 rounded-lg font-medium w-fit bg-success/10 text-success">
                    <TrendingDown size={12} /> {growth} since last week
                </span>
            ) : (
                <span className="flex items-center gap-1.5 text-xs px-2 py-1 rounded-lg font-medium w-fit bg-muted text-muted-foreground">
                    <span className="w-3 h-px bg-muted-foreground rounded" /> No change this week
                </span>
            ),
            data: [
                {
                    name: "Last Week",
                    value: previous,
                    color: "var(--muted-foreground)"
                },
                {
                    name: "This Week",
                    value: current,
                    color: growth > 0 ? "var(--danger)" : growth < 0 ? "var(--success)" : "var(--muted-foreground)"
                }
            ],
        }
    }, [props.weeklyAnomalyCurrent, props.weeklyAnomalyPrevious])

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">

            <Card className="rounded-2xl border border-border shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 py-5 gap-2">
                <CardHeader className="flex justify-between items-center text-muted-foreground font-medium">
                    <span>Pot Overview</span>
                    <div className="p-2 rounded-xl bg-success/15">
                        <Flower2 size={16} className="text-success" />
                    </div>
                </CardHeader>
                <CardContent className="flex flex-row gap-4">
                    <div className="relative w-20 h-20 shrink-0">
                        <ChartContainer config={{}} className="w-full h-full">
                            <RadialBarChart
                                width={80}
                                height={80}
                                cx={40}
                                cy={40}
                                innerRadius={26}
                                outerRadius={38}
                                startAngle={90}
                                endAngle={-270}
                                data={[{
                                    value: potOverViewData.percentageBar,
                                    fill: "var(--success)"
                                }]}
                            >
                                <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                                <RadialBar dataKey="value" background={{ fill: "color-mix(in oklch, var(--danger) 15%, transparent)" }} cornerRadius={10} />
                            </RadialBarChart>
                        </ChartContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-sm font-semibold text-success">{potOverViewData.percentageBar}%</span>
                        </div>
                    </div>
                    <Separator orientation="vertical" className="self-center" style={{ height: "80%" }} />
                    <div className="flex flex-col justify-center gap-2 flex-1 pr-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-success" />
                                <span className="text-sm text-muted-foreground">Online</span>
                            </div>
                            <span className="text-lg font-semibold">{potOverViewData.potOnline}</span>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-danger" />
                                <span className="text-sm text-muted-foreground">Offline</span>
                            </div>
                            <span className="text-lg font-semibold">{potOverViewData.potOffline}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>


            {/* Daily Anomaly */}
            <Card className="rounded-2xl border border-border shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 py-5 gap-5">
                <CardHeader className="flex justify-between items-center text-muted-foreground font-medium">
                    <span>Daily Anomaly</span>
                    <div className="p-2 rounded-xl bg-warning/15">
                        <MessageCircleWarning size={16} className="text-warning" />
                    </div>
                </CardHeader>

                <CardContent className="flex flex-row gap-4">
                    <div className="flex flex-col justify-center gap-2 flex-1 pr-3">
                        <div className="flex flex-col justify-center gap-2 flex-1">
                            <span className="text-lg font-semibold">{dailyAnomalyData.today}</span>
                            {dailyAnomalyData.badgeGrowth}
                        </div>
                    </div>
                    <Separator orientation="vertical" className="self-center" style={{ height: "80%" }} />
                    <div className="w-16 h-16 shrink-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={dailyAnomalyData.data} barCategoryGap="10%">
                                <RechartsTooltip
                                    cursor={{ fill: "transparent" }}
                                    wrapperStyle={{ zIndex: 50 }}
                                    contentStyle={{
                                        backgroundColor: "var(--popover)",
                                        border: "0.5px solid var(--border)",
                                        borderRadius: "8px",
                                        fontSize: "12px",
                                        padding: "6px 10px",
                                    }}
                                    itemStyle={{ color: "var(--popover-foreground)" }}
                                    labelStyle={{ display: "none" }}
                                    formatter={(value, name, props) => [value, props.payload.name]}
                                />
                                <Bar
                                    dataKey="value"
                                    shape={(barProps) => (
                                        <rect
                                            x={barProps.x}
                                            y={barProps.y}
                                            width={barProps.width}
                                            height={barProps.height}
                                            fill={barProps.color}
                                            opacity={barProps.name === "Today" ? 0.7 : 0.3}
                                            rx={3}
                                        />
                                    )}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Weekly Anomaly */}
            <Card className="rounded-2xl border border-border shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 py-5 gap-5">
                <CardHeader className="flex justify-between items-center text-muted-foreground font-medium">
                    <span>Weekly Anomaly</span>
                    <div className="p-2 rounded-xl bg-info/15">
                        <FileExclamationPoint size={16} className="text-info" />
                    </div>
                </CardHeader>
                <CardContent className="flex flex-row gap-4">
                    <div className="flex flex-col justify-center gap-2 flex-1">
                        <span className="text-lg font-semibold">{weeklyAnomalyData.today}</span>
                        {weeklyAnomalyData.badgeGrowth}
                    </div>
                    <Separator orientation="vertical" className="self-center" style={{ height: "80%" }} />
                    <div className="w-16 h-16 shrink-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={weeklyAnomalyData.data} barCategoryGap="10%">
                                <RechartsTooltip
                                    cursor={{ fill: "transparent" }}
                                    wrapperStyle={{ zIndex: 50 }}
                                    contentStyle={{
                                        backgroundColor: "var(--popover)",
                                        border: "0.5px solid var(--border)",
                                        borderRadius: "8px",
                                        fontSize: "12px",
                                        padding: "6px 10px",
                                    }}
                                    itemStyle={{ color: "var(--popover-foreground)" }}
                                    labelStyle={{ display: "none" }}
                                    formatter={(value, name, props) => [value, props.payload.name]}
                                />
                                <Bar
                                    dataKey="value"
                                    shape={(barProps) => (
                                        <rect
                                            x={barProps.x}
                                            y={barProps.y}
                                            width={barProps.width}
                                            height={barProps.height}
                                            fill={barProps.color}
                                            opacity={barProps.name === "This Week" ? 0.7 : 0.3}
                                            rx={3}
                                        />
                                    )}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Latest Anomaly*/}
            <Card className="rounded-2xl border border-border shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 py-5 gap-5">
                <CardHeader className="flex justify-between items-center text-muted-foreground font-medium">
                    <span>Latest Anomaly</span>
                    <div className="p-2 rounded-xl bg-info/15">
                        <ClockAlert size={16} className="text-info" />
                    </div>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">

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
    dailyAnomalyCurrent: PropTypes.any,
    dailyAnomalyPrevious: PropTypes.any,
    weeklyAnomalyCurrent: PropTypes.any,
    weeklyAnomalyPrevious: PropTypes.any,

};

export default SummaryCard