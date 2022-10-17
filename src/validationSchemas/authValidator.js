const yup = require("yup");

exports.create = yup.object().shape({
  email: yup.string().required().min(1),
  username: yup.string().required().min(4).max(13),
  password: yup.string().required().min(8).max(20),
});
