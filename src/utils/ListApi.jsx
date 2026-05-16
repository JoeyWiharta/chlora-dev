import axiosInstance from "./ApiHelper";
import SseInstance from "./SseHelper";

const auth = axiosInstance("auth")
const management = axiosInstance("management")
const managementSse = SseInstance("management")

// Login and Register
export const loginApi = (res) => auth.post("/auth/login", res);
export const registerApi = (res) => auth.post("/auth/register", res);
export const logoutApi = (res) => auth.post("/auth/logout", res);

// app002 - Master User
export const getUser = (params) => management.get("/users", { params });
export const getUserDeleted = (params) => management.get("/users/deleted", { params });
export const addUser = (res) => management.post("/users", res);
export const editUser = (userId, res) => management.patch(`/users/${userId}`, res);
export const deleteUser = (userId) => management.delete(`/users/${userId}`);
export const restoreUser = (userId) => management.post(`/users/deleted/${userId}/restore`);

// app003 - Master Pot
export const getPot = (params) => management.get("/pots", { params });
export const addPot = (res) => management.post("/pots", res);
export const editPot = (potId, res) => management.patch(`/pots/${potId}`, res);
export const deletePot = (potId) => management.delete(`/pots/${potId}`);
export const getComboPot = () => management.get("/pots/list");


// app004 - Master Device
export const getDevice = (params) => management.get("/devices", { params });
export const editDevice = (deviceId, res) => management.patch(`/devices/${deviceId}`, res);
export const deleteDevice = (deviceId) => management.delete(`/devices/${deviceId}`);

// app005 - Telemetry Report
export const getTelemetryReport = (params) => management.get("/reports/telemetry", { params });

// app006 - Anommaly Report
export const getAnomalyReport = (params) => management.get("/reports/anomaly", { params });

// Notification
export const getNotication = () => management.get("/notifications")
export const updateNotificationOne = (notifId, res) => management.patch(`/notifications/${notifId}/read`, res);
export const updateNotificationAll = () => management.patch(`/notifications/read-all`);
export const subscribeNotificationSse = () => managementSse("/notifications/subscribe")

// Dashboard
export const subscribeDashboardSse = () => managementSse("/dashboard/subscribe")
export const getGraph = (params) => management.get("/dashboard/sensor-history", { params });
