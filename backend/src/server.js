const express = require("express");
const cors = require("cors");
const auth = require("./routes/auth");
const errorHandler = require("./middlewares/errorHandler");
const connectDB = require("./config/db");
require("dotenv").config();

connectDB();
const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.options("*", cors());
app.use(express.json());

app.use("/api/v1/auth", auth);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server started at http://localhost:${PORT}`)
);

















