require('dotenv').config();
const mongoose = require('mongoose');

// Ocultar contraseña en el log
const uri = process.env.MONGODB_URI;
const maskedUri = uri ? uri.replace(/:([^:@]+)@/, ':****@') : 'undefined';

console.log("Probando conexión a MongoDB...");
console.log("URI:", maskedUri);

mongoose.connect(uri)
    .then(() => {
        console.log("✅ ¡Conexión Exitosa!");
        console.log("La cadena de conexión es válida.");
        process.exit(0);
    })
    .catch(err => {
        console.error("❌ Falló la conexión:");
        console.error(err.message);
        process.exit(1);
    });
