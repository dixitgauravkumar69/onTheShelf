const express = require("express");
const router = express.Router();
const User = require("../models/Users");

router.use(express.json());

// Signup User
router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists!" });
    }

    // Create new user
    const user = await User.create({ username, email, password });
    res.status(201).json({ success: true, user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
