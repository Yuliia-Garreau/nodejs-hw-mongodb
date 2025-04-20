export const errorHandler = (err, req, res, next) => {
  // console.log(err);

  const { status = 500, message = 'Server error' } = err;
  res.status(status).json({
    message,
  });
};
