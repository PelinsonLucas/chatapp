import React, { useState } from 'react';
import './Login.css';
import { RiLockPasswordFill } from "react-icons/ri";
import { IoIosMail } from "react-icons/io";
import { FaUserTag } from "react-icons/fa";
import { ImUser } from "react-icons/im";
import axios from '../../Components/Axios';

const Login = ({setLoggedIn}) => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const [displayError, setDisplayError] = useState(false);

    const handleLogin = (e) => {
        e.preventDefault();
        if(isLogin) {
            axios.post('/user/login', {
                username: username,
                password: password
            })
            .then( (res)  => { 
                axios.setToken(res.data.user);
                setEmail('');
                setFullName('');
                setLoggedIn(true);
            }
            )
            .catch(() => { 
                setDisplayError(true);
            })
        }
    };

    const handleRegister = (e) => {
        e.preventDefault();

        if(!isLogin) {    
            axios.post('/user/register', {
                email: email,
                name: fullName,
                username: username,
                password: password
            })
            .then( ()  => { 
                window.alert("User created successfully!");

                setIsLogin(true);
            })
            .catch(() => { 
                setDisplayError(true);
            });
        }
    };

    return ( 
        <div className={`login-screen ${isLogin ? "login" : "register"}`}>
            <div className={`login-container ${isLogin ? "display" : "hide"}`}>
                <h2 className="title">Login</h2>
                <h3 className={`error ${displayError ? "" : "hide"}`}>Invalid Username or Password</h3>
                <form className="login-form" onSubmit={handleLogin}>
                    <div className="input-field">
                        <ImUser/>
                        <input placeholder='Username' type="text" value={username} onChange={
                            (e) => setUsername(e.target.value)
                        } />
                    </div>
                    <div className="input-field">
                        <RiLockPasswordFill/>
                        <input placeholder='Password' type="password" value={password} onChange={
                            (e) => setPassword(e.target.value)
                        } />
                    </div>
                    <button type="submit" className="login-button">Login</button>
                </form>
            </div>
            <div className={`register-container ${!isLogin ? "display" : "hide"}`}>
                <h2 className="title">Register</h2>
                <h3 className={`error ${displayError ? "" : "hide"}`}>Error creating user</h3>
                <form className="register-form" onSubmit={handleRegister}>
                    <div className="input-field">
                        <IoIosMail/>
                        <input placeholder='Email' type="text" value={email} onChange={
                            (e) => setEmail(e.target.value)
                        } />
                    </div>
                    <div className="input-field">
                        <FaUserTag/>
                        <input placeholder='Username' type="text" value={username} onChange={
                            (e) => setUsername(e.target.value)
                        } />
                    </div>
                    <div className="input-field"> 
                        <ImUser/>
                        <input placeholder='Name' type="text" value={fullName} onChange={
                            (e) => setFullName(e.target.value)
                        } />
                    </div>
                    <div className="input-field">
                        <RiLockPasswordFill/>
                        <input placeholder='Password' type="password" value={password} onChange={
                            (e) => setPassword(e.target.value)
                        } />
                    </div>
                    <button type="submit" className="register-button">Register</button>
                </form>
            </div>
            <div className={`screen-selector ${isLogin ? "login" : "register"}`}>
                <div className={`green-background ${isLogin ? "login" : "register"}`}>
                </div>
                <h2 className='welcome-text'>
                    Welcome to ChatApp! 
                </h2>    
                <p className='demo-warning'>
                    This is just a Demo App, please avoid using real information.        
                </p>
                <h2 className="screen-selector-text">
                    {`${isLogin ? "Don't have an account?" : "Already registered?"}`}
                </h2>
                <button className="login-register-button" onClick={() => {
                    setIsLogin(!isLogin)
                    setDisplayError(false);
                }}>
                    {isLogin ? "Register" : "Login"}
                </button>
            </div>
        </div>
    )
};

export default Login;
