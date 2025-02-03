const pagoRepository = require('../repositories/pagoRepository');

exports.getAllPagos = async () => {
    return await pagoRepository.findAll();
};

exports.getPagoById = async (id) => {
    const pago = await pagoRepository.findById(id);
    if (!pago) throw new Error('Pago no encontrado');
    return pago;
};

exports.createPago = async (data) => {
    if (!data.monto || !data.fecha_pago || !data.metodo_pago || !data.estado_pago || !data.usuario_id || !data.id_asiento || !data.id_bus) {
        throw new Error('Faltan campos obligatorios');
    }
    return await pagoRepository.create(data);
};

exports.updatePago = async (id, data) => {
    const result = await pagoRepository.update(id, data);
    if (result[0] === 0) throw new Error('Pago no encontrado');
    return result;
};

exports.deletePago = async (id) => {
    const result = await pagoRepository.delete(id);
    if (result === 0) throw new Error('Pago no encontrado');
    return result;
};
