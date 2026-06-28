import { useState } from 'react';
import './loginSignup.css';
import api from "../../api/api";


const LoginSignup = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");

    const login = async () => {
        const formData = new URLSearchParams();
        formData.append("grant_type","password");
        formData.append("username", email);
        formData.append("password",password);
        const response = await api.post(
            "/auth/login",
            formData
        );
        console.log(response);
    }

    //const register = async () => {
        
    //}

    return (
        <>
            <div className="container">
                <div className="header">
                    <h1 className='heading'>{isLogin ? "Login" : "Sign Up"}</h1>
                    <div className="underline"></div>
                </div>
                <div className="inputs">
                    {isLogin ? null : (
                        <div className="input">
                            <input type="text" placeholder='Name' onChange={(e) => setName(e.target.value)} value={name}/>
                        </div>
                    )}
                    <div className="input">
                        <input type="email" placeholder='Email' onChange={(e) => setEmail(e.target.value)} value={email}/>
                    </div>
                        <div className="input">
                        <input type= "password" placeholder='Password' onChange={(e) => setPassword(e.target.value)} value={password}/>
                    </div>
                </div>
                <div className="submits">
                    {isLogin ? (
                        <>
                            <div className="submit">
                                <button onClick={login}>
                                    Login
                                </button>
                            </div>
                            <div className="switch">
                                <p>Don't have an accout?</p>
                                <button onClick={() => setIsLogin(false)}>Sign Up</button>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="submit">
                                <button>
                                    Sign Up
                                </button>
                            </div>
                            <div className="switch">
                                <p>Already have an accout?</p>
                                <button onClick={() => setIsLogin(true)}>Login</button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    ) 
}

export default LoginSignup;
