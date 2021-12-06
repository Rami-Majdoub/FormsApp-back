require('dotenv').config();

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const port = process.env.PORT || 3000;

// setup express
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// define routes
const formController = require("./controllers/form-controller");
const authController = require("./controllers/auth-controller");
app.use("/forms", formController);
app.use("/auth", authController);

// connect to database and listen for requests
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to mongoDB');

    app.listen(port, () => {
        console.log(`Server started on port ${port}`);
    });

}).catch(err => {
    console.log(err);
});
