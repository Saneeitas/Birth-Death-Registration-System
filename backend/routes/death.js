const express = require("express");
const router = express.Router();
const prisma = require("../db");
const auth = require("../middleware/auth");

//CREATE TODO
router.post("/create", async (req, res, next) => {
  const death_id = () => {
    return Math.random().toString(36).substr(3, 10);
  }
  try {
    const { Death_id, Fullname, Sex, Place_of_death, Nature_of_death } = req.body;
    
    if (!(Fullname && Sex && Place_of_death && Nature_of_death)) {
      return res.status(400).send("input required");
    }

    const findRecord = await prisma.death_record.findMany({
      where: {
        Death_id: {
          contains: Death_id,
        },
      },
    });

    if (findRecord.Death_id === death_id()) {
      return res.status(400).send("Record Already exist");
    } else {
      const date = new Date();
      await prisma.death_record.create({
        data: {
          Death_id: death_id(),
          Fullname: Fullname,
          Sex: Sex,
          Place_of_death: Place_of_death,
          DOD: date,
          Nature_of_death: Nature_of_death,
        },
      });
      res.json({ message: "Record created" });
    }
  } catch (error) {
    return res.json(error.message);
  }
  return next();
});

router.get("/getDeath", async (req, res) => {
  const allDeath = await prisma.death_record.findMany();
  return res.status(200).json(allDeath);
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.death_record.delete({
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
  const { Fullname, Sex, Place_of_death, Nature_of_death } = req.body;
  await prisma.death_record.update({
    where: {
      id: Number(id),
    },
    data: {
      Fullname,
      Sex,
      Place_of_death,
      Nature_of_death,
    },
  });
  return res.status(200).json({
    message: "Updated",
  });
});

module.exports = router;
