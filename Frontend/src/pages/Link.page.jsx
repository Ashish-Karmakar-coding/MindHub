import { useEffect, useState } from 'react';
import useLinkStore from '../lib/linkStore.js';
import { useAuthStore } from '../lib/authStore.js';

const LinksPage = () => {
  const { links, loading, error, fetchLinks, addLink } = useLinkStore();
  const { authUser } = useAuthStore();
  const [url, setUrl] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (authUser) {
      fetchLinks();
    }
  }, [authUser, fetchLinks]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url.trim()) return;

    try {
      await addLink(url);
      setUrl('');
      setMessage('Link added successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to add link');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  if (loading && links.length === 0) {
    return <div className="flex justify-center items-center min-h-64">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">My Links</h1>

      {/* Add Link Form */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex gap-4">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter URL"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Add Link
          </button>
        </div>
      </form>

      {/* Messages */}
      {message && (
        <div className={`p-4 mb-6 rounded-lg ${
          message.includes('successfully') 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {message}
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="p-4 mb-6 bg-red-100 text-red-800 rounded-lg">
          {error}
        </div>
      )}

      {/* Links List */}
      <div className="space-y-4">
        {links.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No links found. Add your first link above!
          </div>
        ) : (
          links.map((link) => (
            <div
              key={link._id}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-600 break-all"
                  >
                    {link.url}
                  </a>
                  <p className="text-sm text-gray-500 mt-1">
                    Added on {new Date(link.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Loading indicator for subsequent loads */}
      {loading && links.length > 0 && (
        <div className="text-center py-4">Loading more...</div>
      )}
    </div>
  );
};

export default LinksPage;