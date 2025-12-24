import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Star, Clock, Globe, FileText, PlayCircle, Check, AlertCircle } from 'lucide-react';

const CourseDetail = () => {
  const { id } = useParams();
  
  // Mock Data (In a real app, fetch based on ID)
  const course = {
    _id: id,
    title: 'Complete Web Development Bootcamp 2025',
    description: "Become a full-stack web developer with just one course. HTML, CSS, Javascript, Node, React, MongoDB and more!",
    instructor: {
        name: 'Angela Yu',
        bio: 'Lead Instructor at App Brewery',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
        rating: 4.8,
        students: 150000,
        courses: 12
    },
    rating: 4.8,
    ratingCount: 12500,
    studentsEnrolled: 45000,
    lastUpdated: '12/2024',
    language: 'English',
    price: 499,
    originalPrice: 3999,
    imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    whatYouWillLearn: [
        "Build 16 web development projects for your portfolio",
        "Learn the latest technologies, including Javascript ES6, Bootstrap 5, MongoDB",
        "Build fully-fledged websites and web apps for your startup or business",
        "Master backend development with Node.js and Express"
    ],
    content: [
        { title: "Introduction to HTML", duration: "45m", lectures: 5 },
        { title: "Intermediate CSS", duration: "1h 20m", lectures: 8 },
        { title: "Javascript Basics", duration: "2h 15m", lectures: 12 },
        { title: "React.js Framework", duration: "3h 30m", lectures: 15 },
    ]
  };

  return (
    <div className="bg-white">
        {/* Header Hero */}
        <div className="bg-gray-900 text-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-8">
                <div className="lg:w-2/3 space-y-4">
                    <div className="flex items-center gap-2 text-primary font-medium text-sm">
                        <span>Development</span>
                        <span>{'>'}</span>
                        <span>Web Development</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold leading-tight">{course.title}</h1>
                    <p className="text-lg text-gray-300">{course.description}</p>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm mt-4">
                        <div className="flex items-center gap-1">
                            <span className="font-bold text-yellow-400">{course.rating}</span>
                            <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`w-4 h-4 ${i < Math.floor(course.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-500'}`} />
                                ))}
                            </div>
                            <span className="text-gray-400 underline">({course.ratingCount} ratings)</span>
                        </div>
                        <span className="text-gray-300">{course.studentsEnrolled.toLocaleString()} students</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-6 text-sm text-gray-300 mt-2">
                         <div className="flex items-center gap-2">
                             <AlertCircle className="w-4 h-4" />
                             <span>Last updated {course.lastUpdated}</span>
                         </div>
                         <div className="flex items-center gap-2">
                             <Globe className="w-4 h-4" />
                             <span>{course.language}</span>
                         </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Main Content & Sidebar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col lg:flex-row gap-12 relative">
                
                {/* Main Column */}
                <div className="lg:w-2/3 space-y-12">
                    {/* What you'll learn */}
                    <section className="border border-gray-200 p-6 rounded-lg bg-gray-50">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">What you'll learn</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {course.whatYouWillLearn.map((item, idx) => (
                                <div key={idx} className="flex items-start gap-2">
                                    <Check className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                                    <span className="text-sm text-gray-700">{item}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Course Content */}
                    <section>
                         <h2 className="text-2xl font-bold text-gray-900 mb-4">Course Content</h2>
                         <div className="border border-gray-200 rounded-lg divide-y divide-gray-200">
                             {course.content.map((section, idx) => (
                                 <div key={idx} className="p-4 bg-white hover:bg-gray-50 transition-colors cursor-pointer">
                                     <div className="flex justify-between items-center">
                                         <div className="flex items-center gap-3">
                                             <ChevronDown className="w-5 h-5 text-gray-500" />
                                             <span className="font-medium text-gray-900">{section.title}</span>
                                         </div>
                                         <div className="text-sm text-gray-500">
                                             {section.lectures} lectures • {section.duration}
                                         </div>
                                     </div>
                                 </div>
                             ))}
                         </div>
                    </section>

                    {/* Instructor */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Instructor</h2>
                        <div className="flex flex-col sm:flex-row gap-6">
                            <div className="flex-shrink-0">
                                <img src={course.instructor.avatar} alt={course.instructor.name} className="w-24 h-24 rounded-full object-cover border border-gray-200" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-primary">{course.instructor.name}</h3>
                                <p className="text-gray-600 mb-2">{course.instructor.bio}</p>
                                <div className="flex gap-4 text-sm text-gray-600 mb-4">
                                     <div className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-500 fill-yellow-500"/> {course.instructor.rating} Instructor Rating</div>
                                     <div className="flex items-center gap-1"><PlayCircle className="w-4 h-4"/> {course.instructor.courses} Courses</div>
                                </div>
                                <p className="text-sm text-gray-700 leading-relaxed">
                                    Angela is a developer with a passion for teaching. She's the lead instructor at the London App Brewery, London's leading Programming Bootcamp.
                                </p>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Sidebar Card (Floating) */}
                <div className="lg:w-1/3 lg:relative">
                    <div className="lg:absolute lg:-top-80 lg:right-0 bg-white border border-gray-200 shadow-xl rounded-lg overflow-hidden w-full lg:w-80 z-10 sticky top-24">
                        <div className="h-48 overflow-hidden relative">
                             <img src={course.imageUrl} alt={course.title} className="w-full h-full object-cover" />
                             <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                 <PlayCircle className="w-16 h-16 text-white opacity-80" />
                             </div>
                        </div>
                        <div className="p-6 space-y-6">
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <span className="text-3xl font-bold text-gray-900">₹{course.price}</span>
                                    <span className="text-lg text-gray-400 line-through">₹{course.originalPrice}</span>
                                    <span className="text-sm font-medium text-red-600">88% off</span>
                                </div>
                                <p className="text-sm text-red-600 flex items-center gap-1">
                                    <Clock className="w-4 h-4" /> 
                                    <span>2 days left at this price!</span>
                                </p>
                            </div>
                            
                            <div className="space-y-3">
                                <button className="w-full py-3 bg-primary text-white font-bold rounded hover:bg-indigo-700 transition-colors">
                                    Add to Cart
                                </button>
                                <button className="w-full py-3 border border-gray-300 text-gray-900 font-bold rounded hover:bg-gray-50 transition-colors">
                                    Buy Now
                                </button>
                            </div>

                            <div className="text-center text-xs text-gray-500">
                                30-Day Money-Back Guarantee
                            </div>

                            <div className="space-y-2">
                                <h4 className="font-bold text-gray-900 text-sm">This course includes:</h4>
                                <ul className="text-sm text-gray-600 space-y-2">
                                    <li className="flex items-center gap-2"><PlayCircle className="w-4 h-4" /> 24 hours on-demand video</li>
                                    <li className="flex items-center gap-2"><FileText className="w-4 h-4" /> 15 articles</li>
                                    <li className="flex items-center gap-2"><Globe className="w-4 h-4" /> Full lifetime access</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
  );
};

// Helper component for Accordion
const ChevronDown = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m6 9 6 6 6-6"/></svg>
)

export default CourseDetail;
