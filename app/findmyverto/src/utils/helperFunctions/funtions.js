export default function isTimeEqual(timeStr, areClassesOver) {
    if (!timeStr) return false;

    // Extract period (AM/PM) and start time
    let period = timeStr.match(/[ap]m/i)?.[0].toUpperCase(); // Ensure consistent casing
    let time = parseInt(timeStr.split("-")[0]); // Convert to number safely

    const currentDate = new Date();
    const hours = currentDate.getHours();

    // Check for all combinations of "11 to 12 PM"
    const normalizedTimeStr = timeStr.replace(/\s+/g, "").toUpperCase();
    if (/11(?:AM)?-?12PM/.test(normalizedTimeStr)) {
        const hours = new Date().getHours();
        return hours >= 11 && hours < 12;
    }

    // Convert 12 AM to 0 (midnight), and PM times to 24-hour format
    if (period === "PM" && time !== 12) {
        time += 12; // Convert 1 PM to 13, 2 PM to 14, etc.
    } else if (period === "AM" && time === 12) {
        time = 0; // Convert 12 AM to 0
    }

    const isEqual = areClassesOver ? hours > time : hours === time;
   
    return isEqual;
}
