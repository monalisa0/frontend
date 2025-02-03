import React, { useEffect, useState } from "react";
import axios from "axios";

const App = () => {
  const [message, setMessage] = useState('');
  const [workstation, setWorkstation] = useState(null);

  const allocateWork = async () => {
    try {
      const response = await axios.post('https://backend-brio.onrender.com/api/workstations/allocate');
      setMessage(response.data.message);
      setWorkstation(response.data.workstation);
    } catch (error) {
      setMessage('Error allocating work');
    }
  };

  return (
    <div>
      <h1>Work Allocation</h1>
      <button onClick={allocateWork}>Allocate Work</button>
      <p>{message}</p>
      {workstation && (
        <div>
          <h2>Assigned Workstation:</h2>
          <p>Name: {workstation.name}</p>
          <p>Cost: ${workstation.cost}</p>
          <p>Work Assigned: {workstation.workAssigned}</p>
        </div>
      )}
    </div>
  );
};

export default App;
