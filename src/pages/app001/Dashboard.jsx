import React, { useState } from "react";
import RootPageCustom from "../../components/common/RootPageCustom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";


const Dashboard = () => {
    const [firstRender, setFirstRender] = useState(false)
    const [app001p01Page, setApp001p01Page] = useState(true);



    return (
        <React.Fragment>
            <RootPageCustom>
                <div className={`${app001p01Page ? "flex" : "hidden"} flex-col px-3 gap-2`}>
                    <div className="flex items-center justify-between mb-2">
                        <div>
                            <h1 className="text-xl font-semibold">Dashboard</h1>
                            <p className="text-sm text-muted-foreground">Monitor your plant pots in real-time</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">

                        <Card className="bg-blue-300/10">
                            <CardHeader>
                                <CardTitle>Anomalies Today</CardTitle>
                            </CardHeader>
                            <CardContent>
                                Test
                            </CardContent>
                        </Card>

                        <Card className="bg-green-300/10">
                            <CardHeader>
                                <CardTitle>
                                    Anomalies This Week
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                Test
                            </CardContent>
                        </Card>

                        <Card className="bg-orange-300/10">
                            <CardHeader>
                                <CardTitle>
                                    Last Detected
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                Test
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <Card className="bg-orange-300/10">
                            <CardHeader>
                                <CardTitle>
                                    Last Detected
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                Test
                            </CardContent>
                        </Card>
                    </div>

                </div>


            </RootPageCustom>
        </React.Fragment >
    );
}
export default Dashboard;
