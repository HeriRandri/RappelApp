const jwt = require("jsonwebtoken");
const { User } = require("../model/listModel");

const generateAccessJWT = (user) => {
  let payload = {
    id: user._id,
  };
  const token = jwt.sign(payload, process.env.TOKEN_SECRETS, {
    expiresIn: "20m",
  });
  return token;
};

const verifiesToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) {
      return res.sendStatus(401);
      console.log(process.env.TOKEN_SECRETS);
    }
    jwt.verify(token, process.env.TOKEN_SECRETS, async (err, decode) => {
      if (err) {
        return res
          .status(401)
          .json({ message: "This session is expire , please login again" });
      }

      const { id } = decode;
      const user = await User.findById(id);
      const { password, ...data } = user._doc;
      req.user = data;
      next();
    });
  } catch (error) {
    res.status(500).json("Internal Server Error");
  }
};

module.exports = { generateAccessJWT, verifiesToken };
