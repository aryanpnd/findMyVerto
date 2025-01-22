export default function isTimeEqual(timeStr, areClassesOver) {
    let period = timeStr?.match(/[ap]m/i)[0];
    let time = timeStr?.split("-")[0]
    if (period === "PM" && time < 12) {
        time = parseInt(time) + 12;
    } else if (period === "AM" && time == 12) {
        time = 0;
    }

    const currentDate = new Date();
    const hours = currentDate.getHours();
    const isEqual = areClassesOver ? hours > parseInt(time) : hours == parseInt(time)

    return isEqual;
}
