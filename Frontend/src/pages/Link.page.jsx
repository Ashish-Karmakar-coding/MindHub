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
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">My Links</h1>

      {/* Add Link Form */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex gap-4">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Adding...' : 'Add Link'}
          </button>
        </div>
      </form>

      {/* Links List */}
      <div className="space-y-4">
        {safeLinks.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500 text-lg">No links found</p>
            <p className="text-gray-400 text-sm mt-2">Add your first link above!</p>
          </div>
        ) : (
          safeLinks.map((link) => (
            <div
              key={link._id}
              className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow bg-white"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 min-w-0">
                  <a 
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-600 break-all flex items-center gap-2 group"
                  >
                    <span className="truncate">{link.url}</span>
                    <ExternalLink size={16} className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                  <p className="text-sm text-gray-500 mt-2">
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
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
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
        <div className="text-center py-4 text-gray-500">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
        </div>
      )}
    </div>
  );
};

export default LinksPage;