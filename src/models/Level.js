const { model, Schema } = require("mongoose");

const Level = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    cell_arr: {
      type: String,
      required: true,
    },
    rows: {
      type: Number,
      required: true,
    },
    cols: {
      type: Number,
      required: true,
    },
    rating: {
      type: [Number],
      required: true,
    },
    creator: {
      type: String,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = model("Level", Level);
