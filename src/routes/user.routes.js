const express = require("express");
const router = express.Router();
const User = require("../models/User");


router.get("/", async (req, res) => {
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
router.get("/:id", async (req, res) => {
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



router.put("/:id", async (req, res) => {
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
  
router.put("/:id/delete", async (req, res) => {
    
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
  


module.exports = router;
