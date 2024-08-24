import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { Modal, Paper, Typography } from "@mui/material";
import ChangePassModal from "./ChangePassModal";

const ProfileModal = ({ change }) => {
    const [data, setData] = useState({});
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.accessToken;
        const response = await fetch(`http://localhost:3000/getDetails`, {
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
        console.log(datas);
        setData(datas);
        // Update your UI or perform other actions with the data
      } catch (error) {
        // Handle errors during the fetch request
        console.error('Fetch error:', error);
      }
    };

    fetchData();
  }, []); // Empty dependency array to run the effect only once when the component mounts

  return (
    <>
      {/* <div className="modalContainer"> */}
      <Paper
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            minWidth: '60vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '16px',
            backgroundColor: '#fff',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
            borderRadius: '8px',
            outline: 'none',
            maxWidth: '80vw',
          }}
        >
          <Typography
            variant="h5"
            style={{ fontSize: '24px', marginBottom: '10px' }}
          >
            {data.firstName} {data.lastName}
          </Typography>
          <Typography variant="subtitle1" style={{ fontSize: '18px', marginBottom: '8px' }}>
            {data.contactNumber}
          </Typography>
          <Typography variant="subtitle1" style={{ fontSize: '18px', marginBottom: '20px' }}>
            {data.email}
          </Typography>
          <Button onClick={() => setOpen(true)} style={{ marginLeft: '-3rem' }}>
            Change Password
          </Button>
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <ChangePassModal change={handleClose} />
            {/* <h1>another modal</h1> */}
          </Modal><br/>
          <Button
            variant="contained"
            onClick={() => change()}
            style={{ marginTop: '16px' }}
          >
            Close
          </Button>
        </Paper>
      {/* </div> */}
    </>
  );
};

const styles = {
    name: {
      fontSize: '24px',
      marginBottom: '10px',
    },
    contact: {
      fontSize: '18px',
      marginBottom: '8px',
    },
    email: {
      fontSize: '18px',
      marginBottom: '20px',
    },
    
  };
  
  

export default ProfileModal;
