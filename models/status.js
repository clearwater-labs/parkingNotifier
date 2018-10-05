let mongoose = require("mongoose");

let statusSchema = mongoose.Schema({
  alternateParking: {
    type: Boolean,
    required: true
  }
});

let Status = (module.exports = mongoose.model("Status", statusSchema));
