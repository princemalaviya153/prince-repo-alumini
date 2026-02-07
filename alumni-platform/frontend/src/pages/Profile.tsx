import React, { useEffect, useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

// Update schema to allow file or string
const schema = yup.object({
    name: yup.string().required('Name is required'),
    phone: yup.string(),
    graduationYear: yup.number().transform((value) => (isNaN(value) ? undefined : value)).nullable(),
    degree: yup.string(),
    fieldOfStudy: yup.string(),
    studentId: yup.string(),
    currentPosition: yup.string(),
    company: yup.string(),
    industry: yup.string(),
    location: yup.string(),
    bio: yup.string(),
    linkedIn: yup.string().url('Must be a valid URL').nullable().transform((v) => v === "" ? null : v),
    profilePhoto: yup.mixed(), // Allow file or string
}).required();

const Profile = () => {
    const auth = useContext(AuthContext);
    const user = auth?.user;
    const updateUser = auth?.updateUser;

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });
    const [loading, setLoading] = useState(true);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/profile');
                const profileData = { ...user, ...response.data };
                reset(profileData);
                setPreviewImage(profileData.profilePhoto);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setErrorMsg('Failed to load profile');
                setLoading(false);
            }
        };
        if (user) {
            fetchProfile();
        }
    }, [reset, user]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const onSubmit = async (data: any) => {
        try {
            setSuccessMsg('');
            setErrorMsg('');

            const formData = new FormData();

            // Explicitly handle all fields
            formData.append('name', data.name);
            if (data.phone) formData.append('phone', data.phone);
            if (data.graduationYear) formData.append('graduationYear', String(data.graduationYear));
            if (data.degree) formData.append('degree', data.degree);
            if (data.fieldOfStudy) formData.append('fieldOfStudy', data.fieldOfStudy);
            if (data.studentId) formData.append('studentId', data.studentId);
            if (data.currentPosition) formData.append('currentPosition', data.currentPosition);
            if (data.company) formData.append('company', data.company);
            if (data.industry) formData.append('industry', data.industry);
            if (data.location) formData.append('location', data.location);
            if (data.bio) formData.append('bio', data.bio);
            if (data.linkedIn) formData.append('linkedIn', data.linkedIn);

            if (data.profilePhoto?.[0] instanceof File) {
                formData.append('profilePhoto', data.profilePhoto[0]);
            }

            const response = await axios.put('http://localhost:5000/api/profile', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (updateUser) {
                updateUser(response.data);
            }
            setSuccessMsg('Profile updated successfully!');
            window.scrollTo(0, 0);
        } catch (err) {
            console.error(err);
            setErrorMsg('Failed to update profile');
        }
    };

    if (loading) return <div className="p-8 text-center">Loading profile...</div>;

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg my-8">
            <h1 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-4">My Profile</h1>

            {successMsg && <div className="bg-green-100 text-green-700 p-4 rounded mb-6">{successMsg}</div>}
            {errorMsg && <div className="bg-red-100 text-red-700 p-4 rounded mb-6">{errorMsg}</div>}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Personal Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-2">
                        <h2 className="text-xl font-semibold mb-3 text-gray-700">Personal Details</h2>
                    </div>

                    <div className="col-span-2 flex items-center space-x-4">
                        {previewImage ? (
                            <img src={previewImage} alt="Profile" className="w-20 h-20 rounded-full object-cover" />
                        ) : (
                            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">No Photo</div>
                        )}
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700">Profile Photo</label>
                            <input
                                type="file"
                                accept="image/*"
                                {...register('profilePhoto')}
                                onChange={(e) => {
                                    register('profilePhoto').onChange(e);
                                    handleFileChange(e);
                                }}
                                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                            <p className="text-xs text-gray-500 mt-1">Upload a JPG, PNG, or GIF</p>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input {...register('name')} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                        <p className="text-red-500 text-xs mt-1">{errors.name?.message}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email (Read Only)</label>
                        <input value={user?.email || ''} disabled className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                        <input {...register('phone')} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Location</label>
                        <input {...register('location')} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                </div>

                {/* Academic Info */}
                {user?.role !== 'admin' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-6">
                        <div className="col-span-2">
                            <h2 className="text-xl font-semibold mb-3 text-gray-700">Academic Information</h2>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Degree</label>
                            <select {...register('degree')} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                                <option value="">Select Degree</option>
                                <option value="B.Tech">B.Tech</option>
                                <option value="M.Tech">M.Tech</option>
                                <option value="B.Sc">B.Sc</option>
                                <option value="M.Sc">M.Sc</option>
                                <option value="PhD">PhD</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Field of Study</label>
                            <input {...register('fieldOfStudy')} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Graduation Year</label>
                            <input type="number" {...register('graduationYear')} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                            <p className="text-red-500 text-xs mt-1">{errors.graduationYear?.message}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Student ID (Optional)</label>
                            <input {...register('studentId')} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                    </div>
                )}

                {/* Professional Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-6">
                    <div className="col-span-2">
                        <h2 className="text-xl font-semibold mb-3 text-gray-700">Professional Details</h2>
                    </div>

                    {!['student', 'event_coordinator', 'admin'].includes(user?.role || '') && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Current Position</label>
                                <input {...register('currentPosition')} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Company</label>
                                <input {...register('company')} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Industry</label>
                                <select {...register('industry')} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                                    <option value="">Select Industry</option>
                                    <option value="Technology">Technology</option>
                                    <option value="Finance">Finance</option>
                                    <option value="Healthcare">Healthcare</option>
                                    <option value="Education">Education</option>
                                    <option value="Manufacturing">Manufacturing</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700">LinkedIn Profile</label>
                        <input {...register('linkedIn')} placeholder="https://linkedin.com/in/..." className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                        <p className="text-red-500 text-xs mt-1">{errors.linkedIn?.message}</p>
                    </div>
                </div>

                {/* Bio */}
                <div className="border-t pt-6">
                    <label className="block text-sm font-medium text-gray-700">Bio</label>
                    <textarea {...register('bio')} rows={4} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                </div>

                <div className="flex justify-end pt-6">
                    <button
                        type="submit"
                        className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Save Profile
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Profile;
