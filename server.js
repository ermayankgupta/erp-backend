const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require('cookie-parser')

const employeeRoute = require('./routes/employeeRoutes');
const authRoute = require('./routes/authRoute');
const attendenceRoute = require('./routes/attendenceRoute');
const featureRoute = require('./routes/FeatureAllowedRoute');
const holidayRoute = require('./routes/holidayRoute');

const app = express();

dotenv.config();

require('./config/mongoDb');
app.use(cors({
  origin:["https://erp-frontend-six.vercel.app","http://localhost:3000","http://localhost:3001","http://localhost:3002","http://localhost:3003"],
  credentials:true
}));
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser())

const port = process.env.PORT || 8000;

app.listen(port, () => console.log("Server running on port 8000"));

app.use("/api/v1/employee",employeeRoute)
app.use("/api/v1/auth",authRoute)
app.use("/api/v1/attendence",attendenceRoute)
app.use('/api/v1/features',featureRoute)
app.use('/api/v1/holiday',holidayRoute)