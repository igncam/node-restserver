const express = require('express');
const { verificaToken, verficaROL, verficaTokenImg } = require('../middlewares/autenticacion');
const app = express();
const fs = require('fs');
const path = require('path')


app.get('/imagen/:tipo/:img', verficaTokenImg, (req, res) => {

    let tipo = req.params.tipo;
    let img = req.params.img;

    let pathImg = `./uploads/${ tipo }/${ img }`;

    let pathImagen = path.resolve(__dirname, `../../uploads/${ tipo }/${ img }`)




    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen)
    } else {
        let noImagePath = path.resolve(__dirname, '../assets/no-image.jpg')
        res.sendFile(noImagePath)
    }

})

module.exports = app;