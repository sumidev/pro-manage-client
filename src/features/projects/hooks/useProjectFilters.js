import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchProjects } from "../projectsSlice";

export const useProjectFilters = () => {
  const initialFilter = {
    dueDate: null,
    type: [],
  };
  const [filters, setFilters] = useState(initialFilter);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const dispatch = useDispatch();

  const handleFilterChange = useCallback((key, value) => {
    setFilters((prev) => {
      const currentFilter = prev[key];
      if (Array.isArray(currentFilter)) {
        const newArray = currentFilter.includes(value)
          ? currentFilter.filter((item) => item !== value)
          : [...currentFilter, value];

        return { ...prev, [key]: newArray };
      } else {
        const newValue = currentFilter === value ? "" : value;
        return { ...prev, [key]: newValue };
      }
    });
  }, []);

  const clearAllFilters = useCallback(() => {
    setFilters(initialFilter);
  }, []);

  useEffect(() => {
    dispatch(fetchProjects({ page, searchQuery, filters }));
  }, [page, searchQuery, filters, dispatch]);

  const handlePagination = async (step) => {
    const newPage = step === "next" ? page + 1 : page - 1;
    setPage(newPage);
  };

  const handleProjectSearch = (value) => {
    setSearchQuery(value);
  };

  return {
    filters,
    handleFilterChange,
    clearAllFilters,
    handlePagination,
    handleProjectSearch,
    searchQuery
  };
};
