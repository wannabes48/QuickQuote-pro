import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { FileCheck } from 'lucide-react';

export default function Register() {
    const [formData, setFormData] = useState({
        username: '', email: '', password: '', company_name: '', phone_number: ''
    });
    const [error, setError] = useState('');
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(formData);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.username?.[0] || 'Registration failed. Please check your inputs.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-light py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-lg w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-border">
                <div className="text-center">
                    <div className="flex justify-center mb-4">
                        <div className="bg-blue-50 p-3 rounded-xl">
                            <FileCheck className="h-10 w-10 text-primary" />
                        </div>
                    </div>
                    <h2 className="mt-2 text-3xl font-extrabold text-gray-dark">Create an account</h2>
                    <p className="mt-2 text-sm text-gray-500">Start sending professional quotes in minutes</p>
                </div>
                <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                    {error && <div className="bg-red-50 text-danger p-3 rounded-lg text-sm text-center font-medium">{error}</div>}
                    
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <div>
                            <label className="text-sm font-medium text-gray-700 block mb-1">Username</label>
                            <input name="username" type="text" required onChange={handleChange} className="appearance-none block w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors" />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 block mb-1">Email</label>
                            <input name="email" type="email" required onChange={handleChange} className="appearance-none block w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors" />
                        </div>
                    </div>
                    
                    <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">Company Name</label>
                        <input name="company_name" type="text" required onChange={handleChange} className="appearance-none block w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors" />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">Phone Number</label>
                        <input name="phone_number" type="text" required onChange={handleChange} className="appearance-none block w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors" />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">Password</label>
                        <input name="password" type="password" required onChange={handleChange} className="appearance-none block w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors" />
                    </div>

                    <div>
                        <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all shadow-md">
                            Create Account
                        </button>
                    </div>
                </form>
                <div className="text-center mt-6">
                    <p className="text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="font-semibold text-primary hover:text-blue-700">Log in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
