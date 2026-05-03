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
export const formatTimeStampFull = (timestamp) => {
    if (!timestamp || timestamp === "-") return "-"

    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now - date
    const diffSec = Math.floor(diffMs / 1000)
    const diffMin = Math.floor(diffSec / 60)
    const diffHour = Math.floor(diffMin / 60)
    const diffDay = Math.floor(diffHour / 24)

    if (diffSec < 60) return "Just now"
    if (diffMin < 60) return `${diffMin} min ago`
    if (diffHour < 24) return `${diffHour} hr ago`

    const timeStr = date.toLocaleTimeString("en-US", {
        hour: "2-digit", minute: "2-digit", hour12: false
    })

    if (diffDay === 1) return `Yesterday, ${timeStr}`

    if (diffDay < 7) {
        const dayName = date.toLocaleDateString("en-US", { weekday: "long" })
        return `${dayName}, ${timeStr}`
    }

    const sameYear = date.getFullYear() === now.getFullYear()
    if (sameYear) {
        return date.toLocaleDateString("en-US", {
            day: "numeric", month: "short"
        }) + `, ${timeStr}`
    }

    return date.toLocaleDateString("en-US", {
        day: "numeric", month: "short", year: "numeric"
    })
}