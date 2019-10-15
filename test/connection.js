const mongoose = require("mongoose");


const env = process.env.NODE_ENV || 'dev';
const dbURL = "mongodb://localhost/";
const dbName = "cross-hr";


mongoose.connect(`${dbURL}${dbName}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});


mongoose.connection.once("open", () => {
    console.log("connected to database successfully");
}).on("error", (error) => {
    console.log("DB Connection Error: " + error)
});
