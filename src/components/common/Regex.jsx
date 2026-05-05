export const capitalizeWords = (text = "") => {
    if (!text) return "";
    return text
        .toLowerCase()
        .split(/[\s_]+/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
};

export const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-US", {
        month: "long",
        day: "2-digit",
        year: "numeric",
    });
};

// Formatter for timezone raw
export const formatTimeStamp = (isoString) => {
    if (!isoString) return ""
    const date = new Date(isoString)
    if (isNaN(date)) return ""

    const pad = (n) => String(n).padStart(2, "0")
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

//  Formatter for full day
export const formatTimeStampFull = (timestamp, _tick) => {
    if (!timestamp || timestamp === "-") return "-"

    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now - date
    const diffSec = Math.floor(diffMs / 1000)
    const diffMin = Math.floor(diffSec / 60)
    const diffHour = Math.floor(diffMin / 60)
    const diffDay = Math.floor(diffHour / 24)
    const diffYear = Math.floor(diffDay / 365)

    if (diffSec < 60) return "Just now"
    if (diffMin < 60) return `${diffMin} min ago`
    if (diffHour < 24) return `${diffHour} hr ago`

    if (diffDay === 1) return "Yesterday"

    if (diffYear >= 1) return `${diffYear} yr ago`

    return date.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short"
    })
}