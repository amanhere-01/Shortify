const { nanoid } = require("nanoid");
const URL = require("../models/url");

async function handleGenerateNewShortURL(req,res){
  const body = req.body;
  if(!body.url){
    return res.status(400).json({msg: "URL is required!"});
  }
  
  const existingUrl = await URL.findOne({ redirectURL: body.url });
  if(existingUrl){
    return res.render('home', {
      msg: 'Url already exists',
      existingId: existingUrl.shortId
    })
  }
  const shortId = nanoid(8);

  await URL.create({
    shortId: shortId,
    redirectURL: body.url,
    visitHistory:[]
  })

  return res.render('home', {
    id: shortId
  })
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
  handleGetAnalytics
}

