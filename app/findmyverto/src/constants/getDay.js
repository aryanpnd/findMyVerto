export default function getDay(setDay) {
    const currentDate = new Date();
    setDay(currentDate.getDay())
}
