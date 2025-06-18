'use client'
import React, { useEffect, useState } from 'react';
import {authService} from '../../../services/api/authService'
const UserPage: React.FC = () => {
    const [users, setUsers] = useState<any[]>([]); // Adjust the type as per your user model
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await authService.getAllUsers();
                setUsers(response); // Assuming response contains the user data
            } catch (err) {
                setError('Failed to fetch users');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers(); // Call the async function
    }, []); // Empty dependency array to run once on mount

    if (loading) return <div className="flex justify-center items-center h-screen"><div className="loader"></div></div>; // Tailwind loading spinner
    if (error) return <div className="text-red-500 text-center">{error}</div>; // Tailwind alert for errors

    return (
        <div className="mt-[70px] p-6 bg-gray-100 rounded-lg shadow-md">
            <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">User List</h1>
            <ul className="space-y-4">
                {users.map(user => (
                    <li key={user._id} className="border border-gray-300 rounded-lg p-4 flex flex-col bg-white shadow hover:shadow-lg transition-shadow duration-300">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-semibold text-gray-900">{user.firstName} {user.lastName}</h2>
                            <p className="text-gray-600">{user.email}</p>
                        </div>
                        <p className="text-gray-500">{user.addresses.length > 0 ? user.addresses[0].phone : 'No phone number available'}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserPage;
