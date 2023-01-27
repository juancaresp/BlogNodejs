var express = require('express');
var router = express.Router();
var db = require("./baseDatos").db;

/* GET users listing. */
router.get('/', function(req, res, next) {
  
});
router.post('/', function(req, res, next) {
  //Comprobar contraseñas
  const id = req.body['id'];
  const titulo = req.body['titulo']
  const texto = req.body['texto']
  const fech = req.body['fecha']
  const fecha =new Date(fech).getTime();
  
  console.log(fecha);
  if(id!="-1"){
    db.all('update entradas set titulo=?,texto=?,fecha=? where id = ?',titulo,texto,fecha,id,(err) => {
      if(err) {
        return console.error(err.message)
      } else {
        console.log("Entrada actualizada correctamente");
      }
      }
    )
  }else{
    db.all('Insert into entradas (titulo,texto,fecha) values(?,?,?);',titulo,texto,fecha,(err) => {
      if(err) {
        return console.error(err.message)
      } else {
        console.log("Entrada agregada correctamente");
      }
      }
    )
  }
  
  db.all("select * from entradas",(err,rows)=>{
    if (err) {
      console.log(err);
    }else{
      res.render("panel",{nombre:req.session.usuario,pass_error:"none",entradas:rows});
    }
  })

});

module.exports = router;
