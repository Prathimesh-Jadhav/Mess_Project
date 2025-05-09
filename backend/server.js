require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");
const mongoose = require("mongoose");
const {completeRegistration} = require("./controllers/membersController");


const app = express();

// Middleware
app.options('*', cors());
app.use(helmet()); // Security headers
app.use(cors({origin:'*' || process.env.CORS_ORIGIN, credentials: true })); // CORS
app.use(express.json()); // JSON parsing
app.use(express.urlencoded({ extended: true })); // URL encoding
app.use(mongoSanitize()); // Prevent NoSQL injection


const PORT = process.env.PORT || 5000;

//connect to db:
mongoose.connect(process.env.MONGODB_URI).then(() => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch((error) => {
  console.error("Error connecting to MongoDB:", error);
});

//import routes:
const messDetailsRoutes = require("./routes/messDetailsRoutes");
const memberRoutes = require("./routes/memberRoutes");
const userRoutes = require("./routes/userRoutes");
const mealsRoutes = require("./routes/mealsRouter");
const todaysMenu = require("./routes/todaysMenu");
const paymentsRouter = require("./routes/paymentsRoute");

const paymentsModel = require("./models/paymentsModel");

// app.use(handleMissedMeals)
// app.use(processMonthlyPaymentsJob)
app.use("/api/messDetails", messDetailsRoutes);
app.use('/api/members',memberRoutes)
app.use('/api/users',userRoutes)
app.use('/api/meal',mealsRoutes)
app.use('/api/menu',todaysMenu)
app.use('/api/payments',paymentsRouter)
app.get('/verify-email/:token', completeRegistration)







