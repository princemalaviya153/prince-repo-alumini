import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const schema = yup.object({
    title: yup.string().required('Title is required'),
    description: yup.string().required('Description is required'),
    dateTime: yup.date().required('Date & Time is required').typeError('Invalid date'),
    venue: yup.string().required('Venue is required'),
    eventType: yup.string().required('Event Type is required'),
    maxAttendees: yup.number().positive().integer().nullable().transform((v, o) => (o === '' ? null : v)),
    bannerImage: yup.string().url('Must be a valid URL'),
    registrationLink: yup.string().url('Must be a valid URL'),
}).required();

const EventCreate = () => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });
    const navigate = useNavigate();
    const [errorMsg, setErrorMsg] = useState('');

    const onSubmit = async (data: any) => {
        try {
            await axios.post('http://localhost:5000/api/events', data);
            navigate('/events');
        } catch (err) {
            setErrorMsg('Failed to create event. Please try again.');
            console.error(err);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg my-8">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Create New Event</h1>

            {errorMsg && <div className="bg-red-100 text-red-700 p-4 rounded mb-6">{errorMsg}</div>}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Event Title</label>
                    <input {...register('title')} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                    <p className="text-red-500 text-xs mt-1">{errors.title?.message}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Date & Time</label>
                        <input type="datetime-local" {...register('dateTime')} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                        <p className="text-red-500 text-xs mt-1">{errors.dateTime?.message}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Event Type</label>
                        <select {...register('eventType')} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                            <option value="Networking">Networking</option>
                            <option value="Reunion">Reunion</option>
                            <option value="Workshop">Workshop</option>
                            <option value="Seminar">Seminar</option>
                            <option value="Webinar">Webinar</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Venue</label>
                    <input {...register('venue')} placeholder="e.g. Grand Hall / Zoom Link" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                    <p className="text-red-500 text-xs mt-1">{errors.venue?.message}</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea {...register('description')} rows={4} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                    <p className="text-red-500 text-xs mt-1">{errors.description?.message}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Max Attendees (Optional)</label>
                        <input type="number" {...register('maxAttendees')} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Banner Image URL</label>
                        <input {...register('bannerImage')} placeholder="https://..." className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">External Registration Link (Optional)</label>
                    <input {...register('registrationLink')} placeholder="https://..." className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Create Event
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EventCreate;
