import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../lib/authStore';
import { useNoteStore } from '../lib/noteStore';
import { 
  IconNotes, 
  IconTrendingUp, 
  IconCalendar, 
  IconPlus,
  IconEdit,
  IconTrash
} from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const { authUser } = useAuthStore();
  const { notes, fetchNotes, deleteNote } = useNoteStore();
  const navigate = useNavigate();
  
  const [stats, setStats] = useState({
    totalNotes: 0,
    recentNotes: 0,
    averageLength: 0,
    productivity: 0
  });

  useEffect(() => {
    if (authUser) {
      fetchNotes();
    }
  }, [authUser, fetchNotes]);

  useEffect(() => {
    // Calculate statistics whenever notes change
    const totalNotes = notes.length;
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);
    
    const recentNotes = notes.filter(note => 
      new Date(note.createdAt) > last7Days
    ).length;
    
    const totalChars = notes.reduce((sum, note) => 
      sum + (note.title?.length || 0) + (note.content?.length || 0), 0
    );
    
    const averageLength = totalNotes > 0 ? Math.round(totalChars / totalNotes) : 0;
    const productivity = totalNotes > 0 ? Math.min(100, Math.round((recentNotes / totalNotes) * 200)) : 0;

    setStats({
      totalNotes,
      recentNotes,
      averageLength,
      productivity
    });
  }, [notes]);

  const handleDeleteNote = async (noteId) => {
    if (!window.confirm('Are you sure you want to delete this note?')) {
      return;
    }
    await deleteNote(noteId);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const recentNotes = notes.slice(0, 5); // Show only 5 most recent notes

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">
            Welcome back, {authUser?.name || 'User'}! 👋
          </h1>
          <p className="text-gray-400 mt-2">
            Here's what's happening with your notes today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Notes Card */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Total Notes</p>
                <p className="text-3xl font-bold text-white mt-2">{stats.totalNotes}</p>
                <p className="text-green-400 text-sm mt-1">+{stats.recentNotes} this week</p>
              </div>
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <IconNotes className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </div>

          {/* Productivity Score Card */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Productivity Score</p>
                <p className="text-3xl font-bold text-white mt-2">{stats.productivity}%</p>
                <p className="text-blue-400 text-sm mt-1">Based on recent activity</p>
              </div>
              <div className="p-3 bg-green-500/10 rounded-lg">
                <IconTrendingUp className="h-6 w-6 text-green-400" />
              </div>
            </div>
          </div>

          {/* Average Length Card */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Avg. Note Length</p>
                <p className="text-3xl font-bold text-white mt-2">{stats.averageLength}</p>
                <p className="text-gray-400 text-sm mt-1">characters per note</p>
              </div>
              <div className="p-3 bg-purple-500/10 rounded-lg">
                <IconEdit className="h-6 w-6 text-purple-400" />
              </div>
            </div>
          </div>

          {/* Recent Activity Card */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Recent Activity</p>
                <p className="text-3xl font-bold text-white mt-2">{stats.recentNotes}</p>
                <p className="text-gray-400 text-sm mt-1">notes this week</p>
              </div>
              <div className="p-3 bg-orange-500/10 rounded-lg">
                <IconCalendar className="h-6 w-6 text-orange-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Notes - Takes 2/3 of the space */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-xl border border-gray-700">
              <div className="p-6 border-b border-gray-700">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-white">Recent Notes</h2>
                  <button
                    onClick={() => navigate('/notes')}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                  >
                    <IconPlus size={18} />
                    <span>New Note</span>
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                {recentNotes.length === 0 ? (
                  <div className="text-center py-8">
                    <IconNotes className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400">No notes yet</p>
                    <p className="text-gray-500 text-sm mt-1">Create your first note to get started</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentNotes.map((note) => (
                      <div key={note._id} className="bg-gray-700 rounded-lg p-4 border border-gray-600 hover:border-gray-500 transition-all duration-200 group">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-semibold text-white group-hover:text-blue-300 transition-colors duration-200">
                            {note.title}
                          </h3>
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <button
                              onClick={() => navigate('/notes')}
                              className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-gray-600 rounded transition-colors duration-200"
                              title="Edit note"
                            >
                              <IconEdit size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteNote(note._id)}
                              className="p-1.5 text-red-400 hover:text-red-300 hover:bg-gray-600 rounded transition-colors duration-200"
                              title="Delete note"
                            >
                              <IconTrash size={16} />
                            </button>
                          </div>
                        </div>
                        
                        {note.content && (
                          <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                            {note.content}
                          </p>
                        )}
                        
                        <div className="flex justify-between items-center text-xs text-gray-400 pt-3 border-t border-gray-600">
                          <span>{formatDate(note.createdAt)}</span>
                          {note.updatedAt !== note.createdAt && (
                            <span className="text-blue-400">Edited</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {notes.length > 5 && (
                  <div className="mt-6 text-center">
                    <button
                      onClick={() => navigate('/notes')}
                      className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
                    >
                      View all notes ({notes.length})
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions - Takes 1/3 of the space */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Quick Actions</h2>
              
              <div className="space-y-4">
                <button
                  onClick={() => navigate('/notes')}
                  className="w-full flex items-center gap-3 p-4 bg-gray-700 hover:bg-gray-600 rounded-lg border border-gray-600 hover:border-blue-500 transition-all duration-200 group"
                >
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <IconPlus className="h-5 w-5 text-blue-400 group-hover:text-blue-300" />
                  </div>
                  <div className="text-left">
                    <p className="text-white font-medium">New Note</p>
                    <p className="text-gray-400 text-sm">Create a new note</p>
                  </div>
                </button>

                <button
                  onClick={() => navigate('/notes')}
                  className="w-full flex items-center gap-3 p-4 bg-gray-700 hover:bg-gray-600 rounded-lg border border-gray-600 hover:border-green-500 transition-all duration-200 group"
                >
                  <div className="p-2 bg-green-500/10 rounded-lg">
                    <IconEdit className="h-5 w-5 text-green-400 group-hover:text-green-300" />
                  </div>
                  <div className="text-left">
                    <p className="text-white font-medium">Manage Notes</p>
                    <p className="text-gray-400 text-sm">View and edit all notes</p>
                  </div>
                </button>

                <div className="mt-8">
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                    Statistics
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Notes Created</span>
                      <span className="text-white font-medium">{stats.totalNotes}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">This Week</span>
                      <span className="text-green-400 font-medium">+{stats.recentNotes}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Avg. Length</span>
                      <span className="text-white font-medium">{stats.averageLength} chars</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;