import React, { useState } from 'react';
import { User, ArrowRight, X } from 'lucide-react';

const spotlightData = [
  {
    id: 1,
    name: 'Jane Doe',
    graduationYear: 2010,
    role: 'Lead Researcher',
    company: 'Renewable Energy Solutions',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
    story: 'Leading groundbreaking research in renewable energy solutions, making a significant impact on sustainable development.',
    fullStory: `Dr. Jane Doe graduated from our institution in 2010 with a Ph.D. in Environmental Engineering. Her groundbreaking research in renewable energy has led to significant advancements in solar technology efficiency.

    After graduation, she joined Renewable Energy Solutions as a Research Scientist and quickly rose through the ranks to become their Lead Researcher. Under her leadership, the company has developed innovative solar panel technology that increases energy absorption by 40%.
    
    Her work has been recognized internationally, and she has received numerous awards including the prestigious Global Innovation Award in 2022. Jane continues to mentor young researchers and frequently returns to campus to inspire the next generation of environmental engineers.
    
    "My time at the university laid the foundation for my career in renewable energy research. The support from faculty and the cutting-edge facilities helped me pursue my passion for sustainable technology," says Jane.
    
    Currently, she is leading a team of 30 researchers working on next-generation solar materials that could revolutionize how we harness solar energy.`
  },
  {
    id: 2,
    name: 'John Smith',
    graduationYear: 2015,
    role: 'Tech Entrepreneur',
    company: 'InnovateTech',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
    story: 'Founded a successful tech startup that revolutionized the way we think about artificial intelligence.',
    fullStory: `John Smith's journey from a Computer Science graduate to a successful tech entrepreneur is truly inspiring. After graduating in 2015, he worked at several leading tech companies before founding InnovateTech in 2018.

    His company has developed groundbreaking AI solutions that are now used by major corporations worldwide. InnovateTech's flagship product, an AI-powered decision-making platform, has transformed how businesses approach data analysis and strategic planning.
    
    Under John's leadership, InnovateTech has grown from a small startup to a company valued at over $500 million, employing more than 200 people globally. The company has been featured in Forbes and was named one of the "Most Innovative Companies" by Fast Company in 2023.
    
    "The entrepreneurial spirit I developed during my university years, combined with the technical knowledge and network I built, were crucial to my success," John reflects.
    
    He remains actively involved with the university, serving on the advisory board and establishing a scholarship fund for aspiring tech entrepreneurs.`
  },
];

const AlumniSpotlight = () => {
  const [selectedAlumni, setSelectedAlumni] = useState<typeof spotlightData[0] | null>(null);

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Alumni Spotlight
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            Meet our outstanding alumni who are making waves in their respective fields
          </p>
        </div>

        <div className="mt-10">
          <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
            {spotlightData.map((alumni) => (
              <div
                key={alumni.id}
                className="relative bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-center space-x-4">
                  {alumni.image ? (
                    <img
                      src={alumni.image}
                      alt={alumni.name}
                      className="h-16 w-16 rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-16 w-16 text-gray-400" />
                  )}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{alumni.name}</h3>
                    <p className="text-sm text-gray-500">Class of {alumni.graduationYear}</p>
                    <p className="text-sm font-medium text-indigo-600">
                      {alumni.role} at {alumni.company}
                    </p>
                  </div>
                </div>
                <p className="mt-4 text-gray-500">{alumni.story}</p>
                <button
                  onClick={() => setSelectedAlumni(alumni)}
                  className="mt-4 inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Read full story
                  <ArrowRight className="ml-1 h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Full Story Modal */}
      {selectedAlumni && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-4">
                  <img
                    src={selectedAlumni.image}
                    alt={selectedAlumni.name}
                    className="h-20 w-20 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{selectedAlumni.name}</h3>
                    <p className="text-gray-600">Class of {selectedAlumni.graduationYear}</p>
                    <p className="text-indigo-600 font-medium">
                      {selectedAlumni.role} at {selectedAlumni.company}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedAlumni(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="prose max-w-none">
                {selectedAlumni.fullStory.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 text-gray-700">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default AlumniSpotlight;