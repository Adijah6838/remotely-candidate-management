import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
  picture: string;
  skills: Skill[];
}

export default function Candidates() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/candidates/')
      .then((res) => {
        setCandidates(res.data.items);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load candidates. Is the backend running?');
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center py-10 text-gray-500">Loading directory...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Candidate Directory</h1>
        <Link to="/candidates/new" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors">
          Add Candidate
        </Link>
      </div>

      {candidates.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-lg border border-gray-200 shadow-sm">
          <p className="text-gray-500 mb-4">No candidates found in the database.</p>
          <Link to="/candidates/new" className="text-blue-600 hover:underline font-medium">
            Add your first candidate
          </Link>
        </div>
      ) : (
        <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Skills</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {candidates.map((candidate) => (
                <tr key={candidate.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <img
                          className="h-10 w-10 rounded-full object-cover border border-gray-200"
                          src={`http://127.0.0.1:8000/uploads/${candidate.picture}`}
                          alt=""
                          onError={(e) => { (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=' + candidate.first_name + '+' + candidate.last_name; }}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{candidate.first_name} {candidate.last_name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {candidate.email}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {candidate.skills.map((skill) => (
                        <span key={skill.id} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
