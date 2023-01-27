// Se solicita usuario y contraseña y se inicia la sesión
// asignando permisos al usuario.

var express = require('express');
const db  = require('./baseDatos');
var router = express.Router();
const hash = require('pbkdf2-password')()


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
        db.db.all("SELECT * FROM usuarios WHERE usuario=?",usuario,(err,rows) => {
            if(err) {
                console.log("Error: " + err);
                process.exit(1);
            }else if(rows.length>0){
                var row=rows[0];
                hash({password:pass, salt:row.pass_salt},function(err, pass, salt, hash){
                    if(err) {
                        console.log(err);
                    }else if(row.pass_hash===hash){
                        //Ambas contraseñas coinciden
                        req.session.usuario=usuario;
                        console.log("Sesion abierta");
                        res.redirect('/panel')
                    }else{
                        //la contraseña esta mal
                        req.session.destroy();
                        res.render('login', {login_error: "block"});
                    }
                })
            }else{
                //No existe el usuario
                console.log("No existe el usuario");
                res.render('login', {login_error: "block"});
            }
        })
    }
    /*
    No logre hacer la funcion de login en el otro js de funciones de solo base de datos lo intente durante muchas horas
    if(db.login(usuario, password)) {
        // Se inicia la sesión
        req.session.usuario=usuario;
        console.log("Sesion abierta");
        res.redirect('/')
    }else {
        //Se indica que no son correctos
        console.log("usuario y contraseña incorrectos");
        req.session.destroy();
        res.render('login', {login_error: "block",iniciar:"block",cerrar:"none"});
    }*/
});

module.exports = router;
