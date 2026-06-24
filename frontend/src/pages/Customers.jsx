import React, { useEffect, useState } from 'react';
import api from '../api';
import { Users, Plus, Edit2, Trash2 } from 'lucide-react';

export default function Customers() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ name: '', phone: '', email: '', address: '' });

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const res = await api.get('customers/');
            setCustomers(res.data);
        } catch (error) {
            console.error("Failed to fetch customers", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('customers/', formData);
            setShowModal(false);
            setFormData({ name: '', phone: '', email: '', address: '' });
            fetchCustomers();
        } catch (error) {
            console.error("Failed to save customer", error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this customer? This action cannot be undone.")) return;
        try {
            await api.delete(`customers/${id}/`);
            fetchCustomers();
        } catch (error) {
            console.error("Failed to delete customer", error);
        }
    };

    if (loading) return <div className="p-8">Loading customers...</div>;

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-dark tracking-tight">Customers</h1>
                    <p className="text-gray-500 mt-1">Manage your client list</p>
                </div>
                <button 
                    onClick={() => setShowModal(true)}
                    className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Add Customer
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-border overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-border">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-border">
                        {customers.map(customer => (
                            <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-gray-dark">{customer.name}</td>
                                <td className="px-6 py-4 text-gray-500">{customer.phone}</td>
                                <td className="px-6 py-4 text-gray-500">{customer.email || '-'}</td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-gray-400 hover:text-primary mr-4 transition-colors"><Edit2 className="w-4 h-4" /></button>
                                    <button onClick={() => handleDelete(customer.id)} className="text-gray-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                                </td>
                            </tr>
                        ))}
                        {customers.length === 0 && (
                            <tr>
                                <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                                    <Users className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                                    <p className="text-lg font-medium text-gray-dark">No customers found</p>
                                    <p className="mt-1">Add your first customer to get started.</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Add Customer Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-gray-dark bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-border bg-gray-50">
                            <h3 className="text-xl font-bold text-gray-dark">Add Customer</h3>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input type="text" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                                    value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Jane Doe" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                <input type="text" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                                    value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="0712345678" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input type="email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                                    value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="jane@example.com" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                <textarea className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors" rows="2"
                                    value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} placeholder="Nairobi, Kenya" />
                            </div>
                            <div className="flex justify-end space-x-3 mt-8">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-700 hover:bg-gray-100 font-medium rounded-lg transition-colors">Cancel</button>
                                <button type="submit" className="px-6 py-2 bg-primary text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm">Save Customer</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
