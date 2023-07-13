require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");

// Importing route modules for various API endpoints
const invoiceRoutes = require("./api/routes/invoice");
const generateInvoiceRoutes = require("./api/routes/generate-invoice");
const renderUsersRoutes = require("./api/routes/cx_users");
const taskRoutes = require("./api/routes/task");
const projectRoutes = require("./api/routes/project");
const LoggingRoutes = require("./api/routes/logging");
const syncDataRoutes = require("./api/routes/syncData");
const authorizeDataRoutes = require("./api/routes/authorize");
const userRoutes = require("./api/routes/user");

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//PREVENT CORS ERRORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

app.get("/", (req, res) => {
  res.status(200).json({
    message: "It works",
  });
});

//Routes which should handle requests
app.use("/user", userRoutes);
app.use("/authorize", authorizeDataRoutes);
app.use("/sync-data", syncDataRoutes);
app.use("/invoice", invoiceRoutes);
app.use("/invoice/generate-invoice", generateInvoiceRoutes);
app.use("/render-users", renderUsersRoutes);
app.use("/tasks", taskRoutes);
app.use("/projects", projectRoutes);
app.use("/loggings", LoggingRoutes);

//handle error
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
