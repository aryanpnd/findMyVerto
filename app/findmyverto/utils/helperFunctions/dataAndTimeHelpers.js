export function getDay() {
    // sunday is false, saturaday is 5, start from monday which is 0
    const day = new Date().getDay();
    return day === 0 || day === 7 ? false : day - 1;
}

export function getCalculatedDate(days, updatedAt) {
    const currentDate = new Date();
    const updatedDate = new Date(updatedAt);
    const difference = currentDate - updatedDate;
    const daysPassed = Math.floor(difference / (1000 * 60 * 60 * 24));
    const daysLeft = days - daysPassed;

    const updateDeadline = new Date(updatedDate);
    updateDeadline.setDate(updateDeadline.getDate() + days);

    const dd = String(updateDeadline.getDate()).padStart(2, '0');
    const mm = String(updateDeadline.getMonth() + 1).padStart(2, '0');
    const yy = String(updateDeadline.getFullYear()).slice(-2);

    return {
        daysLeft: daysLeft,
        updateBefore: `${dd}-${mm}-${yy}`
    };
}


export function isTimeEqual(timeStr, areClassesOver) {
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


export function isTimeUpcoming(timeStr) {
    if (!timeStr) return false;

    // Extract period (AM/PM) and start time
    let period = timeStr.match(/[ap]m/i)?.[0].toUpperCase();
    let time = parseInt(timeStr.split("-")[0]); // e.g. "10-11 AM" gives 10

    const currentDate = new Date();
    const hours = currentDate.getHours();

    // Handle the special case for "11 to 12 PM"
    const normalizedTimeStr = timeStr.replace(/\s+/g, "").toUpperCase();
    if (/11(?:AM)?-?12PM/.test(normalizedTimeStr)) {
        // For an 11-12 PM class, consider it upcoming if current time is before 11 AM
        return hours < 11;
    }

    // Convert 12 AM to 0, and adjust PM times (except 12 PM)
    if (period === "PM" && time !== 12) {
        time += 12;
    } else if (period === "AM" && time === 12) {
        time = 0;
    }

    // Class is upcoming if the current hour is less than the class start hour
    return hours < time;
}

export function isDayEqual(dayStr) {
    // Parse the provided date string ("MM/DD/YY")
    const parts = dayStr.split('/');
    if (parts.length !== 3) return { isEqual: false, daysLeft: null }; // Invalid format

    // For MM/DD/YY, the first part is month, the second is day, and the third is year.
    const month = parseInt(parts[0], 10) - 1; // JavaScript months are 0-indexed
    const day = parseInt(parts[1], 10);
    let year = parseInt(parts[2], 10);
    year = year < 100 ? 2000 + year : year; // Convert two-digit year to four-digit year

    // Create a Date object from the input date and normalize it to midnight
    const inputDate = new Date(year, month, day);
    inputDate.setHours(0, 0, 0, 0);

    // Get today's date and normalize it to midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Calculate the difference in days between the input date and today
    const timeDiff = inputDate.getTime() - today.getTime();
    const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // Convert ms to days

    return {
        isEqual: timeDiff === 0,
        daysLeft,
    };
}
