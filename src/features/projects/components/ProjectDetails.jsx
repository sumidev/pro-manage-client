import React, { useState, useRef } from "react";
import { ArrowLeft, Clock, MoreVertical, Trash2, FileText } from "lucide-react";
import { formatDate } from "../../../utils/dateUtils";
import TeamDropdownStatic from "./TeamDropdownStatic";
import { Link, useNavigate } from "react-router-dom";
import ProjectHeader from "./ProjectHeader";
import { useDispatch } from "react-redux";
import { deleteProject, updateProject } from "../projectsSlice";
import DeleteProjectModal from "./DeleteProjectModal";
import { DropdownPortal } from "@/components/ui/DropdownPortal";

export const ProjectDetails = ({ projectDetails }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const menuButtonRef = useRef(null);

  const updateProjectField = async (key, value) => {
    try {
      dispatch(updateProject({ id: projectDetails.id, data: { [key]: value } }));
    } catch (error) {
      console.error("Failed to update", error);
    }
  };

  const handleDeleteProject = async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      await dispatch(deleteProject(projectDetails.id)).unwrap();
      setIsModalOpen(false);
      navigate("/projects");
    } catch (error) {
      console.error("Failed to delete project", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="flex items-start justify-between gap-4 mb-1">
        {/* Left: Back + Header */}
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <Link
            to="/projects"
            className="mt-1 p-1 rounded transition-all shrink-0"
            style={{ color: "#6b778c" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#f4f5f7"; e.currentTarget.style.color = "#172b4d"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = ""; e.currentTarget.style.color = "#6b778c"; }}
          >
            <ArrowLeft size={16} />
          </Link>

          <div className="flex-1 min-w-0">
            <ProjectHeader
              projectDetails={projectDetails}
              onUpdate={updateProjectField}
            />
          </div>
        </div>

        {/* Right: Team + Deadline + Menu */}
        <div className="flex items-center gap-2 shrink-0 pt-1">
          {/* Team avatars */}
          <TeamDropdownStatic
            members={projectDetails.members}
            projectId={projectDetails.id}
          />

          {/* Deadline */}
          {projectDetails.deadline && (
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium"
              style={{ background: "#f4f5f7", color: "#6b778c", border: "1px solid #dfe1e6" }}
            >
              <Clock size={12} />
              <span>{formatDate(projectDetails.deadline)}</span>
            </div>
          )}

          {/* More menu */}
          <div className="relative">
            <button
              ref={menuButtonRef}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-1.5 rounded transition-all"
              style={{
                background: isMenuOpen ? "var(--bg-hover)" : "transparent",
                color: isMenuOpen ? "var(--text-primary)" : "var(--text-muted)",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "var(--bg-hover)"; e.currentTarget.style.color = "var(--text-primary)"; }}
              onMouseLeave={(e) => { if (!isMenuOpen) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-muted)"; } }}
            >
              <MoreVertical size={16} />
            </button>

            <DropdownPortal
              anchorRef={menuButtonRef}
              open={isMenuOpen}
              onClose={() => setIsMenuOpen(false)}
              align="right"
              minWidth={176}
            >
              <div
                className="w-44 rounded shadow-xl border py-1 fade-in"
                style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
              >
                <button
                  onClick={() => { setIsModalOpen(true); setIsMenuOpen(false); }}
                  className="flex items-center gap-2.5 w-full px-3 py-2 text-sm font-semibold transition-all text-left"
                  style={{ color: "var(--red-text)" }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(222, 53, 11, 0.1)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                >
                  <Trash2 size={14} />
                  Delete project
                </button>
              </div>
            </DropdownPortal>
          </div>
        </div>
      </div>

      <DeleteProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        projectName={projectDetails.name}
        onConfirm={handleDeleteProject}
        isDeleting={isDeleting}
      />
    </>
  );
};
