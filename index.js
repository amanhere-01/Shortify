const express = require('express');
const urlRouter = require('./routes/url');
const connectToMongoDB = require('./connect');
const URL = require('./models/url');

const app = express();
const PORT = 8001;

//connection to MongoDB
connectToMongoDB("mongodb://localhost:27017/short-url")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(`Error: ${err}`));


app.use(express.json())

//Routes
app.use('/url', urlRouter);


app.get('/:shortId', async (req,res) => {
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
