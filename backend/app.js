const express = require("express");
const cors = require("cors");
require("dotenv").config();

const routes = require("./routes");
const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors({
  origin: "*"
}));
app.use(express.json());

app.use("/", routes);

app.get("/", (req, res) => {
  res.send("API running");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});