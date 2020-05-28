const jwt = require("jsonwebtoken")

module.exports = async (req, res, next) => {
    try {
        const bearerHeader = req.headers['authorization'];
        if(typeof(bearerHeader) !== 'undefined') {
        const decodedToken = bearerHeader.split(" ")[1];
        const verifiedToken = await jwt.verify(decodedToken, 'hashmysecret@');
        req.token = verifiedToken;
        } else {
        return res.status(403).json({status: res.statusCode, message: "Unauthorized"});
        }
            next();
    } catch(error) {
        return res.status(401).json({status: res.statusCode, message: "Auth failed"})
    }
  }