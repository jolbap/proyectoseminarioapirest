const mongoose = require("../connect");
var homesSchema = {
  canthabit : String,
  cantbaños : String,
  superficie : String,
  precio : String,
  año : String,
  descripcion : String
};
var homes = mongoose.model("homes", homesSchema);
module.exports = homes;
