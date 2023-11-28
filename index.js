const express = require('express');
const { connect } = require('mongoose');
const app = express();
const port = 3000;
const morgan = require('morgan');
const connectDB = require('./connection/connection');
const { Router } = require('express');
const router = require('./routes/router');
const cors = require('cors')


connectDB();
app.use(morgan('dev'));
app.use(cors)
app.use(express.json());


app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use("/api", router);


const server = app.listen(port, () => {
    const { address, port } = server.address();
    console.log(`Example app listening at http://${address}:${port}`);
});
