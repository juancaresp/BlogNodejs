var express = require('express');
const { request } = require('../app');
var router = express.Router();
var db = require("./baseDatos").db;

router.post('/', function (req, res, next) {
  if (req.body["id"] != "-1") {

    let id = req.body["id"];

    db.all('select * from entradas where id = ?', id, (err, rows) => {
      if (err) {
        return console.error(err.message)
      } else {
        if (rows.length > 0) {

          let row = rows[0];
          let f=new Date(row.fecha);
          
          //Vaya fechita
          let fech = f.getFullYear()+"-"+(f.getMonth()+1)+"-"+(f.getDate()<10?"0"+f.getDate():f.getDate());
          console.log(fech);
          res.render("editar", {title:"Editar Entrada",nombre: req.session.usuario, id: req.body["id"], titulo: row.titulo, texto: row.texto, fecha:fech });

        }
      }
    }
    )
  } else {
    let f=new Date(Date.now());
    //Vaya fechita
    let fech = f.getFullYear()+"-"+(f.getMonth()+1)+"-"+(f.getDate()<10?"0"+f.getDate():f.getDate());
    res.render('editar', {title:"Crear Entrada",nombre: req.session.usuario, id: "-1", titulo: "", texto: "", fecha: fech});
  }
});

module.exports = router;
