var express = require('express');
var router = express.Router();
const db=require("./baseDatos.js");

router.get('/', function(req, res, next) {
  db.iniciardb();
  res.render('instalador',{iniciar:"block",cerrar:"none",iniciada:"none",nombre:""});
});

module.exports = router;
