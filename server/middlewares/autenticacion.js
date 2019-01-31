const jwt = require('jsonwebtoken');


//================  
//Verificar token
//================

let verificaToken = (req, res, next) => {

    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decode) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido'
                }
            })
        }

        req.usuario = decode.usuario;
        next();

    })


};



//================  
//Verificar adminROL
//================

let verficaROL = (req, res, next) => {

    let usuario = req.usuario;
    //console.log(usuario.role);

    if (usuario.role === 'ADMIN_ROLE') {

        next();
    } else {

        return res.json({
            ok: false,
            err: {
                message: 'No tienes los permisos suficientes'
            }
        })
    }

};
//================  
//Verificar token img
//================
let verficaTokenImg = (req, res, next) => {
    let token = req.query.token;
    jwt.verify(token, process.env.SEED, (err, decode) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido'
                }
            })
        }

        req.usuario = decode.usuario;
        next();

    })

}
module.exports = {
    verificaToken,
    verficaROL,
    verficaTokenImg
}