// // src/pages/Dashboard.jsx
// import React, { useEffect, useState } from 'react';
// import './Dashboard.css';
// import axios from 'axios';

// const Dashboard = () => {
//   const [userData, setUserData] = useState({ recommended: [], favorites: [] });
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       const token = localStorage.getItem('token');
//       if (token) {
//         try {
//           const res = await axios.get('http://localhost:5000/dashboard', {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           });
//           setUserData(res.data);
//         } catch (error) {
//           console.error('Error fetching dashboard data', error);
//         }
//       }
//       setLoading(false);
//     };

//     fetchDashboardData();
//   }, []);

//   return (
//     <div className="dashboard-container">
//       {loading ? (
//         <p>Loading...</p>
//       ) : (
//         <>
//           <h2>Welcome to your Dashboard</h2>
//           <h3>Recommended Places</h3>
//           <div className="places-list">
//             {userData.recommended.map((place, index) => (
//               <div key={index} className="place-card">
//                 <h3>{place.Place}</h3>
//                 <p>{place.Description}</p>
//                 <button>Add to Favorites</button>
//               </div>
//             ))}
//           </div>
//           <h3>Your Favorite Places</h3>
//           <div className="places-list">
//             {userData.favorites.map((place, index) => (
//               <div key={index} className="place-card">
//                 <h3>{place.place_name}</h3>
//                 <p>{place.description}</p>
//                 <button>Remove from Favorites</button>
//               </div>
//             ))}
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default Dashboard;
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();

  // Sample user data (can be fetched from JWT/localStorage/API)
  const user = {
    name: 'John Doe',
    email: 'john@example.com',
    favorites: ['Goa', 'Jaipur', 'Kolkata'],
    recommendations: ['Delhi', 'Chennai', 'Mumbai']
  };

  const handleLogout = () => {
    // Clear token or user session
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="dashboard">
      <h1>Welcome back, {user.name} 👋</h1>
      <p>Email: {user.email}</p>

      <section className="section">
        <h2>🌟 Recommended for You</h2>
        <div className="card-row">
          {user.recommendations.map((place, index) => (
            <div key={index} className="card" onClick={() => navigate(`/place-details`, { state: { place: { name: place } } })}>
              <h3>{place}</h3>
              <p>Explore amazing experiences</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <h2>❤️ Your Favorites</h2>
        <div className="card-row">
          {user.favorites.map((place, index) => (
            <div key={index} className="card">
              <h3>{place}</h3>
              <p>Saved to your list</p>
            </div>
          ))}
        </div>
      </section>

      <button className="logout-btn" onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Dashboard;
