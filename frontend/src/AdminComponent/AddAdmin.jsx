import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AddAdmin = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [admin, setAdmin] = useState(true);
  const Navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.accessToken;
        const response = await fetch(`http://localhost:3000/admin/verifyAdmin`, {
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
        if(datas.res != true){
            // console.log("yele");
            Navigate("/");
        }
        // Update your UI or perform other actions with the data
      } catch (error) {
        // Handle errors during the fetch request
        console.error('Fetch error:', error);
        Navigate("/");
      }
    };

    fetchData();
  }, []); // Empty dependency array to run the effect only once when the component mounts


  const handleSignup = async (e) => {
    e.preventDefault();
    const user = {
      firstName,
      lastName,
      contactNumber,
      email,
      password,
    };

    try {
      const response = await fetch('http://localhost:3000/admin/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });

      if (response.status === 200) {
        // Handle successful signup, e.g., show a success message.
        console.log('Signup successful');
      } else {
        const data = await response.json();
        // Handle signup error, e.g., show an error message.
        console.error('Signup error:', data.message);
      }
    } catch (error) {
      // Handle network or other errors.
      console.error('Error:', error);
    }
  };

  return (
    <div className="signup-form">
      <h2>Add Admin</h2>
      <form onSubmit={handleSignup}>
        <label htmlFor="firstName">First Name:</label>
        <input
          type="text"
          id="firstName"
          name="firstName"
          required
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <label htmlFor="lastName">Last Name:</label>
        <input
          type="text"
          id="lastName"
          name="lastName"
          required
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <label htmlFor="contactNumber">Contact Number:</label>
        <input
          type="tel"
          id="contactNumber"
          name="contactNumber"
          required
          value={contactNumber}
          onChange={(e) => setContactNumber(e.target.value)}
        />
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Signup</button>
      </form>
    </div>
  );
};

export default AddAdmin;
