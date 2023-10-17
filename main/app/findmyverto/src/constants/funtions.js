export default function isTimeEqual(time) {
    const currentDate = new Date();
    const hours = currentDate.getHours();
    const hours12 = (hours % 12) || 12;
    const curTime = time.split("-")[0]
    const isEqual = hours12==parseInt(curTime)
    return isEqual;
}
