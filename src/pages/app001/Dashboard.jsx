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
    const [potOverviewData, setPotOverviewData] = useState([])
    const [dailyAnomalyData, setDailyAnomalyData] = useState([])
    const [weeklyAnomalyData, setWeeklyAnomalyData] = useState([])
    const [latestAnomalyData, setLatestAnomalyData] = useState([])
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

    // -------------------- Sync Every State Based On Dashboard Data Changes -------------------- //
    useEffect(() => {
        setPotOverviewData(dashboardData?.potStatus || null)
        setDailyAnomalyData(dashboardData?.anomalySummary?.today || null)
        setWeeklyAnomalyData(dashboardData?.anomalySummary?.thisWeek || null)
        setLatestAnomalyData(dashboardData?.anomalySummary?.lastDetected || null)
        setPotData(dashboardData?.pots || [])
    }, [dashboardData])
    // -------------------- Sync Every State Based On Dashboard Data Changes -------------------- //

    return (
        <React.Fragment>
            <RootPageCustom
                title={"Dashboard"}
                desc={"Monitor your plant pots in real-time"}
            >
                <div className={`${app001p01Page ? "flex" : "hidden"} flex-col flex-1 gap-6 `}>
                    <div className="flex-none">
                        <SummaryCard
                            potOverviewData={potOverviewData}
                            dailyAnomalyData={dailyAnomalyData}
                            weeklyAnomalyData={weeklyAnomalyData}
                            latestAnomalyData={latestAnomalyData}
                        />
                    </div>
                    <div className="flex-1 min-h-0">
                        <PotCard
                            potData={potData}
                        />
                    </div>
                    
                </div>
            </RootPageCustom >
        </React.Fragment >
    );
}
export default Dashboard;
