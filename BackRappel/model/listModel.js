const mongoose = require("mongoose");
const { isEmail } = require("validator");
const jwt = require("jsonwebtoken");

const listRappel = new mongoose.Schema({
  titre: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },

  date: {
    type: Date,
    required: true,
  },
  image: { type: String },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference the User model
    required: true, // Ensure that every task is linked to a user
  },
});

const userModel = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: [true, "Please enter an email"],
    unique: true,
    lowercase: true,
    validate: [isEmail, "Please enter a valid email"],
  },
  phone: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: [true, "Please enter a password"],
    minlength: [6, "Minimum password length is 6 characters"],
  },
  image: { type: String },
  role: {
    type: [String],
    enum: ["user", "admin"],
    default: "user",
  },
});
// userModel.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();
//   try {
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//     next();
//   } catch (err) {
//     next(err);
//   }
// });

userModel.method.generateTokenJWT = function () {
  let payload = {
    id: this._id,
  };
  return jwt.sign(payload, process.env.TOKEN_SECRETS, {
    expiresIn: " 20m",
  });
};

const Rappel = mongoose.model("rappel", listRappel);
const User = mongoose.model("user", userModel);
User.met;
module.exports = { Rappel, User };
