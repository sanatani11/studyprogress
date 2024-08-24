import { useState } from 'react';

const ForgotPass = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [resp, setResp] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    const user = {email};
    // Create a request object to send login data to the API
    try {
      const response = await fetch('http://localhost:3000/forgotPassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });
      if (response.status === 200) {
        const data = await response.json();
        const accessToken = data.token;

        // Save the token to local storage or a state management solution.
        // You may want to add token expiration handling and more.
        localStorage.setItem('accessToken', accessToken);
        setResp(true);
        // Redirect the user to another page after successful login.
        // You can use React Router to achieve this.
        // Example: history.push('/dashboard');
      } else {
        // Handle login error, e.g., show an error message.
        console.log('Login failed');
      }
    } catch (error) {
      // Handle network or other errors.
      console.error('Error:', error);
      setError('An error occurred during login.');
    }
  };

  return (
    <div className="login-form">
      <h2>Forgot Password</h2>
      <form onSubmit={handleLogin}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {error && <div className="error-message">{error}</div>}
        <button type="submit">Send Mail</button>
      </form>
      {resp ? (<h3>Mail Send Successfully</h3>) : (<h3></h3>)
      }
    </div>
  );
};

export default ForgotPass;
