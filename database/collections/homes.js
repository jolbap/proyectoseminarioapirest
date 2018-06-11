const mongoose = require("../connect");
var homesSchema = {
  canthabit : String,
  cantbaños : String,
  superficie : String,
  precio : Number,
  año : String,
  descripcion : String,
  direccion : String,
  lat : Number,
  lon : Number
};
var homes = mongoose.model("homes", homesSchema);
module.exports = homes;
