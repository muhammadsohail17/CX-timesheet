require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");

const corsErrorHandler = require("./utils/corsErrorHandler");
const { handleNotFound, handleError } = require("./utils/errorHandler");

// Importing route modules for various API endpoints
const invoiceRoutes = require("./api/routes/invoice");
const generateInvoiceRoutes = require("./api/routes/generateInvoice");
const renderUsersRoutes = require("./api/routes/cxUsers");
const taskRoutes = require("./api/routes/task");
const projectRoutes = require("./api/routes/project");
const loggingRoutes = require("./api/routes/logging");
const syncDataRoutes = require("./api/routes/syncData");
const authorizeDataRoutes = require("./api/routes/authorize");
const userRoutes = require("./api/routes/user");
const weeklySummary = require("./api/routes/cfWeeklySummary");

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//PREVENT CORS ERRORS
app.use(corsErrorHandler);
// Set ejs as express view engine
app.set("views", "views");
app.set("view engine", "ejs");

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
app.use("/invoice", generateInvoiceRoutes);
app.use("/render-users", renderUsersRoutes);
app.use("/tasks", taskRoutes);
app.use("/projects", projectRoutes);
app.use("/loggings", loggingRoutes);
app.use("/generate-weekly-summary", weeklySummary);

// Handle "Not Found" error
app.use(handleNotFound);

// Handle other errors
app.use(handleError);

module.exports = app;
