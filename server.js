//modules
const express = require('express');
const app = express();
const dev = require('morgan')
const mongoose = require('mongoose'); 

const users = require('./routes/users')
const mongoUri = require('./config/keys').mongoUri;


//middleware
app.use(dev('dev'));
app.use(express.urlencoded({extended : false})); 
app.use(express.json());

//mongoconnect

mongoose.connect(mongoUri, {useNewUrlParser : true})
    .then(() => console.log(`db connected`))
    .catch(err => console.log({error : 'db connection unsuccessful'})); 


//routes
app.use('/users',users);


const PORT = process.env.PORT || 6000

app.listen(PORT, () => console.log(`server running on port ${PORT}`));
