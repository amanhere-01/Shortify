require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser')
const connectToMongoDB = require('./connect');

const urlRouter = require('./routes/url');
const staticRouter = require('./routes/staticRouter');
const userRouter = require('./routes/user');
const { checkForAuthentication, restrictTo} = require('./middlewares/auth');

const app = express();
const PORT = 8001;

//connection to MongoDB
connectToMongoDB(process.env.MONGODB_URL)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(`Error: ${err}`));


app.set('view engine', 'ejs');  //telling express the view engine we are using is ejs
app.set('views', path.resolve('./views'));  //telling express the path of ejs files

//middleware to parse the json,form data and cookies
app.use(express.json()) 
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(checkForAuthentication);

//Routes
app.use('/url', restrictTo(['NORMAL','ADMIN']), urlRouter); //All routes starting with /url will first go through the restrictTo middleware.
app.use('/user', userRouter);
app.use('/', staticRouter);  //Home page





app.listen(PORT, () => console.log(`Server started at ${PORT}`));
