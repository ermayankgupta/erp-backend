const mongoose = require("mongoose");

const featureAllowedSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  checkname: {
    type: String,
    required: [true, "Checkname is required"],
  },
  allowedTo: {
    type: [String],
    default: ["admin"],
    enum: ["developer", "admin", "hr", "manager", "account"],
    required: [true, "Atleast one role required"],
  },
});

const featureAllowedModal = mongoose.model(
  "featuresAllowed",
  featureAllowedSchema
);

module.exports = featureAllowedModal;
