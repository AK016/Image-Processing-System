const express = require("express");
const app = express();
const apiRoutes = require("./routes/apiRoutes");

app.use(express.json());
app.use("/api", apiRoutes); 

module.exports = app;
