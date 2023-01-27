const sqlite3 = require('sqlite3');
const hash = require('pbkdf2-password')()

function DBFactory(tipo){

    if(tipo==="sqlite"){
        let db= new sqlite3.Database('./baseBlog.db', sqlite3.OPEN_READWRITE |
        sqlite3.OPEN_CREATE, (err) => {
        if (err) {
        console.log("Error: " + err);
        process.exit(1);
        }
        });
        
        db.iniciar=()=>{
            hash({password: "admin"},function(err,pass,salt,hash){
                if (err) {
                    throw err;
                }else{
                    db.exec(
                        `
                        DROP TABLE IF EXISTS usuarios;
                        CREATE TABLE IF NOT EXISTS usuarios (
                            usuario TEXT PRIMARY KEY,
                            pass_hash TEXT,
                            pass_salt TEXT,
                            perm integer
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
                    db.all('insert into usuarios (usuario, pass_hash, pass_salt,perm) values(?,?,?,?)',
                            "admin", hash, salt,3,
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
        
        db.login=(usu,pass,funfinal)=>{
        
            db.all("SELECT * FROM usuarios WHERE usuario=?",usu,(err,rows) => {
                if(err) {
                    console.log("Error: " + err);
                    process.exit(1);
                }
                
                if(rows[0]){
                    let row=rows[0]
                    hash({password:pass, salt:row.pass_salt},function(err, pass, salt, hash){
                        if(err) {
                            console.log(err);
                        }else if(row.pass_hash===hash){
                            console.log("Permiso Base de datos: "+row.perm);
                            funfinal(true,row.perm)
                        }else{
                            funfinal(false,null)
                        }
                    })
                }else{
                    funfinal(false,null)
                }
                
            })
        }
        db.updatePassword=(usu,pass,perm,fun)=>{
            db.all("SELECT * FROM usuarios WHERE usuario=?",usu,(err,rows) => {
                let row= rows[0]
                hash({password:pass,salt:row.pass_salt},function(err, pass, salt, hash){
                    db.all('Update usuarios set pass_hash=?, pass_salt=?, perm=? where usuario=?',hash, salt, perm, usu,(err) => {
                        if (err) {
                            fun(err);
                        }else{
                            fun();
                        }
                    })
                })
            })
        }
        
        db.insertarUsu=(usu,pass,perm,fun)=>{
            hash({password:pass},function(err, pass, salt, hash){
                if(err){
                  fun(err)
                }else{
                    db.all('insert into usuarios (usuario, pass_hash, pass_salt, perm) values(?,?,?,?)', usu, hash, salt, perm, (err) => {
                        if(err) {
                            fun(err)
                        } else {
                            fun()
                        }
                    }
                  ) 
                }
            })  
        }
        
        db.eliminarUsu=(usu,fun)=>{
            db.all('delete from usuarios where usuario = ?',usu,(err) => {
                if(err) {
                    fun(err)
                } else {
                    fun()
                }
            }
            )
        }
        db.usuarios=(funfinal)=>{
        
            db.all("SELECT * FROM usuarios",(err,rows) => {
                if(err) {
                    console.log("Error: " + err);
                    process.exit(1);
                }
                funfinal(rows);
            })
        }

        return db;
    }else if(tipo==="mysql"){
        return false;
    }
}



exports.DBFactory = DBFactory;

