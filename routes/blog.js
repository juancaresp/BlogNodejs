var express = require('express');
var router = express.Router();
const db = require('./baseDatos').db;

router.get('/', function (req, res, next) {
  db.all("select * from entradas", (err, rows) => {
    if (err) {
      console.log(err);
    } else {
      //Ordenamos las entradas
      rows.sort(function compareFn(a, b) {
        if (a.fecha < b.fecha) {
          return -1;
        } else if (b.fecha < a.fecha) {
          return 1;
        }
        return 0;
      })
      //Numero de pagina actual
      let np=0
      
      let filas = [];
      //numero de paginas que existen
      let intp = parseInt(rows.length / 3)
      let n = rows.length / 3 > 1 ? rows.length / 3 > (intp) ? (intp) + 1 : intp : 1;

      if (rows.length > 3) {
        for (let i = 0; i < 3; i++)
          filas[i] = rows[i];
      } else {
        filas = rows;
      }

      if (req.session.usuario)
        res.render('blog', { titulo: 'Blog', iniciar: "none", cerrar: "block", iniciada: "block", perm: "block", nombre: req.session.usuario, entradas: filas, n: n, np:np });
      else
        res.render('blog', { titulo: 'Blog', iniciar: "block", cerrar: "none", iniciada: "none", perm: "none", nombre: req.session.usuario, entradas: filas, n: n, np:np });

    }
  })
});

router.post('/', function (req, res, next) {
  db.all("select * from entradas", (err, rows) => {
    if (err) {
      console.log(err);
    } else {
      //Ordenamos las entradas
      rows.sort(function compareFn(a, b) {
        if (a.fecha < b.fecha) {
          return -1;
        } else if (b.fecha < a.fecha) {
          return 1;
        }
        return 0;
      })

      //numero de paginas que existen
      let intp = parseInt(rows.length / 3)
      let n = rows.length / 3 > 1 ? rows.length / 3 > (intp) ? (intp) + 1 : intp : 1;

      let filas = [];

      if (req.body["p"]) {
        //Numero de pagina actual
        let p = parseInt(req.body["p"])

        //Creamos el array de entradas a mostrar
        if (rows.length > 3) {
          let donde = 0;
          for (let i = 0 + (p * 3); i < (p * 3) + 3; i++) {
            if (rows[i]) {
              filas[donde] = rows[i];
              donde++;
            }
          }
        } else {
          //Creamos el array de entradas a mostrar
          for (let i = 0; i < rows.length; i++)
            filas[i] = rows[i];
        }

        if (req.session.usuario)
          res.render('blog', { titulo: 'Blog', iniciar: "none", cerrar: "block", iniciada: "block", perm: "block", nombre: req.session.usuario, entradas: filas, n: n, np:p });
        else
          res.render('blog', { titulo: 'Blog', iniciar: "block", cerrar: "none", iniciada: "none", perm: "none", nombre: req.session.usuario, entradas: filas, n: n, np:p });

      } else {
        //Numero de pagina actual
        let np=0

        //Creamos el array de entradas a mostrar
        if (rows.length > 3) {
          for (let i = 0; i < 3; i++)
            filas[i] = rows[i];
        } else {
          filas = rows;
        }

        if (req.session.usuario)
          res.render('blog', { titulo: 'Blog', iniciar: "none", cerrar: "block", iniciada: "block", perm: "block", nombre: req.session.usuario, entradas: filas, n: n, np:np });
        else
          res.render('blog', { titulo: 'Blog', iniciar: "block", cerrar: "none", iniciada: "none", perm: "none", nombre: req.session.usuario, entradas: filas, n: n, np:np });
      }
    }
  })
});

module.exports = router;
