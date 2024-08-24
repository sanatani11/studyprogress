create database studyprogress;
use studyprogress;

-- Create Users Table
CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    contact_number VARCHAR(15),
    email VARCHAR(255),
    password VARCHAR(255),
    role VARCHAR(50) NOT NULL
);

-- Create Subjects Table
CREATE TABLE Subjects (
    subject_id INT AUTO_INCREMENT PRIMARY KEY,
    subject_name VARCHAR(255)
);

-- Create Progress Table
CREATE TABLE Progress (
    progress_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    subject_id INT,
    user_progress INT,
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (subject_id) REFERENCES Subjects(subject_id)
);

-- Create Resources Table
CREATE TABLE Resources (
    resource_id INT AUTO_INCREMENT PRIMARY KEY,
    subject_id INT,
    resource_url TEXT,
    FOREIGN KEY (subject_id) REFERENCES Subjects(subject_id)
);
