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
