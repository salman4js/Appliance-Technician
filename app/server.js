const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const endPoints = require('../routes/routes');

// Initialize the app!
const app = express();
app.use(bodyParser.json());
app.use(cors());

// Initialize routes!
app.use("/", endPoints);

// Database connection!
const database = "mongodb+srv://salman4javascript:salman4js@cluster0.98pct.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(database,{
   useNewUrlParser : true
})

mongoose.connection.on("connected", () => {
   console.log("DB connection initiated...");

})

mongoose.connection.on("error",(err) => {
   console.log("DB connection failed...", err);
})


app.listen(8080, () => {
   console.log('Server is running...');
});