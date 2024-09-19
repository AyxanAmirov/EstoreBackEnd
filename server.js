const dotenv = require("dotenv");
const express = require("express");
const db = require("./config/db");
const cors = require("cors");
const app = express();
const register = require("./routes/auth");
const login = require("./routes/login");

const PORT = process.env.PORT || 8000;
dotenv.config();
const corsOptions = {
  origin: '*', // Test üçün bütün domenlərə icazə verilir, istehsalda xüsusi domenlər təyin edin
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded());

app.use("/api", register);
app.use("/api", login);

db();
app.listen(PORT, () => {
  console.log("server was running on port: 8000");
});
