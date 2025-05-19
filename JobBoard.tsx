import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  MapPin,
  Clock,
  Building2,
  DollarSign,
  BookmarkPlus,
  Check
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import AuthModal from './AuthModal';
import PostJobForm from './PostJobForm';

const JobBoard = () => {
  const { user } = useAuthStore();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [loading, setLoading] = useState(false);
  const [userBatch, setUserBatch] = useState<number | null>(null);
  const [isAlumni, setIsAlumni] = useState(false);
  const [jobs, setJobs] = useState<any[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);
  const [fetchingJobs, setFetchingJobs] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('batch')
            .eq('id', user.id)
            .single();

          if (error) throw error;

          if (data && data.batch) {
            setUserBatch(data.batch);
            setIsAlumni(data.batch <= 2021);
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      }
    };

    const fetchJobs = async () => {
      try {
        setFetchingJobs(true);
        const { data, error } = await supabase
          .from('jobs')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        if (data) setJobs(data);

        // Fetch user's applied jobs
        if (user) {
          const { data: applications } = await supabase
            .from('job_applications')
            .select('job_id')
            .eq('user_id', user.id);

          if (applications) {
            setAppliedJobs(applications.map(app => app.job_id));
          }
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
        toast.error('Failed to load jobs');
      } finally {
        setFetchingJobs(false);
      }
    };

    fetchUserProfile();
    fetchJobs();
  }, [user]);

  const filteredJobs = jobs.filter((job) => {
    const searchMatch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase());

    const locationMatch = !selectedLocation || 
      (job.location && job.location.includes(selectedLocation));
    const typeMatch = !selectedType || job.type === selectedType;

    return searchMatch && locationMatch && typeMatch;
  });

  const handleApply = async (jobId: string) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    if (appliedJobs.includes(jobId)) {
      toast.error('You have already applied for this job');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('job_applications')
        .insert([{ job_id: jobId, user_id: user.id }]);

      if (error) throw error;

      // Update applied jobs list
      setAppliedJobs([...appliedJobs, jobId]);

      // Add notification
      const job = jobs.find(j => j.id === jobId);
      const { error: notifError } = await supabase
        .from('notifications')
        .insert([{
          user_id: user.id,
          type: 'job_application',
          message: `You have successfully applied for ${job.title} at ${job.company}`,
          is_read: false
        }]);

      if (notifError) throw notifError;

      toast.success('Successfully applied for the job!');
    } catch (error: any) {
      if (error.message.includes('duplicate')) {
        toast.error('You have already applied for this job');
      } else {
        toast.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {user && isAlumni ? (
          <>
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Post Job Opportunities</h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Share career opportunities with our alumni network
              </p>
            </div>
            <PostJobForm onJobPosted={handleJobPosted} />
          </>
        ) : (
          <>
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Job Board</h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Explore career opportunities shared by our alumni network
              </p>
            </div>

            {/* Search & Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="Search jobs..."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                >
                  <option value="">All Locations</option>
                  <option value="San Francisco">San Francisco</option>
                  <option value="New York">New York</option>
                  <option value="Remote">Remote</option>
                </select>
                <select
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                >
                  <option value="">All Job Types</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>
            </div>

            {/* Job Listings */}
            <div className="space-y-6">
              {fetchingJobs ? (
                <div className="text-center py-12">
                  <p className="text-gray-600 dark:text-gray-400 text-lg">Loading jobs...</p>
                </div>
              ) : filteredJobs.length > 0 ? (
                filteredJobs.map((job) => (
                  <div
                    key={job.id}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="p-6">
                      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">{job.title}</h2>
                      <p className="text-gray-600 dark:text-gray-400 mb-2 flex items-center gap-2">
                        <Building2 className="w-4 h-4" /> {job.company}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 mb-2 flex items-center gap-2">
                        <MapPin className="w-4 h-4" /> {job.location}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 mb-2 flex items-center gap-2">
                        <Briefcase className="w-4 h-4" /> {job.type}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 mb-4 flex items-center gap-2">
                        <DollarSign className="w-4 h-4" /> {job.salary || 'Salary not specified'}
                      </p>
                      <p className="text-gray-700 dark:text-gray-300 mb-4">{job.description}</p>

                      {job.requirements && job.requirements.length > 0 && (
                        <div className="mb-4">
                          <h4 className="font-medium mb-2 text-gray-800 dark:text-white">Requirements:</h4>
                          <ul className="list-disc pl-5 space-y-1">
                            {job.requirements.map((req: string, i: number) => (
                              <li key={i} className="text-gray-600 dark:text-gray-400">{req}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-4">
                        <button
                          className={`px-4 py-2 rounded-md flex items-center gap-2 ${
                            appliedJobs.includes(job.id)
                              ? 'bg-green-600 text-white cursor-default'
                              : 'bg-indigo-600 text-white hover:bg-indigo-700'
                          } transition-colors disabled:opacity-50`}
                          onClick={() => handleApply(job.id)}
                          disabled={loading || appliedJobs.includes(job.id)}
                        >
                          {appliedJobs.includes(job.id) ? (
                            <>
                              <Check className="w-4 h-4" /> Applied
                            </>
                          ) : (
                            'Apply Now'
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-600 dark:text-gray-400 text-lg">
                    No jobs found matching your search criteria.
                  </p>
                </div>
              )}
            </div>
          </>
        )}

        {showAuthModal && (
          <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
        )}
      </div>
    </div>
  );
};

export default JobBoard;