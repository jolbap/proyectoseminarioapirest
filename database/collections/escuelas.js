const mongoose = require("../connect");
var mon = require('mongoose');
var Schema = mon.Schema;
var escuelasSchema = new Schema({
  escuelanombre : String,
  late : Number,
  lone : Number
});
var escuelas = mongoose.model("escuelas", escuelasSchema);
module.exports = escuelas;
