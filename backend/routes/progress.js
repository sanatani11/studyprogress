//importing essential files and libraries
const express = require("express");
const database = require("../database");
const router = express.Router();

//we are using jsonwebtoken jwt for authenticating the user.
const jwt = require("jsonwebtoken");
//we are using nodemailer to send mails, of forget password to users.
const nodemailer = require("nodemailer");
// .env for saving enviornment data.
require("dotenv").config();

//importing authentication and role files from services folder

var authentication = require("../services/authentication");

router.post(
  "/startSubject",
  authentication.authenticateToken,
  (request, response) => {
    const info = request.body;
    const email = response.locals.email;

    // Query to fetch subject_id based on subject_name
    const querySubjectId =
      "SELECT subject_id FROM subjects WHERE subject_name = ?";

    // Query to fetch user_id based on email
    const queryUserId = "SELECT user_id FROM users WHERE email = ?";

    // Query to check if the subject has already been started for the user
    const queryCheckProgress =
      "SELECT * FROM progress WHERE user_id = ? AND subject_id = ?";

    // Query to insert a new row into the progress table
    const queryInsertProgress =
      "INSERT INTO progress(user_id, subject_id, user_progress) VALUES (?, ?, 1)";

    // Fetch subject_id
    database.query(
      querySubjectId,
      [info.subject_name],
      (errorSubject, resultsSubject) => {
        if (errorSubject) {
          return response.status(500).json(errorSubject);
        }

        if (resultsSubject.length === 0) {
          return response.status(404).json({ message: "Subject not found" });
        }

        const subjectId = resultsSubject[0].subject_id;

        // Fetch user_id
        database.query(queryUserId, [email], (errorUser, resultsUser) => {
          if (errorUser) {
            return response.status(500).json(errorUser);
          }

          if (resultsUser.length === 0) {
            return response.status(404).json({ message: "User not found" });
          }

          const userId = resultsUser[0].user_id;

          // Check if the subject has already been started for the user
          database.query(
            queryCheckProgress,
            [userId, subjectId],
            (errorCheck, resultsCheck) => {
              if (errorCheck) {
                return response.status(500).json(errorCheck);
              }
              console.log(resultsCheck.length);
              if (resultsCheck.length > 0) {
                return response
                  .status(400)
                  .json({ message: "Subject already started for the user" });
              }

              // Insert a new row into the progress table
              database.query(
                queryInsertProgress,
                [userId, subjectId],
                (errorInsert, resultsInsert) => {
                  if (errorInsert) {
                    return response.status(500).json(errorInsert);
                  }

                  return response
                    .status(200)
                    .json({ message: "Subject started successfully" });
                }
              );
            }
          );
        });
      }
    );
  }
);

router.post(
  "/updateSubjectProgress",
  authentication.authenticateToken,
  (request, response) => {
    const info = request.body;
    const email = response.locals.email;

    // Query to fetch user_id based on email
    const queryUserId = "SELECT user_id FROM users WHERE email = ?";

    // Query to fetch subject_id based on subject_name
    const querySubjectId =
      "SELECT subject_id FROM subjects WHERE subject_name = ?";

    // Query to update user_progress based on user_id and subject_id
    const queryUpdateProgress =
      "UPDATE progress SET user_progress = ? WHERE user_id = ? AND subject_id = ?";

    // Fetch user_id
    database.query(queryUserId, [email], (errorUser, resultsUser) => {
      if (errorUser) {
        return response.status(500).json(errorUser);
      }

      if (resultsUser.length === 0) {
        return response.status(404).json({ message: "User not found" });
      }

      const userId = resultsUser[0].user_id;

      // Fetch subject_id based on subject_name
      database.query(
        querySubjectId,
        [info.subject_name],
        (errorSubject, resultsSubject) => {
          if (errorSubject) {
            return response.status(500).json(errorSubject);
          }

          if (resultsSubject.length === 0) {
            return response.status(404).json({ message: "Subject not found" });
          }

          const subjectId = resultsSubject[0].subject_id;

          // Update user_progress
          database.query(
            queryUpdateProgress,
            [info.user_progress, userId, subjectId],
            (errorUpdate, resultsUpdate) => {
              if (errorUpdate) {
                return response.status(500).json(errorUpdate);
              }

              if (resultsUpdate.affectedRows === 0) {
                return response
                  .status(404)
                  .json({ message: "User or subject not found in progress" });
              }

              return response
                .status(200)
                .json({ message: "Subject progress updated successfully" });
            }
          );
        }
      );
    });
  }
);

module.exports = router;
