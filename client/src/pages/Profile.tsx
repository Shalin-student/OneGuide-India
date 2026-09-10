import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Bookmark, LogOut, Loader2 } from 'lucide-react';
import axios from 'axios';

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/v1/users/profile', {
          withCredentials: true
        });
        setProfile(response.data.data);
      } catch (error) {
        console.error('Error fetching profile', error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/api/v1/auth/logout', {}, { withCredentials: true });
      navigate('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const handleUnsave = async (serviceId: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/v1/users/saved-services/${serviceId}`, {
        withCredentials: true
      });
      setProfile((prev: any) => ({
        ...prev,
        savedServices: prev.savedServices.filter((s: any) => s._id !== serviceId)
      }));
    } catch (error) {
      console.error('Failed to unsave service', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Profile Header */}
        <div className="bg-white rounded-[12px] shadow-[0_1px_2px_rgba(0,0,0,0.25)] p-8 border border-gray-100 flex flex-col sm:flex-row items-center gap-6">
          <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-3xl">
            {profile.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-3xl font-extrabold text-gray-900">{profile.name}</h1>
            <p className="text-gray-500 mt-1">{profile.email}</p>
            <div className="mt-3 inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
              <User size={16} /> {profile.role === 'admin' ? 'Administrator' : 'Citizen'}
            </div>
          </div>
          <div className="flex flex-col gap-3 w-full sm:w-auto">
            {profile.role === 'admin' && (
              <Link to="/admin" className="px-6 py-2.5 bg-gray-900 text-white rounded-full font-medium text-center hover:bg-gray-800 transition">
                Admin Dashboard
              </Link>
            )}
            <button onClick={handleLogout} className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-full font-medium flex items-center justify-center gap-2 hover:bg-gray-50 transition">
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>

        {/* Saved Services Section */}
        <div className="bg-white rounded-[12px] shadow-[0_1px_2px_rgba(0,0,0,0.25)] p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Bookmark className="text-blue-600" /> Saved Services
          </h2>
          
          {profile.savedServices && profile.savedServices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profile.savedServices.map((service: any) => (
                <div key={service._id} className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition">
                  <h3 className="font-bold text-gray-900 text-lg mb-2">{service.name}</h3>
                  <div className="flex justify-between items-center mt-4">
                    <Link to={`/service/${service.slug}`} className="text-blue-600 font-medium hover:underline text-sm">
                      View Details &rarr;
                    </Link>
                    <button 
                      onClick={() => handleUnsave(service._id)}
                      className="text-red-500 hover:text-red-700 text-sm font-medium"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
              <Bookmark className="mx-auto text-gray-400 mb-3" size={32} />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No saved services</h3>
              <p className="text-gray-500 mb-4">You haven't saved any government schemes or services yet.</p>
              <Link to="/services" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700">
                Find Schemes for Me
              </Link>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Profile;
