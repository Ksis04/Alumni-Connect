import React, { useState, useMemo } from 'react';
import { Search, Mail, Phone, Linkedin, Twitter, Github, Building2, GraduationCap, MapPin } from 'lucide-react';

// Sample alumni data - In a real app, this would come from your database
const alumniData = [
  {
    id: 1,
    name: 'Sarah Johnson',
    batch: 2020,
    department: 'Computer Science',
    company: 'Google',
    role: 'Senior Software Engineer',
    location: 'San Francisco, CA',
    phone: '+1 (555) 123-4567',
    email: 'sarah.j@example.com',
    linkedin: 'https://linkedin.com/in/sarahj',
    twitter: 'https://twitter.com/sarahj',
    github: 'https://github.com/sarahj',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
  },
  {
    id: 2,
    name: 'Michael Chen',
    batch: 2019,
    department: 'Electrical Engineering',
    company: 'Tesla',
    role: 'Systems Engineer',
    location: 'Austin, TX',
    phone: '+1 (555) 234-5678',
    email: 'michael.c@example.com',
    linkedin: 'https://linkedin.com/in/michaelc',
    twitter: 'https://twitter.com/michaelc',
    github: 'https://github.com/michaelc',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
  },
    {
    id: 3,
    name: 'Emily Davis',
    batch: 2021,
    department: 'Mechanical Engineering',
    company: 'Boeing',
    role: 'Aerospace Engineer',
    location: 'Seattle, WA',
    phone: '+1 (555) 345-6789',
    email: 'emily.d@example.com',
    linkedin: 'https://linkedin.com/in/emilyd',
    twitter: 'https://twitter.com/emilyd',
    github: 'https://github.com/emilyd',
    image: 'https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
  },
  {
    id: 4,
    name: 'David Martinez',
    batch: 2018,
    department: 'Civil Engineering',
    company: 'AECOM',
    role: 'Project Manager',
    location: 'Los Angeles, CA',
    phone: '+1 (555) 456-7890',
    email: 'david.m@example.com',
    linkedin: 'https://linkedin.com/in/davidm',
    twitter: 'https://twitter.com/davidm',
    github: 'https://github.com/davidm',
    image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
  },
  {
    id: 5,
    name: 'Sophia Brown',
    batch: 2022,
    department: 'Information Technology',
    company: 'Amazon',
    role: 'Cloud Solutions Architect',
    location: 'New York, NY',
    phone: '+1 (555) 567-8901',
    email: 'sophia.b@example.com',
    linkedin: 'https://linkedin.com/in/sophiab',
    twitter: 'https://twitter.com/sophiab',
    github: 'https://github.com/sophiab',
    image: 'https://images.unsplash.com/photo-1532074205216-d0e1f4b6b4a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
  },
  {
    id: 6,
    name: 'James Wilson',
    batch: 2017,
    department: 'Computer Science',
    company: 'Microsoft',
    role: 'Software Developer',
    location: 'Redmond, WA',
    phone: '+1 (555) 678-9012',
    email: 'james.w@example.com',
    linkedin: 'https://linkedin.com/in/jamesw',
    twitter: 'https://twitter.com/jamesw',
    github: 'https://github.com/jamesw',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
  },
  {
    id: 7,
    name: 'Olivia Garcia',
    batch: 2020,
    department: 'Electrical Engineering',
    company: 'Intel',
    role: 'Hardware Engineer',
    location: 'Santa Clara, CA',
    phone: '+1 (555) 789-0123',
    email: 'olivia.g@example.com',
    linkedin: 'https://linkedin.com/in/oliviag',
    twitter: 'https://twitter.com/oliviag',
    github: 'https://github.com/oliviag',
    image: 'https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
  },
  {
    id: 8,
    name: 'Liam Anderson',
    batch: 2019,
    department: 'Mechanical Engineering',
    company: 'Ford',
    role: 'Automotive Engineer',
    location: 'Detroit, MI',
    phone: '+1 (555) 890-1234',
    email: 'liam.a@example.com',
    linkedin: 'https://linkedin.com/in/liama',
    twitter: 'https://twitter.com/liama',
    github: 'https://github.com/liama',
    image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
  },
  {
    id: 9,
    name: 'Emma Martinez',
    batch: 2021,
    department: 'Civil Engineering',
    company: 'Bechtel',
    role: 'Structural Engineer',
    location: 'Houston, TX',
    phone: '+1 (555) 901-2345',
    email: 'emma.m@example.com',
    linkedin: 'https://linkedin.com/in/emmam',
    twitter: 'https://twitter.com/emmam',
    github: 'https://github.com/emmam',
    image: 'https://images.unsplash.com/photo-1532074205216-d0e1f4b6b4a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
  },
  {
    id: 10,
    name: 'Noah Lee',
    batch: 2018,
    department: 'Information Technology',
    company: 'Facebook',
    role: 'Data Scientist',
    location: 'Menlo Park, CA',
    phone: '+1 (555) 012-3456',
    email: 'noah.l@example.com',
    linkedin: 'https://linkedin.com/in/noahl',
    twitter: 'https://twitter.com/noahl',
    github: 'https://github.com/noahl',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
  },
  {
    id: 11,
    name: 'Ava Hernandez',
    batch: 2022,
    department: 'Computer Science',
    company: 'Apple',
    role: 'iOS Developer',
    location: 'Cupertino, CA',
    phone: '+1 (555) 123-4567',
    email: 'ava.h@example.com',
    linkedin: 'https://linkedin.com/in/avah',
    twitter: 'https://twitter.com/avah',
    github: 'https://github.com/avah',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
  },
  {
    id: 12,
    name: 'William Clark',
    batch: 2017,
    department: 'Electrical Engineering',
    company: 'Qualcomm',
    role: 'Embedded Systems Engineer',
    location: 'San Diego, CA',
    phone: '+1 (555) 234-5678',
    email: 'willia.c@example.com',
    linkedin: 'https://linkedin.com/in/williamc',
    twitter: 'https://twitter.com/williamc',
    github: 'https://github.com/williamc',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
  },
  // Add more sample data as needed
];

