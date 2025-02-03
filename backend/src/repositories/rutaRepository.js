const { Ruta, Bus } = require('../models');
const rutaRepository = {
    findAll: async () => await Ruta.findAll(),
    findById: async (id) => await Ruta.findByPk(id),
    create: async (data) => await Ruta.create(data),
    update: async (id, data) => {
        // Filtramos solo los campos permitidos
        const allowedFields = ["origen", "destino", "distancia", "monto"];
        const filteredData = Object.keys(data)
            .filter((key) => allowedFields.includes(key))
            .reduce((obj, key) => {
                obj[key] = data[key];
                return obj;
            }, {});

        return await Ruta.update(filteredData, { where: { id_ruta: id } });
    },
    delete: async (id) => await Ruta.destroy({ where: { id_ruta: id } }),
    findAllWithBusCapacity: async () => {
        return await Ruta.findAll({
            include: [
                {
                    model: Bus,
                    attributes: ["id_bus", "capacidad", "estado", "numero"],
                },
            ],
            attributes: ["id_ruta", "origen", "destino", "distancia", "monto"],
        });
    },
};

module.exports = rutaRepository;
