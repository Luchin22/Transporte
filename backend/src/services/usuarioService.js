const usuarioRepository = require('../repositories/usuarioRepository');
const { Rol } = require('../models'); 
const bcrypt = require('bcrypt');

exports.getAllUsuarios = async () => {
    return await usuarioRepository.findAll();
};

exports.getUsuarioById = async (id) => {
    return await usuarioRepository.findById(id);
};

exports.updateUsuario = async (id, data) => {
    return await usuarioRepository.update(id, data);
};

exports.deleteUsuario = async (id) => {
    return await usuarioRepository.delete(id);
};

exports.createUsuario = async (data) => {
    const { rol_id, nombre, apellido, email, telefono, password} = data;

    // Verificar que el rol existe
    const rol = await Rol.findByPk(rol_id);
    if (!rol) {
        throw new Error('El rol especificado no existe');
    }

    // Validar que el correo electrónico no exista ya
    const usuarioExistente = await usuarioRepository.findByEmail(email);
    if (usuarioExistente) {
        throw new Error('El correo electrónico ya está registrado');
    }

    // Validar el formato y seguridad de la contraseña
    if (password.length < 8) {
        throw new Error('La contraseña debe tener al menos 8 caracteres');
    }
    if (!/[A-Z]/.test(password)) {
        throw new Error('La contraseña debe contener al menos una letra mayúscula');
    }
    if (!/[a-z]/.test(password)) {
        throw new Error('La contraseña debe contener al menos una letra minúscula');
    }
    if (!/[0-9]/.test(password)) {
        throw new Error('La contraseña debe contener al menos un número');
    }
    if (!/[@$!%*?&#]/.test(password)) {
        throw new Error('La contraseña debe contener al menos un carácter especial (@$!%*?&#)');
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    // Crear el usuario con la contraseña encriptada
    return await usuarioRepository.create({
        rol_id,
        nombre,
        apellido,
        email,
        telefono,
        password: hashedPassword
    });
};