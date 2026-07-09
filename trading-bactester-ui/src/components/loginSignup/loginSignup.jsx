import { useEffect, useState } from 'react';
import './loginSignup.css';
import api from "../../api/api";
import { useNavigate } from 'react-router-dom';



const LoginSignup = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    
    const naviagte = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('access_token')
        if(token != null){
            naviagte("/dashboard")
        }
    })

    const login = async () => {
        const formData = new URLSearchParams();
        formData.append("grant_type","password");
        formData.append("username", email);
        formData.append("password",password);
        const response = await api.post(
            "/auth/login",
            formData
        );
        localStorage.setItem('access_token', response.data.access_token);
        localStorage.setItem('token_type', response.data.token_type);
        naviagte("/dashboard")
    }

    const register = async () => {
        try {
            const response = await api.post("/auth/register", {
                name,
                email,
                password,
            });

            console.log(response.data); 
            setIsLogin(true);
        } catch (error) {
            console.error(error.response?.data || error.message);
        }
    }

    return (
        <div className="login-signup-container">
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
                                <button onClick={register}>
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
        </div>
    ) 
}

export default LoginSignup;
