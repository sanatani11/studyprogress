import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { Modal } from "@mui/material";

const UpdateModal = ({ change, rowData }) => {
  
  const [oldPassword, setOldPass] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setNpassword] = useState('');
  const [error, setError] = useState(null);
  console.log(rowData);
  return (
    <>
    <div className="modalContainer">
        <h1>This is modal</h1>
        <h1>{rowData}</h1>
        <Button variant="contained" onClick={() => change()}>
          Close
        </Button>
      </div>
    </>
  );
};

export default UpdateModal;
