const express = require('express');
const path = require('path');
const urlRouter = require('./routes/url');
const staticRouter = require('./routes/staticRouter');
const connectToMongoDB = require('./connect');
const URL = require('./models/url');

const app = express();
const PORT = 8001;

//connection to MongoDB
connectToMongoDB("mongodb://localhost:27017/short-url")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(`Error: ${err}`));


app.set('view engine', 'ejs');  //telling express the view engine we are using is ejs
app.set('views', path.resolve('./views'));  //telling express the path of ejs files

//middleware to parse the json and form data
app.use(express.json()) 
app.use(express.urlencoded({extended: false}));

//Routes
app.use('/url', urlRouter);
app.use('/', staticRouter)


app.get('/url/:shortId', async (req,res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    {shortId},
    {
      $push: {
        visitHistory: {
          timestamp : new Date().toLocaleString(),
        }
      }
    }
  )

  return res.redirect(entry.redirectURL);
})

app.listen(PORT, () => console.log(`Server started at ${PORT}`));
