// Se solicita usuario y contraseña y se inicia la sesión
// asignando permisos al usuario.

var express = require('express');
const DBFactory  = require('./baseDatos').DBFactory;
var router = express.Router();
const perm = require("../permissions")

//La base de datos
let db=DBFactory("sqlite")


router.get('/', function(req, res, next) {
    if(req.session.usuario) {
        console.log('Sesión ya iniciada iniciada')
        res.redirect('/')
    }
    res.render('login', {login_error: "none"});
});

router.post('/', function(req, res, next) {
    const usuario = req.body['usuario']
    const pass = req.body['password']
    if(req.session.usuario) {
        res.redirect('/')
    }else{
        db.login(usuario,pass,(correcto,permiso)=>{
            if(correcto){
                //Ambas contraseñas coinciden
                req.session.usuario=usuario;
                if(permiso==perm.ADMIN){
                    req.session.permiso= perm.ADMIN;
                    console.log("entro en admin");
                }else if(permiso==perm.USER){
                    req.session.permiso= perm.USER;
                    console.log("permiso de usuario")
                }else if(permiso==perm.NONE){
                    req.session.permiso= perm.NONE;
                }
                console.log(req.session.permiso)
                console.log("Sesion abierta");
                res.redirect('/panel')
            }else{
                //La contraseña esta mal
                //destruimos por si acaso hay alguna sesion iniciada
                req.session.destroy();
                res.render('login', {login_error: "block"});
            }
        })
    }
}
);

module.exports = router;
