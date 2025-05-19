import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
 
const PostJobForm = ({ onJobPosted }: { onJobPosted: () => void }) => {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    type: 'Full-time',
    salary: '',
    description: '',
    requirements: '',
  });
  const [loading, setLoading] = useState(false);
 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
 
    try {
      // Split requirements by new lines
      const requirementsArray = formData.requirements
        .split('\n')
        .filter(req => req.trim() !== '');
 
      const { error } = await supabase
        .from('jobs')
        .insert([
          {
            title: formData.title,
            company: formData.company,
            location: formData.location,
            type: formData.type,
            salary: formData.salary,
            description: formData.description,
            requirements: requirementsArray,
            
          }
        ]);
 
      if (error) throw error;
 
      toast.success('Job posted successfully!');
      setFormData({
        title: '',
        company: '',
        location: '',
        type: 'Full-time',
        salary: '',
        description: '',
        requirements: '',
      });
      onJobPosted();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
 
  return (
<div className="bg-white rounded-lg shadow-md p-6">
<h2 className="text-2xl font-bold mb-6">Post a Job Opportunity</h2>
<form onSubmit={handleSubmit} className="space-y-4">
<div>
<label className="block text-sm font-medium text-gray-700">Job Title*</label>
<input
            type="text"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
</div>
 
        <div>
<label className="block text-sm font-medium text-gray-700">Company Name*</label>
<input
            type="text"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
          />
</div>
 
        <div>
<label className="block text-sm font-medium text-gray-700">Location*</label>
<input
            type="text"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          />
</div>
 
        <div className="grid grid-cols-2 gap-4">
<div>
<label className="block text-sm font-medium text-gray-700">Job Type*</label>
<select
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
>
<option value="Full-time">Full-time</option>
<option value="Part-time">Part-time</option>
<option value="Contract">Contract</option>
<option value="Internship">Internship</option>
</select>
</div>
 
          <div>
<label className="block text-sm font-medium text-gray-700">Salary Range*</label>
<input
              type="text"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={formData.salary}
              onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
              placeholder="e.g. $80,000 - $100,000"
            />
</div>
</div>
 
        <div>
<label className="block text-sm font-medium text-gray-700">Job Description*</label>
<textarea
            required
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
</div>
 
        <div>
<label className="block text-sm font-medium text-gray-700">
            Requirements* (one per line)
</label>
<textarea
            required
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={formData.requirements}
            onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
          />
</div>
 
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50"
>
          {loading ? 'Posting Job...' : 'Post Job'}
</button>
</form>
</div>
  );
};
 
export default PostJobForm;