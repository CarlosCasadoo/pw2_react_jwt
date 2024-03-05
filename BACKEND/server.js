const express = require("express");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const dbConfig = require("./app/config/db.config.js");

const app = express();

var corsOptions = {
  origin: "http://localhost:8081"
};

const db = require("./app/models");
const Role = db.role;

app.use(cors(corsOptions));
app.use(cookieParser());

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// simple route
app.use(express.static(__dirname + '/public'));

db.mongoose
  .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });


require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

async function initial() {
    try {
      const count = await Role.estimatedDocumentCount();
      if (count === 0) {
        try {
          await new Role({ name: "user" }).save();
          console.log("added 'user' to roles collection");
  
          await new Role({ name: "moderator" }).save();
          console.log("added 'moderator' to roles collection");
  
          await new Role({ name: "admin" }).save();
          console.log("added 'admin' to roles collection");
        } catch (error) {
          console.log("error", error);
        }
      }
    } catch (error) {
      console.log("error", error);
    }
  }
