const { Usuario } = require('../models');

exports.findAll = async () => {
    return await Usuario.findAll();
};

exports.findById = async (id) => {
    return await Usuario.findByPk(id);
};

exports.create = async (data) => {
    return await Usuario.create(data);
};

exports.update = async (id, data) => {
    return await Usuario.update(data, { where: { usuario_id: id } });
};

exports.delete = async (id) => {
    return await Usuario.destroy({ where: { usuario_id: id } });
};

// Añadir el método findByEmail
exports.findByEmail = async (email) => {
    return await Usuario.findOne({ where: { email } });
};

// Función para almacenar el refresh token en la base de datos
exports.storeRefreshToken = async (usuarioId, refreshToken) => {
    return await Usuario.update(
        { refresh_token: refreshToken }, // Almacena el refresh token en la columna `refresh_token`
        { where: { usuario_id: usuarioId } } // Condición para encontrar el usuario
    );
};

// Funciones de token de recuperacion
exports.storeResetToken = async (usuarioId, resetToken, expirationDate) => {
    return await Usuario.update(
        { reset_token: resetToken, reset_token_expiration: expirationDate },
        { where: { usuario_id: usuarioId } }
    );
};

exports.findByResetToken = async (resetToken) => {
    return await Usuario.findOne({ where: { reset_token: resetToken } });
};

exports.updatePassword = async (usuarioId, hashedPassword) => {
    return await Usuario.update(
        { password: hashedPassword },
        { where: { usuario_id: usuarioId } }
    );
};

exports.clearResetToken = async (usuarioId) => {
    return await Usuario.update(
        { reset_token: null, reset_token_expiration: null },
        { where: { usuario_id: usuarioId } }
    );
};