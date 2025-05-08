const { nanoid } = require("nanoid");
const URL = require("../models/url");

async function handleGenerateNewShortURL(req,res){
  const body = req.body;
  if(!body.url){
    return res.status(400).json({msg: "URL is required!"});
  }
  
  const shortId = nanoid(8);

  await URL.create({
    shortId: shortId,
    redirectURL: body.url,
    visitHistory:[],
    createdBy: req.user._id //this is to show the urls of users that he has created
  })

  return res.render('home', {
    id: shortId
  })
}

async function handleRedirectUrl(req,res){
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
}

async function handleGetAnalytics(req,res){
  const shortId = req.params.shortId;
  const result = await URL.findOne({shortId});
  if (!result) {
    return res.status(404).json({ error: "Short URL not found" });
  }
  return res.json({
    totalClicks : result.visitHistory.length,
    visitHistory: result.visitHistory
  })
}

module.exports = {
  handleGenerateNewShortURL,
  handleRedirectUrl,
  handleGetAnalytics
}

