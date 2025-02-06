require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sequelize = require("./config/config");
const routes = require("./routes");
const cron = require("./jobs/scheduler"); // Asegúrate de que este archivo existe
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY); // Asegúrate de tener tu clave secreta de Stripe



const app = express();
const PORT = process.env.PORT || 3005;

// Middlewares
app.use(express.json());

// Configuración de CORS
app.use(cors({
    origin: "http://localhost:8081",  // Cambia a la URL de tu frontend
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));


// Middleware de manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Ocurrió un error en el servidor." });
});

// Rutas
app.use("/api", routes);
router.get('/get-public-key', (req, res) => {
    res.json({ publicKey: process.env.STRIPE_PUBLIC_KEY });
  });
  
  // Ruta para crear el PaymentIntent
  router.post('/create-payment-intent', async (req, res) => {
    const { amount } = req.body; // El monto del pago que se va a procesar
  
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100, // Stripe trabaja en centavos
        currency: 'usd', // Cambia a la moneda que necesites
        automatic_payment_methods: { enabled: true },
      });
  
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: error.message });
    }
  });
// Sincronización de Sequelize e inicialización de datos
sequelize.sync({ force: false })
    .then(async () => {
        console.log("Tablas sincronizadas con éxito.");
        

        // Iniciar servidor
        app.listen(PORT, () => {
            console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Error al sincronizar las tablas:", error);
    });

module.exports = { app, sequelize };
