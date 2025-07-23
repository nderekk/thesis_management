const authStudent = (req, res, next) => {
  if ( req.user.role !== "student") {
    res.status(401)
    throw new Error("Not Authorized Endpoint");
  }
  next();
};

const authProfessor = (req, res, next) => {
  if ( req.user.role !== "professor") {
    res.status(401)
    throw new Error("Not Authorized Endpoint");
  }
  next();
};

module.exports = { authStudent, authProfessor };