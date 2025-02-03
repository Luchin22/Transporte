const { Op } = require('sequelize');
const moment = require('moment');
const { Bus, Horario, Asiento } = require('../models'); // Asegúrate de importar Horario

const actualizarEstadoBus = async (horario) => {
    const currentTime = moment(); // Hora actual
    const horaSalida = moment(horario.hora_salida, 'HH:mm');
    const horaAntesDeSalida = moment(horaSalida).subtract(1, 'hour'); // Una hora antes de la hora de salida
    const horaLlegada = moment(horario.hora_llegada, 'HH:mm');

    if (horaLlegada.isBefore(horaSalida)) {
        horaLlegada.add(1, 'days'); // Si la hora de llegada es antes que la salida, sumamos un día
    }

    // Obtener el bus relacionado con el horario
    const bus = await Bus.findByPk(horario.id_bus);

    if (!bus) {
        console.log(`No se encontró el bus con id ${horario.id_bus}`);
        return;
    }

    // Calcular los asientos ocupados para la fecha actual
    const fechaActual = moment().format('YYYY-MM-DD');
    const asientos = await Asiento.findAll({
        where: {
            id_bus: bus.id_bus,
            estado: 'ocupado',
            fecha_asiento: fechaActual,
        },
        attributes: ['numero'],
    });

    // Desglosar y contar los asientos individuales
    const asientosOcupados = asientos.reduce((total, asiento) => {
        const numeros = asiento.numero.split(',').map(num => parseInt(num.trim(), 10));
        return total + numeros.length;
    }, 0);

    console.log(`Asientos ocupados en el bus ${bus.numero} para la fecha ${fechaActual}: ${asientosOcupados}`);

    if (asientosOcupados > 0) {
        const capacidadRestante = bus.capacidad_inicial - asientosOcupados;

        if (currentTime.isBetween(horaAntesDeSalida, horaLlegada)) {
            console.log(`Estado del bus ${bus.numero} actualizado a ocupado`);
            await bus.update({ estado: 'ocupado', capacidad: capacidadRestante });
        } else if (currentTime.isAfter(horaLlegada)) {
            console.log(`Estado del bus ${bus.numero} actualizado a finalizado`);
            await bus.update({ estado: 'finalizado' });
        } else {
            console.log(`Estado del bus ${bus.numero} actualizado a activo`);
            await bus.update({ estado: 'activo', capacidad: capacidadRestante });
        }
    } else {
        console.log(`No hay asientos ocupados para la fecha ${fechaActual}. Capacidad restablecida.`);
        await bus.update({ capacidad: bus.capacidad_inicial, estado: 'activo' });
    }

    console.log(`Capacidad restante del bus ${bus.numero}: ${bus.capacidad}`);
};

// Actualizar estados de buses basados en horarios
const actualizarEstados = async () => {
    const horarios = await Horario.findAll(); // Obtener todos los horarios

    for (const horario of horarios) {
        await actualizarEstadoBus(horario);
    }
};

module.exports = { actualizarEstadoBus, actualizarEstados };
