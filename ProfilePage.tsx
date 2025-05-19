import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';
import { Calendar, Briefcase, Users, BookmarkPlus, Check, User } from 'lucide-react';
import toast from 'react-hot-toast';

interface Activity {
  type: 'event' | 'job' | 'mentorship';
  title: string;
  date: string;
  status: string;
}

interface SavedJob {
  id: string;
  title: string;
  company: string;
  location: string;
  saved_at: string;
}

const ProfilePage = () => {
  const { user, profile, updateProfile } = useAuthStore();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState(profile?.avatar_url || '');
  const [formData, setFormData] = useState({
    fullName: profile?.full_name || '',
    phone: profile?.phone || '',
    branch: profile?.branch || '',
    batch: profile?.batch || '',
    bio: profile?.bio || '',
    linkedin: profile?.linkedin_url || '',
    twitter: profile?.twitter_url || '',
    github: profile?.github_url || '',
  });

  useEffect(() => {
    if (user) {
      loadActivities();
      loadSavedJobs();
    }
  }, [user]);

  useEffect(() => {
    if (profile) {
      setFormData({
        fullName: profile.full_name || '',
        phone: profile.phone || '',
        branch: profile.branch || '',
        batch: profile.batch || '',
        bio: profile.bio || '',
        linkedin: profile.linkedin_url || '',
        twitter: profile.twitter_url || '',
        github: profile.github_url || '',
      });
      setProfileImageUrl(profile.avatar_url || '');
    }
  }, [profile]);

  const loadActivities = async () => {
    try {
      const { data: events } = await supabase
        .from('event_registrations')
        .select('events(*)')
        .eq('user_id', user?.id);

      const { data: jobs } = await supabase
        .from('job_applications')
        .select('jobs(*)')
        .eq('user_id', user?.id);

      const { data: mentorships } = await supabase
        .from('mentorship_connections')
        .select('mentors(*)')
        .eq('mentee_id', user?.id);

      const allActivities: Activity[] = [
        ...(events?.map(e => ({
          type: 'event' as const,
          title: e.events.title,
          date: e.events.date,
          status: 'Registered',
        })) || []),
        ...(jobs?.map(j => ({
          type: 'job' as const,
          title: j.jobs.title,
          date: j.jobs.posted_date,
          status: 'Applied',
        })) || []),
        ...(mentorships?.map(m => ({
          type: 'mentorship' as const,
          title: `Mentorship with ${m.mentors.name}`,
          date: m.mentors.start_date,
          status: 'Active',
        })) || []),
      ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      setActivities(allActivities);
    } catch (error) {
      console.error('Error loading activities:', error);
    }
  };

  const loadSavedJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('saved_jobs')
        .select('jobs(*)')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setSavedJobs(data?.map(item => ({
        id: item.jobs.id,
        title: item.jobs.title,
        company: item.jobs.company,
        location: item.jobs.location,
        saved_at: item.created_at,
      })) || []);
    } catch (error) {
      console.error('Error loading saved jobs:', error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0]);
      setProfileImageUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let avatar_url = profile?.avatar_url;

      if (profileImage) {
        // Delete old avatar if exists
        if (profile?.avatar_url) {
          const oldAvatarPath = profile.avatar_url.split('/').pop();
          if (oldAvatarPath) {
            await supabase.storage
              .from('avatars')
              .remove([oldAvatarPath]);
          }
        }

        // Upload new avatar
        const fileExt = profileImage.name.split('.').pop();
        const fileName = `${user?.id}/${Math.random()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(fileName, profileImage);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(fileName);

        avatar_url = publicUrl;
      }

      await updateProfile({
        full_name: formData.fullName,
        phone: formData.phone,
        branch: formData.branch,
        batch: parseInt(formData.batch),
        bio: formData.bio,
        linkedin_url: formData.linkedin,
        twitter_url: formData.twitter,
        github_url: formData.github,
        avatar_url,
        updated_at: new Date().toISOString(),
      });

      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Please sign in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  {profileImageUrl ? (
                    <img
                      src={profileImageUrl}
                      alt={profile.full_name}
                      className="h-24 w-24 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-24 w-24 rounded-full bg-indigo-100 flex items-center justify-center">
                      <User className="h-12 w-12 text-indigo-600" />
                    </div>
                  )}
                  {isEditing && (
                    <label className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full cursor-pointer hover:bg-indigo-700 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                      <BookmarkPlus className="h-4 w-4" />
                    </label>
                  )}
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{profile.full_name}</h1>
                  <p className="text-gray-600">{profile.email}</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-indigo-600 hover:text-indigo-500"
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>

            {isEditing ? (
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                    <input
                      type="text"
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <input
                      type="tel"
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Branch</label>
                    <select
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      value={formData.branch}
                      onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                    >
                      <option value="">Select Branch</option>
                      <option value="Computer Science">Computer Science</option>
                      <option value="Electrical Engineering">Electrical Engineering</option>
                      <option value="Mechanical Engineering">Mechanical Engineering</option>
                      <option value="Civil Engineering">Civil Engineering</option>
                      <option value="Information Technology">Information Technology</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Batch</label>
                    <input
                      type="number"
                      required
                      min="1970"
                      max="2024"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      value={formData.batch}
                      onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Bio</label>
                    <textarea
                      rows={4}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">LinkedIn URL</label>
                    <input
                      type="url"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      value={formData.linkedin}
                      onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Twitter URL</label>
                    <input
                      type="url"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      value={formData.twitter}
                      onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                      placeholder="https://twitter.com/username"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">GitHub URL</label>
                    <input
                      type="url"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      value={formData.github}
                      onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                      placeholder="https://github.com/username"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
                >
                  {loading ? (
                    <>
                      <span>Saving Changes</span>
                      <Check className="h-5 w-5 animate-spin" />
                    </>
                  ) : (
                    <span>Save Changes</span>
                  )}
                </button>
              </form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
                  <div className="space-y-3">
                    <p><span className="font-medium">Full Name:</span> {profile.full_name}</p>
                    <p><span className="font-medium">Email:</span> {profile.email}</p>
                    <p><span className="font-medium">Phone:</span> {profile.phone || 'Not provided'}</p>
                    <p><span className="font-medium">Branch:</span> {profile.branch || 'Not provided'}</p>
                    <p><span className="font-medium">Batch:</span> {profile.batch || 'Not provided'}</p>
                  </div>

                  {profile.bio && (
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold mb-2">Bio</h3>
                      <p className="text-gray-600">{profile.bio}</p>
                    </div>
                  )}

                  {(profile.linkedin_url || profile.twitter_url || profile.github_url) && (
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold mb-2">Social Links</h3>
                      <div className="space-y-2">
                        {profile.linkedin_url && (
                          <a
                            href={profile.linkedin_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:text-indigo-500 block"
                          >
                            LinkedIn Profile
                          </a>
                        )}
                        {profile.twitter_url && (
                          <a
                            href={profile.twitter_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:text-indigo-500 block"
                          >
                            Twitter Profile
                          </a>
                        )}
                        {profile.github_url && (
                          <a
                            href={profile.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:text-indigo-500 block"
                          >
                            GitHub Profile
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <h2 className="text-xl font-semibold mb-4">Saved Jobs</h2>
                  <div className="space-y-4">
                    {savedJobs.map((job) => (
                      <div key={job.id} className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-medium text-gray-900">{job.title}</h3>
                        <p className="text-gray-600">{job.company}</p>
                        <p className="text-gray-500 text-sm">{job.location}</p>
                        <p className="text-gray-400 text-sm mt-2">
                          Saved on {new Date(job.saved_at).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                    {savedJobs.length === 0 && (
                      <p className="text-gray-500">No saved jobs yet</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  {activity.type === 'event' && <Calendar className="h-6 w-6 text-indigo-600 mr-3" />}
                  {activity.type === 'job' && <Briefcase className="h-6 w-6 text-indigo-600 mr-3" />}
                  {activity.type === 'mentorship' && <Users className="h-6 w-6 text-indigo-600 mr-3" />}
                  <div>
                    <h3 className="text-lg font-semibold">{activity.title}</h3>
                    <p className="text-sm text-gray-600">
                      {new Date(activity.date).toLocaleDateString()} - {activity.status}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {activities.length === 0 && (
              <p className="text-gray-600 text-center">No recent activity</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;