import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const schema = yup.object({
    title: yup.string().required('Title is required'),
    company: yup.string().required('Company is required'),
    location: yup.string().required('Location is required'),
    jobType: yup.string().required('Job Type is required'),
    description: yup.string().required('Description is required'),
    applicationUrl: yup.string().url('Must be a valid URL'),
    salaryRange: yup.string(),
    experienceRequired: yup.string(),
    requirements: yup.string(),
    responsibilities: yup.string(),
}).required();

const JobPost = () => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });
    const navigate = useNavigate();
    const [errorMsg, setErrorMsg] = useState('');

    const onSubmit = async (data: any) => {
        try {
            await axios.post('http://localhost:5000/api/jobs', data);
            navigate('/jobs');
        } catch (err) {
            setErrorMsg('Failed to post job. Please try again.');
            console.error(err);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg my-8">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Post a New Job</h1>

            {errorMsg && <div className="bg-red-100 text-red-700 p-4 rounded mb-6">{errorMsg}</div>}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Job Title</label>
                        <input {...register('title')} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                        <p className="text-red-500 text-xs mt-1">{errors.title?.message}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Company</label>
                        <input {...register('company')} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                        <p className="text-red-500 text-xs mt-1">{errors.company?.message}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Location</label>
                        <input {...register('location')} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                        <p className="text-red-500 text-xs mt-1">{errors.location?.message}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Job Type</label>
                        <select {...register('jobType')} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                            <option value="">Select Type</option>
                            <option value="Full-time">Full-time</option>
                            <option value="Part-time">Part-time</option>
                            <option value="Contract">Contract</option>
                            <option value="Internship">Internship</option>
                            <option value="Freelance">Freelance</option>
                        </select>
                        <p className="text-red-500 text-xs mt-1">{errors.jobType?.message}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Salary Range</label>
                        <input {...register('salaryRange')} placeholder="e.g. $80k - $100k" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Experience Required</label>
                        <input {...register('experienceRequired')} placeholder="e.g. 2-4 years" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea {...register('description')} rows={4} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                    <p className="text-red-500 text-xs mt-1">{errors.description?.message}</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Requirements</label>
                    <textarea {...register('requirements')} rows={3} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Application URL / Email</label>
                    <input {...register('applicationUrl')} placeholder="https://..." className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                    <p className="text-red-500 text-xs mt-1">{errors.applicationUrl?.message}</p>
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Post Job
                    </button>
                </div>
            </form>
        </div>
    );
};

export default JobPost;
