const express = require("express");

const schemaValidate = require("../middlewares/schemaValidate");
const { levelValidator } = require("../validationSchemas");
const Level = require("../models/Level");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  try {
    let { search = "", perPage = 6, page = 1, sortOrder = -1 } = req.query;
    if (page === "") {
      page = 1;
    }
    //console.log(req.user.username);

    const levels = await Level.find(
      {
        $and: [
          {
            title: {
              $regex: search,
              $options: "i",
            },
          },
        ],
      },
      null,
      {
        limit: Number(perPage),
        skip: (Number(page) - 1) * Number(perPage),
      }
    );
    const count = await Level.countDocuments({
      title: {
        $regex: search,
        $options: "i",
      },
    });

    res.json({
      levels,
      count: count,
      activePage: Number(page),
      perPage: Number(perPage),
      pagesCount: Math.ceil(count / Number(perPage)),
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

router.post(
  "/",
  schemaValidate(levelValidator.create),
  authMiddleware,
  async (req, res) => {
    try {
      const newLevel = await Level.create({
        title: req.body.title,
        cell_arr: req.body.cell_arr,
        rows: req.body.rows,
        cols: req.body.cols,
        rating: req.body.rating,
        creator: req.body.creator,
      });

      res.status(201).json(newLevel);
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  }
);

router.put("/:_id", authMiddleware, async (req, res) => {
  try {
    const level = await Level.findById(req.params._id);

    if (level.creator !== req.user.username) {
      res.status(403).json({ message: "Error 403" });
      return;
    }

    const editedLevel = await Level.findByIdAndUpdate(
      req.params._id,
      req.body,
      {
        new: true,
      }
    );

    res.json({ editedLevel });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

module.exports = router;
