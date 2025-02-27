export default function formatExams(exams) {
  const months = {
    "Jan": 0,
    "Feb": 1,
    "Mar": 2,
    "Apr": 3,
    "May": 4,
    "Jun": 5,
    "Jul": 6,
    "Aug": 7,
    "Sep": 8,
    "Oct": 9,
    "Nov": 10,
    "Dec": 11
  };

  function parseDate(dateStr) {
    const [day, mon, year] = dateStr.split(" ");
    const month = months[mon];
    return new Date(year, month, day);
  }

  function formatDate(date) {
    const monthsArr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const day = String(date.getDate()).padStart(2, '0');
    const mon = monthsArr[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${mon} ${year}`;
  }

  const oneDay = 24 * 60 * 60 * 1000; 
  const newArray = [];

  for (let i = 0; i < exams.length; i++) {
    newArray.push(exams[i]);

    if (i < exams.length - 1) {
      const currentDate = parseDate(exams[i].date);
      const nextDate = parseDate(exams[i + 1].date);
      const diffDays = Math.round((nextDate - currentDate) / oneDay);

      if (diffDays > 1) {
        const gapDays = diffDays - 1;
        const toDate = new Date(nextDate.getTime() - oneDay);
        const gapObj = {
          gap: gapDays.toString(),
          from: exams[i].date,        
          to: formatDate(toDate)      
        };
        newArray.push(gapObj);
      }
    }
  }

  return newArray;
}