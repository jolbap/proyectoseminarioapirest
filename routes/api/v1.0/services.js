var express = require('express');

var multer = require('multer');

var router = express.Router();

var fs = require('fs');

var Homes = require("../../../database/collections/homes");
var Img = require("../../../database/collections/img");
var Escuelas = require("../../../database/collections/escuelas");
var Vecindario = require("../../../database/collections/vecindario");

var storage = multer.diskStorage({
  destination: "./public/casasimg",
  filename: function (req, file, cb) {
    console.log("-------------------------");
    console.log(file);
    cb(null, "IMG_" + Date.now() + ".jpg");
  }
});
var upload = multer({
  storage: storage
}).single("img");;


/*----------------IMAGENES CASAS---------------*/

//Registro de fotos de casas
router.post(/homeimg\/[a-z0-9]{1,}$/, (req, res) => {
  var url = req.url;
  var id = url.split("/")[2];
  upload(req, res, (err) => {
    if (err) {
      res.status(500).json({
        "msn" : "No se ha podido subir la imagen"
      });
    } else {
      var ruta = req.file.path.substr(6, req.file.path.length);
      console.log(ruta);
      var img = {
        idhome: id,
        name : req.file.originalname,
        physicalpath: req.file.path,
        relativepath: "http://localhost:7777" + ruta
      };
      var imgData = new Img(img);
      imgData.save().then( (infoimg) => {
        //content-type
        //Update User IMG
        var homes = {
          gallery: new Array()
        }
        Homes.findOne({_id:id}).exec( (err, docs) =>{
          //console.log(docs);
          var data = docs.gallery;
          var aux = new  Array();
          if (data.length == 1 && data[0] == "") {
            homes.gallery.push("/api/v1.0/homeimg/" + infoimg._id)
          } else {
            aux.push("/api/v1.0/homeimg/" + infoimg._id);
            data = data.concat(aux);
            homes.gallery = data;
          }
          Homes.findOneAndUpdate({_id : id}, homes, (err, params) => {
              if (err) {
                res.status(500).json({
                  "msn" : "error en la actualizacion del usuario"
                });
                return;
              }
              res.status(200).json(
                req.file
              );
              return;
          });
        });
      });
    }
  });
});

