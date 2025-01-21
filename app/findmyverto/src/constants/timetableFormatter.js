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
                        const classList = classes?.split(', ').map(classString => {
                            const regex = /(\w+) \/ G:(\w+) C:(\w+) \/ R: (\S+) \/ S:(\S+)/;
                            const match = classString?.match(regex);
                            if (match) {
                                return {
                                    type: match[1],
                                    group: match[2],
                                    class: match[3],
                                    className: courses[match[3]] ? courses[match[3]].course_title : match[3],
                                    room: match[4],
                                    section: match[5]
                                };
                            }
                            return null;
                        }).filter(Boolean);
                        return {
                            time,
                            class: classList
                        };
                    });
                formattedTimetable = addBreaksToSchedule(classes);
            }
        } else {
            formattedTimetable = Object.fromEntries(
                Object.entries(ttToFormat).map(([day, schedule]) => {
                    const dailyClasses = Object.entries(schedule)
                        .filter(([_, value]) => value.length > 1)
                        .map(([time, classes]) => {
                            const classList = classes.split(', ').map(classString => {
                                const regex = /(\w+) \/ G:(\w+) C:(\w+) \/ R: (\S+) \/ S:(\S+)/;
                                const match = classString.match(regex);
                                if (match) {
                                    return {
                                        type: match[1],
                                        group: match[2],
                                        class: match[3],
                                        className: courses[match[3]] ? courses[match[3]].course_title : match[3],
                                        room: match[4],
                                        section: match[5]
                                    };
                                }
                                return null;
                            }).filter(Boolean);
                            return {
                                time,
                                class: classList
                            };
                        });
                    return [day, addBreaksToSchedule(dailyClasses)];
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