const { User, Rappel } = require("../model/listModel");
const bcrypt = require("bcrypt");
const { validationSignup } = require("./validateSignup");
const { generateAccessJWT } = require("../milldeware/generateAccessJWT");
const path = require("path");
const multer = require("multer");

require("dotenv").config();
module.exports.signup_get = (req, res) => {
  res.send("Signup Get");
};
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../Images");
    console.log(`Upload path: ${uploadPath}`);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    console.log(`File: ${file.originalname}`);
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

module.exports.upload = multer({ storage: storage });
module.exports.signup_post = async (req, res, next) => {
  // console.log(req.file);
  try {
    const { name, email, phone, username, password, confirmPassword } =
      req.body;
    const image = req.file ? req.file.filename : null;
    // console.log("voici ", image);

    const { error } = validationSignup(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    let userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(409).json("that email is already in use");
    } else if (confirmPassword !== password) {
      return res.status(403).json("Password do not match");
    }

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      name,
      email,
      phone,
      username,
      password: hashPassword,
      image,
      // imagePath: req.file.path,
    });
    const saveUser = await newUser.save();
    const { role, ...user_data } = saveUser._doc;
    console.log(user_data);

    res.status(200).json({
      status: "success",
      data: [user_data],
      message:
        "Thank you for registering with us. Your account has been successfully created.",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      code: 500,
      data: [],
      message: "Internal Server Error",
    });
    next(error);
  }
};

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        status: "failed",
        data: [],
        message:
          "Invalid email or password. Please try again with the correct credentials.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({
        status: "failed",
        data: [],
        message:
          "Invalid password. Please try again with the correct credentials.",
      });
    let options = {
      maxAge: 20 * 60 * 1000, // would expire in 20minutes
      httpOnly: true, // The cookie is only accessible by the web server
      secure: true,
      sameSite: "None",
    };
    const token = generateAccessJWT(user);
    if (!token) {
      console.log("erreur de generer le token ");
    }
    // res.cookie("SessionID", token, options); // set the token to response header, so that the client sends it back on each subsequent request
    res.status(200).json({
      status: "success",
      message: "You have successfully logged in.",
      token,
      user,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      code: 500,
      data: [],
      message: "Internal Server Error",
    });
    console.log(error);
  }
};

// module.exports.auth = (req, res) => {
//   console.log("test");
//   res.json({ message: "Bienvenue", auth: true, user });
// };

// module.exports.addTask = async (req, res) => {
//   try {
//     const { titre, description, date } = req.body;
//     if (!titre || !description || !date) {
//       return res.status(400).json({ message: "All fields are required" });
//     }
//     const newList = new Rappel({ titre, description, date });
//     await newList.save();
//     res.json(newList);
//   } catch (error) {
//     console.error("Error adding task:", error);
//     if (!res.headersSent) {
//       return res.status(500).json({ error: "Internal server error" });
//     }
//   }
// };

// module.exports.listRappel = async (req, res) => {
//   try {
//     const user = req.user;
//     console.log(user);

//     const data = await Rappel.find({});
//     if (data.length === 0) {
//       return res.status(404).json({ msg: "No data found" });
//     }
//     res.status(200).json({ data: data, user });
//   } catch (error) {
//     console.error(error);
//   }
// };

module.exports.getId = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!id) {
      return res.status(400).json({ message: "User not found" });
    }
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouve" });
    }
    const task = await Rappel.find({ userId: user._id })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    // if (task.length === 0) {
    //   return res.status(404).json({ message: "No data Found" });
    // }
    const total = await Rappel.countDocuments();
    return res.status(200).json({ data: task, user, total });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports.addTaskId = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "userId est requis" });
    }
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    const task = new Rappel({ ...req.body, userId: user._id });

    await task.save();
    res.status(201).json(task);
  } catch (error) {
    console.error("Erreur lors de l'ajout de la tâche:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

module.exports.searchUser = async (req, res) => {
  try {
    const { seUser } = req.params;
    const user = await User.find({
      username: { $regex: seUser },
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
    console.log(`c'est l'${error}`);
  }
};

module.exports.delete = async (req, res) => {
  try {
    const { id: taskID } = req.params;
    const task = await Rappel.findOneAndDelete({ _id: taskID });
    if (!task) {
      return res.status(404).json({ msg: `No task with id': ${taskID}` });
    }
    res.status(200).json({ task });
  } catch (error) {
    console.log(error);
  }
};

module.exports.update = async (req, res) => {
  try {
    const { id, taskId } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    const updatedTask = await Rappel.findByIdAndUpdate(taskId, req.body, {
      new: true,
    });
    if (updatedTask) {
      return res.json(updatedTask);
    } else {
      return res.status(404).send("task not found");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
