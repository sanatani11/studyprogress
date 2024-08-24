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
  "/getAllSubjects",
  authentication.authenticateToken,
  (request, response) => {
    const email = response.locals.email;
    let user_id;

    // Fetch user_id
    var queryUser_ID = "select user_id from users where email = ?";
    database.query(queryUser_ID, [email], (error, results) => {
      if (!error) {
        user_id = results[0].user_id;

        // Fetch all subjects
        var queryAllSubject = "select * from subjects";
        database.query(queryAllSubject, (error, results) => {
          if (!error) {
            const subjectList = results;

            // Fetch user progress for each subject
            const subjectsWithProgress = subjectList.map((subject) => {
              var queryProgress =
                "select user_progress from progress where subject_id = ? AND user_id = ?";
              return new Promise((resolve, reject) => {
                database.query(
                  queryProgress,
                  [subject.subject_id, user_id],
                  (error, progressResults) => {
                    if (!error) {
                      resolve({
                        subject_name: subject.subject_name,
                        user_progress: progressResults[0]?.user_progress || 0,
                      });
                    } else {
                      reject(error);
                    }
                  }
                );
              });
            });

            // Resolve all promises and send the response
            Promise.all(subjectsWithProgress)
              .then((result) => {
                response.json(result);
              })
              .catch((error) => {
                response.status(500).json(error);
              });
          } else {
            response.status(500).json(error);
          }
        });
      } else {
        response.status(500).json(error);
      }
    });
  }
);

router.patch(
  "/getAllSubjectsSecond",
  authentication.authenticateToken,
  (request, response) => {
    const email = request.body.email;
    let user_id;

    // Fetch user_id
    var queryUser_ID = "select user_id from users where email = ?";
    database.query(queryUser_ID, [email], (error, results) => {
      if (!error) {
        user_id = results[0].user_id;

        // Fetch all subjects
        var queryAllSubject = "select * from subjects";
        database.query(queryAllSubject, (error, results) => {
          if (!error) {
            const subjectList = results;

            // Fetch user progress for each subject
            const subjectsWithProgress = subjectList.map((subject) => {
              var queryProgress =
                "select user_progress from progress where subject_id = ? AND user_id = ?";
              return new Promise((resolve, reject) => {
                database.query(
                  queryProgress,
                  [subject.subject_id, user_id],
                  (error, progressResults) => {
                    if (!error) {
                      resolve({
                        subject_name: subject.subject_name,
                        user_progress: progressResults[0]?.user_progress || 0,
                      });
                    } else {
                      reject(error);
                    }
                  }
                );
              });
            });

            // Resolve all promises and send the response
            Promise.all(subjectsWithProgress)
              .then((result) => {
                response.json(result);
              })
              .catch((error) => {
                response.status(500).json(error);
              });
          } else {
            response.status(500).json(error);
          }
        });
      } else {
        response.status(500).json(error);
      }
    });
  }
);

module.exports = router;
