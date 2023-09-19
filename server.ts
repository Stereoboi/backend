import "reflect-metadata";
import bodyParser from "body-parser";
import express from "express";
import session from "express-session";
import "dotenv/config";

import AppRouter from "./src/routes/index";
import connectDB from "./src/config/database";
import ErrorHandler from "./src/middleware/errorHandler";

const cors = require("cors");

const app = express();
app.use(cors());

const router = new AppRouter(app);
// Connect to Postgress
connectDB();

// Express configuration
app.set("port", process.env.PORT || 4200);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  session({
    secret: "secret",
    saveUninitialized: false,
    resave: false,
  })
);

router.init();

const port = app.get("port");
const server = app.listen(port, "0.0.0.0", () => {
  return console.log(`Server started on port ${port}`);
});
app.use(ErrorHandler);

export default server;
