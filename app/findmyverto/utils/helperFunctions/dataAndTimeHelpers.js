export function getDay() {
    // sunday is false, saturaday is 5, start from monday which is 0
    const day = new Date().getDay();
    return day === 0 || day === 7 ? false : day - 1;
}

export function getCalculatedDate(days, updatedAt) {
    const currentDate = new Date();
    const updatedDate = new Date(updatedAt);
    const difference = currentDate - updatedDate;
    const daysPassed = Math.floor(difference / (1000 * 60 * 60 * 24));
    const daysLeft = days - daysPassed;

    const updateDeadline = new Date(updatedDate);
    updateDeadline.setDate(updateDeadline.getDate() + days);

    const dd = String(updateDeadline.getDate()).padStart(2, '0');
    const mm = String(updateDeadline.getMonth() + 1).padStart(2, '0'); 
    const yy = String(updateDeadline.getFullYear()).slice(-2);

    return {
        daysLeft: daysLeft,
        updateBefore: `${dd}-${mm}-${yy}`
    };
}
