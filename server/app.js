const express = require("express");
const mongoose = require("mongoose");
const app = express();
const { MONGOURI } = require("./key");
const User = require("./models/user");
const cors = require('cors')
const PORT = 5000;


app.use(cors())
// Connection to Mongo Atlas
mongoose
  .connect(MONGOURI)
  .then(() => {
    console.log("Connected to Database");
  })
  .catch((error) => {
    console.log("Failed to connect to Database", error);
  });


  //export schema
  require('./models/post')

  //middleWear
app.use(express.json());

//routes
app.use(require("./routes/auth"));
app.use(require("./routes/post"))
app.use(require("./routes/user"))


app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
