import { useState, useEffect } from "react";
import api from "@/services/api";
import toast from "react-hot-toast";

export const useAdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchUsers = async (currentSearch, currentPage) => {
    setLoading(true);
    try {
      const res = await api.get("/admin/users", {
        params: {
          search: currentSearch,
          page: currentPage,
        },
      });
      setUsers(res.data.data);
      setTotalPages(res.data.last_page);
    } catch (err) {
      console.error("Users fetch error: ", err);
    } finally {
      setLoading(false);
    }
  };

  // Debouncing Logic
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchUsers(searchTerm, 1);
      setPage(1);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  // Role Update Logic
  const handleRoleChange = async (userId, newRole) => {
    const previousUsers = [...users];
    setUsers(
      users.map((u) => (u.id === userId ? { ...u, system_role: newRole } : u)),
    );

    try {
      const updateRole = api.patch(`/admin/users/${userId}/role`, {
        system_role: newRole,
      });
      await toast.promise(updateRole, {
        loading: "Updating user role...",
        success: "Role updated successfully!",
        error: "Failed to update role.",
      });
    } catch (err) {
      setUsers(previousUsers);
      alert("Role update failed.");
    }
  };

  // Pagination Logic
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
      fetchUsers(searchTerm, newPage);
    }
  };

  // Sirf data aur functions return kar raha hai
  return {
    users,
    loading,
    searchTerm,
    setSearchTerm,
    page,
    totalPages,
    handleRoleChange,
    handlePageChange,
  };
};
