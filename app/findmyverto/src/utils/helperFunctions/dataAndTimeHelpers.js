export default function getDay() {
    // Get the current day from the weekdays only monday to saturday, monday is 0 and saturday is 5
    // If the day is Sunday, return false
    const day = new Date().getDay();
    return day === 0 || day === 7 ? false : day - 1;
}
