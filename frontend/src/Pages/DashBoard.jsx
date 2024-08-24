import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';

export default function Dashboard() {
    const [status, setStatus] = React.useState(true);
    const [data, setData] = React.useState([]);
    const [change, setChange] = React.useState([]);
    const [count, setCount] = React.useState(0);

  const handleIncrease = () => {
    setCount(prevCount => prevCount + 1);
  };

  const handleDecrease = () => {

    setCount(prevCount => Math.max(prevCount - 1, 1));
  };
    React.useEffect(() => {
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
            const newArray = datas.map((obj) => ({ ...obj, status: false }));
            setData(newArray);
            console.log(newArray);
            // Update your UI or perform other actions with the data
          } catch (error) {
            // Handle errors during the fetch request
            console.error('Fetch error:', error);
          }
        };
    
        fetchData();
      }, [change]); // Empty dependency array to run the effect only once when the component mounts
    const handleStart = async (val) => {
        console.log(val);
        try {
            const token = localStorage.accessToken;
            const response = await fetch('http://localhost:3000/progress/startSubject', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({"subject_name":val}),
            });
      
            if (response.status === 200) {
              // Handle successful signup, e.g., show a success message.
              console.log('Subject started');
            } else {
              const data = await response.json();
              // Handle signup error, e.g., show an error message.
              console.error('Signup error:', data.message);
            }
          } catch (error) {
            // Handle network or other errors.
            console.error('Error:', error);
          }
          setChange(!change);
    }
    const updateProgress = async (sub, newval) => {
      console.log(sub, newval);
      try {
        const token = localStorage.accessToken;
        const response = await fetch('http://localhost:3000/progress/updateSubjectProgress', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({"subject_name":sub, "user_progress":newval}),
        });
  
        if (response.status === 200) {
          // Handle successful signup, e.g., show a success message.
          console.log('Progress Updated');
          setChange(!change);
        } else {
          const data = await response.json();
          // Handle signup error, e.g., show an error message.
          console.error('error:', data.message);
        }
      } catch (error) {
        // Handle network or other errors.
        console.error('Error:', error);
      }
    }
    const handleStatus = (val) => {
        console.log(val);
        setData((prevArray) => {
          return prevArray.map((obj) =>
            obj.subject_name === val.subject_name ? { ...obj, "status":!obj.status } : obj
          );
        });
        setCount(val.user_progress);
        if(val.status){
          updateProgress(val.subject_name, count);
        }
        // console.log(data);

    }
  return (
    <TableContainer component={Paper} style={{"width": "99vw", "backgroundColor":"#D3D3D3"}}>
      <Table sx={{ minWidth: 650 }} aria-label="caption table">
        <TableHead>
          <TableRow>
            <TableCell>Subject</TableCell>
            <TableCell align="right">Progress</TableCell>
            <TableCell align="right">Update</TableCell>
            <TableCell align="right">Start</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.name}>
              <TableCell component="th" scope="row">
                {row.subject_name}
              </TableCell>
              <TableCell align="right">{row.user_progress < 0 ? "Nil" : row.user_progress}</TableCell>
              <TableCell align="right">
                {row.status ? (<div>
                  <h3 style={{"marginRight": "3.5rem"}}>Progress: {count}</h3>
                  <div>
                    <Button onClick={handleIncrease} style={{"color":"green"}}>Increase+</Button>
                    <Button onClick={handleDecrease} style={{"color":"red"}}>Decrease-</Button>
                  </div>
              </div>): (<h1></h1>)}
                <Button  style={{"marginRight": "2rem"}}onClick={() => handleStatus(row)} disabled={row.user_progress<=0 ? true : false}>{!row.status?"update progress" : "upload progress"}</Button>
               </TableCell>
              <TableCell align="right">
                <Button onClick={() => handleStart(row.subject_name)} disabled={row.user_progress<=0 ? false : true}>Start</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}