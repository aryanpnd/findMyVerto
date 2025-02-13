export const availableFieldsToShow = {
  "attendance": { icon: require("../../assets/icons/attendance.png"), title: "Attendance" },
  "timetable": { icon: require("../../assets/icons/schedule.png"), title: "Timetable" },
  "marks": { icon: require("../../assets/icons/marks.png"), title: "Marks" },
  "cgpa": { icon: require("../../assets/icons/cgpa.png"), title: "CGPA" },
}

export const homeScreenNavigations = [
  {
    title: "Friends",
    icon: require('../../assets/icons/friends.png'),
    route: "Friends",
    development: false
  },
  {
    title: "Timetable",
    icon: require('../../assets/icons/schedule.png'),
    route: "Timetable",
    development: false
  },
  {
    title: "Marks",
    icon: require('../../assets/icons/marks.png'),
    route: "Marks",
    development: false
  },
  {
    title: "CGPA",
    icon: require('../../assets/icons/cgpa.png'),
    route: "CGPA",
    development: false
  },
  {
    title: "Exams",
    icon: require('../../assets/icons/exam.png'),
    route: "Exams",
    development: true
  },
  {
    title: "Assignments",
    icon: require('../../assets/icons/assignment.png'),
    route: "Assignments",
    development: true
  },
  {
    title: "My Messages",
    icon: require('../../assets/icons/myMessages.png'),
    route: "MyMessages",
    development: true
  },
  {
    title: "Leave Slip",
    icon: require('../../assets/icons/leaveSlip.png'),
    route: "LeaveSlip",
    development: true
  },
  {
    title: "My Drives",
    icon: require('../../assets/icons/interview.png'),
    route: "MyDrives",
    development: true
  },
]