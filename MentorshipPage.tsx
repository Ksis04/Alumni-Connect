import React, { useState } from 'react';

interface Mentor {
  id: string;
  name: string;
  title: string;
  expertise: string[];
  experience: number;
  bio: string;
  availability: string;
  imageUrl: string;
  linkedinUrl: string;
}

const MentorshipPage: React.FC = () => {
  const [selectedExpertise, setSelectedExpertise] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // Static mentor data
  const mentors: Mentor[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      title: 'Senior Software Engineer at TechCorp',
      expertise: ['JavaScript', 'React', 'Node.js'],
      experience: 8,
      bio: 'Passionate about frontend architecture and mentoring junior developers. I specialize in React performance optimization.',
      availability: 'Available for 3 mentees',
      imageUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
      linkedinUrl: 'https://www.linkedin.com/in/john-chen-20988b4?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app'
    },
    {
      id: '2',
      name: 'Michael Chen',
      title: 'Data Science Lead at DataWorks',
      expertise: ['Python', 'Machine Learning', 'Data Visualization'],
      experience: 10,
      bio: 'Experienced in building ML pipelines and explaining complex concepts in simple terms. Let me help you break into data science!',
      availability: 'Available for 2 mentees',
      imageUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
      linkedinUrl: 'https://www.linkedin.com/in/john-chen-20988b4?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app'
    },
    {
      id: '3',
      name: 'Priya Patel',
      title: 'DevOps Engineer at CloudScale',
      expertise: ['AWS', 'Docker', 'CI/CD'],
      experience: 6,
      bio: 'I love automating infrastructure and teaching others about cloud technologies. Certified AWS Solutions Architect.',
      availability: 'Available for 1 mentee',
      imageUrl: 'https://randomuser.me/api/portraits/women/68.jpg',
      linkedinUrl: 'https://www.linkedin.com/in/john-chen-20988b4?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app'
    },
    {
      id: '4',
      name: 'David Kim',
      title: 'UX Designer at CreativeMinds',
      expertise: ['UI/UX Design', 'Figma', 'User Research'],
      experience: 7,
      bio: 'Specializing in creating intuitive user experiences. I can help you build your design portfolio and interview skills.',
      availability: 'Available for 2 mentees',
      imageUrl: 'https://randomuser.me/api/portraits/men/75.jpg',
      linkedinUrl: '#'
    },
    {
      id: '5',
      name: 'Emma Rodriguez',
      title: 'Engineering Manager at FutureTech',
      expertise: ['Leadership', 'Agile', 'Technical Interviews'],
      experience: 12,
      bio: 'I help engineers transition to leadership roles and navigate career growth in tech companies.',
      availability: 'Available for 1 mentee',
      imageUrl: 'https://randomuser.me/api/portraits/women/63.jpg',
      linkedinUrl: '#'
    },
    {
      id: '6',
      name: 'James Wilson',
      title: 'Mobile Developer at AppWorks',
      expertise: ['React Native', 'iOS', 'Android'],
      experience: 5,
      bio: 'Cross-platform mobile development expert. Let me help you build your first app or improve your existing skills.',
      availability: 'Available for 3 mentees',
      imageUrl: 'https://randomuser.me/api/portraits/men/81.jpg',
      linkedinUrl: '#'
    }
  ];

  const expertiseOptions = [
    'JavaScript',
    'React',
    'Node.js',
    'Python',
    'Machine Learning',
    'Data Visualization',
    'AWS',
    'Docker',
    'CI/CD',
    'UI/UX Design',
    'Figma',
    'User Research',
    'Leadership',
    'Agile',
    'Technical Interviews',
    'React Native',
    'iOS',
    'Android'
  ];

  const toggleExpertise = (expertise: string) => {
    setSelectedExpertise(prev =>
      prev.includes(expertise)
        ? prev.filter(e => e !== expertise)
        : [...prev, expertise]
    );
  };

  const filteredMentors = selectedExpertise.length === 0
    ? mentors
    : mentors.filter(mentor =>
        mentor.expertise.some(exp => selectedExpertise.includes(exp))
      );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Tech Mentorship Program</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Connect with experienced professionals who can guide you in your tech career journey
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Filter Mentors</h2>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="text-indigo-600 hover:text-indigo-800"
            >
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>

          {showFilters && (
            <div>
              <h3 className="text-md font-medium mb-3">By Expertise</h3>
              <div className="flex flex-wrap gap-2">
                {expertiseOptions.map(expertise => (
                  <button
                    key={expertise}
                    onClick={() => toggleExpertise(expertise)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      selectedExpertise.includes(expertise)
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {expertise}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Mentors Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredMentors.map(mentor => (
            <div key={mentor.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <img
                    src={mentor.imageUrl}
                    alt={mentor.name}
                    className="h-16 w-16 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-xl font-semibold">{mentor.name}</h3>
                    <p className="text-gray-600 text-sm">{mentor.title}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Expertise</h4>
                  <div className="flex flex-wrap gap-2">
                    {mentor.expertise.map(skill => (
                      <span
                        key={skill}
                        className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <p className="text-gray-600 mb-4">{mentor.bio}</p>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>Experience: {mentor.experience} years</span>
                  <span className="text-green-600">{mentor.availability}</span>
                </div>

                <div className="flex space-x-3">
                  <button className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors">
                    Request Mentorship
                  </button>
                  <a
                    href={mentor.linkedinUrl}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center justify-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredMentors.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-gray-700 mb-2">No mentors found</h3>
            <p className="text-gray-500">Try adjusting your filters to see more results</p>
            <button
              onClick={() => setSelectedExpertise([])}
              className="mt-4 text-indigo-600 hover:text-indigo-800"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MentorshipPage;