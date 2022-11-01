module.exports = (schema) => async (req, res, next) => {
  try {
    //console.log(req);
    await schema.validate(req.body, { abortEarly: false });
    next();
  } catch (error) {
    console.log(error);
    res.status(422).json(error);
  }
};
