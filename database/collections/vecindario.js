const mongoose = require("../connect");
var vecindarioSchema = {
	nombrevecindario: String,
	zoom: Number,
	lat: Number,
	lng: Number,
	coordenadas:Array
};
var vecindario = mongoose.model("vecindario", vecindarioSchema);
module.exports = vecindario;
