const authStudent = (req, res, next) => {
  if ( req.user.role !== "student") {
    res.status(401)
    throw new Error("Not Authorized Endpoint");
  }
};

module.exports = { authStudent };