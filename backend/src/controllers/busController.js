const busService = require('../services/busService');

exports.getAllBuses = async (req, res) => {
    try {
        const buses = await busService.getAllBuses();
        res.json(buses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getBusById = async (req, res) => {
    try {
        const bus = await busService.getBusById(req.params.id);
        res.json(bus);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

exports.createBus = async (req, res) => {
    try {
        const bus = await busService.createBus(req.body);
        res.status(201).json(bus);
    } catch (error) {
        console.error("Error al registrar el bus:", error.message);

        if (error.message.includes("La placa ya está registrada")) {
            return res.status(400).json({ message: "La placa ya está registrada." });
        }
        
        res.status(500).json({ message: "Error en el servidor." });
    }
};

exports.updateRoute = async (req, res) => {
    try {
        const { id } = req.params;
        const { id_ruta } = req.body;

        const response = await busService.updateRoute(id, id_ruta);
        res.json(response);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.updateBusDato = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;

        // Validar que los campos requeridos estén presentes
        const requiredFields = ['placa', 'marca', 'modelo', 'capacidad', 'estado', 'numero'];
        const missingFields = requiredFields.filter(field => !updatedData[field]);

        if (missingFields.length > 0) {
            return res.status(400).json({ error: `Faltan los campos: ${missingFields.join(', ')}` });
        }

        const response = await busService.updateBusDato(id, updatedData);
        res.json(response);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};


exports.updateBus = async (req, res) => {
    try {
        const bus = await busService.getBusById(req.params.id); // Obtener el bus por id
        const updatedData = req.body;

        // Actualizar los campos del bus que recibes en el body (por ejemplo, capacidad)
        // Si se recibe un nuevo valor para capacidad, puedes ajustarlo o hacerlo dinámico según el negocio
        if (updatedData.capacidad) {
            // Realizar validación si es necesario o calcular la capacidad restante basada en los asientos ocupados
            // Actualizar capacidad basándote en la lógica que el bus requiere
            const asientosOcupados = await Asiento.count({
                where: {
                    id_bus: bus.id_bus,
                    estado: 'ocupado'
                }
            });

            const capacidadRestante = bus.capacidad - asientosOcupados; // Resta asientos ocupados
            updatedData.capacidad = capacidadRestante; // Asignar la capacidad restante

            console.log(`Capacidad actualizada del bus ${bus.numero}: ${capacidadRestante}`);
        }

        // Ahora, actualiza el bus con los nuevos datos
        await busService.updateBus(req.params.id, updatedData);
        res.json({ message: 'Bus actualizado correctamente' });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};


exports.deleteBus = async (req, res) => {
    try {
        await busService.deleteBus(req.params.id);
        res.json({ message: 'Bus eliminado correctamente' });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};
