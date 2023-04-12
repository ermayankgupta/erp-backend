const mongoose = require("mongoose");

const HolidaySchema = mongoose.Schema({
  date: {
    type: Date,
    required: [true, "Date is required"],
  },
  name: {
    type: String,
    required: [true, "Holiday name is required"],
  },
});

const holidayModal = mongoose.model("holiday", HolidaySchema);

module.exports = holidayModal;
