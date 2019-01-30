// =============
// puerto
//==============

process.env.PORT = process.env.PORT || 3000;


// =============
// entorno
//==============

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';



// =============
// Base de datos
//==============

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe'
} else {
    urlDB = 'mongodb://cafeadm:Pepe01@ds057944.mlab.com:57944/cafe'
}

process.env.URLDB = urlDB