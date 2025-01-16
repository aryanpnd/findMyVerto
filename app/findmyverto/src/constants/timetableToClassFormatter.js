export default function formatTimetableToClasses(ttToFormat) {
    if (ttToFormat && Object.keys(ttToFormat).length > 0) {
        const today = new Date();
        const dayIndex = (today.getDay() + 6) % 7;
        const ttEntries = Object.entries(ttToFormat);
        
        if (ttEntries[dayIndex] && ttEntries[dayIndex][1]) {
            const tt = ttEntries[dayIndex][1];
            const classes = Object.entries(tt).filter(([_, value]) => value.length > 1);
            return classes;
        } else {
            return [];
        }
    } else {
        return [];
    }
}