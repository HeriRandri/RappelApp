const auth = require("../controller/controlle");
const controller = require("../controller/authController");
const { Router } = require("express");
const verify = require("../milldeware/milldware");
const { verifiesToken } = require("../milldeware/generateAccessJWT");

const router = Router();
router.get("/signupGet", auth.signup_get);
router.post("/signUpPost", auth.upload.single("image"), auth.signup_post);
router.post("/loginPost", auth.login_post);
router.delete("/delete/:id", auth.delete);
router.put("/update/:id/:taskId", auth.update);
router.get("/get/:id", verifiesToken, auth.getId);
router.post("/addTaskId/:id", verifiesToken, auth.addTaskId);
router.get("/search/:seUser", auth.searchUser);

module.exports = router;