const departments = ['All Departments', 'Computer Science', 'Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering'];
const batches = ['All Batches', ...Array.from(new Set(alumniData.map(a => a.batch)))].sort();

const AlumniDirectory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments');
  const [selectedBatch, setSelectedBatch] = useState('All Batches');

  const filteredAlumni = useMemo(() => {
    return alumniData.filter(alumni => {
      const matchesSearch = alumni.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          alumni.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          alumni.role.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDepartment = selectedDepartment === 'All Departments' || alumni.department === selectedDepartment;
      const matchesBatch = selectedBatch === 'All Batches' || alumni.batch === parseInt(selectedBatch);

      return matchesSearch && matchesDepartment && matchesBatch;
    });
  }, [searchTerm, selectedDepartment, selectedBatch]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Alumni Directory</h1>
          <p className="text-lg text-gray-600">Connect with our global network of alumni</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by name, company, or role..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <select
                className="w-full py-2 px-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            <div>
              <select
                className="w-full py-2 px-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={selectedBatch}
                onChange={(e) => setSelectedBatch(e.target.value)}
              >
                {batches.map(batch => (
                  <option key={batch} value={batch}>{batch}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Alumni Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAlumni.map(alumni => (
            <div key={alumni.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <img
                    src={alumni.image}
                    alt={alumni.name}
                    className="h-16 w-16 rounded-full object-cover border-2 border-indigo-500"
                  />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{alumni.name}</h3>
                    <p className="text-gray-600">{alumni.role}</p>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <GraduationCap size={18} />
                    <span>{alumni.department} - {alumni.batch}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Building2 size={18} />
                    <span>{alumni.company}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin size={18} />
                    <span>{alumni.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail size={18} />
                    <a href={`mailto:${alumni.email}`} className="text-indigo-600 hover:text-indigo-800">
                      {alumni.email}
                    </a>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone size={18} />
                    <a href={`tel:${alumni.phone}`} className="text-indigo-600 hover:text-indigo-800">
                      {alumni.phone}
                    </a>
                  </div>
                </div>

                <div className="mt-4 flex space-x-4 justify-center">
                  <a
                    href={alumni.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Linkedin size={20} />
                  </a>
                  <a
                    href={alumni.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-600"
                  >
                    <Twitter size={20} />
                  </a>
                  <a
                    href={alumni.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-800 hover:text-gray-600"
                  >
                    <Github size={20} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredAlumni.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No alumni found matching your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlumniDirectory;