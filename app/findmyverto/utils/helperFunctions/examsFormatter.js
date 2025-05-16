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
    return new Date(year, months[mon], parseInt(day, 10));
  }

  function formatDate(date) {
    const monthsArr = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    const day = String(date.getDate()).padStart(2, '0');
    const mon = monthsArr[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${mon} ${year}`;
  }

  const oneDay = 24 * 60 * 60 * 1000;
  const newArray = [];

  // 1. Insert gap before the first exam (from today until first exam)
  if (exams.length > 0) {
    const firstExamDate = parseDate(exams[0].date);
    const today = new Date();
    const diffDays = Math.floor((firstExamDate - today) / oneDay);
    if (diffDays > 0) {
      newArray.push({
        beginGap: true,
        gap: diffDays.toString()
      });
    }
  }

  // 2. Push each exam and gaps between exams
  for (let i = 0; i < exams.length; i++) {
    // Push the exam object
    newArray.push(exams[i]);

    // If there's a next exam, calculate the gap to it
    if (i < exams.length - 1) {
      const currentDate = parseDate(exams[i].date);
      const nextDate = parseDate(exams[i + 1].date);
      const diffDays = Math.round((nextDate - currentDate) / oneDay);

      if (diffDays > 1) {
        const gapDays = diffDays - 1;
        const toDate = new Date(nextDate.getTime() - oneDay);
        newArray.push({
          from: exams[i].date,
          gap: gapDays.toString(),
          to: formatDate(toDate)
        });
      }
    }
  }

  return newArray;
}
