import React, { useState, useEffect, useRef } from "react";
import RootPageCustom from "../../components/common/RootPageCustom";
import PotCard from "./PotCard";
import { subscribeDashboardSse } from "@/utils/ListApi";
import { useAuth } from "@/context/AuthContext";
import SummaryCard from "./SummaryCard";
import GraphModal from "./GraphModal";

const Dashboard = () => {
    const { loginStatus } = useAuth()
    const [app001p01Page, setApp001p01Page] = useState(true);
    const [dashboardData, setDashboardData] = useState([])
    const [potOverviewData, setPotOverviewData] = useState([])
    const [dailyAnomalyData, setDailyAnomalyData] = useState([])
    const [weeklyAnomalyData, setWeeklyAnomalyData] = useState([])
    const [latestAnomalyData, setLatestAnomalyData] = useState([])
    const [potData, setPotData] = useState([])

    // -------------------- Graph Modal -------------------- //
    const [graphModal, setGraphModal] = useState(false)
    const [selectedPotDetail, setSelectedPotDetail] = useState(null);
    const handleOpenGraphModal = (row) => {
        setSelectedPotDetail(row)
        setGraphModal(true)
    }
    // -------------------- Graph Modal -------------------- //

    // -------------------- Increment Time Counter Every Minutes -------------------- //
    const [tickTime, setTickTime] = useState(0)
    useEffect(() => {
        const interval = setInterval(() => setTickTime(t => t + 1), 60000)
        return () => clearInterval(interval)
    }, [])
    // -------------------- Increment Time Counter Every Minutes -------------------- //


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

    // -------------------- Sync Data to Graph Modal -------------------- //
    useEffect(() => {
        if (!selectedPotDetail) return;
        const updated = potData.find(p => p.potId === selectedPotDetail.potId);
        if (updated && JSON.stringify(updated) !== JSON.stringify(selectedPotDetail)) {
            setSelectedPotDetail(updated);
        }
    }, [potData]);
    // -------------------- Sync Data to Graph Modal -------------------- //


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
                            tickTime={tickTime}
                        />
                    </div>
                    <div className="flex-1 min-h-0">
                        <PotCard
                            potData={potData}
                            tickTime={tickTime}
                            handleOpenGraphModal={handleOpenGraphModal}
                            graphModal={graphModal}
                            setGraphModal={setGraphModal}
                            selectedPotDetail={selectedPotDetail}
                        />
                    </div>
                </div>

            </RootPageCustom >
        </React.Fragment >
    );
}
export default Dashboard;
