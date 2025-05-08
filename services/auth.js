const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.SECRET_KEY;

function setUser(user){
  const payload = {
    _id: user._id,
    email: user.email,
    role: user.role
  }
  const token =  jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
  return token;
}

function getUser(token){
  try{
    const user = jwt.verify(token, SECRET_KEY);
    return user;
  }
  catch(err){
    return null;
  }
}

module.exports = {
  setUser,
  getUser
}