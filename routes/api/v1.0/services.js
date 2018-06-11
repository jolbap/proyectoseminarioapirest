var express = require('express');
var router = express.Router();
var Homes = require("../../../database/collections/homes");

/*----------------CASAS---------------*/

//Registro de casas
router.post("/homes", (req, res) => {
  if (req.body.precio == "") {
    res.status(400).json({
      "msn" : "formato incorrecto"
    });
    return;
  }
  var homes = {
    canthabit : req.body.canthabit,
    cantbaños : req.body.cantbaños,
    superficie : req.body.superficie,
    precio : req.body.precio,
    año : req.body.año,
    descripcion : req.body.descripcion,
    direccion : req.body.direccion,
    lat : req.body.lat,
    lon : req.body.lon
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

// muestra casa por id
router.get(/homes\/[a-z0-9]{1,}$/, (req, res) => {
  var url = req.url;
  var id = url.split("/")[2];
  Homes.findOne({_id : id}).exec( (error, docs) => {
    if (docs != null) {
        res.status(200).json(docs);
        return;
    }
    res.status(200).json({
      "msn" : "No existe el recurso "
    });
  })
});
//elimina
router.delete(/homes\/[a-z0-9]{1,}$/, (req, res) => {
  var url = req.url;
  var id = url.split("/")[2];
  Homes.find({_id : id}).remove().exec( (err, docs) => {
      res.status(200).json(docs);
  });
});

module.exports = router;
