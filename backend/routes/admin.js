//importing essential files and libraries
const express = require("express");
const database = require("../database");
const router = express.Router();

//we are using jsonwebtoken jwt for authenticating the user.
const jwt = require("jsonwebtoken");
// .env for saving enviornment data.
require("dotenv").config();

//importing authentication and role files from services folder
var authentication = require("../services/authentication");

router.get(
  "/verifyAdmin",
  authentication.authenticateToken,
  (request, response) => {
    const email = response.locals.email;
    var queryi = "select role from users where email = ?";
    database.query(queryi, [email], (error, results) => {
      if (!error) {
        console.log(results);
        if (results[0].role == "admin") {
          return response.status(200).json({ res: true });
        }
        return response.status(200).json({ res: false });
      } else {
        return response.status(500).json(error);
      }
    });
  }
);

router.post("/signup", (request, response) => {
  //hitting mysql query to database and checking for error and responses.
  console.log("signup called");
  // console.log(request);
  let user = request.body;
  queryy = "select email,password from users where email =?";
  //only one user is allowed with one email so checking weither this email is already registered or not.
  database.query(queryy, [user.email], (error, results) => {
    console.log("this is it");
    if (!error) {
      // console.log("this function is called");
      //if no one with this email is already there registering them.
      if (results.length <= 0) {
        queryi =
          "INSERT INTO users(first_name, last_name, contact_number, email, password, role) VALUES (?, ?, ?, ?, ?, 'admin')";
        database.query(
          queryi,
          [
            user.firstName,
            user.lastName,
            user.contactNumber,
            user.email,
            user.password,
          ],
          (error, results) => {
            if (!error) {
              console.log("done");
              return response
                .status(200)
                .json({ message: "Successfully Registered" });
            } else {
              return response.status(500).json(error);
            }
          }
        );
      }
      //else displaying message already registered
      else {
        return response
          .status(400)
          .json({ message: "Already Registered with this Email" });
      }
    } else {
      console.log(error);
      return response.status(500).json(error);
    }
  });
});

router.post("/login", (request, response) => {
  const user = request.body;
  //   console.log(request.headers);
  queryi =
    "SELECT email, password FROM Users WHERE email = ? AND role = 'admin';";
  database.query(queryi, [user.email], (error, results) => {
    if (!error) {
      console.log(results[0]);
      //if no user with given email, showing incorrect username or password
      if (results.length <= 0 || results[0].password != user.password) {
        return response
          .status(401)
          .json({ message: "Incorrect username or password" });
      }
      //incase of correct password making a jwt token containg email and role and returning it.
      else if (results[0].password == user.password) {
        const data = { email: results[0].email };
        const accessToken = jwt.sign(data, process.env.ACCESS_TOKEN_KEY, {
          expiresIn: "8h",
        });
        response.status(200).json({ token: accessToken });
      } else {
        return response
          .status(400)
          .json({ message: "something went wrong . please try again later" });
      }
    } else {
      return response.status(500).json(error);
    }
  });
});
router.post(
  "/addsubject",
  authentication.authenticateToken,
  (request, response) => {
    console.log("called");
    const info = request.body;
    const queryCheck = "SELECT * FROM subjects WHERE subject_name = ?";

    // Check if a subject with the same name already exists
    database.query(queryCheck, [info.subject_name], (error, results) => {
      if (error) {
        return response.status(500).json(error);
      }

      // If a subject with the same name already exists, return an error response
      if (results.length > 0) {
        return response
          .status(400)
          .json({ message: "Subject with this name already exists" });
      }

      // If the subject does not exist, proceed with the insertion
      const queryInsert = "INSERT INTO subjects(subject_name) VALUES (?)";
      database.query(queryInsert, [info.subject_name], (error, results) => {
        if (!error) {
          return response.status(200).json({ message: "Subject added" });
        } else {
          return response.status(500).json(error);
        }
      });
    });
  }
);

module.exports = router;
