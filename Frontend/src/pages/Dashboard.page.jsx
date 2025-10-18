import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../lib/authStore';
import { useNoteStore } from '../lib/noteStore';
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
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                </svg>
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
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                </svg>
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
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
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
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
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
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    <span>New Note</span>
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                {recentNotes.length === 0 ? (
                  <div className="text-center py-8">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-600 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
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
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDeleteNote(note._id)}
                              className="p-1.5 text-red-400 hover:text-red-300 hover:bg-gray-600 rounded transition-colors duration-200"
                              title="Delete note"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
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
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400 group-hover:text-blue-300" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
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
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400 group-hover:text-green-300" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
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