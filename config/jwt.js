const jwt = require("jsonwebtoken");

const createJwtToken = async (id ,secret, time) => {
  console.log(id)
  const token = jwt.sign({ id }, secret, { expiresIn: time });
  return token
};

module.exports = createJwtToken;
