const mongoose = require("mongoose");
const { Schema } = mongoose;

const studentschema = new Schema({
  photoURL: { type: String },
  name: { type: String },
  registrationNumber: { type: String, required: [true, "Registration Number required"], unique: [true, "Registration Number already exists"] },
  password: { type: String, required: [true, "Password required"] },
  rollNo: { type: String },
  term: { type: String },
  section: { type: String },
  group: { type: String },
  program: { type: String },
  attendance: { type: String },
  friends: [{
    type: Schema.Types.ObjectId,
    ref: 'Student'
  }],
  friendRequests: [{
    type: Schema.Types.ObjectId,
    ref: 'Student'
  }],
  sentFriendRequests: [{
    type: Schema.Types.ObjectId,
    ref: 'Student'
  }],
});

const Student = mongoose.model("Student", studentschema);
// -------------------------------------------------------------------------

module.exports = { Student };
