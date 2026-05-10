import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchProjectById, moveTaskOptimistically, syncTaskMovement } from "../projectsSlice";
import { createTask, moveTaskStage } from "../../tasks/tasksSlice";
import { useTaskFilters } from "./useTaskFilters";
import echo from "@/utils/echo";

export const useProjectBoard = () => {
  const { id } = useParams();

  const { project, loading } = useSelector((state) => state.projects);

  const projectDetails = project.project;

  const projectId = id;

  const tasks = project.tasks;

  const { filters, handleFilterChange, filteredTasks, clearAllFilters } =
    useTaskFilters(tasks);

  const dispatch = useDispatch();

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
      ) {
        return;
      }
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
        .catch((err) => {
          toast.error("Failed to move task");
        });
    },
    [dispatch],
  );

  const handleCreateTask = async (data) => {
    const payload = { ...data, projectId: projectDetails.id };
    await toast.promise(dispatch(createTask(payload)).unwrap(), {
      loading: "Creating Task...",
      success: "Task Created!",
      error: (err) => `Error: ${err}`,
    });
  };

  useEffect(() => {
    dispatch(fetchProjectById(id));
  }, [id, dispatch]);

  useEffect(() => {
    const channel = echo
      .private(`project.${projectId}`)
      .listen(".task.moved", (data) => {
        console.log("Task moved by another user:", data);
        // // 🚨 Yahan Redux dispatch kar ke state update kar do
        dispatch(syncTaskMovement(data.task));
      });

    return () => {
      echo.leave(`project.${projectId}`);
    };
  }, [projectId,dispatch]);

  return {
    projectDetails,
    filteredTasks,
    allTasks,
    filters,
    handleFilterChange,
    loading,
    handleDragEnd,
    handleCreateTask,
    clearAllFilters,
  };
};
