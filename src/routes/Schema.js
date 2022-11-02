const express = require("express");

const schemaValidate = require("../middlewares/schemaValidate");
const { schemaValidator } = require("../validationSchemas");
const Schema = require("../models/Schema");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    let { search = "", perPage = 6, page = 1, sortOrder = -1 } = req.query;
    if (page === "") {
      page = 1;
    }

    const schemas = await Schema.find(
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
    const count = await Schema.countDocuments({
      title: {
        $regex: search,
        $options: "i",
      },
    });

    res.json({
      schemas,
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

router.post("/", schemaValidate(schemaValidator.create), async (req, res) => {
  try {
    const newSchema = await Schema.create({
      title: req.body.title,
      description: req.body.description,
      cell_arr: req.body.cell_arr,
      size: req.body.size,
      rating: req.body.rating,
      creator: req.body.creator,
      creatorName: req.body.creatorName,
    });

    res.status(201).json(newSchema);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

router.put("/:_id", async (req, res) => {
  try {
    const editedSchema = await Schema.findByIdAndUpdate(
      req.params._id,
      req.body,
      {
        new: true,
      }
    );
    res.json({ editedSchema });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

router.get("/:_id", async (req, res) => {
  try {
    const schema = await Schema.findById(req.params._id);
    res.json({ schema });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

router.delete("/:_id", async (req, res) => {
  try {
    const schema = await Schema.findById(req.params._id);
    console.log(req.body.userId);
    if (schema.creator !== req.body.userId) {
      res.status(403).json({ message: "Can't delete not your post!" });
      return;
    }
    await Schema.findByIdAndDelete(req.params._id);
    res.json({ message: "Done" });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

module.exports = router;
