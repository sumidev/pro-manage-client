import { useCallback, useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  clearProjectDetails,
  fetchProjectById,
  moveTaskOptimistically,
  syncTaskMovement,
} from "../projectsSlice";
import { createTask, moveTaskStage } from "../../tasks/tasksSlice";
import { useTaskFilters } from "./useTaskFilters";
import echo from "@/utils/echo";

export const useProjectBoard = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { project, loading, projectLoading, error } = useSelector(
    (state) => state.projects,
  );

  // Relaxed project check to handle arrays or missing id wrapper
  let projectObj = project;
  if (Array.isArray(project) && project.length > 0) {
    projectObj = project[0];
  }

  const projectDetails = projectObj && (projectObj.id || projectObj._id) ? projectObj : null;

  const projectId = id;
  const tasks = projectDetails?.tasks ?? null;

  const { filters, handleFilterChange, filteredTasks, clearAllFilters } =
    useTaskFilters(tasks);

  const allTasks = useMemo(() => {
    if (!tasks) return [];
    return Object.keys(tasks).flatMap((stage) =>
      tasks[stage].map((t) => ({ ...t, stageName: stage })),
    );
  }, [tasks]);

  const handleDragEnd = useCallback(
    (result) => {
      const { source, destination, draggableId } = result;
      if (!destination) return;
      if (
        source.droppableId === destination.droppableId &&
        source.index === destination.index
      )
        return;

      dispatch(
        moveTaskOptimistically({
          taskId: draggableId,
          fromStage: source.droppableId,
          toStage: destination.droppableId,
          newIndex: destination.index,
        }),
      );

      dispatch(
        moveTaskStage({
          taskId: draggableId,
          newStage: destination.droppableId,
          newIndex: destination.index,
        }),
      )
        .unwrap()
        .catch(() => toast.error("Failed to move task"));
    },
    [dispatch],
  );

  const handleCreateTask = async (data) => {
    const payload = { ...data, projectId: projectDetails.id };
    await toast.promise(dispatch(createTask(payload)).unwrap(), {
      loading: "Creating issue...",
      success: "Issue created!",
      error: (err) => `Error: ${err}`,
    });
  };

  // Fetch project on mount, clear on unmount
  useEffect(() => {
    dispatch(fetchProjectById(id));
    return () => {
      dispatch(clearProjectDetails());
    };
  }, [id, dispatch]);

  // Real-time task movement via Echo
  useEffect(() => {
    const channel = echo
      .private(`project.${projectId}`)
      .listen(".task.moved", (data) => {
        dispatch(syncTaskMovement(data.task));
      });

    return () => {
      echo.leave(`project.${projectId}`);
    };
  }, [projectId, dispatch]);

  return {
    projectDetails,
    filteredTasks,
    allTasks,
    filters,
    handleFilterChange,
    loading,
    projectLoading,
    error,
    handleDragEnd,
    handleCreateTask,
    clearAllFilters,
  };
};
