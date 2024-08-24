import React, { useState, useEffect } from 'react';
import { TextField, List, ListItem, Typography, Paper, Container, Button } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

// Compare Component
const Compare = () => {
  // State for search query
  const [searchQuery, setSearchQuery] = useState('');
  const [friend, setFriend] = useState();
  const [show, setShow] = useState(false);
  // State to store fetched students
  const [students, setStudents] = useState([]);
  // State for the selected student
  const [selectedStudent, setSelectedStudent] = useState(null);

  // useEffect to fetch students based on the search query
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.accessToken;
        const response = await fetch(`http://localhost:3000/compare/searchStudents?query=${searchQuery}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, // Replace with your authentication token
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);
        setStudents(data);
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };

    // Fetch students when search query changes
    if (searchQuery.trim() !== '') {
      fetchStudents();
    } else {
      setStudents([]);
    }
  }, [searchQuery]);

  // Function to handle click on a student
  const handleStudentClick = (clickedStudent) => {
    setSelectedStudent(clickedStudent);
  };

  // Function to handle changing the selected student
  const handleChangeStudent = () => {
    setSelectedStudent(null);
  };
  
  const [dataSec, setDataSec] = useState([{}]);
  const [dataFir, setDataFir] = useState([{}]);
  // Function to handle comparing selected student
  const handleCompare = (values) => {
    // Implement your logic for comparison here
    console.log('Comparing students...');
    const fetchData = async () => {
        try {
          const token = localStorage.accessToken;
          const response = await fetch(`http://localhost:3000/dashboard/getAllSubjects`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
  
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
  
          var datas = await response.json();
          // Handle the data returned from the server
          setDataFir(datas);
        //   console.log(dataFir, datas);
          // Update your UI or perform other actions with the data
        } catch (error) {
          // Handle errors during the fetch request
          console.error('Fetch error:', error);
        }
      };
      const fetchDataSec = async () => {
        try {
          const token = localStorage.accessToken;
          const response = await fetch(`http://localhost:3000/dashboard/getAllSubjectsSecond`, {
            method: 'PATCH',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({"email": values.email}),
          });
  
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
  
          var datas = await response.json();
          // Handle the data returned from the server
          setDataSec(datas);
        //   console.log(dataSec);
          // Update your UI or perform other actions with the data
        } catch (error) {
          // Handle errors during the fetch request
          console.error('Fetch error:', error);
        }
      };
      fetchData();
      fetchDataSec();
      setFriend(`${values.first_name} ${values.last_name}`)
      setShow(true);
      setSelectedStudent('');
    //   console.log(dataFir, dataSec);
  };

  return (
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#D3D3D3',
        minWidth: '100vw',
        minHeight: '100vh', // Set minimum height to cover the whole screen
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: '80%', // Set the width of the paper
          padding: 3,
          margin: 'auto',
          marginTop: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Search Input */}
        <TextField
          label="Search Students"
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {/* List of Students */}
        <List sx={{ maxHeight: 200, overflow: 'auto', width: '100%' }}>
          {students.map((student) => (
            <ListItem key={student.user_id} onClick={() => handleStudentClick(student)}>
              {`${student.first_name} ${student.last_name}`}
            </ListItem>
          ))}
        </List>

        {/* Display Selected Student Details */}
        {selectedStudent && (
          <div sx={{ marginTop: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Selected Student:
            </Typography>
            <Typography>{`Name: ${selectedStudent.first_name} ${selectedStudent.last_name}`}</Typography>
            <Typography>{`Email: ${selectedStudent.email}`}</Typography>
            {/* Add other details as needed */}
            <Button variant="contained" onClick={handleChangeStudent} sx={{ margin: 1 }}>
              Change Student
            </Button>
            <Button variant="contained" onClick={() => handleCompare(selectedStudent)} sx={{ margin: 1 , backgroundColor: "green"}}>
              Compare
            </Button>
          </div>
        )}
      </Paper>
      {show && (
      <TableContainer component={Paper} style={{"width": "99vw", "backgroundColor":"#D3D3D3"}}>
      <Table sx={{ minWidth: 650 }} aria-label="caption table">
        <TableHead>
          <TableRow>
            <TableCell style={{"fontSize":"1.5rem"}}>Subject</TableCell>
            <TableCell align="right" style={{"fontSize":"1.5rem"}}>My Progress</TableCell>
            <TableCell align="right" style={{"fontSize":"1.5rem"}}>{`${friend}'s Progress`}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {dataFir.map((row, index) => (
            <TableRow key={row.name}>
              <TableCell component="th" style={{"fontSize":"1.2rem"}} scope="row">
                {row.subject_name}
              </TableCell>
              <TableCell align="right" style={{"fontSize":"1.1rem"}} >{row.user_progress < 0 ? "Nil" : row.user_progress}</TableCell>
              <TableCell align="right" style={{"fontSize":"1.1rem"}} >{dataSec[index].user_progress < 0 ? "Nil" : dataSec[index].user_progress}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    )}
    </Container>
  );
};

export default Compare;
