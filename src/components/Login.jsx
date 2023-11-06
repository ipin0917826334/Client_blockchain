import React, { useState, useContext } from 'react';
import { Form, Input, Button, Checkbox, Alert } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import Navbar from "./Navbar"
import { useNavigate } from "react-router-dom";
import bcrypt from 'bcryptjs';
import { UserContext } from './UserContext';
import axios from 'axios';  // Import axios

const Login = () => {
    const [error, setError] = useState(null);
    const { user, setUser } = useContext(UserContext);
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const saveUserToLocalStorage = (user) => {
        const userData = {
          user,
          timestamp: Date.now()
        };
        localStorage.setItem('user', JSON.stringify(userData));
      };
    const navigate = useNavigate();
    const onFinish = async (values) => {
        console.log('Received values of form: ', values);
        console.log("Input Email:", values.email);
        if (!values.email || !values.password) {
            alert('Email and password are required.');
            return;
        }
        try {
            // Send a POST request to your backend server with the email and password
            const response = await axios.post('http://localhost:3001/api/login', {
                email: values.email,
                password: values.password
            });

            if (response.data.success) {
                // If the login is successful, set the user context and navigate to a new route
                const loggedInUser = response.data.user;
                setUser(loggedInUser);
                saveUserToLocalStorage(loggedInUser);  // <-- Change this line
                navigate("/create");
            } else {
                // If the login fails, show an error message
                setError(response.data.error || 'Login failed');
            }
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div className="flex flex-col md:flex-row h-screen bg-white mt-20">
            <div className="w-full md:w-3/4 bg-[#DEE9EF] relative"> {/* Added md: prefix for medium screens */}
                <img src='/images/Vector 22.png' className='img-login w-full h-full' />
                <img src='/images/Group 2055.png' className='img-login absolute top-0 right-0 md:w-auto' /> {/* Adjust width on medium screens */}
            </div>
            <div className="w-full md:w-1/4 flex mt-5 md:mt-20 items-center flex-col md:p-10">
                <div className='text-5xl font-inconsolata mb-5'>DeVote</div>
                <div className='text-2xl font-inconsolata mb-5'>Welcome Back</div>
                <div className="login-form-container px-5 md:px-0">
                    {error && <Alert
                        message={error}
                        type="error"
                        closable
                        onClose={() => setError(null)}
                    />}
                    <Form
                        name="normal_login"
                        className="login-form"
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                    >
                        <Form.Item
                            name="email"
                            rules={[{ required: true, message: 'Please input your Email!' }]}
                        >
                            <Input prefix={<UserOutlined className="site-form-item-icon" />} value={email} onChange={(e) => { setEmail(e.target.value) }} placeholder="Email" />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[{ required: true, message: 'Please input your Password!' }]}
                        >
                            <Input
                                prefix={<LockOutlined className="site-form-item-icon" />}
                                type="password"
                                value={password} onChange={(e) => { setPassword(e.target.value) }}
                                placeholder="Password"
                            />
                        </Form.Item>
                        <Form.Item>
                            <Form.Item name="remember" valuePropName="checked" noStyle>
                                <Checkbox>Remember me</Checkbox>
                            </Form.Item>

                            <a className="login-form-forgot" href="/">
                                Forgot password?
                            </a>
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                Log in
                            </Button>
                            Or <a href="/register">register now!</a>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default Login;
