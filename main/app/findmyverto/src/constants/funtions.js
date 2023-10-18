export default function isTimeEqual(timeStr) {
    let period = timeStr.match(/[ap]m/i)[0];
    let time = timeStr.split("-")[0]
    if (period === "pm" && time < 12) {
        time = parseInt(time) + 12;
    } else if (period === "am" && time == 12) {
        time = 0;
    }

    const currentDate = new Date();
    const hours = currentDate.getHours();
    const isEqual = hours==parseInt(time)
    return isEqual;
}
