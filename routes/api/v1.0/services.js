var express = require('express');
var router = express.Router();
var Homes = require("../../../database/collections/homes");

/*----------------CASAS---------------*/

//Registro de casas

router.post("/homes", (req, res) => {
  if (req.body.id == "") {
    res.status(400).json({
      "msn" : "formato incorrecto"
    });
    return;
  }
  var homes = {
    id: req.body.id,
    canthabit : req.body.canthabit,
    cantbaños : req.body.cantbaños,
    superficie : req.body.superficie,
    precio : req.body.precio,
    año: req.body.año,
    descripcion: req.body.descripcion
  };
  var homesData = new Homes(homes);

  homesData.save().then( () => {
    res.status(200).json({
      "msn" : "CASA REGISTRADA CON EXITO "
    });
  });
});

// muestra todas las casas
router.get("/homes", (req, res, next) => {
  Homes.find({}).exec( (error, docs) => {
    res.status(200).json(docs);
  })
});

module.exports = router;
