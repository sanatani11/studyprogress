const express = require("express");
const cors = require("cors");
const database = require("./database");
const studentPath = require("./routes/student");
const adminPath = require("./routes/admin");
const dashboardPath = require("./routes/dashboard");
const progressPath = require("./routes/progress");
const comparePath = require("./routes/compare");

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/", studentPath);
app.use("/admin", adminPath);
app.use("/dashboard", dashboardPath);
app.use("/progress", progressPath);
app.use("/compare", comparePath);

// Export the app
module.exports = app;
