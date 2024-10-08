import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const logInUser = async () => {
        try {
            const response = await axios.post('https://dezsanyilvantarto.hu/api/login', {
                "username": username,
                "password": password
            }, { withCredentials: true });
            console.log("szerver válasz:", response.data);
            window.location.href = '/';

        } catch (error) {
            console.log(error);
            alert('Hibás felhasználónév vagy jelszó!');
        }
    }

    return (
        <div>
            <div className='container mt-4 pt-5 d-flex justify-content-center'>
                <form className='border border-info-subtle border-3 p-5 shadow'>
                    <h1 className='text-center'>Bejelentkezés</h1>
                    <h6 className='text-center pt-1 pb-1'>Kérlek add meg a belépési adatokat!</h6>
                    <div className="mt-3">
                        <label htmlFor="username">Felhasználónév:</label>
                        <input
                            type='text'
                            className='form-control'
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder='Felhasználónév'
                            id="username" 
                        />
                        <label htmlFor="password">Jelszó:</label>
                        <input
                            type='password'
                            className='form-control'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder='Jelszó'
                            id="password"
                        />
                        <button type='button' className="btn btn-primary mt-4" onClick={() => logInUser()}>Bejelentkezés</button>
                    </div>
                </form>
            </div>
        </div>
    )
}