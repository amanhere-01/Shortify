const mongoose = require('mongoose');

const urlSchema = mongoose.Schema(
  {
    shortId: {
      type: String,
      required: true,
      unique: true
    },
    redirectURL : {
      type: String,
      required: true,
    },
    visitHistory : [    //Array of objects
      {
        timestamp: {
          type: String
        }
      }
    ],
    createdBy : {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users'
    }
  },
  {timestamps: true}
);

const URL = mongoose.model('url', urlSchema);

module.exports = URL;