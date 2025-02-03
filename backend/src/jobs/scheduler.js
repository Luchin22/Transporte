const cron = require("node-cron");
const moment = require("moment");
const { Horario, Bus, Asiento } = require("../models");
const { actualizarEstadoBus } = require("../utils/actualizarEstadoBus");

cron.schedule("* * * * *", async () => {
    console.log("Ejecutando tarea programada para actualizar estado y capacidad de los buses...");
    try {
        const horarios = await Horario.findAll({
            include: [{ model: Bus }],
        });

        for (const horario of horarios) {
            await actualizarEstadoBus(horario);
        }
    } catch (error) {
        console.error("Error al actualizar el estado o la capacidad de los buses:", error);
    }
});

console.log("Tarea programada configurada con éxito.");

