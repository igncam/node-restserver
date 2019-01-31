require('./config/config')

const express = require('express')
const app = express()
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const colors = require('colors')
const path = require('path')
    // parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// importa las rutas GLOBAL
app.use(require('./routes/index'));


// Habilitar la carpeta public
app.use(express.static(path.resolve(__dirname, '../public')));


//conecto a mongodb
mongoose.connect(process.env.URLDB, { useCreateIndex: true, useNewUrlParser: true }, (err, res) => {
    if (err) { return console.log('Base de datos OFFLINE'.red); };
    console.log('Base de datos ONLINE'.green);
});



app.listen(process.env.PORT, () => {
    console.log('Escuchando el puerto 3000'.grey);
});