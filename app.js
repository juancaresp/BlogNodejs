var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var logger = require('morgan');

/*
*Proyecto de Juan Carlos Calleja
*
*Siempre ha sido ejecutado desde la carpeta bin
*Tambien es donde esta creada la base de datos y a la que trata de
* acceder si se ejecuta desde bin el archivo www
*
*
*/

//Base de datos
var db = require("./routes/baseDatos").db;

// Se cargan las rutas

var editarRouter = require('./routes/editar');
var panelRouter = require('./routes/panel');
var loginRouter = require('./routes/login');
var blogRouter = require('./routes/blog');
var logoutRouter = require('./routes/logout');
var instaladorRouter = require('./routes/instalador');
var enviarRouter = require('./routes/enviar');
var borrarRouter = require('./routes/borrar');
var usuRouter = require('./routes/usuarios');
const { application } = require('express');
const { request } = require('http');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(
    session({
        secret: "Contraseña", 
        cookie: { maxAge: 10*60*1000 }, 
        saveUninitialized: false,
        resave: false
    })
)

// Listado de las páginas que se pueden ver sin autentificación
const public_pages = [
    "/",
    "/login",
    "/instalador",
    "/blog"
];

// Listado de páginas que requieren algún tipo de autorización especial
const private_pages = [
    "/editar",
    "/logout",
    "/panel",
    "/enviar",
    "/borrar",
    "/usuarios"
];

// Control de sesión iniciada
app.use((req, res, next) => {
    // Se verifica que el usuario haya iniciado sesión
    if(req.session.usuario) {
        if(req.url==="/login"){
            res.redirect("/")
        }
        next()
    } else {
            // Si el usuario no ha iniciado sesión, se verifica que la página es pública
        if(public_pages.includes(req.url))
            next()
        else if(private_pages.includes(req.url))
            res.redirect('/login')
        else
            next(createError(404)) // Not found
    }
})

// Se asignan las rutas a sus funciones middleware

app.use('/editar', editarRouter);
app.use('/panel', panelRouter);
app.use('/login', loginRouter);
app.use('/blog', blogRouter);
app.use('/', blogRouter);
app.use('/logout', logoutRouter);
app.use('/instalador', instaladorRouter)
app.use('/enviar',enviarRouter)
app.use('/borrar',borrarRouter)
app.use('/usuarios',usuRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
