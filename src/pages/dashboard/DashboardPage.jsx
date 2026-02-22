import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { 
  Briefcase, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Plus, 
  ArrowRight 
} from "lucide-react";
import { fetchDashboardStats } from "../../features/dashboard/dashboardSlice";
import { STATS_CONFIG } from "../../features/dashboard/dashboardConstants";
import { formatDate } from "../../utils/dateUtils";

// --- REUSABLE STAT CARD COMPONENT ---
const StatCard = ({ title, value, icon: Icon, color, bg }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
    <div>
      <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
    </div>
    <div className={`p-3 rounded-lg ${bg} ${color}`}>
      <Icon size={24} />
    </div>
  </div>
);

const DashboardPage = () => {
  // Redux se User ka naam lene ke liye
  const { user } = useSelector((state) => state.auth);
  const {stats, recentProjects, myTasks} = useSelector((state) => state.dashboard);
  const dispatch = useDispatch();
  useEffect(()=>{
    console.log("testing case");
    dispatch(fetchDashboardStats());
  },[]);

  return (
    <div className="space-y-6">
      
      {/* 1. WELCOME SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Welcome back, {`${user?.first_name} ${user?.last_name || "User"}`}! 👋
          </h1>
          <p className="text-gray-500">Here's what's happening with your projects today.</p>
        </div>
        <Link 
          to="/projects" // Filhal Projects list pe bhejte hain, baad me Create Modal kholenge
          className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition shadow-sm shadow-indigo-200"
        >
          <Plus size={18} /> New Project
        </Link>
      </div>

      {/* 2. statss GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {STATS_CONFIG.map((stat, index) => {
          const value = stats ? stats[stat.key] : 0;
          return <StatCard key={index} {...stat} value={value} />
        })}
      </div>

      {/* 3. SPLIT SECTION (PROJECTS & TASKS) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT: Recent Projects (Takes 2 columns) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-800">Recent Projects</h2>
            <Link to="/projects" className="text-sm text-indigo-600 font-medium hover:underline flex items-center gap-1">
              View All <ArrowRight size={16}/>
            </Link>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
             {recentProjects.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {recentProjects.map((project) => (
                    <Link to={`/projects/${project.id}`} key={project.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center font-bold text-gray-600">
                          {project.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{project.name}</h4>
                          <span className="text-xs text-gray-500">Updated {formatDate(project.updated_at)}</span>
                        </div>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${project.color}`}>
                        {project.status}
                      </span>
                    </Link>
                  ))}
                </div>
             ) : (
               <div className="p-8 text-center text-gray-500">No projects found.</div>
             )}
          </div>
        </div>

        {/* RIGHT: My Tasks (Takes 1 column) */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-800">My Tasks</h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 space-y-3">
             {myTasks.map((task) => (
               <div key={task.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                 {/* Checkbox visual */}
                 <div className="mt-1 w-5 h-5 rounded-full border-2 border-gray-300 flex-shrink-0 cursor-pointer hover:border-indigo-500"></div>
                 <div>
                    <h4 className="text-sm font-medium text-gray-800 line-clamp-1">{task.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                       <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-wide 
                          ${task.priority === 'high' ? 'bg-red-100 text-red-700' : 
                            task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : 
                            'bg-blue-100 text-blue-700'}`}>
                          {task.priority}
                       </span>
                       <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Clock size={12} /> {formatDate(task.due_date)}
                       </span>
                    </div>
                 </div>
               </div>
             ))}
             <button className="w-full text-center text-sm text-gray-500 hover:text-indigo-600 font-medium py-2">
               See all tasks
             </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardPage;