const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const placesRoutes = require('./api/routes/places');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/user');
const alcoholRoutes =  require('./api/routes/alcohol');
const foodRoutes = require('./api/routes/food');
const sheeshaRoutes = require('./api/routes/sheesha');
const cartRoutes = require('./api/routes/cart');

mongoose.connect('mongodb+srv://arshbansal:'+ process.env.MONGO_ATLAS_PW + '@cluster0-qjlw2.mongodb.net/test?retryWrites=true&w=majority', {
    useNewUrlParser: true
});
mongoose.Promise = global.Promise;

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use('/food_images', express.static('food_images'));
app.use('/home_images', express.static('home_images'));
app.use('/critic_images', express.static('critic_images'));
app.use('/policy_files', express.static('policy_files'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.text()); //change to bodyparser.text() when using app and .json() when using postman

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Orgin", "*");
    res.header("Access-Control-Allow-Headers", 
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if(req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

app.use('/sheesha', sheeshaRoutes);
app.use('/food', foodRoutes);
app.use('/alcohol', alcoholRoutes);

app.use('/cart', cartRoutes);

app.use('/places', placesRoutes);
app.use('/orders', orderRoutes);
app.use('/user', userRoutes);

app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
})

app.use((error ,req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;