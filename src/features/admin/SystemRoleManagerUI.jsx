import React from 'react';

const SystemRoleManagerUI = ({
    users,
    loading,
    searchTerm,
    onSearchChange,
    onRoleChange,
    page,
    totalPages,
    onPageChange
}) => {

    return (
        <div className="p-6 max-w-6xl mx-auto">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">System Role Management</h2>
                <span className="bg-red-100 text-red-800 text-xs font-bold px-3 py-1 rounded tracking-wide uppercase">
                    Admin Access
                </span>
            </div>

            {/* Search Input */}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search users..."
                    className="w-full md:w-1/3 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-4">
                {loading && users.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">Loading directory...</div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="p-4 text-sm font-semibold text-gray-600">Name</th>
                                <th className="p-4 text-sm font-semibold text-gray-600">Email</th>
                                <th className="p-4 text-sm font-semibold text-gray-600">System Role</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {users.length === 0 ? (
                                <tr>
                                    <td colSpan="3" className="p-4 text-center text-gray-500">No users found.</td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 font-medium text-gray-900">{user.first_name} {user.last_name}</td>
                                        <td className="p-4 text-gray-600">{user.email}</td>
                                        <td className="p-4 w-48">
                                            <select
                                                className="w-full border border-gray-300 rounded-md p-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                                                value={user.system_role}
                                                onChange={(e) => onRoleChange(user.id, e.target.value)}
                                            >
                                                <option value="client">Client</option>
                                                <option value="employee">Employee</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Pagination Controls */}
            {!loading && totalPages > 1 && (
                <div className="flex justify-between items-center text-sm text-gray-600">
                    <button
                        onClick={() => onPageChange(page - 1)}
                        disabled={page === 1}
                        className={`px-4 py-2 border rounded ${page === 1 ? 'bg-gray-100 cursor-not-allowed' : 'hover:bg-gray-50'}`}
                    >
                        Previous
                    </button>
                    <span>Page {page} of {totalPages}</span>
                    <button
                        onClick={() => onPageChange(page + 1)}
                        disabled={page === totalPages}
                        className={`px-4 py-2 border rounded ${page === totalPages ? 'bg-gray-100 cursor-not-allowed' : 'hover:bg-gray-50'}`}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default SystemRoleManagerUI;