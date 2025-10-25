import { useEffect, useState } from 'react';
import { useLinkStore } from '../lib/linkStore.js';
import { useAuthStore } from '../lib/authStore.js';
import { Trash2, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';

const LinksPage = () => {
  const { links, loading, error, fetchLinks, addLink, deleteLink, clearError } = useLinkStore();
  const { authUser } = useAuthStore();
  const [url, setUrl] = useState('');

  useEffect(() => {
    if (authUser) {
      fetchLinks();
    }
  }, [authUser]);

  // Show error toast when error changes
  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url.trim()) return;

    // Basic URL validation
    try {
      new URL(url);
    } catch {
      toast.error('Please enter a valid URL');
      return;
    }

    try {
      await addLink(url);
      setUrl('');
      toast.success('Link added successfully!');
    } catch (err) {
      // Error toast is handled by the useEffect above
      console.error('Failed to add link:', err);
    }
  };

  const handleDelete = async (linkId) => {
    // Use toast.promise for delete confirmation and feedback
    toast.promise(
      deleteLink(linkId),
      {
        loading: 'Deleting link...',
        success: 'Link deleted successfully!',
        error: 'Failed to delete link',
      }
    ).catch(err => {
      console.error('Failed to delete link:', err);
    });
  };

  // Ensure links is always an array for mapping
  const safeLinks = Array.isArray(links) ? links : [];

  if (loading && safeLinks.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-gray-600">Loading links...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-white text-center">
          My Links Collection
        </h1>

        {/* Add Link Form */}
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex gap-4">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="flex-1 px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold shadow-lg"
              >
              {loading ? 'Adding...' : 'Add Link'}
            </button>
          </div>
        </form>

        {/* Links List */}
        <div className="space-y-4">
          {safeLinks.length === 0 ? (
            <div className="text-center py-16 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
              <p className="text-white/80 text-xl font-semibold">No links found</p>
              <p className="text-white/50 text-sm mt-2">Add your first link above!</p>
            </div>
          ) : (
            safeLinks.map((link) => (
              <div
                key={link._id}
                className="p-5 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl hover:bg-white/15 hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <a 
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-300 hover:text-blue-200 break-all flex items-center gap-2 group font-medium"
                    >
                      <span className="truncate">{link.url}</span>
                      <ExternalLink size={16} className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                    <p className="text-sm text-white/60 mt-2">
                      Added {new Date(link.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(link._id)}
                    className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-all duration-300 flex-shrink-0 hover:scale-110"
                    title="Delete link"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Loading indicator for subsequent operations */}
        {loading && safeLinks.length > 0 && (
          <div className="text-center py-4 text-white/70">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LinksPage;