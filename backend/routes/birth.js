const express = require("express");
const router = express.Router();
const prisma = require("../db");
const auth = require("../middleware/auth");

//CREATE TODO
router.post("/create", async (req, res, next) => {
  const birth_id = () => {
    return Math.random().toString(36).substr(2, 9);
    //return Math.floor(Math.random()*Date.now())
  }
  try {
    const { Birth_id, Fullname, Sex, Place_of_birth, Weight } = req.body;
    
    if (!(Fullname && Sex && Place_of_birth && Weight)) {
      return res.status(400).send("input required");
    }

    const findRecord = await prisma.birth_record.findMany({
      where: {
        Birth_id: {
          contains: Birth_id,
        },
      },
    });

    if (findRecord.Birth_id === birth_id()) {
      return res.status(400).send("Record Already exist");
    } else {
      const date = new Date();
     // const birth_id = Math.random().toString(36).substr(2, 9);
      await prisma.birth_record.create({
        data: {
          Birth_id: birth_id(),
          Fullname: Fullname,
          Sex: Sex,
          Place_of_birth: Place_of_birth,
          DOB: date,
          Weight: Weight,
        },
      });
      res.json({ message: "Record created" });
    }
  } catch (error) {
    return res.json(error.message);
  }
  return next();
});

router.get("/getBirth", async (req, res) => {
  const allBirth = await prisma.birth_record.findMany();
  return res.status(200).json(allBirth);
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.birth_record.delete({
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

router.put("/edit/:id", async (req, res) => {
  const { id } = req.params;
  const { Fullname, Sex, Place_of_birth, Weight } = req.body;
  await prisma.birth_record.update({
    where: {
      id: Number(id),
    },
    data: {
      Fullname,
      Sex,
      Place_of_birth,
      Weight,
    },
  });
  return res.status(200).json({
    message: "Updated",
  });
});




module.exports = router;
