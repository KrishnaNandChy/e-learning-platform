import React from "react";
import { Link } from "react-router-dom";
import { PlusCircle, BarChart, BookOpen, DollarSign } from "lucide-react";

const InstructorDashboard = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div>
             <h1 className="text-3xl font-bold text-gray-900">Instructor Dashboard</h1>
             <p className="text-gray-600 mt-2">Manage your courses and track performance.</p>
          </div>
          <button className="mt-4 md:mt-0 flex items-center gap-2 px-6 py-3 bg-secondary text-white font-medium rounded-lg hover:bg-black transition-colors">
              <PlusCircle className="h-5 w-5" />
              <span>Create New Course</span>
          </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center gap-4">
                  <div className="p-3 bg-indigo-100 text-indigo-600 rounded-full">
                      <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                      <h3 className="text-2xl font-bold text-gray-900">3</h3>
                      <p className="text-sm text-gray-500">Active Courses</p>
                  </div>
              </div>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 text-green-600 rounded-full">
                      <DollarSign className="w-6 h-6" />
                  </div>
                  <div>
                      <h3 className="text-2xl font-bold text-gray-900">₹12,450</h3>
                      <p className="text-sm text-gray-500">Total Earnings</p>
                  </div>
              </div>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
                      <BarChart className="w-6 h-6" />
                  </div>
                  <div>
                      <h3 className="text-2xl font-bold text-gray-900">1,203</h3>
                      <p className="text-sm text-gray-500">Total Students</p>
                  </div>
              </div>
          </div>
      </div>

      {/* Course List */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900">My Courses</h2>
              <Link to="#" className="text-sm text-primary hover:underline">View All</Link>
          </div>
          <div className="divide-y divide-gray-200">
               {[1, 2, 3].map((i) => (
                   <div key={i} className="p-6 flex flex-col md:flex-row items-center justify-between gap-4 hover:bg-gray-50">
                       <div className="flex items-center gap-4">
                            <div className="w-16 h-10 bg-gray-200 rounded overflow-hidden">
                                <img src={`https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80`} alt="Course" className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">Complete Web Development Bootcamp</h3>
                                <div className="text-sm text-gray-500 flex gap-4 mt-1">
                                    <span>Draft</span>
                                    <span>•</span>
                                    <span>Last edited 2 days ago</span>
                                </div>
                            </div>
                       </div>
                       <div className="flex items-center gap-4">
                            <span className="text-sm font-bold text-gray-900">₹499</span>
                            <button className="text-sm text-gray-600 hover:text-primary">Edit</button>
                            <button className="text-sm text-gray-600 hover:text-red-600">Delete</button>
                       </div>
                   </div>
               ))}
          </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;
