//modules
const express = require('express');
const app = express();
const dev = require('morgan')
const mongoose = require('mongoose'); 
const passport = require('passport');

//routes
const users = require('./routes/users');
const profile = require('./routes/profile');
const posts = require('./routes/posts') 

const mongoUri = require('./config/keys').mongoUri;



//middleware
app.use(dev('dev'));
app.use(express.urlencoded({extended : false})); 
app.use(express.json());

//Mongo Connect

mongoose.connect(mongoUri, {useNewUrlParser : true})
    .then(() => console.log(`db connected`))
    .catch(err => console.log({error : 'db connection unsuccessful'})); 

//Passport middleware
passport.initialize();

//passport config
require('./config/passport')(passport); 

//routes
app.use('/users', users);
app.use('/profile', profile);
app.use('/posts', posts )


const PORT = process.env.PORT || 6000

app.listen(PORT, () => console.log(`server running on port ${PORT}`));
