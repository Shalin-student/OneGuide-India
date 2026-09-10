import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Plus, List, Trash2, Edit, Loader2 } from 'lucide-react';
import axios from 'axios';

const Admin = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('list');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const verifyAdmin = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/v1/users/profile', {
          withCredentials: true
        });
        if (response.data.data.role !== 'admin') {
          navigate('/'); // Redirect non-admins
        } else {
          setIsAdmin(true);
          fetchServices();
        }
      } catch (error) {
        navigate('/login');
      }
    };
    verifyAdmin();
  }, [navigate]);

  const fetchServices = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/v1/services');
      setServices(response.data.data);
    } catch (error) {
      console.error('Error fetching services', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await axios.delete(`http://localhost:5000/api/v1/services/${id}`, {
          withCredentials: true
        });
        fetchServices();
      } catch (error) {
        console.error('Delete failed', error);
      }
    }
  };

  if (!isAdmin || loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <ShieldCheck size={32} className="text-blue-700" />
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        </div>

        <div className="bg-white rounded-[12px] shadow-[0_1px_2px_rgba(0,0,0,0.25)] border border-gray-100 overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b">
            <button 
              onClick={() => setActiveTab('list')}
              className={`flex-1 py-4 font-medium flex items-center justify-center gap-2 transition ${activeTab === 'list' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
            >
              <List size={18} /> Manage Services
            </button>
            <button 
              onClick={() => setActiveTab('create')}
              className={`flex-1 py-4 font-medium flex items-center justify-center gap-2 transition ${activeTab === 'create' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
            >
              <Plus size={18} /> Add New Service
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'list' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="py-3 px-4 text-sm font-semibold text-gray-600">Service Name</th>
                      <th className="py-3 px-4 text-sm font-semibold text-gray-600">Dept</th>
                      <th className="py-3 px-4 text-sm font-semibold text-gray-600">Status</th>
                      <th className="py-3 px-4 text-sm font-semibold text-gray-600 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {services.map((service: any) => (
                      <tr key={service._id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-gray-900">{service.name}</td>
                        <td className="py-3 px-4 text-sm text-gray-500">{service.governmentDepartment}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">Active</span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button className="text-blue-600 hover:text-blue-800 p-2"><Edit size={18} /></button>
                          <button onClick={() => handleDelete(service._id)} className="text-red-500 hover:text-red-700 p-2"><Trash2 size={18} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'create' && (
              <div className="max-w-2xl mx-auto py-8 text-center text-gray-500">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 mb-4">
                   <Plus className="text-blue-500" size={32} />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">Create New Service</h3>
                <p className="mb-6">Fill in the comprehensive details of the government scheme to add it to the directory.</p>
                <button 
                  onClick={() => setActiveTab('list')}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700"
                >
                  Back to List
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
