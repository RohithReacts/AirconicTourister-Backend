const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router();

router.post("/signup", authController.SignUpUser);
router.post("/signin", authController.SignInUser);
router.post("/signout", authController.SignOutUser);

module.exports = router;
