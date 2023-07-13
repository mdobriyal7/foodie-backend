const mongoose = require("mongoose");

const db = process.env.DATABASE_URL;


mongoose
.connect(db)
.then(() => {
  console.log("connected my db");
})
.catch((err) => {
  console.log(err);
});
