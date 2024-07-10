const express = require("express");
require("dotenv").config();
const cors = require("cors");
const fileupload = require("express-fileupload");
const path = require("path");

const sequelize = require("./db.js");
const models = require("./models/models.js");
const router = require("./routes/index.js");
const ErrorHandler = require("./middleware/ErrorHandingMiddleware.js");

const app = express();
const PORT = process.env.PORT ?? 80;

/* =========================================== */

app.use(cors());
app.use(fileupload());
app.use(express.json());
app.use(express.static(path.resolve(__dirname, "static")));
app.use("/api", router);
app.use(ErrorHandler);
/* =========================================== */

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    app.listen(PORT, () =>
      console.log(
        `server listening on port ${PORT}. http://localhost${
          PORT != 80 ? ":" + PORT : ""
        }`
      )
    );
  } catch (err) {
    console.error(err);
  }
};

start();
