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
  "/searchStudents",
  authentication.authenticateToken,
  (request, response) => {
    console.log("search is called");
    const roleToSearch = "student";
    const { query } = request.query; // Assuming you pass the search query as a query parameter
    console.log(query);

    // Assuming your database query to fetch students with the specified role and matching first_name or last_name
    var querySearchStudents =
      "SELECT * FROM users WHERE role = ? AND (first_name LIKE ? OR last_name LIKE ?)";

    const searchPattern = `%${query}%`;

    database.query(
      querySearchStudents,
      [roleToSearch, searchPattern, searchPattern],
      (error, results) => {
        if (!error) {
          console.log(results);
          response.json(results);
        } else {
          response.status(500).json(error);
        }
      }
    );
  }
);

router.get(
  "/getInfo",
  authentication.authenticateToken,
  (request, response) => {
    const emailFromToken = response.locals.email;
    const emailFromBody = request.body.email; // Assuming you pass the email in the request body

    // Fetch user_id for the email from the authentication token
    database
      .query("SELECT user_id FROM users WHERE email = ?", [emailFromToken])
      .then(([userRowsFromToken]) => {
        if (userRowsFromToken.length === 0) {
          return response.status(404).json({ message: "User not found" });
        }

        const user_id_from_token = userRowsFromToken[0].user_id;

        // Fetch user_id for the email from the request body
        return database.query("SELECT user_id FROM users WHERE email = ?", [
          emailFromBody,
        ]);
      })
      .then(([userRowsFromBody]) => {
        if (userRowsFromBody.length === 0) {
          return response.status(404).json({ message: "User not found" });
        }

        const user_id_from_body = userRowsFromBody[0].user_id;
        console.log(user_id_from_body, user_id_from_token);
        // Fetch all subjects
        return database.query("SELECT * FROM subjects");
      })
      .then(([allSubjects]) => {
        // Fetch user progress for each subject for both users
        const subjectsWithProgress = Promise.all(
          allSubjects.map((subject) => {
            // Fetch user progress from the authentication token
            const progressFromToken = database.query(
              "SELECT user_progress FROM progress WHERE subject_id = ? AND user_id = ?",
              [subject.subject_id, user_id_from_token]
            );

            // Fetch user progress from the request body
            const progressFromBody = database.query(
              "SELECT user_progress FROM progress WHERE subject_id = ? AND user_id = ?",
              [subject.subject_id, user_id_from_body]
            );

            return Promise.all([progressFromToken, progressFromBody]).then(
              ([progressRowsFromToken, progressRowsFromBody]) => {
                return {
                  subject_name: subject.subject_name,
                  user_progress_from_token:
                    progressRowsFromToken[0]?.user_progress || 0,
                  user_progress_from_body:
                    progressRowsFromBody[0]?.user_progress || 0,
                };
              }
            );
          })
        );

        return subjectsWithProgress;
      })
      .then((subjectsWithProgress) => {
        // Send the response
        response.json(subjectsWithProgress);
      })
      .catch((error) => {
        response.status(500).json(error);
      });
  }
);

module.exports = router;
