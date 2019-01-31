const express = require('express');

let { verificaToken, verficaROL } = require('../middlewares/autenticacion');

let app = express();

let Categoria = require('../models/categoria');

const _ = require('underscore')

// ====================================== 
//  Mostrar todas las categorias
// ====================================== 


app.get('/categoria', verificaToken, (req, res) => {

    //todas las categorias
    Categoria.find({})
        .populate('usuario', 'nombre email')
        .sort('descripcion')
        .exec((err, categoria) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            res.json({
                ok: true,
                categoria

            })
        })

});

// ====================================== 
//  Mostrar una categoria por ID
// ======================================

app.get('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id

    Categoria.findById(id, (err, categoria) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                categoria
            })

        })
        //todas las categorias
        //Categoria.findById();

});

// ====================================== 
//  Crear nueva categoria
// ======================================

app.post('/categoria', verificaToken, (req, res) => {
    let body = req.body

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id

    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })
    })

});

// ====================================== 
//  Actulizar categoria
// ======================================

app.put('/categoria/:id', verificaToken, (req, res) => {

    // actulizar desc de la categoria
    let id = req.params.id
    let body = req.body

    let descCategoria = {
        descripcion: body.descripcion
    };

    Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        })

    })


});

// ====================================== 
//  Borrar categoria
// ======================================

app.delete('/categoria/:id', [verificaToken, verficaROL], (req, res) => {

    // solo un adm puede borrar categorias
    // 
    let id = req.params.id

    Categoria.findByIdAndRemove(id, (err, categoriaBorrada) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!categoriaBorrada) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no existe'
                }
            })
        }
        res.json({
            ok: true,
            message: 'Categoria Borrada'
        })
    })

});

module.exports = app;