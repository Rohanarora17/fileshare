const express = require("express");
const mongoose = require("mongoose");
const urlRoute = require("./routes/index");
require("dotenv").config();
const port = process.env.PORT || 3000;

const app = express();

mongoose
  .connect("mongodb://localhost:27017/fileshare", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database Connected Successfully!");
  })
  .catch((error) => {
    console.log("Could not connect to database", error);
    process.exit();
  });

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use("/", urlRoute);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
