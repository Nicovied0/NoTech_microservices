const express = require("express");
const dbConnect = require("./src/config/mongo");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const userRoute = require("./src/routes/user.routes");
const authRoute = require("./src/routes/auth.routes");
const uploadImageRoute = require("./src/routes/uploadImage.routes");


const app = express();
const PORT = process.env.PORT || 3001;


const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "NoTech microservice",
      version: "1.0.0",
    },
  },
  servers: [
    {
      url: "https://notech-microservice.vercel.app/",
      description: "My API Documentation",
    },
  ],
  apis: ["src/**/*.js"],
};

const specs = swaggerJsDoc(options);

const CSS_URL =
  "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css";

app.use(
  "/api/docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, {
    customCss:
      ".swagger-ui .opblock .opblock-summary-path-description-wrapper { align-items: center; display: flex; flex-wrap: wrap; gap: 0 10px; padding: 0 10px; width: 100%; }",
    customCssUrl: CSS_URL,
  })
);

app.use("/api/user",userRoute)
app.use("/api/auth",authRoute)
app.use("/api/newImage",uploadImageRoute)

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
