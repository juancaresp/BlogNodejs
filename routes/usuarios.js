var express = require('express');
var router = express.Router();
const DBFactory  = require('./baseDatos').DBFactory;

//La base de datos
let db=DBFactory("sqlite")

/* GET users listing. */
router.get('/', function(req, res, next) {
  db.usuarios((rows)=>{
    res.render("usuarios",{nombre:req.session.usuario,pass_error:"none",usuarios:rows});
  })
});

router.post('/', function(req, res, next) {
    //Comprobar contraseñas
    db.usuarios((rows)=>{
      let mode=req.body["mode"];
      if(mode==="2"){
        const usu= req.body['usu2'].trim()
        const pass1 = req.body['pass21']
        const pass2 = req.body['pass22']
        const perm=req.body['perm2']
        if(pass1!=pass2||perm===""||pass1===""||usu==="") {
          res.render("usuarios",{nombre:req.session.usuario,pass_error:"block",usuarios:rows});
        }else{
          db.updatePassword(usu,pass1,perm,(err)=>{
            if(!err){
              console.log('Contraseña Actualizada')
              res.render("usuarios",{nombre:req.session.usuario,pass_error:"none",usuarios:rows});
            }else{
              res.render("usuarios",{nombre:req.session.usuario,pass_error:"block",usuarios:rows});
            }
          })
        }
      }else if(mode==="1"){
        const usu= req.body['usu1'].trim()
        const pass1 = req.body['pass11']
        const pass2 = req.body['pass12']
        const perm=req.body['perm']
        console.log("Permiso del select: "+perm)
  
        if(pass1!=pass2||perm===""||pass1===""||usu==="") {
          res.render("usuarios",{nombre:req.session.usuario,pass_error:"block",usuarios:rows});
        }else{
          db.insertarUsu(usu,pass1,perm,(err)=>{
            if(err){
              res.render("usuarios",{nombre:req.session.usuario,pass_error:"block",usuarios:rows});
            }else{
              res.render("usuarios",{nombre:req.session.usuario,pass_error:"none",usuarios:rows});
            }
          })
        }
      }else if(mode==="3"){
  
        const usu= req.body['usu3'].trim()
        if(usu===""){
          res.render("usuarios",{nombre:req.session.usuario,pass_error:"block",usuarios:rows});
        }else{
  
          db.eliminarUsu(usu,(err)=>{
            if(err){
              res.render("usuarios",{nombre:req.session.usuario,pass_error:"block",usuarios:rows});
            }else{
              console.log("Usuario eliminado correctamente");
              res.render("usuarios",{nombre:req.session.usuario,pass_error:"none",usuarios:rows});
            }
          })
  
        }
      }
    });
    

});

module.exports = router