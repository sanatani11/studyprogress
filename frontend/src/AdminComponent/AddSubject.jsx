import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AddSubject = () => {

  const [subject, setSubject] = useState('');
  const [error, setError] = useState(null);
  const [resp, setResp] = useState(false);
  const Navigate = useNavigate();
  // location.reload();
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
            console.log("yele");
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
  const handleAddSub = async (e) => {
    e.preventDefault();

    const subVal = {"subject_name": subject};
    // Create a request object to send login data to the API
    try {
      const token = localStorage.accessToken;
      const response = await fetch('http://localhost:3000/admin/addsubject', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        body: JSON.stringify(subVal),
      });
      if (response.status === 200) {
        const data = await response.json();
        // const accessToken = data.token;
        setResp(true);
        console.log("ho gya")
      } else {
        const respons = await response.json();
        // Handle error, e.g., show an error message.
        setError(respons.message);
      }
    } catch (error) {
      // Handle network or other errors.
      console.error('Error:', error);
      setError('An error occurred. Please try again letter');
    }
  };

  return (
    <div className="login-form">
      <h2>Add Subject</h2>
      <form onSubmit={handleAddSub}>
        <label htmlFor="subject">Subject</label>
        <input
          type="text"
          id="subject"
          name="subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
        />
        {error && <div className="error-message">{error}</div>}
        <button type="submit">Add Subject</button>
      </form>
      {resp ? (<h3>Subject Added Successfully</h3>) : (<h3></h3>)
      }
    </div>
  );
};

export default AddSubject;
