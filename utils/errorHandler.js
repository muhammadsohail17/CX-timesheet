const handleNotFound = (req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
};

const handleError = (error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
};

module.exports = { handleNotFound, handleError };
