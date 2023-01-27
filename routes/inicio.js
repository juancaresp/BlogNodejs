var express = require('express');
var router = express.Router();
const db = require('./baseDatos').db;

router.get('/', function (req, res, next) {
 
  if (req.session.usuario)
    res.render('blog', { titulo: 'Blog', iniciar: "none", cerrar: "block", iniciada: "block", perm: "block", nombre: req.session.usuario});
  else
    res.render('blog', { titulo: 'Blog', iniciar: "block", cerrar: "none", iniciada: "none", perm: "none", nombre: ""});
})

module.exports = router;
