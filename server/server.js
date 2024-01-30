require('dotenv').config();
const cors = require('cors');
const express = require('express');
const mongoDB = require('./config/mongoose');
const PORT = process.env.PORT || 8000;
const server = express();

//middlewares
server.use(cors());
server.use(express.json());
server.use(express.urlencoded({extended: true}));

//routing
server.use('/', require('./routes/index'));

server.listen(PORT, (err) => {
    if(err){
        console.log(err);
        return;
    }

    console.log(`Server running on PORT ${PORT}`);
});