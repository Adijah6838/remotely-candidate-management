import { Link, Outlet, Route, Routes } from 'react-router-dom';
import Candidates from './Candidates';
import CreateCandidate from './CreateCandidate';
import CandidateProfile from './CandidateProfile';
import EditCandidate from './EditCandidate';

function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-blue-600 tracking-tight">
            Remotely
          </Link>
          <nav className="flex space-x-4">
            <Link to="/" className="text-gray-600 hover:text-gray-900 font-medium">
              Dashboard
            </Link>
            <Link to="/candidates" className="text-gray-600 hover:text-gray-900 font-medium">
              Candidates
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}

function Home() {
  return (
    <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
      <h1 className="text-2xl font-bold mb-4">Welcome to Remotely</h1>
      <p className="text-gray-600">The frontend is successfully connected!</p>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="candidates" element={<Candidates />} />
        <Route path="candidates/new" element={<CreateCandidate />} />
        <Route path="candidates/:id" element={<CandidateProfile />} />
        <Route path="candidates/:id/edit" element={<EditCandidate />} />
      </Route>
    </Routes>
  );
}
