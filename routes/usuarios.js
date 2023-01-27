var express = require('express');
var router = express.Router();
const db  = require('./baseDatos').db;
const hash = require('pbkdf2-password')()

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render("usuarios",{nombre:req.session.usuario,pass_error:"none"});
});

router.post('/', function(req, res, next) {
    //Comprobar contraseñas
    let mode=req.body["mode"];
    if(mode==="2"){
      const usu= req.body['usu2']
      const pass1 = req.body['pass21']
      const pass2 = req.body['pass22']
      if(pass1!=pass2) {
        res.render("usuarios",{nombre:req.session.usuario,pass_error:"block"});
      }else{
        hash({password:pass1},function(err, pass, salt, hash){
          if(err)
            console.log("Error actualizando contraseña");
          else{
            db.all('Update usuarios set pass_hash=?, pass_salt=? where usuario=?',hash, salt, usu,(err) => {
              if(err) {
                res.render("usuarios",{nombre:req.session.usuario,pass_error:"block"});
                return console.error(err.message)
              } else {
                console.log('Contraseña Actualizada')
                res.render("usuarios",{nombre:req.session.usuario,pass_error:"none"})
              }
            })
          }
        })
      }
    }else if(mode==="1"){
      const usu= req.body['usu1']
      const pass1 = req.body['pass11']
      const pass2 = req.body['pass12']
      if(pass1!=pass2) {
        res.render("usuarios",{nombre:req.session.usuario,pass_error:"block"});
      }else{
        hash({password:pass1},function(err, pass, salt, hash){
          if(err){
            res.render("usuarios",{nombre:req.session.usuario,pass_error:"block"});
          }else{
            db.all('insert into usuarios (usuario, pass_hash, pass_salt) values(?,?,?)',usu, hash, salt,
                (err) => {
                    if(err) {
                  return console.error(err.message)
                } else {
                  res.render("usuarios",{nombre:req.session.usuario,pass_error:"none"})
                }
              }
            ) 
          }
        })
      }
    }else if(mode==="3"){
      const usu= req.body['usu3']
      db.all('delete from usuarios where usuario = ?',usu,(err) => {
        if(err) {
          res.render("usuarios",{nombre:req.session.usuario,pass_error:"block"});
        } else {
          console.log("Usuario eliminado correctamente");
          res.render("usuarios",{nombre:req.session.usuario,pass_error:"none"})
        }
        }
      )
    }
    
});

module.exports = router