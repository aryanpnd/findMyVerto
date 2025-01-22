export default function formatTimeAgo(lastSynced) {
    const currentDate = new Date();
    const syncDate = new Date(lastSynced);

    const timeDifference = currentDate - syncDate;
    const minutesAgo = Math.floor(timeDifference / (1000 * 60));
    const hoursAgo = Math.floor(minutesAgo / 60);
    const daysAgo = Math.floor(hoursAgo / 24);
    const monthsAgo = Math.floor(daysAgo / 30);

    if (monthsAgo > 0) {
        return `${monthsAgo} month${monthsAgo > 1 ? 's' : ''} ago`;
    } else if (daysAgo > 0) {
        return `${daysAgo} day${daysAgo > 1 ? 's' : ''} ago`;
    } else if (hoursAgo > 0) {
        return `${hoursAgo} hour${hoursAgo > 1 ? 's' : ''} ago`;
    } 
    else if (minutesAgo>0){
        return `${minutesAgo} minute${minutesAgo > 1 ? 's' : ''} ago`;
    }
    else {
        return "Just now";
    }

}
