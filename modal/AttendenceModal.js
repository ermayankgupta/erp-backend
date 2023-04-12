const mongoose = require("mongoose");

const attendenceSchema = mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: [true, "Login to identify the employee"],
  },
  date: {
    type: Date,
    required: true,
  },
  clockIn: {
    type: Date,
    required: false,
  },
  clockOut: {
    type: Date,
    required: false,
  },
  totalWorkHours: {
    type: Number,
    required: false,
  },
  overtime: {
    type: Number,
    required: false,
  },
  status: {
    type: String,
    required: true,
    enum: [
      "Absent",
      "Present",
      "HalfDay",
      "ShortLeave",
      "Weekly Off",
      "Holiday",
    ],
    default: "Absent",
  },
});

attendenceSchema.pre("save", async function (next) {
  if (this.clockIn && this.clockOut) {
    const workHour = (this.clockOut - this.clockIn) / (1000 * 60 * 60);
    this.totalWorkHours = workHour;
    if (workHour >= 9) {
      this.overtime = workHour - 9;
      this.status = "Present";
    } else if (workHour >= 6) {
      this.status = "ShortLeave";
    } else if (workHour >= 4) {
      this.status = "HalfDay";
    } else {
      this.status = "Absent";
      this.workHour = 0
    }
    next();
  }
});

const attendenceModal = mongoose.model("Attendence", attendenceSchema);

module.exports = attendenceModal;
