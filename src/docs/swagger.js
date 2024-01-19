// src/docs/swagger.js

const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Your API Documentation",
      version: "1.0.0",
      description: "API documentation for your application.",
    },
  },
  apis: ["./src/routes/*.js", "./src/routes/**/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

const configureSwagger = (app, port) => {
  // Serve Swagger UI assets
  app.use("/api/docs", swaggerUi.serve);

  // Serve Swagger JSON spec
  app.get("/api/docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });

  // Swagger UI setup
  app.get("/api/docs", swaggerUi.setup(swaggerSpec, { explorer: true }));

  console.log(`Swagger documentation available at http://localhost:${port}/api/docs`);
};

module.exports = { configureSwagger };
