import React, { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const schema = yup.object().shape({
    role: yup.string().oneOf(['alumni', 'student', 'event_coordinator'], 'Select a valid role').default('alumni'),
    name: yup.string().required('Name is required'),
    email: yup.string()
        .email('Invalid email')
        .required('Email is required')
        .when('role', {
            is: 'student',
            then: (schema) => schema.test('is-charusat', 'Students must use a @charusat.edu.in email', (value) => value ? value.endsWith('@charusat.edu.in') : false),
        }),
    password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    confirmPassword: yup.string().oneOf([yup.ref('password')], 'Passwords must match').required('Confirm Password is required'),
});

const Register = () => {
    const { register, handleSubmit, watch, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            role: 'alumni'
        }
    });

    const selectedRole = watch('role');

    const auth = useContext(AuthContext);
    const navigate = useNavigate();
    const [serverError, setServerError] = useState('');

    const onSubmit = async (data: any) => {
        try {
            const response = await axios.post('http://localhost:5000/api/auth/register', data);
            auth?.login(response.data.token, response.data.user);
            navigate('/dashboard'); // Direct to dashboard after registration
        } catch (error: any) {
            setServerError(error.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Register</h2>
                {serverError && <p className="text-red-500 text-center mb-4">{serverError}</p>}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                    {/* Role Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">I am a...</label>
                        <div className="flex space-x-2">
                            <label className={`flex-1 text-center py-2 border rounded-md cursor-pointer text-sm ${selectedRole === 'alumni' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}>
                                <input {...register('role')} type="radio" value="alumni" className="sr-only" />
                                Alumni
                            </label>
                            <label className={`flex-1 text-center py-2 border rounded-md cursor-pointer text-sm ${selectedRole === 'student' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}>
                                <input {...register('role')} type="radio" value="student" className="sr-only" />
                                Student
                            </label>
                            <label className={`flex-1 text-center py-2 border rounded-md cursor-pointer text-sm ${selectedRole === 'event_coordinator' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}>
                                <input {...register('role')} type="radio" value="event_coordinator" className="sr-only" />
                                Coordinator
                            </label>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            {...register('name')}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                        <p className="text-red-500 text-xs mt-1">{errors.name?.message}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            {...register('email')}
                            placeholder={selectedRole === 'student' ? 'your.id@charusat.edu.in' : 'your@email.com'}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                        <p className="text-red-500 text-xs mt-1">{errors.email?.message}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            {...register('password')}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                        <p className="text-red-500 text-xs mt-1">{errors.password?.message}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                        <input
                            type="password"
                            {...register('confirmPassword')}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                        <p className="text-red-500 text-xs mt-1">{errors.confirmPassword?.message}</p>
                    </div>
                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Register as {selectedRole === 'student' ? 'Student' : 'Alumni'}
                    </button>
                </form>
                <p className="mt-4 text-center text-sm text-gray-600">
                    Already have an account? <Link to="/login" className="text-blue-600 hover:text-blue-500">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
