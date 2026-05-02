import React from 'react';
import SystemRoleManagerUI from '@/features/admin/SystemRoleManagerUI';
import { useAdminUsers } from '@/features/admin/hooks/useAdminUsers';

const UsersPage = () => {
    const {
        users,
        loading,
        searchTerm,
        setSearchTerm,
        page,
        totalPages,
        handleRoleChange,
        handlePageChange
    } = useAdminUsers();

    return (
        <SystemRoleManagerUI
            users={users}
            loading={loading}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onRoleChange={handleRoleChange}
            page={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
        />
    );
};

export default UsersPage;