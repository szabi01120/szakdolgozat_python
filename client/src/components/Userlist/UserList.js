import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function UserList() {
  const [userData, setUserData] = useState(false);
  const [users, setUsers] = useState([{}]);

  // Get user api with Axios
  useEffect(() => {
    axios.get("/api/users")
      .then(response => setUsers(response.data))
      .catch(error => console.log("Error fetching users: ", error));
  }, []);

  // Toggle user data display
  const handleUsersButtonClick = () => {
    setUserData(!userData);
  };


  // Handle delete user button click
  const handleDeleteButtonClick = async (id) => {
    try {
      const response = await axios.delete(`http://127.0.0.1:5000/api/delete_user/${id}`);
      if (response.status === 200) {
        console.log('Sikeres törlés');
        //sikeres törlés után felh listát frissíteni kell
        const updatedUsers = users.filter(user => user.id !== id);
        setUsers(updatedUsers);
      } else {
        console.log('Sikertelen törlés');
      }
    } catch (error) {
      console.log("Hiba történt a törlés közben: ", error);
    }
  };

  return (
    <div>
      <div className="container shadow d-flex flex-column pt-4">
        <h2>Felhasználók</h2>
        <div className="d-flex">
          <button type="button" className="btn btn-primary w-25 mb-3 mt-2 me-4" onClick={handleUsersButtonClick}>
            Lekérdezés
          </button>
          <Link to="/AddUser" type="button" className="btn btn-primary w-25 mb-3 mt-2">
            Felhasználó hozzáadása
          </Link>
        </div>
        {userData && 
          <div className="container pt-3">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Felhasználó</th>
                  <th scope="col">#</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr><td colSpan="3">Nincs felhasználó adat</td></tr>
                ) : (
                  users.map(user => (
                    <tr key={user.id}>
                      <th scope="row">{user.id}</th>
                      <td>{user.username}</td>
                      <td>
                        <button type="button" className="btn btn-primary w-25" onClick={() => handleDeleteButtonClick(user.id)}>
                          Törlés
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        }
      </div>
    </div>
  );
}
