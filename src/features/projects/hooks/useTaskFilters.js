import { useCallback, useMemo, useState } from "react";

export const useTaskFilters = (tasks) => {
  const initialFilter = {
    search: "",
    dueDate: null,
    priorities: [],
    assignees: [],
  };
  const [filters, setFilters] = useState(initialFilter);

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

  const filteredTasks = useMemo(() => {
    if (!tasks) return {};

    const result = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    Object.keys(tasks).forEach((stage) => {
      result[stage] = tasks[stage].filter((task) => {
        const matchesSearch =
          !filters.search ||
          task.name.toLowerCase().includes(filters.search.toLowerCase());

        const matchesPriority =
          filters.priorities.length === 0 ||
          filters.priorities
            .map((p) => p.toLowerCase())
            .includes(task.priority);

        const matchesAssignee =
          filters.assignees.length === 0 ||
          filters.assignees.includes(Number(task.assigned_to?.id)) ||
          (filters.assignees.includes("unassigned") && !task.assigned_to);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const currentDay = today.getDay();
        const daysUntilSunday = currentDay === 0 ? 0 : 7 - currentDay;
        const endOfWeek = new Date(today);
        endOfWeek.setDate(today.getDate() + daysUntilSunday);
        endOfWeek.setHours(0, 0, 0, 0);

        let matchesDueDate = true;

        if (filters.dueDate && filters.dueDate !== "all") {
          if (filters.dueDate === "no_date") {
            matchesDueDate = !task.due_date;
          } else {
            if (!task.due_date) {
              matchesDueDate = false;
            } else {
              const taskDate = new Date(task.due_date);
              taskDate.setHours(0, 0, 0, 0);

              if (filters.dueDate === "today") {
                matchesDueDate = taskDate.getTime() === today.getTime();
              } else if (filters.dueDate === "overdue") {
                matchesDueDate =
                  taskDate.getTime() < today.getTime() && stage !== "done";
              } else if (filters.dueDate === "week") {
                matchesDueDate =
                  taskDate.getTime() >= today.getTime() &&
                  taskDate.getTime() <= endOfWeek.getTime();
              }
            }
          }
        }
        return (
          matchesSearch && matchesPriority && matchesAssignee && matchesDueDate
        );
      });
    });

    return result;
  }, [tasks, filters]);

  return {
    filters,
    handleFilterChange,
    filteredTasks,
    clearAllFilters
  };
};
