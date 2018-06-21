const mongoose = require("../connect");
var mon = require('mongoose');
var Schema = mon.Schema;
var homesSchema = new Schema({
  canthabit : String,
  cantbaños : String,
  superficie : String,
  precio : Number,
  año : String,
  descripcion : String,
  direccion : String,
  lat : Number,
  lon : Number,
  gallery : Array
});
var homes = mongoose.model("homes", homesSchema);
module.exports = homes;
