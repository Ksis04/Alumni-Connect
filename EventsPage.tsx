import React, { useEffect, useState } from 'react';
import { Calendar, MapPin, Clock, Users, Check, Plus } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';
import AuthModal from '../components/AuthModal';
import AddEventModal from '../components/AddEventModal';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  max_participants: number;
  created_at: string;
  attendees_count?: number;
  is_registered?: boolean;
}

const EventsPage = () => {
  const { user } = useAuthStore();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [isSivani, setIsSivani] = useState(false);

  useEffect(() => {
    const initializePage = async () => {
      await fetchEvents();
      if (user) {
        await checkRegisteredEvents();
        await checkIfSivani();
      }
    };
    initializePage();
  }, [user, activeTab]);

  const checkIfSivani = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      setIsSivani(data?.full_name?.toLowerCase().trim() === 'sivani');
    } catch (error) {
      console.error('Error checking user:', error);
      setIsSivani(false);
    }
  };

  const fetchEvents = async () => {
    setIsLoadingEvents(true);
    try {
      const now = new Date().toISOString();
      let query = supabase
        .from('events')
        .select('*');

      if (activeTab === 'upcoming') {
        query = query.gte('date', now);
      } else {
        query = query.lt('date', now);
      }

      const { data, error } = await query.order('date', { ascending: activeTab === 'upcoming' });

      if (error) throw error;
      setEvents(data || []);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoadingEvents(false);
    }
  };

  const checkRegisteredEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('event_registrations')
        .select('event_id')
        .eq('user_id', user?.id);

      if (error) throw error;

      setEvents(prevEvents => 
        prevEvents.map(event => ({
          ...event,
          is_registered: data?.some(reg => reg.event_id === event.id) || false
        }))
      );
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleRegister = async (eventId: string) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('event_registrations')
        .insert([
          { event_id: eventId, user_id: user.id }
        ]);

      if (error) throw error;

      toast.success('Successfully registered for the event!');
      fetchEvents();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEventAdded = () => {
    fetchEvents();
    setShowAddEventModal(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center mb-12">
          <div className="text-center w-full">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Events</h1>
            <p className="text-lg text-gray-600">
              Join us at our upcoming events and stay connected with the alumni community
            </p>
          </div>
          
          {isSivani && (
            <button
              onClick={() => setShowAddEventModal(true)}
              className="mt-4 flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
              Add Event
            </button>
          )}
        </div>

        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg shadow-sm p-1 inline-flex">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-6 py-2 rounded-md ${
                activeTab === 'upcoming'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Upcoming Events
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`px-6 py-2 rounded-md ${
                activeTab === 'past'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Past Events
            </button>
          </div>
        </div>

        {isLoadingEvents ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Loading events...</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{event.title}</h3>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-5 w-5 mr-2" />
                      <span>{formatDate(event.date)}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-600">
                      <Clock className="h-5 w-5 mr-2" />
                      <span>{formatTime(event.date)}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-5 w-5 mr-2" />
                      <span>{event.location}</span>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4">{event.description}</p>

                  <div className="flex space-x-4">
                    {activeTab === 'upcoming' && (
                      event.is_registered ? (
                        <button 
                          className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md cursor-default flex items-center justify-center"
                          disabled
                        >
                          <Check className="h-5 w-5 mr-2" />
                          Registered
                        </button>
                      ) : (
                        <button
                          onClick={() => handleRegister(event.id)}
                          disabled={loading}
                          className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50"
                        >
                          {loading ? 'Registering...' : 'Register Now'}
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoadingEvents && events.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              {activeTab === 'upcoming' 
                ? 'No upcoming events at the moment. Check back soon!'
                : 'No past events to display.'}
            </p>
          </div>
        )}
      </div>

      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      )}

      {showAddEventModal && (
        <AddEventModal
          isOpen={showAddEventModal}
          onClose={() => setShowAddEventModal(false)}
          onEventAdded={handleEventAdded}
        />
      )}
    </div>
  );
};

export default EventsPage;