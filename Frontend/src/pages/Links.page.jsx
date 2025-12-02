import { useState, useEffect } from 'react';
import { Plus, ExternalLink, Trash2, Save, X, Loader, Search } from 'lucide-react';
import { useLinksStore } from '../lib/linksStore';

export const Links = () => {
  const { links, isLoading, isAdding, isDeleting, fetchLinks, addLink, deleteLink } = useLinksStore();
  const [isAddingLink, setIsAddingLink] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    description: ''
  });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  const handleAdd = async () => {
    if (formData.title.trim() && formData.url.trim()) {
      // Add https:// if not present
      let url = formData.url.trim();
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }

      const result = await addLink({
        title: formData.title.trim(),
        url: url,
        description: formData.description.trim()
      });

      if (result.success) {
        setFormData({ title: '', url: '', description: '' });
        setIsAddingLink(false);
      }
    }
  };

  const handleDelete = async (linkId) => {
    await deleteLink(linkId);
  };

  const handleCancel = () => {
    setIsAddingLink(false);
    setFormData({ title: '', url: '', description: '' });
  };

  const openLink = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const filteredLinks = links.filter(link =>
    link.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    link.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (link.description && link.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-900 p-3 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">My Links</h1>
            <p className="text-gray-400 text-xs sm:text-sm mt-1">
              {filteredLinks.length} {filteredLinks.length === 1 ? 'link' : 'links'} found
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search links..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-lg leading-5 bg-gray-800 text-gray-300 placeholder-gray-400 focus:outline-none focus:bg-gray-700 focus:border-green-500 focus:ring-1 focus:ring-green-500 sm:text-sm transition duration-150 ease-in-out"
              />
            </div>

            {!isAddingLink && (
              <button
                onClick={() => setIsAddingLink(true)}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg transition duration-200 font-medium w-full sm:w-auto justify-center disabled:opacity-50"
                disabled={isLoading}
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-base">Add Link</span>
              </button>
            )}
          </div>
        </div>

        {/* Links Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="w-8 h-8 animate-spin text-green-500" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {filteredLinks.length === 0 ? (
              <div className="col-span-full text-center py-8 sm:py-12">
                <p className="text-gray-400 text-base sm:text-lg">
                  {searchQuery ? 'No links found matching your search.' : 'No links yet. Add your first link!'}
                </p>
              </div>
            ) : (
              filteredLinks.map((link) => (
                <div
                  key={link._id}
                  className="bg-gray-800 rounded-lg p-4 sm:p-5 border border-gray-700 hover:border-green-600 transition duration-200 group"
                >
                  <div className="flex justify-between items-start mb-2 sm:mb-3">
                    <h3 className="text-base sm:text-lg font-semibold text-white flex-1 pr-2 line-clamp-2">
                      {link.title}
                    </h3>
                    <div className="flex gap-1 sm:gap-2 flex-shrink-0">
                      <button
                        onClick={() => openLink(link.url)}
                        className="text-green-400 hover:text-green-300 transition duration-200 p-1"
                        title="Open link"
                      >
                        <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(link._id)}
                        className="text-red-400 hover:text-red-300 transition duration-200 p-1 disabled:opacity-50"
                        title="Delete link"
                        disabled={isDeleting}
                      >
                        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  </div>

                  <div
                    onClick={() => openLink(link.url)}
                    className="mb-2 sm:mb-3 cursor-pointer"
                  >
                    <p className="text-green-400 text-xs sm:text-sm font-mono line-clamp-1 hover:text-green-300 transition duration-200">
                      {link.url.replace(/^https?:\/\//, '')}
                    </p>
                  </div>

                  {link.description && (
                    <p className="text-gray-300 text-xs sm:text-sm mb-2 sm:mb-3 whitespace-pre-wrap line-clamp-2">
                      {link.description}
                    </p>
                  )}

                  <div className="flex justify-between items-center">
                    <p className="text-gray-500 text-xs">
                      {new Date(link.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                    <span className="text-green-500 text-xs bg-green-900 bg-opacity-30 px-2 py-1 rounded-full">
                      Link
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Popup Modal for Add Form with Blur Background */}
      {isAddingLink && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black bg-opacity-30 flex items-center justify-center p-3 sm:p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-4 sm:p-6 w-full max-w-md sm:max-w-2xl mx-auto border border-gray-700 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <h2 className="text-lg sm:text-xl font-semibold text-white">
                Add New Link
              </h2>
              <button
                onClick={handleCancel}
                className="text-gray-400 hover:text-white transition duration-200 p-1 rounded-full hover:bg-gray-700"
                disabled={isAdding}
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1 sm:mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter link title"
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
                  autoFocus
                  disabled={isAdding}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1 sm:mb-2">
                  URL *
                </label>
                <input
                  type="text"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://example.com"
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
                  disabled={isAdding}
                />
                <p className="text-gray-400 text-xs mt-1">
                  You can enter with or without https://
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1 sm:mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter link description (optional)"
                  rows="3"
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none text-sm sm:text-base"
                  disabled={isAdding}
                ></textarea>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
                <button
                  onClick={handleAdd}
                  className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 sm:px-6 py-2.5 rounded-lg transition duration-200 font-medium text-sm sm:text-base order-2 sm:order-1 disabled:opacity-50"
                  disabled={isAdding || !formData.title.trim() || !formData.url.trim()}
                >
                  {isAdding ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span>Add Link</span>
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 sm:px-6 py-2.5 rounded-lg transition duration-200 font-medium text-sm sm:text-base order-1 sm:order-2 disabled:opacity-50"
                  disabled={isAdding}
                >
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}