var express = require('express');
var router = express.Router();
const db  = require('./baseDatos').db;
const hash = require('pbkdf2-password')()

/* GET users listing. */
router.get('/', function(req, res, next) {
  db.all("select * from entradas",(err,rows)=>{
    if (err) {
      console.log(err);
    }else{
      res.render("panel",{nombre:req.session.usuario,pass_error:"none",entradas:rows});
    }
  })
  
});

router.post('/', function(req, res, next) {
  db.all("select * from entradas",(err,rows)=>{
    if (err) {
      console.log(err);
    }else{
    //Comprobar contraseñas
    const pass1 = req.body['pass1']
    const pass2 = req.body['pass2']
    if(pass1!=pass2) {
      res.render("panel",{nombre:req.session.usuario,pass_error:"block",entradas:rows});
    }else{
      hash({password:pass1},function(err, pass, salt, hash){
        if(err)
          console.log("Error actualizando contraseña");
        else{
          db.all('Update usuarios set pass_hash=?, pass_salt=? where usuario=?',hash, salt, req.session.usuario,(err) => {
            if(err) {
              return console.error(err.message)
            } else {
              console.log('Contraseña Actualizada')
              res.render("panel",{nombre:req.session.usuario,pass_error:"none",entradas:rows})
            }
          })
        }
      })
    }
  }
  })
});

module.exports = router