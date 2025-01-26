import mongoose from "mongoose";
const { Schema } = mongoose;

const studentTimeTableSchema = new Schema({
  data: {
    time_table: {
      Monday: { type: Map, of: String },
      Tuesday: { type: Map, of: String },
      Wednesday: { type: Map, of: String },
      Thursday: { type: Map, of: String },
      Friday: { type: Map, of: String },
      Saturday: { type: Map, of: String },
      Sunday: { type: Map, of: String }
    },
    courses: {
      type: Map,
      of: {
        course_type: String,
        course_title: String,
        lectures: String,
        tutorials: String,
        practical: String,
        credits: String,
        faculty_name: String,
        cabin: String,
        last_updated: String
      }
    },
    section: { type: String },
    last_updated: { type: String },
    registration_number: { type: String }
  },
  section: { type: String },
  last_updated: { type: String },
  lastSync: { type: Date },
  reg_no: { type: String }
});

export const TimeTable = mongoose.model("TimeTable", studentTimeTableSchema);
