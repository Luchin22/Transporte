const express = require('express');
const router = express.Router();

const usuarioRoutes = require('./usuarioRoutes');
const asientoRoutes = require('./asientoRoutes');
const reservaRoutes = require('./reservaRoutes');
const pagoRoutes = require('./pagoRoutes');
const historialreservaRoutes = require('./historialreservaRoutes');
const rolRoutes = require('./rolRoutes');
const conductorRoutes = require('./conductorRoutes');
const busRoutes = require('./busRoutes');
const rutaRoutes = require('./rutaRoutes');
const horarioRoutes = require('./horarioRoutes');

// Ruta de prueba
router.get('/', (req, res) => {
  res.send('Bienvenido al backend de la aplicación de transporte');
});

// Asociar rutas
router.use('/usuarios', usuarioRoutes);
router.use('/asientos', asientoRoutes);
router.use('/reservas', reservaRoutes);
router.use('/pagos', pagoRoutes);
router.use('/historial-reservas', historialreservaRoutes);
router.use('/roles', rolRoutes);
router.use('/conductores', conductorRoutes);
router.use('/buses', busRoutes);
router.use('/rutas', rutaRoutes);
router.use('/horarios', horarioRoutes);

module.exports = router;
