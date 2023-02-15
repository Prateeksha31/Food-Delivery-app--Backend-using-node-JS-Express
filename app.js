require("dotenv").config();

const express = require('express');
const app= express();


const {router} = require("./routes/route.js");
app.use(express.json());
app.use(router); 

app.listen(process.env.APP_PORT,()=>{
    console.log(`Server is open at  port number ${process.env.APP_PORT}`);
})


