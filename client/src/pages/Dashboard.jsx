import { useAuth } from "../context/AuthContext";

import StudentDashboard from "./dashboards/StudentDashboard";
import InstructorDashboard from "./dashboards/InstructorDashboard";
import AdminDashboard from "./dashboards/AdminDashboard";

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) return null;

  switch (user.role) {
    case "student":
      return <StudentDashboard />;

    case "instructor":
      return <InstructorDashboard />;

    case "admin":
      return <AdminDashboard />;

    default:
      return <p>Unauthorized</p>;
  }
};

export default Dashboard;
