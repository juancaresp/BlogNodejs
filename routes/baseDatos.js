const sqlite3 = require('sqlite3');
const hash = require('pbkdf2-password')()


let db= new sqlite3.Database('./baseBlog.db', sqlite3.OPEN_READWRITE |
sqlite3.OPEN_CREATE, (err) => {
    console.log("Base de datos abierta");
if (err) {
console.log("Error: " + err);
process.exit(1);
}
});


function iniciar(){
    hash({password: "admin"},function(err,pass,salt,hash){
        if (err) {
            throw err;
        }else{
            db.exec(
                `CREATE TABLE IF NOT EXISTS usuarios (
                    usuario TEXT PRIMARY KEY,
                    pass_hash TEXT,
                    pass_salt TEXT
                );
                CREATE TABLE IF NOT EXISTS entradas (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    titulo TEXT,
                    texto TEXT,
                    fecha INTEGER
                );
                delete from usuarios where usuario="admin";
                `,
                (err) => {
                    if(err) {
                    console.log("Error: " + err);
                    process.exit(1);
                    }
                }
            )
            db.all('insert into usuarios (usuario, pass_hash, pass_salt) values(?,?,?)',
                    "admin", hash, salt,
                    (err) => {
                        if(err) {
                            return console.error(err.message)
                        } else {
                            console.log('Base de datos creada')
                        }
                    }
            ) 
        }
    })
}
/*
function login(usu,pass){
    correcto=false;

    db.all("SELECT * FROM usuarios WHERE usuario=?",usu,(err,rows) => {
        if(err) {
            console.log("Error: " + err);
            process.exit(1);
        }
        rows.forEach(usuario => {
            console.log("Contraseña: "+usuario.password);
            if(usuario.password===pass) {
                console.log("usuario y contraseña correctos");
                correcto=true;
            }
        })
        
    })
    console.log("Correcto: " + correcto);
    return correcto;
}
*/

exports.db=db;
exports.iniciardb=iniciar;
//exports.login=login;