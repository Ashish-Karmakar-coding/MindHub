import { useState } from 'react';
import { Plus, ExternalLink, Trash2, Save, X } from 'lucide-react';

export const Links = () => {
  const [links, setLinks] = useState([
    { 
      id: 1, 
      title: 'Google', 
      url: 'https://google.com', 
      description: 'Search engine',
      createdAt: new Date().toISOString() 
    },
    { 
      id: 2, 
      title: 'GitHub', 
      url: 'https://github.com', 
      description: 'Code hosting platform',
      createdAt: new Date().toISOString() 
    },
  ]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ 
    title: '', 
    url: '', 
    description: '' 
  });

  const handleAdd = () => {
    if (formData.title.trim() && formData.url.trim()) {
      // Add https:// if not present
      let url = formData.url.trim();
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }

      const newLink = {
        id: Date.now(),
        title: formData.title,
        url: url,
        description: formData.description,
        createdAt: new Date().toISOString(),
      };
      setLinks([newLink, ...links]);
      setFormData({ title: '', url: '', description: '' });
      setIsAdding(false);
    }
  };

  const handleEdit = (link) => {
    setEditingId(link.id);
    setFormData({ 
      title: link.title, 
      url: link.url, 
      description: link.description 
    });
  };

  const handleUpdate = () => {
    if (formData.title.trim() && formData.url.trim()) {
      // Add https:// if not present
      let url = formData.url.trim();
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }

      setLinks(links.map(link => 
        link.id === editingId 
          ? { 
              ...link, 
              title: formData.title, 
              url: url, 
              description: formData.description 
            }
          : link
      ));
      setEditingId(null);
      setFormData({ title: '', url: '', description: '' });
    }
  };

  const handleDelete = (id) => {
    setLinks(links.filter(link => link.id !== id));
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({ title: '', url: '', description: '' });
  };

  const openLink = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-gray-900 p-3 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">My Links</h1>
            <p className="text-gray-400 text-xs sm:text-sm mt-1">
              {links.length} {links.length === 1 ? 'link' : 'links'} total
            </p>
          </div>
          {!isAdding && !editingId && (
            <button
              onClick={() => setIsAdding(true)}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg transition duration-200 font-medium w-full sm:w-auto justify-center"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base">Add Link</span>
            </button>
          )}
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {links.length === 0 ? (
            <div className="col-span-full text-center py-8 sm:py-12">
              <p className="text-gray-400 text-base sm:text-lg">
                No links yet. Add your first link!
              </p>
            </div>
          ) : (
            links.map((link) => (
              <div
                key={link.id}
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
                      onClick={() => handleEdit(link)}
                      className="text-blue-400 hover:text-blue-300 transition duration-200 p-1"
                      title="Edit link"
                    >
                      <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(link.id)}
                      className="text-red-400 hover:text-red-300 transition duration-200 p-1"
                      title="Delete link"
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
      </div>

      {/* Popup Modal for Add/Edit Form with Blur Background */}
      {(isAdding || editingId) && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black bg-opacity-30 flex items-center justify-center p-3 sm:p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-4 sm:p-6 w-full max-w-md sm:max-w-2xl mx-auto border border-gray-700 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <h2 className="text-lg sm:text-xl font-semibold text-white">
                {isAdding ? 'Add New Link' : 'Edit Link'}
              </h2>
              <button
                onClick={handleCancel}
                className="text-gray-400 hover:text-white transition duration-200 p-1 rounded-full hover:bg-gray-700"
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
                ></textarea>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
                <button
                  onClick={isAdding ? handleAdd : handleUpdate}
                  className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 sm:px-6 py-2.5 rounded-lg transition duration-200 font-medium text-sm sm:text-base order-2 sm:order-1"
                >
                  <Save className="w-4 h-4" />
                  <span>{isAdding ? 'Add Link' : 'Save Changes'}</span>
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 sm:px-6 py-2.5 rounded-lg transition duration-200 font-medium text-sm sm:text-base order-1 sm:order-2"
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