import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const schema = yup.object({
    alumniName: yup.string().required('Name is required'),
    graduationYear: yup.number().typeError('Year must be a number'),
    currentPosition: yup.string().required('Current Position is required'),
    achievementTitle: yup.string().required('Title is required'),
    description: yup.string().required('Description is required'),
    category: yup.string().required('Category is required'),
    photo: yup.string().url('Must be a valid URL'),
}).required();

const StorySubmit = () => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });
    const navigate = useNavigate();
    const [errorMsg, setErrorMsg] = useState('');

    const onSubmit = async (data: any) => {
        try {
            await axios.post('http://localhost:5000/api/stories', data);
            navigate('/stories');
        } catch (err) {
            setErrorMsg('Failed to submit story. Please try again.');
            console.error(err);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg my-8">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Share Your Success Story</h1>

            {errorMsg && <div className="bg-red-100 text-red-700 p-4 rounded mb-6">{errorMsg}</div>}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Alumni Name</label>
                        <input {...register('alumniName')} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                        <p className="text-red-500 text-xs mt-1">{errors.alumniName?.message}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Graduation Year</label>
                        <input type="number" {...register('graduationYear')} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Current Position</label>
                        <input {...register('currentPosition')} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Category</label>
                        <select {...register('category')} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                            <option value="Career">Career</option>
                            <option value="Innovation">Innovation</option>
                            <option value="Research">Research</option>
                            <option value="Social Impact">Social Impact</option>
                            <option value="Sports">Sports</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Achievement Title</label>
                    <input {...register('achievementTitle')} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                    <p className="text-red-500 text-xs mt-1">{errors.achievementTitle?.message}</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea {...register('description')} rows={5} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                    <p className="text-red-500 text-xs mt-1">{errors.description?.message}</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Photo URL</label>
                    <input {...register('photo')} placeholder="https://..." className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Submit Story
                    </button>
                </div>
            </form>
        </div>
    );
};

export default StorySubmit;
