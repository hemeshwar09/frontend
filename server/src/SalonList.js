import React, { useEffect, useState } from 'react';
import axios from 'axios';

function SalonList() {
  const [salons, setSalons] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/salons')
      .then(res => setSalons(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2>Salon List</h2>
      <ul>
        {salons.map((salon) => (
          <li key={salon._id}>{salon.name} - {salon.address}</li>
        ))}
      </ul>
    </div>
  );
}

export default SalonList;
