// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useHistory } from 'react-router-dom';
// import { getToken } from './auth'; // Utility function to get token (if applicable)

// const Profile = () => {
//   const [user, setUser] = useState(null);
//   const history = useHistory();
  
//   // Fetch the profile details from the backend
//   useEffect(() => {
//     const fetchUserProfile = async () => {
//       try {
//         const token = getToken();
//         if (!token) {
//           history.push("/login"); // Redirect to login if no token
//         }
        
//         const response = await axios.get('http://localhost:5000/user-profile', {
//           headers: {
//             Authorization: `Bearer ${token}`
//           }
//         });
//         setUser(response.data); // Set user data to state
//       } catch (error) {
//         console.error("Error fetching profile", error);
//         // Handle error (maybe show a message or redirect to login)
//       }
//     };

//     fetchUserProfile();
//   }, [history]);

//   const handleLogout = () => {
//     // Perform logout by clearing token
//     localStorage.removeItem('token');  // or sessionStorage
//     history.push('/login'); // Redirect to login
//   };

//   const handleEditProfile = () => {
//     // Redirect to the profile edit page or show a modal
//     history.push('/edit-profile');
//   };

//   return (
//     <div className="profile-container">
//       {user ? (
//         <div>
//           <h2>{user.name}'s Profile</h2>
//           <p>Email: {user.email}</p>

//           <div className="buttons">
//             <button onClick={handleEditProfile}>Edit Profile</button>
//             <button onClick={handleLogout}>Logout</button>
//           </div>
//         </div>
//       ) : (
//         <p>Loading profile...</p>
//       )}
//     </div>
//   );
// };

// export default Profile;
