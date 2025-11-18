import { FileText, Link, Calendar } from 'lucide-react';

export const Dashboard = ({ notes = [], links = [] }) => {
  const totalNotes = notes.length;
  const totalLinks = links.length;

  // Get recent items
  const recentNotes = [...notes]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);
  
  const recentLinks = [...links]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-900 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 mt-2">Welcome to your personal workspace</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {/* Notes Card */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center gap-4">
              <div className="bg-blue-500 bg-opacity-20 p-3 rounded-lg">
                <FileText className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Notes</p>
                <h3 className="text-2xl font-bold text-white">{totalNotes}</h3>
              </div>
            </div>
          </div>

          {/* Links Card */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center gap-4">
              <div className="bg-green-500 bg-opacity-20 p-3 rounded-lg">
                <Link className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Links</p>
                <h3 className="text-2xl font-bold text-white">{totalLinks}</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Items */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Notes */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-lg font-semibold text-white mb-4">Recent Notes</h2>
            <div className="space-y-3">
              {recentNotes.length === 0 ? (
                <p className="text-gray-400 text-sm">No notes yet</p>
              ) : (
                recentNotes.map(note => (
                  <div key={note.id} className="bg-gray-700 rounded p-3">
                    <h3 className="text-white font-medium text-sm">{note.title}</h3>
                    <p className="text-gray-400 text-xs mt-1 line-clamp-2">{note.content}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Links */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-lg font-semibold text-white mb-4">Recent Links</h2>
            <div className="space-y-3">
              {recentLinks.length === 0 ? (
                <p className="text-gray-400 text-sm">No links yet</p>
              ) : (
                recentLinks.map(link => (
                  <div key={link.id} className="bg-gray-700 rounded p-3">
                    <h3 className="text-white font-medium text-sm">{link.title}</h3>
                    <p className="text-green-400 text-xs font-mono mt-1 truncate">
                      {link.url.replace(/^https?:\/\//, '')}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};