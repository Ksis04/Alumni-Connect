import React, { useState } from 'react';
import { GraduationCap, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('newsletter_subscriptions')
        .insert([{ email }]);

      if (error) throw error;

      toast.success('Successfully subscribed to newsletter!');
      setEmail('');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2">
              <GraduationCap className="h-8 w-8 text-indigo-400" />
              <span className="text-xl font-bold">Alumni Connect</span>
            </Link>
            <p className="mt-4 text-gray-400">
              Connecting alumni, empowering futures. Join our community to stay connected
              and grow together.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/alumni-directory" className="text-gray-400 hover:text-white">
                  Alumni Directory
                </Link>
              </li>
              <li>
                <Link to="/events" className="text-gray-400 hover:text-white">
                  Events
                </Link>
              </li>
              <li>
                <Link to="/jobs" className="text-gray-400 hover:text-white">
                  Job Board
                </Link>
              </li>
              <li>
                <Link to="/mentorship" className="text-gray-400 hover:text-white">
                  Mentorship
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
            <p className="text-gray-400 mb-4">
              Subscribe to our newsletter for updates and opportunities.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-4">
              <div className="flex">
                <div className="relative flex-grow">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-l-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Subscribing...' : 'Subscribe'}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800">
          <p className="text-center text-gray-400">
            © {new Date().getFullYear()} Alumni Connect. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;