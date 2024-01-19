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
    apis: ["./src/routes/*.js"],
  };
  

const swaggerSpec = swaggerJSDoc(options);

const configureSwagger = (app, port) => {
    app.use(
        "/api/docs",
        swaggerUi.serve,
        swaggerUi.setup(swaggerSpec, {
          swaggerOptions: {
            url: "/api/docs.json",
          },
        })
      );
  app.get("/api/docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });
  console.log(
    `Swagger documentation available at http://localhost:${port}/api/docs`
  );
};

module.exports = { configureSwagger };
