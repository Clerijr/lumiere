var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var session = require('express-session');
var flash = require('connect-flash');
require('../app/models/user');
const User = mongoose.model('user');

// Session
router.use(session({
    secret: "crudsecreto",
    resave: true,
    saveUninitialized: true
}))
// Flash
router.use(flash())
// Parsing data
router.use(express.urlencoded({ extended: true }));
router.use(express.json());
/* Middleware */
router.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg")
    res.locals.error_msg = req.flash("error_msg")
    next()
})

// User register route
router.route('/cadastro/novo')
    .post((req, res) => { /* Method Create */
        /* Validation */
        var erros = [];
        if (!req.body.user_name || typeof req.body.user_name == undefined || req.body.user_name == null) {
            erros.push({
                text: "Nome inválido"
            })
        }
        if (!req.body.user_mstatus || req.body.user_mstatus == "Estado Civil") {
            req.body.user_mstatus = "Não informar"
        }
        if (typeof req.body.user_mstatus == undefined || req.body.user_mstatus == null) {
            erros.push({
                text: "Estado Civil inválido"
            })
        }
        if (!req.body.user_age || typeof req.body.user_age == undefined || req.body.user_age == null) {
            erros.push({
                text: "Idade inválida"
            })
        }
        if (!req.body.user_cpf || typeof req.body.user_cpf == undefined || req.body.user_cpf == null) {
            erros.push({
                text: "CPF inválido"
            })
        }
        if (!req.body.user_city || typeof req.body.user_city == undefined || req.body.user_city == null) {
            erros.push({
                text: "Cidade inválida"
            })
        }
        if (!req.body.user_uf || typeof req.body.user_uf == undefined || req.body.user_uf == null) {
            erros.push({
                text: "Estado inválido"
            })
        }
        if (erros.length > 0) {
            res.render('admin/formulario', { erros: erros })
        }
        else {
            var user = new User({
                name: req.body.user_name,
                ecivil: req.body.user_mstatus,
                age: req.body.user_age,
                cpf: req.body.user_cpf,
                city: req.body.user_city,
                uf: req.body.user_uf
            }).save().then(() => {
                req.flash("success_msg", "Usuário criado com sucesso!")
                res.redirect('/cadastro')
            }).catch((err) => {
                req.flash("error_msg", "Falha ao criar o usuário: " + err)
                res.redirect('/cadastro')
            })
        }
    })

/* Delete user route */
router.route('/cadastro/remover/')
    /* Method Delete */
    .post((req, res) => {
        User.deleteOne({
            _id: req.body.id
        }).then(() => {
            req.flash("success_msg", "Usuário removido com sucesso!")
            res.redirect('/')
        }).catch((err) => {
            if (err) req.flash("error_msg", "Falha ao remover o usuário: " + err)
            res.redirect('/')
        })
    })



/* Edit user route */
router.route("/editar")
    /* Method Update */
    .post((req, res) => {
        User.findById({ _id: req.body.id }, (err, user) => {
            if (err) res.send("Houve um erro ao atualizar: " + err)

            user.name = req.body.user_name;
            if (!req.body.user_mstatus || req.body.user_mstatus == "Estado Civil") {
                user.ecivil = "Não informar"
            } else {
                user.ecivil = req.body.user_mstatus;
            };
            user.age = req.body.user_age;
            user.cpf = req.body.user_cpf;
            user.city = req.body.user_city;
            user.uf = req.body.user_uf;

            user.save().then(() => {
                req.flash("success_msg", "Usuário editado com sucesso!")
                res.redirect('/')
            }).catch((err) => {
                if (err) req.flash("error_msg", "Falha ao editar o usuário: " + err)
                res.redirect('/')
            })
        })
    });



/* Route for API */
router.get('/api', (req, res) => {
    User.find((error, usuarios) => {
        if (error) res.send('Houve um erro ao carregar a tabela: ' + error)
        res.json({ usuarios })
    })
})
/* Method Read */

/* Pagination Function */



/* Mainpage Render method */

router.get('/', (req, res) => {
    User.find((error, usuarios) => {
        if (error) res.send('Houve um erro ao carregar a tabela: ' + error)
        res.render('admin/tabela', { usuarios })
        console.log(usuarios.length)
    })
});



router.get('/cadastro', (req, res) => {
    res.render('admin/formulario')
});

/* Find by ID */
router.post(("/id/"), (req, res) => {
    User.findOne({ _id: req.body.id }).then((user) => {
        res.render('admin/idtabela', { user: user })
    }).catch((err) => {
        res.send("Houve um erro ao localizar o usuário: " + err)
    })
})


router.get("/editar/:id", (req, res) => {
    User.findOne({ _id: req.params.id }).then((user) => {
        res.render('admin/editar', { user: user })
    }).catch((err) => {
        res.send("Houve um erro ao localizar o usuário: " + err)
    })
})

module.exports = router