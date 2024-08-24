import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateComponent = () => {
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.accessToken;
        const response = await fetch('http://localhost:3000/checkToken', {
          method: 'GET',
          headers: {
            'authorization': `hello ${token}`
          }
        });

        if (response.status === 200) {
          setAuth(true);
        } else {
          console.error('Unauthorized');
          setAuth(false);
        }
      } catch (error) {
        console.error('Error', error);
        setAuth(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array to run the effect only once when the component mounts

  if (auth === null) {
    // You can return a loading indicator or null while the authentication is being checked
    return null;
  }

  return auth ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateComponent;
