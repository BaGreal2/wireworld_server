const { model, Schema } = require("mongoose");

const Schemaa = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    cell_arr: {
      type: String,
      required: true,
    },
    size: {
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
    creatorName: {
      type: String,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = model("Schema", Schemaa);
