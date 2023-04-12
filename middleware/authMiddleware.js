const jwt = require("jsonwebtoken");
const employee = require('../modal/EmployeeModal');

const verifyEmployee = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    var decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.employee = await employee.findById(decoded.id)
    next()
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};

module.exports = verifyEmployee;
// pedro tech
// freecodecamp - > node 4 projects