//Muestra img por id
router.get(/homeimg\/[a-z0-9]{1,}$/, (req, res) => {
  var url = req.url;
  var id = url.split("/")[2];
  console.log(id)
  Img.findOne({_id: id}).exec((err, docs) => {
    if (err) {
      res.status(500).json({
        "msn": "Sucedio algun error en el servicio"
      });
      return;
    }
    //regresamos la imagen deseada
    var img = fs.readFileSync("./" + docs.physicalpath);
    //var img = fs.readFileSync("./public/avatars/img.jpg");
    res.contentType('image/jpeg');
    res.status(200).send(img);
  });
});

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
    nombrevecindario : req.body.nombrevecindario,
    canthabit : req.body.canthabit,
    cantbaños : req.body.cantbaños,
    superficie : req.body.superficie,
    precio : req.body.precio,
    año : req.body.año,
    descripcion : req.body.descripcion,
    direccion : req.body.direccion,
    lat : req.body.lat,
    lon : req.body.lon,
    gallery : ""
  };
  var homesData = new Homes(homes);

  homesData.save().then( (rr) => {
    res.status(200).json({
      "id" : rr._id,
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

/*
// muestra casa por palabra
router.get(/homes\/[a-z]{3}/, (req, res) => {
  var url = req.url;
  var direccion = url.split("/")[2];
  Homes.find({direccion : direccion}).exec( (error, docs) => {
    if (docs != null) {
        res.status(200).json(docs);
        return;
    }
    res.status(200).json({
      "msn" : "No existe el recurso "
    });
  })
});
router.post('/homess', function(req, res, next) {

  var wordkey = req.body.direccion;
  var expreg = new RegExp(wordkey);
  var result = Homes.filter((key) => {
    if (key.search(expreg) > -1) {
      return true
    }
    return false;
  });
  res.send(
    {
      "wordkey" : wordkey,
      "result" : result
    });
});
*/

// actualiza datos de casas
router.patch(/homes\/[a-z0-9]{1,}$/, (req, res) => {
  var url = req.url;
  var id = url.split("/")[2];
  var keys = Object.keys(req.body);
  var homes = {};
  for (var i = 0; i < keys.length; i++) {
    homes[keys[i]] = req.body[keys[i]];
  }
  console.log(homes);
  Homes.findOneAndUpdate({_id: id}, homes, (err, params) => {
      if(err) {
        res.status(500).json({
          "msn": "Error no se pudo actualizar los datos"
        });
        return;
      }
      res.status(200).json(params);
      return;
  });
});

//elimina casas
router.delete(/homes\/[a-z0-9]{1,}$/, (req, res) => {
  var url = req.url;
  var id = url.split("/")[2];
  Homes.find({_id : id}).remove().exec( (err, docs) => {
      res.status(200).json(docs);
  });
});

/*----------------VECINDARIOS---------------*/

//Registro de vecindario
router.post("/vecindario", (req, res) => {
  var vecindario = {
    nombrevecindario :  req.body.nombrevecindario,
    zoom  :  req.body.zoom,
    lat : req.body.lat,
    lng : req.body.lng,
    coordenadas : req.body.coordenadas,
  };
  var vecindarioData = new Vecindario(vecindario);
  vecindarioData.save().then( (doc) => {
    console.log('post req');
    res.status(200).json({
      "msn" : "vecindario Registrado con exito ",
      "doc" : doc._id
    });
  }).catch(err => {
    res.status(500).json({
      error : err
    });
  });
});

// muestra todos los vecindarios
router.get("/vecindario", (req, res, next) => {
  Vecindario.find({}).exec( (error, docs) => {
    if (error) {
      res.status(500).json({error : error});
      return;
    }
    res.status(200).json(docs);
  })

});

// muestra un vecindario por id
router.get(/vecindario\/[a-z0-9]{1,}$/, (req, res) => {
  var url = req.url;
  var id = url.split("/")[2];
  Vecindario.findOne({_id : id}).exec( (error, docs) => {
    if (docs != null) {
        res.status(200).json(docs);
        return;
    }
    res.status(200).json({
      "msn" : "No existe el ingrediente"
    });
  })
});
//cad.splt(' ').join('-');
//elimina vecindarios
router.delete(/vecindario\/[a-z0-9]{1,}$/, (req, res) => {
  var url = req.url;
  var id = url.split("/")[2];
  Vecindario.find({_id : id}).remove().exec( (err, docs) => {
      res.status(200).json(docs);
  });
});

/*----------------ESCUELAS---------------*/

//Registro de escuelas
router.post("/escuelas", (req, res) => {
  if (req.body.escuelanombre == "") {
    res.status(400).json({
      "msn" : "formato incorrecto"
    });
    return;
  }
  var escuelas = {
    escuelanombre : req.body.escuelanombre,
    late : req.body.late,
    lone : req.body.lone
  };
  var escuelasData = new Escuelas(escuelas);

  escuelasData.save().then( (rr) => {
    res.status(200).json({
      "id" : rr._id,
      "msn" : "CASA REGISTRADA CON EXITO "
    });
  });
});

// muestra todas las escuelas
router.get("/escuelas", (req, res, next) => {
  Escuelas.find({}).exec( (error, docs) => {
    res.status(200).json(docs);
  })
});

//elimina escuelas
router.delete(/escuelas\/[a-z0-9]{1,}$/, (req, res) => {
  var url = req.url;
  var id = url.split("/")[2];
  Escuelas.find({_id : id}).remove().exec( (err, docs) => {
      res.status(200).json(docs);
  });
});

module.exports = router;
