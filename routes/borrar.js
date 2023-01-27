var express = require('express');
var router = express.Router();
var db = require("./baseDatos").db;

router.post('/', function(req, res, next) {
  //Comprobar contraseñas
  const id = req.body['id'];

  db.all('delete from entradas where id = ?',id,(err) => {
    if(err) {
      return console.error(err.message)
    } else {
      console.log("Entrada eliminada correctamente");
    }
    }
  )
  db.all("select * from entradas",(err,rows)=>{
    if (err) {
      console.log(err);
    }else{
      res.render("panel",{nombre:req.session.usuario,pass_error:"none",entradas:rows});
    }
  })
});

module.exports = router;
