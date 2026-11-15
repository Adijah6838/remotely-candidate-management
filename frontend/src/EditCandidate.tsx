import { FormEvent, useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { api } from './api';

export default function EditCandidate() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [skills, setSkills] = useState('');
  const [picture, setPicture] = useState<File | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  // Load existing data
  useEffect(() => {
    api.get(`/candidates/${id}`)
      .then((res) => {
        const c = res.data;
        setFirstName(c.first_name);
        setLastName(c.last_name);
        setEmail(c.email);
        setPhone(c.phone);
        setSkills(c.skills.map((s: any) => s.name).join(', '));
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load candidate data.');
        setLoading(false);
      });
  }, [id]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const formData = new FormData();
    formData.append('first_name', firstName);
    formData.append('last_name', lastName);
    formData.append('email', email);
    formData.append('phone', phone);
    formData.append('skills', skills);
    
    if (picture) {
      formData.append('picture', picture);
    }

    try {
      await api.patch(`/candidates/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      navigate(`/candidates/${id}`);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || 'Failed to update candidate.');
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-10 text-gray-500">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Edit Candidate</h1>
        <Link to={`/candidates/${id}`} className="text-gray-500 hover:text-gray-900 text-sm font-medium">
          Cancel
        </Link>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
            <input required type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
            <input required type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
            <input required type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Skills (Comma separated)</label>
          <input type="text" value={skills} onChange={(e) => setSkills(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Replace Profile Photograph (Optional)</label>
          <input type="file" accept="image/*" onChange={(e) => setPicture(e.target.files?.[0] || null)} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
        </div>

        <div className="pt-4 border-t border-gray-100 flex justify-end">
          <button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors disabled:opacity-50">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
