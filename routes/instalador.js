var express = require('express');
var router = express.Router();
const DBFactory=require("./baseDatos.js").DBFactory;

//La base de datos
let db=DBFactory("sqlite")

router.get('/', function(req, res, next) {
  db.iniciar();
  res.render('instalador',{iniciar:"block",cerrar:"none",iniciada:"none",nombre:""});
});

module.exports = router;
