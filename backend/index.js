const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const dotenv = require("dotenv").config();
const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use("/admin", require("./routes/admin"));
app.use("/birth", require("./routes/birth"));
app.use("/death", require("./routes/death"));

app.listen(5000, () => {
  console.log(`App is running on port 5000`);
});
