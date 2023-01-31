const express = require("express");
const router = express.Router();
const prisma = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//CREATE USER
router.post("/create", async (req, res) => {
  try {
    const { username, userpassword } = req.body;

    if (!(username && userpassword)) {
      return res.status(400).send("Signing input are required");
    }

    const oldUser = await prisma.admin_record.findFirst({
      where: {
        username: {
          contains: username,
        },
      },
    });

    if (oldUser) {
      return res.status(400).send("User Already exist");
    } else {
      encryptPassword = await bcrypt.hash(userpassword, 10);

      const user = await prisma.admin_record.create({
        data: {
          username: username,
          userpassword: encryptPassword,
        },
      });

      const token = jwt.sign(
        { user_id: user.id, username },
        process.env.TOKEN_KEY,
        {
          expiresIn: "90d",
        }
      );
      user.token = token;
      return res.json(user);
    }
  } catch (error) {
    return res.json(error.message);
  }
});

//ADMIN LOG IN
router.post("/login", async (req, res) => {
  try {
    const { username, userpassword } = req.body;

    if (!(username && userpassword)) {
      return res.status(400).send("Login input required");
    }

    const user = await prisma.admin_record.findFirst({
      where: {
        username: {
          contains: username,
        },
      },
    });

    if (
      user.username === username &&
      user &&
      (await bcrypt.compare(userpassword, user.userpassword))
    ) {
      const token = jwt.sign(
        { user_id: user.id, username },
        process.env.TOKEN_KEY,
        {
          expiresIn: "90d",
        }
      );
      user.token = token;
      return res.status(200).json(user);
    }
    return res.json({ message: "Incorrect login details" });
  } catch (error) {
    return res.json(error.message);
  }
});

module.exports = router;
