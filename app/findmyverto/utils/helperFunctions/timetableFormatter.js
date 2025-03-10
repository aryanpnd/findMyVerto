export default function formatTimetable(ttToFormat, courses = {}, formatToClasses = false) {
    let formattedTimetable = {};
    if (ttToFormat && Object.keys(ttToFormat).length > 0) {
        if (formatToClasses) {
            const today = new Date();
            const dayIndex = (today.getDay() + 6) % 7;
            const ttEntries = Object.entries(ttToFormat);

            if (ttEntries[dayIndex] && ttEntries[dayIndex][1]) {
                const tt = ttEntries[dayIndex][1];
                const classes = Object.entries(tt)
                    .filter(([_, value]) => value.length > 1)
                    .map(([time, classes]) => {
                        const classList = classes.split(', ').map(classString => {
                            // Update the regex to allow spaces and parentheses in the room field.
                            const regex = /(\w+)\s*\/\s*G:(\w+)\s*C:(\w+)\s*\/\s*R:\s*([^\/]+)\s*\/\s*S:(\S+)/;
                            const match = classString.match(regex);

                            if (match) {
                                // Process the room field.
                                const roomInfo = cleanRoom(match[4]);

                                return {
                                    type: match[1],
                                    group: match[2],
                                    class: match[3],
                                    className: courses[match[3]] ? courses[match[3]].course_title : match[3],
                                    room: roomInfo.cleaned,       // cleaned room string
                                    section: match[5],
                                    makeup: roomInfo.makeup       // new field indicating a makeup class
                                };
                            }
                            return null;
                        }).filter(Boolean);
                        return {
                            time,
                            class: classList
                        };
                    });
                formattedTimetable = classes.length ? addBreaksToSchedule(classes) : [{}];
            } else {
                formattedTimetable = [{}];
            }
        } else {
            formattedTimetable = Object.fromEntries(
                Object.entries(ttToFormat).map(([day, schedule]) => {
                    const dailyClasses = Object.entries(schedule)
                        .filter(([_, value]) => value.length > 1)
                        .map(([time, classes]) => {
                            const classList = classes.split(', ').map(classString => {
                                // Update the regex to allow spaces and parentheses in the room field.
                                const regex = /(\w+)\s*\/\s*G:(\w+)\s*C:(\w+)\s*\/\s*R:\s*([^\/]+)\s*\/\s*S:(\S+)/;
                                const match = classString.match(regex);

                                if (match) {
                                    // Process the room field.
                                    const roomInfo = cleanRoom(match[4]);

                                    return {
                                        type: match[1],
                                        group: match[2],
                                        class: match[3],
                                        className: courses[match[3]] ? courses[match[3]].course_title : match[3],
                                        room: roomInfo.cleaned,       // cleaned room string
                                        section: match[5],
                                        makeup: roomInfo.makeup       // new field indicating a makeup class
                                    };
                                }
                                return null;
                            }).filter(Boolean);
                            return {
                                time,
                                class: classList
                            };
                        });
                    return [day, dailyClasses.length ? addBreaksToSchedule(dailyClasses) : [{}]];
                })
            );
        }
    }
    return formattedTimetable;
}


function addBreaksToSchedule(data) {
    // Helper function to convert time string to minutes
    function timeToMinutes(timeStr) {
        let [range, period] = timeStr.split(' ');
        let [start, end] = range.split('-');

        const convert = (t) => {
            let [hour, minute] = t.split(':').map(Number);
            if (period.includes('PM') && hour !== 12) hour += 12;
            if (period.includes('AM') && hour === 12) hour = 0;
            return hour * 60 + (minute || 0);
        };
        return [convert(start), convert(end)];
    }

    // Sort the data by start time
    data.sort((a, b) => timeToMinutes(a.time)[0] - timeToMinutes(b.time)[0]);

    let result = [];
    for (let i = 0; i < data.length - 1; i++) {
        result.push(data[i]);
        let [, end] = timeToMinutes(data[i].time);
        let [nextStart] = timeToMinutes(data[i + 1].time);

        // If there is a gap, insert a break
        if (nextStart > end) {
            let startHour = data[i].time.split('-')[1].split(" ")[0];
            let endHour = data[i + 1].time.split('-')[0];
            if (startHour !== endHour) {
                let currentPeriod = data[i + 1].time.split(' ')[1];
                result.push({ time: `${startHour}-${endHour} ${currentPeriod}`, break: true });
            }
        }
    }

    result.push(data[data.length - 1]); // Add the last class
    return result;
}


function cleanRoom(roomStr) {
    let makeup = false;
    let cleaned = roomStr.trim();

    // This regex looks for text inside parentheses that contains "Makeup Class"
    const makeupRegex = /\(\s*(.*?)\s*Makeup Class\s*\)/i;
    if (makeupRegex.test(cleaned)) {
        makeup = true;
        // Replace the whole "( ... Makeup Class )" with "(...)" where "..." is trimmed content.
        cleaned = cleaned.replace(/\(\s*([^)]*?)\s*Class\s*\)/i, '($1)');
    }

    return { cleaned, makeup };
}


// The following function is used to count the number of classes for today.
export function formatClassesToday(timetable, todayOnly) {
    if (todayOnly) {
        // Return the count of classes for today (excluding breaks)
        return timetable.filter(item => !item.break && item.class).length;
    } else {
        const daysOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

        // Return an array of counts for each day
        return daysOrder.map(day => {
            const daySchedule = timetable[day] || [];
            const classesForDay = daySchedule.filter(item => !item.break && item.class);
            return classesForDay.length;
        });
    }
}


export function filterOutdatedMakeup(makeupClasses) {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today's date
    return makeupClasses?.length>0 ? makeupClasses?.filter(item => {
        const parts = item.scheduledDate.split('/');
        if (parts.length !== 3) return false; // Skip if the format is invalid

        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; // Month is zero-indexed
        let year = parseInt(parts[2], 10);
        // Convert two-digit year to four digits (e.g., "25" becomes 2025)
        year = year < 100 ? 2000 + year : year;
        const classDate = new Date(year, month, day);
        classDate.setHours(0, 0, 0, 0);
        // Keep only classes scheduled for today or in the future.
        return classDate >= today;
    }) : [];
}