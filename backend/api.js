const express = require("express");
const router = express.Router();
const prisma = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");

router.post("/registration", async (req, res) => {
  try {
    const { username, userpassword } = req.body;

    if (!(username && userpassword)) {
      return res.status(400).send("Signing input are required");
    }

    const oldUser = await prisma.users.findFirst({
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

      const user = await prisma.users.create({
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

router.post("/login", async (req, res) => {
  try {
    const { username, userpassword } = req.body;

    if (!(username && userpassword)) {
      return res.status(400).send("Login input required");
    }

    const user = await prisma.users.findFirst({
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

router.get("/getUser", auth, async (req, res) => {
  const users = await prisma.users.findMany();
  return res.status(200).json(users);
});

router.get("/user/:id", async (req, res) => {
  const { id } = req.params;
  const user = await prisma.users.findUnique({
    where: {
      id: Number(id),
    },
  });
  return res.json(user);
});

router.delete("/delete/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.users.delete({
      where: {
        id: Number(id),
      },
    });
    return res.status(200).json({
      message: "deleted",
    });
  } catch (error) {
    return res.json(error.message);
  }
});

router.put("/edit/:id", auth, async (req, res) => {
  const { id } = req.params;
  const { username, userpassword } = req.body;
  await prisma.users.update({
    where: {
      id: Number(id),
    },
    data: {
      username,
      userpassword,
    },
  });
  return res.status(200).json({
    message: "Updated",
  });
});

module.exports = router;
