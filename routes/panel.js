var express = require('express');
var router = express.Router();
const DBFactory  = require('./baseDatos').DBFactory;
const perm = require('../permissions')

//La base de datos
let db=DBFactory("sqlite")

/* GET users listing. */
router.get('/', function(req, res, next) {
  if(req.session.usuario) {
    res.render("panel",{nombre:req.session.usuario,pass_error:"none",usua:req.session.permiso});
  }else{
    res.redirect("/");
  }
});

router.post('/', function(req, res, next) {
    //Comprobar contraseñas
    const pass1 = req.body['pass1']
    const pass2 = req.body['pass2']
    if(pass1!=pass2) {
      res.render("panel",{nombre:req.session.usuario,pass_error:"block",usua:req.session.permiso});
    }else{
      db.updatePassword(req.session.usuario,pass1, req.session.permiso,(err)=>{
        if(!err){
          console.log('Contraseña Actualizada')
          res.render("panel",{nombre:req.session.usuario,pass_error:"none",usua:req.session.permiso});
        }else{
          res.render("panel",{nombre:req.session.usuario,pass_error:"block",usua:req.session.permiso});
        }
      })
    }
});

module.exports = router