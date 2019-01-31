const express = require('express')
const { verificaToken } = require('../middlewares/autenticacion')
const app = express();

let Producto = require('../models/producto');


//=====================
//  Obtener productos
//=====================

app.get('/productos', verificaToken, (req, res) => {
    // trae todos los productos
    // populate: usuario y categoria
    // paginado
    let desde = req.query.desde || 0;
    desde = Number(desde)

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(limite)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            Producto.count({ disponible: true }, (err, conteo) => {

                res.json({
                    ok: true,
                    productos,
                    Total: conteo
                })
            })
        })


})

//=====================
//  Obtener productos por id
//=====================

app.get('/productos/:id', verificaToken, (req, res) => {

        let id = req.params.id

        Producto.findById(id)
            .populate('usuario', 'nombre email')
            .populate('categoria', 'descripcion')
            .exec((err, producto) => {

                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    })
                }

                if (!producto) {
                    return res.status(401).json({
                        ok: false,
                        err: {
                            message: 'No se encontro ningun producto con el id solicitado'
                        }
                    })
                }
                res.json({
                    ok: true,
                    producto
                })


            })


        // populate: usuario y categoria
        //paginado


    })
    //=====================
    //  busca productos
    //=====================
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {
    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('categoria', 'nombre')
        .exec((err, productos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                productos
            })

        })


})



//=====================
//  Crear un nuevo producto
//=====================

app.post('/productos', verificaToken, (req, res) => {

        //Grabar el usuario
        //Grabar una categoria del listado de categoria

        // nombre: { type: String, required: [true, 'El nombre es necesario'] },
        // precioUni: { type: Number, required: [true, 'El precio únitario es necesario'] },
        // descripcion: { type: String, required: false },
        // disponible: { type: Boolean, required: true, default: true },
        // categoria: { type: Schema.Types.ObjectId, ref: 'Categoria', required: true },
        // usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }

        let body = req.body

        let producto = new Producto({
            nombre: body.nombre,
            precioUni: body.precioUni,
            descripcion: body.descripcion,
            categoria: body.categoria,
            usuario: req.usuario._id,
            disponible: body.disponible

        })

        producto.save((err, productoDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.status(201).json({
                ok: true,
                producto: productoDB
            })

        })

    })
    //=====================
    //  Actulizar el producto
    //=====================

app.put('/productos/:id', (req, res) => {

    //Grabar el usuario
    //Grabar una categoria del listado de categoria
    let id = req.params.id;
    let body = req.body;

    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto no existe'
                }
            })
        }

        productoDB.nombre = body.nombre
        productoDB.precioUni = body.precioUni
        productoDB.disponible = body.disponible
        productoDB.categoria = body.categoria
        productoDB.descripcion = body.descripcion

        productoDB.save((err, productoGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            res.json({
                ok: true,
                producto: productoGuardado
            })

        })

    })

})

//=====================
//  Borrar el producto
//=====================

app.delete('/productos/:id', (req, res) => {

    //Cambiar estado
    //
    let id = req.params.id;

    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto no existe'
                }
            })
        }

        productoDB.disponible = false;
        productoDB.save((err, productoBorrado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            res.json({
                ok: true,
                productoBorrado,
                message: 'Producto borrado'
            })

        })
    })


})

module.exports = app;