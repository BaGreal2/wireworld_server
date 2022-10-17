const yup = require("yup");

exports.create = yup.object().shape({
  title: yup.string().required(),
  cell_arr: yup.string().required(),
  rows: yup.number().required(),
  cols: yup.number().required(),
  rating: yup.array().of(yup.number()).required(),
  creator: yup.string().required(),
});
