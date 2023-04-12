const employee = require("../modal/EmployeeModal");

exports.addEmployee = async (req, res) => {
  const {
    name,
    email,
    phone,
    password,
    department,
    role,
    basicSalary,
    houseRentAllowance,
    specialAllowance,
    deduction,
    birthday,
  } = req.body;

  try {
    const existingEmployee = await employee.findOne({ email: email });

    if (existingEmployee) {
      res.status(400).json({ error: "Employee already exist" });
    } else {
      const newEmployee = new employee({
        name,
        email,
        phone,
        password,
        department,
        role,
        basicSalary,
        houseRentAllowance,
        specialAllowance,
        deduction,
        birthday,
      });
      const result = await newEmployee.save();
      res.status(201).send(result);
    }
  } catch (err) {
    res.status(500).send({error:err.message})
  }
};

exports.getEmployees = async (req,res) =>{
  try{
    const employees = await employee.find(req?.query)
    res.status(200).send(employees)
  }catch(err){
    res.status(500).json({error:err.message})
  }
}