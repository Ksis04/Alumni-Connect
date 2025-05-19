import React from 'react';
import { Briefcase, MapPin, Clock, Building2, DollarSign } from 'lucide-react';

const jobs = [
  {
    id: 1,
    title: 'Senior Software Engineer',
    company: 'Tech Innovations Inc.',
    location: 'San Francisco, CA',
    type: 'Full-time',
    salary: '$120,000 - $180,000',
    postedDate: '2024-03-10',
    description: 'We are seeking an experienced Senior Software Engineer to join our dynamic team. The ideal candidate will have strong expertise in full-stack development and a passion for building scalable applications.',
    requirements: [
      '7+ years of software development experience',
      'Strong expertise in React, Node.js, and TypeScript',
      'Experience with cloud platforms (AWS/Azure/GCP)',
      'Bachelor\'s degree in Computer Science or related field'
    ]
  },
  {
    id: 2,
    title: 'Product Manager',
    company: 'Innovation Labs',
    location: 'New York, NY',
    type: 'Full-time',
    salary: '$100,000 - $150,000',
    postedDate: '2024-03-08',
    description: 'Looking for a strategic Product Manager to lead our product development initiatives. You will work closely with engineering, design, and business teams to drive product success.',
    requirements: [
      '5+ years of product management experience',
      'Strong analytical and problem-solving skills',
      'Excellent communication and leadership abilities',
      'MBA or equivalent experience preferred'
    ]
  }
];

const JobBoardPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Job Board</h1>
          <p className="text-lg text-gray-600">Explore career opportunities shared by our alumni network</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Search jobs..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <select className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
              <option value="">All Locations</option>
              <option value="sf">San Francisco</option>
              <option value="ny">New York</option>
              <option value="remote">Remote</option>
            </select>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
              <option value="">All Job Types</option>
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
            </select>
          </div>
        </div>

        {/* Job Listings */}
        <div className="space-y-6">
          {jobs.map((job) => (
            <div key={job.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">{job.title}</h2>
                    <div className="flex items-center space-x-4 text-gray-600 mb-4">
                      <div className="flex items-center">
                        <Building2 className="h-5 w-5 mr-2" />
                        <span>{job.company}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-5 w-5 mr-2" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center">
                        <Briefcase className="h-5 w-5 mr-2" />
                        <span>{job.type}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <DollarSign className="h-5 w-5 mr-1" />
                    <span>{job.salary}</span>
                  </div>
                </div>

                <p className="text-gray-600 mb-4">{job.description}</p>

                <div className="mb-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Requirements:</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-600">
                    {job.requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center text-gray-500">
                    <Clock className="h-5 w-5 mr-2" />
                    <span>Posted {new Date(job.postedDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex space-x-4">
                    <button className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors">
                      Apply Now
                    </button>
                    <button className="border border-indigo-600 text-indigo-600 px-6 py-2 rounded-md hover:bg-indigo-50 transition-colors">
                      Save Job
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JobBoardPage;