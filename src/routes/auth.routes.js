const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { name, image, email, phone, password, role, active, description } = req.body;
    
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    
    const newUser = new User({
      name,
      email,
      image,
      phone,
      role,
      active,
      description,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();
    res.status(201).json({ message: "Registration successful" });
  } catch (error) {
    console.error("Error adding a user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Incorrect email or password" });
    }

    const passwordMatch = bcrypt.compareSync(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Incorrect email or password" });
    }

    const token = jwt.sign({ userId: user._id }, "secret");

    res.status(200).json({ token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/profile", async (req, res) => {
  try {
    const token = req.headers.token;

    if (!token) {
      return res.status(401).json({ message: "Token not provided" });
    }

    jwt.verify(token, "secret", async (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Invalid token" });
      }

      const userId = decoded.userId;

      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const userProfile = {
        name: user.name,
        email: user.email,
        image: user.image,
        phone: user.phone,
        description: user.description,
        role: user.role,
        actived:user.actived,
        id: userId,
      };

      res.status(200).json({ profile: userProfile });
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/profile/edit", async (req, res) => {
  try {
    const token = req.headers.token;

    if (!token) {
      return res.status(401).json({ message: "Token not provided" });
    }

    jwt.verify(token, "secret", async (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Invalid token" });
      }

      const userId = decoded.userId;

      const updateFields = {};
      const { name, email, image, number, description } = req.body;

      if (name) updateFields.name = name;
      if (email) updateFields.email = email;
      if (image) updateFields.image = image;
      if (number) updateFields.number = number;
      if (description) updateFields.description = description;

      const updatedUser = await User.findByIdAndUpdate(userId, updateFields, {
        new: true,
        omitUndefined: true,
      });

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      const userProfile = {
        name: updatedUser.name,
        email: updatedUser.email,
        image: updatedUser.image,
        number: updatedUser.number,
        description: updatedUser.description,
        role: updatedUser.role,
      };

      res.status(200).json({ profile: userProfile });
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
