const express = require("express");
const bodyParser = require("body-parser");
const User = require("../models/User");
const userRoute = express.Router();

userRoute.use(bodyParser.json());
/**
 * @swagger
 * /api/user:
 *   get:
 *     tags:
 *       - User
 *     summary: Get all users
 *     description: Retrieve a list of all users.
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
userRoute.get("/", async (req, res) => {
  try {
    const users = await User.find();
    console.log("Route /user was called");
    res.json(users);
  } catch (error) {
    console.error("Error fetching users", error);
    res.status(500).json({ error: "Error fetching users" });
  }
});


/**
 * @swagger
 * /api/user/{id}:
 *   get:
 *     tags:
 *       - User
 *     summary: Get user by ID
 *     description: Retrieve a user by their ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful operation
 *       '404':
 *         description: User not found
 *         content:
 *           application/json:
 *             example:
 *               error: User not found
 *               message: The user with the specified ID was not found.
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               error: Error fetching user
 *               message: An error occurred while fetching the user.
 */
userRoute.get("/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    console.log("Route /USERS/" + userId + " was called");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user", error);
    res.status(500).json({ error: "Error fetching user" });
  }
});

/**
 * @swagger
 * /api/user/{id}:
 *   put:
 *     tags:
 *       - User
 *     summary: Update user by ID
 *     description: Update an existing user by their ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Updated user object
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '404':
 *         description: User not found
 *         content:
 *           application/json:
 *             example:
 *               error: User not found
 *               message: The user with the specified ID was not found.
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               error: Error updating user
 *               message: An error occurred while updating the user.
 *
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: '65aa899da62e0e5813581dfd'
 *         name:
 *           type: string
 *           example: 'user admin'
 *         image:
 *           type: string
 *           example: 'https://img.icons8.com/ios-glyphs/90/user--v1.png'
 *         email:
 *           type: string
 *           example: 'user@gmail.com'
 *         password:
 *           type: string
 *           example: '$2b$10$IlVhfg68DQpLKxPb6mmvUeQucHCJyJHQZAkmva4x0r/VVZZvDdX2S'
 *         role:
 *           type: string
 *           example: 'public'
 *         actived:
 *           type: boolean
 *           example: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: '2024-01-19T14:39:25.264Z'
 *         __v:
 *           type: integer
 *           example: 0
 */
userRoute.put("/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const updatedUserData = req.body;

    const updatedUser = await User.findByIdAndUpdate(userId, updatedUserData, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    console.log("User updated:", updatedUser);
    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user", error);
    res.status(500).json({ error: "Error updating user" });
  }
});

/**
 * @swagger
 * /api/user/{id}/delete:
 *   put:
 *     tags:
 *       - User
 *     summary: Delete user by ID
 *     description: Delete an existing user by their ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to delete.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '404':
 *         description: User not found
 *         content:
 *           application/json:
 *             example:
 *               error: User not found
 *               message: The user with the specified ID was not found.
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               error: Error updating user
 *               message: An error occurred while updating the user.
 */
userRoute.put("/:id/delete", async (req, res) => {
  try {
    const userId = req.params.id;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { actived: false },
      {
        new: true,
      }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    console.log("User deleted:", updatedUser);
    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user", error);
    res.status(500).json({ error: "Error updating user" });
  }
});

module.exports = userRoute;
