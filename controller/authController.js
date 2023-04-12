const employee = require("../modal/EmployeeModal");
const createJwtToken = require("../config/jwt");
const jwt = require('jsonwebtoken')

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const emp = await employee.findOne({ email });

    if (!emp || !(await emp.passwordCompare(password, emp.password))) {
      res.status(400).json({ error: "Wrong email or password" });
    } else {
      emp.password = null;
      const token = await createJwtToken(
        emp._id,
        process.env.JWT_SECRET,
        "90d"
      );
      const refreshToken = await createJwtToken(
        emp._id,
        process.env.JWT_SECRET,
        "90d"
      );

      const empWithToken = {
        ...emp.toObject(),
        token: token,
      };

      res.cookie("refresh_token", refreshToken, {httpOnly: true}).status(200).send(empWithToken);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: err.message });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refresh_token;
    if(!refreshToken){
      res.status(403).send({error:"Token is not present"})
    }else{
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);    
    const emp = await employee.findById(decoded.id)
    emp.password = null
    const token = await createJwtToken(
      emp._id,
      process.env.JWT_SECRET,
      "1m"
    );
    const empWithToken = {
      ...emp.toObject(),
      token: token,
    };
    res.status(200).send(empWithToken)
    }
  } catch (err) {
    console.log(err)
    res.status(500).send({ error: err.message });
  }
};

exports.changePassword = async (req,res)=>{
  try{
    console.log(req.body ,"req.body")
    console.log(req.employee)
    const emp = await employee.findById(req.employee._id)
    if(emp.passwordCompare(req.body.currentPassword,emp.password)){
      emp.password = req.body.password;
      await emp.save()
      res.status(201).send({message:"Password Changed Successfully"})
    }else{
      res.status(400).send({message:"Old password is Incorrect"})
    }
  }catch (err) {
    console.log(err)
    res.status(500).send({ error: err.message });
  }
}
