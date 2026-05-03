import React, { useState, useEffect } from "react";
import RootPageCustom from "../../components/common/RootPageCustom";
import PotCard from "./PotCard";
import { subscribeDashboardSse } from "@/utils/ListApi";
import { useAuth } from "@/context/AuthContext";
import SummaryCard from "./SummaryCard";

const Dashboard = () => {
    const { loginStatus } = useAuth()
    const [app001p01Page, setApp001p01Page] = useState(true);




    const [dashboardData, setDashboardData] = useState([])

    // Pot Overview Card
    const [potOverviewData, setPotOverviewData] = useState([])

    // Daily Anomaly Card
    const [dailyAnomalyData, setDailyAnomalyData] = useState([])
    const [dailyAnomalyGrowth, setDailyAnomalyGrowth] = useState(0)

    // Weekly Anomaly Card
    const [weeklyAnomalyData, setWeeklyAnomalyData] = useState([])
    const [weeklyAnomalyGrowth, setWeeklyAnomalyGrowth] = useState(0)

    // Last Detected Anomaly 
    const [latestAnomalyData, setLatestAnomalyData] = useState([])

    // Pot List
    const [potData, setPotData] = useState([])

    // -------------------- Listen SSE Subscribe Dashboard -------------------- //
    useEffect(() => {
        if (!loginStatus) return

        const eventSource = subscribeDashboardSse()

        const handleEvent = (event) => {
            try {
                const jsonResponse = JSON.parse(event.data)
                if (jsonResponse) {
                    setDashboardData(jsonResponse)
                }
            } catch (error) {
                console.log(error)
            }
        }

        eventSource.addEventListener("snapshot", handleEvent)
        eventSource.addEventListener("dashboard-update", handleEvent)

        eventSource.onerror = (error) => {
            if (!loginStatus) {
                eventSource.close()
                return
            }
            console.log(error)
        }

        return () => {
            eventSource.removeEventListener("snapshot", handleEvent)
            eventSource.removeEventListener("dashboard-update", handleEvent)
            eventSource.close()
        }
    }, [loginStatus])
    // -------------------- Listen SSE Subscribe Dashboard -------------------- //

    useEffect(() => {
        console.log("Check Dashboard Data : ", dashboardData)

        setPotOverviewData(dashboardData?.potStatus || null)

        setDailyAnomalyData(dashboardData?.anomalySummary?.today || null)
        setDailyAnomalyGrowth(dashboardData?.anomalySummary?.today?.current - dashboardData?.anomalySummary?.today?.previous)

        setWeeklyAnomalyData(dashboardData?.anomalySummary?.thisWeek || null)
        setWeeklyAnomalyGrowth(dashboardData?.anomalySummary?.thisWeek?.current - dashboardData?.anomalySummary?.thisWeek?.previous)

        setLatestAnomalyData(dashboardData?.anomalySummary?.lastDetected || null)

        setPotData(dashboardData?.pots || [])

    }, [dashboardData])



    return (
        <React.Fragment>
            <RootPageCustom
                title={"Dashboard"}
                desc={"Monitor your plant pots in real-time"}
            >
                {/* Main Wrapper */}
                <div className={`${app001p01Page ? "flex" : "hidden"} flex-col flex-1 gap-6 bg-gray-800`}>
                    <div className="flex-none">
                        <SummaryCard
                            potOnline={potOverviewData?.onlineCount}
                            potOffline={potOverviewData?.offlineCount}

                            dailyAnomalyCurrent={dailyAnomalyData?.current}
                            dailyAnomalyPrevious={dailyAnomalyData?.previous}
                            dailyAnomalyGrowth={dailyAnomalyGrowth}

                            weeklyAnomalyCurrent={weeklyAnomalyData?.current}
                            weeklyAnomalyPrevious={weeklyAnomalyData?.previous}
                            weeklyAnomalyGrowth={weeklyAnomalyGrowth}

                            latestAnomalyData={latestAnomalyData}
                        />
                    </div>

                    <div className="flex-1 min-h-0">
                        <PotCard potData={potData} />
                    </div>
                </div>


            </RootPageCustom >
        </React.Fragment >
    );
}
export default Dashboard;
