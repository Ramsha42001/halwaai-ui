'use client'
import React, { useEffect, useState } from 'react';
import { authService } from '../../../services/api/authService'
import withAuth, { withAdminAuth } from '@/utils/withAuth';
const UserPage: React.FC = () => {
    const [users, setUsers] = useState<any[]>([]); // Adjust the type as per your user model
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedUserId, setExpandedUserId] = useState<string | null>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await authService.getAllUsers();
                console.log(response)
                setUsers(response); // Assuming response contains the user data
            } catch (err) {
                setError('Failed to fetch users');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers(); // Call the async function
    }, []); // Empty dependency array to run once on mount

    const toggleAccordion = (userId: string) => {
        setExpandedUserId(expandedUserId === userId ? null : userId);
    };

    if (loading) return <div className="flex justify-center items-center h-screen"><div className="loader"></div></div>; // Tailwind loading spinner
    if (error) return <div className="text-red-500 text-center">{error}</div>; // Tailwind alert for errors

    return (
        <div className="p-6 bg-gray-100 rounded-lg shadow-md min-h-[100vh] h-auto">
            <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">User List</h1>
            <ul className="space-y-4">
                {users.map(user => (
                    <li key={user._id} className="border border-gray-300 rounded-lg p-4 flex flex-col bg-white shadow hover:shadow-lg transition-shadow duration-300">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-semibold text-gray-900">{user.firstName} {user.lastName}</h2>
                            <p className="text-gray-600">{user.email}</p>
                            <button onClick={() => toggleAccordion(user._id)} className="text-blue-500">{expandedUserId === user._id ? 'View Less' : 'View More'}</button>
                        </div>
                        {expandedUserId === user._id && (
                            <div className="mt-2 text-gray-500">
                                <p>Phone: {user.addresses.length > 0 ? user.addresses[0].phone : 'No phone number available'}</p>
                                <p>Address: {user.addresses.length > 0 ? `${user.addresses[0].addressLine1}, ${user.addresses[0].addressLine2}, ${user.addresses[0].city}, ${user.addresses[0].state}, ${user.addresses[0].country}, ${user.addresses[0].zipCode}` : 'No address available'}</p>
                                <p>Created At: {new Date(user.createdAt).toLocaleDateString()}</p>
                                <p>Updated At: {new Date(user.updatedAt).toLocaleDateString()}</p>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default withAdminAuth(UserPage);
