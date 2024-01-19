const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const dbConnect = require("./src/config/mongo");
const routes = require("./src/routes/index.routes");
const { configureSwagger } = require('./src/docs/swagger');
const swaggerUi = require("swagger-ui-express")
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;
const BACK_URL = process.env.BACK_URL || "http://localhost:";

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/", routes);

// Swagger Docs
configureSwagger(app, BACK_URL);  

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

// Start Server
async function startServer() {
  try {
    await dbConnect();
    app.listen(PORT, () => {
      console.log("Successfully connected to MongoDB");
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

startServer();
