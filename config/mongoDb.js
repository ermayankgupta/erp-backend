const mongoose = require("mongoose");

mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.DB, {
    useNewUrlParser: true,
  })
  .then((conn) => {
    console.log("DB connected successfully");
  })
  .catch((err) => {
    console.log(`Some error occured while connecting the database : ${err}`);
  });
