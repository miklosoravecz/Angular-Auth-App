const express = require('express');
const path = require('path');
const cors = require ('cors');
const passport = require ('passport');
const mongoose = require ('mongoose');
const config = require('./config/database');

//Connect to database
mongoose.connect(config.database, { useNewUrlParser: true, useUnifiedTopology: true,  useFindAndModify: false });

//On connection
mongoose.connection.on('connected', () => {
    console.log('Connected to DB ' + config.database);
});

//Check error
mongoose.connection.on('error', (err) => {
    console.log('Database error: ' + err);
});


const app = express();

const users = require('./routes/users');

const port = 3000;


//CORS middleware
app.use(cors());

//Set static folder
app.use(express.static(path.join(__dirname, 'public')));

//Express body parser middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

app.use('/users', users);

//Index route
app.get('/', (req, res) => {
    res.send('Invalid endpoint!!');
});

app.listen(port, ()=> {
    console.log(`Server started on port ${port}`);
});