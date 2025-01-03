export default function formatTimetableToClasses(ttToFormat) {
    if(ttToFormat){
        const today = new Date();
        const dayIndex = (today.getDay() + 6) % 7;
        // const dayIndex = (today.getDay() + 5) % 7;
        const tt = Object.entries(ttToFormat)[dayIndex][1]
        const classes = Object.entries(tt).filter(([_, value]) => value.length > 1)
        return classes
    }else{
        return
    }
}