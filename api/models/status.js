let mongoose = require("mongoose");

let statusSchema = mongoose.Schema({
  alternateParking: {
    type: Boolean,
    required: true
  },
  timestamp: {
    type: Date,
    required: true
  },
  streetSide: {
    type: String,
    required: true
  },
  expirationDate: {
    type: Date,
    require: true
  }
});

let Status = (module.exports = mongoose.model("Status", statusSchema));
