import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { api } from './api';

interface Skill {
  id: number;
  name: string;
}

interface Candidate {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  picture: string;
  created_at: string;
  updated_at: string;
  skills: Skill[];
}

export default function CandidateProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    api.get(`/candidates/${id}`)
      .then((res) => {
        setCandidate(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Candidate not found or failed to load.');
        setLoading(false);
      });
  }, [id]);

  const handleDelete = async () => {
    const isConfirmed = window.confirm("Are you sure you want to permanently delete this candidate? This action cannot be undone.");
    if (!isConfirmed) return;

    setDeleting(true);
    try {
      await api.delete(`/candidates/${id}`);
      navigate('/candidates');
    } catch (err) {
      console.error(err);
      alert("Failed to delete candidate. Please try again.");
      setDeleting(false);
    }
  };

  if (loading) return <div className="text-center py-10 text-gray-500">Loading profile...</div>;
  if (error || !candidate) return (
    <div className="text-center py-10">
      <p className="text-red-500 mb-4">{error}</p>
      <Link to="/candidates" className="text-blue-600 hover:underline">Back to Directory</Link>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <Link to="/candidates" className="text-gray-500 hover:text-gray-900 font-medium">
          &larr; Back to Directory
        </Link>
        <div className="flex space-x-3">
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-4 py-2 rounded-md font-medium transition-colors disabled:opacity-50"
          >
            {deleting ? 'Deleting...' : 'Delete Candidate'}
          </button>
          <Link to={`/candidates/${candidate.id}/edit`} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors">
            Edit Profile
          </Link>
        </div>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center space-x-6 mb-8">
          <img
            className="h-24 w-24 rounded-full object-cover border-4 border-gray-50 shadow-sm"
            src={`http://127.0.0.1:8000/uploads/${candidate.picture}`}
            alt=""
            onError={(e) => { (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=' + candidate.first_name + '+' + candidate.last_name + '&size=128'; }}
          />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{candidate.first_name} {candidate.last_name}</h1>
            <p className="text-gray-500 mt-1">Candidate ID: #{candidate.id}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gray-100 pt-6">
          <div>
            <p className="text-sm font-medium text-gray-500">Email</p>
            <p className="text-gray-900">{candidate.email}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Phone</p>
            <p className="text-gray-900">{candidate.phone}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Date Created</p>
            <p className="text-gray-900">{new Date(candidate.created_at).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Last Updated</p>
            <p className="text-gray-900">{new Date(candidate.updated_at).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-6 mt-6">
          <p className="text-sm font-medium text-gray-500 mb-3">Technical Skills</p>
          <div className="flex flex-wrap gap-2">
            {candidate.skills.length > 0 ? (
              candidate.skills.map((skill) => (
                <span key={skill.id} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {skill.name}
                </span>
              ))
            ) : (
              <span className="text-gray-400 italic">No skills listed.</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
