import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { CreditCard, Heart, Trophy } from 'lucide-react';

import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Donation = () => {
    const auth = React.useContext(AuthContext);

    if (auth?.user?.role === 'student') {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Access Restricted</h1>
                <p className="text-gray-600 mb-8">Donations are currently available only for alumni members.</p>
                <Link to="/dashboard" className="text-blue-600 hover:text-blue-800 font-medium">Return to Dashboard</Link>
            </div>
        );
    }
    const { register, handleSubmit, reset, setValue } = useForm();
    const [donations, setDonations] = useState<any[]>([]);
    const [totalRaised, setTotalRaised] = useState(0);
    const [processing, setProcessing] = useState(false);
    const [receipt, setReceipt] = useState<any>(null);

    useEffect(() => {
        fetchDonations();
    }, []);

    const fetchDonations = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/donations');
            setDonations(response.data);
            const total = response.data.reduce((acc: number, curr: any) => acc + curr.amount, 0);
            setTotalRaised(total);
        } catch (err) {
            console.error(err);
        }
    };

    const onSubmit = async (data: any) => {
        setProcessing(true);
        // Simulate payment delay
        setTimeout(async () => {
            try {
                const response = await axios.post('http://localhost:5000/api/donations', data);
                setReceipt(response.data);
                reset();
                fetchDonations();
            } catch (err) {
                console.error(err);
                alert('Donation failed');
            } finally {
                setProcessing(false);
            }
        }, 1500);
    };

    const presetAmounts = [500, 1000, 5000, 10000];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Support Your Alma Mater</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Donation Form - Hidden for Admin */}
                {auth?.user?.role !== 'admin' && (
                    <div className="md:col-span-2 bg-white rounded-lg shadow-lg overflow-hidden">
                        <div className="p-6 bg-blue-600 text-white">
                            <h2 className="text-xl font-bold flex items-center">
                                <Heart className="mr-2 h-6 w-6" /> Make a Donation
                            </h2>
                            <p className="opacity-90 mt-1">Your contribution helps shape the future.</p>
                        </div>
                        <div className="p-8">
                            {receipt ? (
                                <div className="text-center py-8">
                                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                                        <CreditCard className="h-8 w-8 text-green-600" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h3>
                                    <p className="text-gray-600 mb-6">Your donation has been received successfully.</p>
                                    <div className="bg-gray-50 p-4 rounded-md inline-block text-left">
                                        <p><strong>Receipt #:</strong> {receipt.receiptNumber}</p>
                                        <p><strong>Amount:</strong> ₹{receipt.amount}</p>
                                        <p><strong>Date:</strong> {new Date(receipt.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <button
                                        onClick={() => setReceipt(null)}
                                        className="mt-6 block w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
                                    >
                                        Make Another Donation
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Select Amount (₹)</label>
                                        <div className="flex space-x-4 mb-4">
                                            {presetAmounts.map(amt => (
                                                <button
                                                    key={amt}
                                                    type="button"
                                                    onClick={() => setValue('amount', amt)}
                                                    className="flex-1 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 focus:ring-2 focus:ring-blue-500"
                                                >
                                                    {amt}
                                                </button>
                                            ))}
                                        </div>
                                        <input
                                            type="number"
                                            {...register('amount', { required: true, min: 1 })}
                                            placeholder="Other Amount"
                                            className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Donor Name</label>
                                            <input
                                                {...register('donorName', { required: true })}
                                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Purpose (Optional)</label>
                                            <select
                                                {...register('purpose', { required: true })}
                                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                            >
                                                <option value="General Fund">General Fund</option>
                                                <option value="Scholarship">Scholarship</option>
                                                <option value="Infrastructure">Infrastructure</option>
                                                <option value="Events">Events</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            {...register('isAnonymous')}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                        <label className="ml-2 block text-sm text-gray-900">Make this donation anonymous</label>
                                    </div>

                                    <div className="border-t pt-6 mt-6">
                                        <h4 className="text-sm font-medium text-gray-700 mb-3">Payment Info (Mock)</h4>
                                        <div className="bg-gray-100 p-4 rounded-md border border-gray-200">
                                            <p className="text-sm text-gray-500 text-center">Using SafePay Secure Gateway (Mock Mode)</p>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                                    >
                                        {processing ? 'Processing...' : 'Donate Now'}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                )}

                {/* Stats & Recent Donors */}
                <div className={`space-y-8 ${auth?.user?.role === 'admin' ? 'col-span-3' : ''}`}>
                    <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                        <h3 className="text-gray-500 font-medium">Total Raised</h3>
                        <p className="text-4xl font-bold text-blue-600 mt-2">₹{totalRaised.toLocaleString()}</p>
                    </div>

                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                        <div className="p-4 bg-gray-50 border-b">
                            <h3 className="font-bold text-gray-700 flex items-center">
                                <Trophy className="mr-2 h-5 w-5 text-yellow-500" /> Recent Donors
                            </h3>
                        </div>
                        <ul className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                            {donations.map((donation: any) => (
                                <li key={donation._id} className="p-4 flex justify-between items-center hover:bg-gray-50">
                                    <div>
                                        <p className="font-medium text-gray-900">{donation.donorName}</p>
                                        <p className="text-xs text-gray-500">{donation.purpose}</p>
                                    </div>
                                    <span className="font-semibold text-green-600">₹{donation.amount}</span>
                                </li>
                            ))}
                            {donations.length === 0 && <li className="p-4 text-center text-gray-500">Be the first to donate!</li>}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Donation;
