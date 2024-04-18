import React, { useState } from 'react'
import { Navbar } from '../../components'
import axios from 'axios';
import './Login.css'

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const logInUser = async () => {
        try {
            await axios.post('http://localhost:5000/login', {
                withCredentials: true,
                username,
                password
            })
            .then((response) => {
                if (response.status === 200) {
                    window.location.href = '/';
                } else {
                    alert('Hibás felhasználónév vagy jelszó!');
                }
            });
        } catch (error) {
            console.log(error);
            alert('Hibás felhasználónév vagy jelszó!');
        }
    }

    return (
        <div>
            <Navbar />
            <h1>Bejelentkezés</h1>
            <form className='form m-3'>
                <label>Felhasználónév:</label>
                <input
                    type='text'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder='Felhasználónév'
                    id="username"
                />
                <br />
                <label>Jelszó:</label>
                <input
                    type='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder='Jelszó'
                    id="password"
                />
                <br />
                <button type='button' className="btn btn-primary mt-4" onClick={() => logInUser()}>Bejelentkezés</button>
            </form>
        </div>
    )
}