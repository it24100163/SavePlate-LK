const errorMiddleware = (error, req, res, next) => {
  if (res.headersSent) return next(error);

  if (error.name === "ValidationError") {
    const message = Object.values(error.errors)[0]?.message || "Invalid donation data.";
    return res.status(400).json({ success: false, message });
  }

  console.error(error);
  res.status(error.status || 500).json({
    success: false,
    message: error.status ? error.message : "Something went wrong on the server.",
  });
};

module.exports = errorMiddleware;
