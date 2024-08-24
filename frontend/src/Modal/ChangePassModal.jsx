import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { Modal } from "@mui/material";

const ChangePassModal = ({ change }) => {
  
  const [oldPassword, setOldPass] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setNpassword] = useState('');
  const [error, setError] = useState(null);
  const handleChangePass = async () => {
    if(confirmPassword != password){
        setError("New Password does not matches");
        return;
    }
  try {
    const token = localStorage.accessToken;
    const response = await fetch("http://localhost:3000/changePassword", {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        oldPassword,
        confirmPassword,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    setError(data.message);
  } catch (error) {
    console.error('Fetch error:', error);
    setError("An error occurred while changing the password.");
  }
};



  return (
    <div className="login-form">
      <h2>Change Password</h2>
      <form onSubmit={handleChangePass}>
        <label htmlFor="password">Old Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={oldPassword}
          onChange={(e) => setOldPass(e.target.value)}
          required
        />
        <label htmlFor="password">New Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <label htmlFor="password">Confirm New Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={confirmPassword}
          onChange={(e) => setNpassword(e.target.value)}
          required
        />
        {error && <div className="error-message">{error}</div>}
        <button type="submit">Change Password</button>
      </form>
      <Button style={{"marginTop": "1rem", "marginLeft": "40%"}} variant="contained" onClick={() => change()}>
          Close
      </Button>
    </div>
  );
};

export default ChangePassModal;
