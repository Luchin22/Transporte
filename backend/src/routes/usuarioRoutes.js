const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/rolMiddleware');

// Ruta de inicio de sesión (no protegida)
router.post('/nuevoUsuarioSinToken', usuarioController.createUsuarioSinToken);
router.post('/sign-in', usuarioController.login);
router.post('/refresh', usuarioController.refreshToken); // renovar el token
router.post('/register-admin', usuarioController.registerAdmin); // Ruta temporal para crear un usuario dueño

// recuperacion de contrasenas
router.post('/forgot-password', usuarioController.requestPasswordReset);
router.post('/reset-password', usuarioController.resetPassword);

// Rutas protegidas
router.get('/perfil',  usuarioController.getPerfil); 

// Rutas de usuarios con restricciones específicas
// Ruta para crear usuarios sin necesidad de autenticación

router.post('/nuevoUsuario', usuarioController.createUsuario);
router.delete('/usuario/:id', authMiddleware, roleMiddleware(['eliminar_usuario']), usuarioController.deleteUsuario);
router.get('/listarUsuarios', usuarioController.getAllUsuarios);
router.put('/usuario/:id', usuarioController.updateUsuario);
router.put('/usuarioSinToken/:id', usuarioController.updateUsuarioSinToken);


// Todos los usuarios autenticados pueden ver su propia información
router.get('/usuario/:id', usuarioController.getUsuarioById);

module.exports = router;