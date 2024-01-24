const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const User = require("../models/User");

const authRoute = express.Router();

authRoute.use(bodyParser.json());

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags:
 *       - Auth
 *     summary: User registration
 *     description: Register a new user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       '201':
 *         description: Registration successful
 *       '400':
 *         description: Email is already registered
 *       '500':
 *         description: Internal server error
 */
authRoute.post("/register", async (req, res) => {
  try {
    const {
      name,
      image,
      email,
      phone,
      password,
      role,
      active,
      description,
      documentType,
      documentNumber,
    } = req.body;

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
      documentType,
      documentNumber,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();
    res.status(201).json({ message: "Registration successful" });
  } catch (error) {
    console.error("Error adding a user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: User login
 *     description: Log in with existing credentials.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@gmail.com
 *               password:
 *                 type: string
 *                 example: 123123
 *     responses:
 *       '200':
 *         description: Login successful
 *       '401':
 *         description: Incorrect email or password
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Internal server error
 */
authRoute.post("/login", async (req, res) => {
  try {
    let { email, documentNumber, password } = req.body;

    if (!documentNumber && !email) {
      return res
        .status(400)
        .json({ message: "Please provide documentNumber or email" });
    }

    let user;

    if (documentNumber) {
      user = await User.findOne({ documentNumber });
    }

    if (!user && email) {
      user = await User.findOne({ email });
    }

    if (!user) {
      return res
        .status(404)
        .json({ message: "Incorrect documentNumber, email, or password" });
    }

    const passwordMatch = bcrypt.compareSync(password, user.password);

    if (!passwordMatch) {
      return res
        .status(401)
        .json({ message: "Incorrect documentNumber, email, or password" });
    }

    const token = jwt.sign({ userId: user._id }, "secret");

    res.status(200).json({ token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     tags:
 *       - Auth
 *     summary: Get user profile
 *     description: Retrieve the user profile using a valid token.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 profile:
 *                   $ref: '#/components/schemas/User'
 *       '401':
 *         description: Token not provided or invalid
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Internal server error
 */
authRoute.get("/profile", async (req, res) => {
  try {
    const token = req.headers.token;

    if (!token) {
      return res.status(401).json({ message: "Token not provided" });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
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
        documentType: user.documentType,
        documentNumber: user.documentNumber,
        role: user.role,
        actived: user.actived,
        id: userId,
      };

      res.status(200).json({ profile: userProfile });
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * @swagger
 * /api/auth/profile/edit:
 *   put:
 *     tags:
 *       - Auth
 *     summary: Update user profile
 *     description: Update the user profile using a valid token.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               image:
 *                 type: string
 *               number:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 profile:
 *                   $ref: '#/components/schemas/User'
 *       '401':
 *         description: Token not provided or invalid
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Internal server error
 */
authRoute.put("/profile/edit", async (req, res) => {
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

module.exports = authRoute;
