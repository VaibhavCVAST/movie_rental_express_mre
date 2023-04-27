const jwt = require("jsonwebtoken");
const config = require("config");

const verifyToken = async (req, res, next) => {
  const token = req.headers["x-auth-token"];
  console.log("token is ", token);
  if (!token)
    return res.status(400)
      .send({ success: false, message: "Access Denied ! Invalid jwt token" });
  try {
    const decode = jwt.verify(token, config.get("password"));
    req.user = decode;
  } catch (error) {
    res.status(401).send("Invalid Token !");
  }
  //   console.log(decode)
  return next();
};

module.exports = verifyToken;
