const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const Usuario = require('../models/usuario')
const fs = require('fs');
const Producto = require('../models/producto')

const path = require('path')

app.use(fileUpload());


app.put('/upload/:tipo/:id', function(req, res) {
    let tipo = req.params.tipo;
    let id = req.params.id;


    if (!req.files) {


        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se cargo ningun archivo'
            }
        })

    }

    // Validar tipo

    let tiposValidos = ['productos', 'usuarios'];

    if (tiposValidos.indexOf(tipo) < 0) {

        return res.status(400).json({
            ok: false,
            err: {
                message: 'las tipos permitidas son ' + tiposValidos.join(', ')
            }
        })

    }

    let archivo = req.files.archivo

    // Extensiones permitidas
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg']

    let nombreArchivo = archivo.name.split('.')

    let extension = nombreArchivo[1]
        //console.log(extencion);

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'las extensiones permitidas son ' + extensionesValidas.join(', '),
                ext: extension
            }
        })
    }

    // cambiar nombre al archivo
    let nombreArchivoMV = `${ id }-${new Date().getMilliseconds()}.${ extension }`


    //return

    archivo.mv(`uploads/${ tipo }/${nombreArchivoMV}`, (err) => {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            });


        // ya se que se cargo

        if (tipo === 'usuarios') {

            imagenUsuario(id, res, nombreArchivoMV);
        } else {
            imagenProducto(id, res, nombreArchivoMV)

        }




    });

});

function imagenUsuario(id, res, archivof) {
    Usuario.findById(id, (err, usuarioBD) => {


        if (err) {
            borraArchivo(archivof, 'usuarios')
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioBD) {
            borraArchivo(archivof, 'usuarios')
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }
            });
        }

        // let pathImagen = path.resolve(__dirname, `../../uploads/usuarios/${ usuarioBD.img }`)

        // if (fs.existsSync(pathImagen)) {

        //     fs.unlinkSync(pathImagen);

        // }
        borraArchivo(usuarioBD.img, 'usuarios')

        usuarioBD.img = archivof;

        usuarioBD.save((err, usuarioGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                usuario: usuarioGuardado,
                img: archivof
            })

        })

    })
}

function borraArchivo(nombreImagen, tipo) {

    let pathImagen = path.resolve(__dirname, `../../uploads/${ tipo }/${ nombreImagen }`)

    if (fs.existsSync(pathImagen)) {

        fs.unlinkSync(pathImagen);

    }
}


function imagenProducto(id, res, archivof) {

    Producto.findById(id, (err, productoBD) => {


        if (err) {
            borraArchivo(archivof, 'productos')
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoBD) {
            borraArchivo(archivof, 'productos')
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no existe'
                }
            });
        }

        // let pathImagen = path.resolve(__dirname, `../../uploads/usuarios/${ usuarioBD.img }`)

        // if (fs.existsSync(pathImagen)) {

        //     fs.unlinkSync(pathImagen);

        // }
        borraArchivo(productoBD.img, 'productos')

        productoBD.img = archivof;

        productoBD.save((err, productoGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                usuario: productoGuardado,
                img: archivof
            })

        })

    })

}
module.exports = app;