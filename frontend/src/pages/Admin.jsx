import React, { useState, useEffect } from 'react';
import { userService, featureService, docService } from '../services/api';
import { Plus, Users, Grid, FilePlus, Trash2, Settings, CheckCircle } from 'lucide-react';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('features');
  const [users, setUsers] = useState([]);
  const [features, setFeatures] = useState([]);
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const [newFeature, setNewFeature] = useState({ name: '', description: '' });
  const [newDoc, setNewDoc] = useState({ title: '', content: '', feature_id: '', category: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [u, f, d] = await Promise.all([
        userService.getAll(),
        featureService.getAll(),
        docService.getAll()
      ]);
      setUsers(u.data);
      setFeatures(f.data);
      setDocs(d.data || []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleCreateFeature = async (e) => {
    e.preventDefault();
    await featureService.create(newFeature);
    setNewFeature({ name: '', description: '' });
    setMessage('Feature created successfully');
    fetchData();
    setTimeout(() => setMessage(''), 3000);
  };

  const handleCreateDoc = async (e) => {
    e.preventDefault();
    await docService.create(newDoc);
    setNewDoc({ title: '', content: '', feature_id: '', category: '' });
    setMessage('Document created successfully');
    fetchData();
    setTimeout(() => setMessage(''), 3000);
  };

  const handleDeleteDoc = async (id) => {
    if (!window.confirm('Delete this document?')) return;
    await docService.delete(id);
    fetchData();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="bg-gray-50 text-gray-800 min-h-screen px-6 py-8">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 mb-10">

        <div className="flex items-center gap-4">
          <div className="bg-blue-100 p-3 rounded-xl">
            <Settings className="text-blue-600" />
          </div>

          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="text-gray-500">
              Manage users, features, and documents
            </p>
          </div>
        </div>

        {/* TABS */}
        <div className="flex bg-white border border-gray-200 p-1 rounded-lg shadow-sm">
          {[
            { id: 'features', label: 'Features', icon: Grid },
            { id: 'users', label: 'Users', icon: Users },
            { id: 'docs', label: 'Docs', icon: FilePlus }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2 rounded-md text-sm font-medium transition ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

      </div>

      {/* MESSAGE */}
      {message && (
        <div className="mb-6 flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg">
          <CheckCircle size={16} />
          {message}
        </div>
      )}

      {/* FEATURES TAB */}
      {activeTab === 'features' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* FORM */}
          <form
            onSubmit={handleCreateFeature}
            className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
          >
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Create Feature
            </h2>

            <input
              required
              placeholder="Feature name"
              value={newFeature.name}
              onChange={(e) => setNewFeature({ ...newFeature, name: e.target.value })}
              className="w-full mb-3 border border-gray-300 px-3 py-2 rounded-md text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <textarea
              required
              placeholder="Description"
              value={newFeature.description}
              onChange={(e) => setNewFeature({ ...newFeature, description: e.target.value })}
              className="w-full mb-4 border border-gray-300 px-3 py-2 rounded-md text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition">
              Add Feature
            </button>
          </form>

          {/* LIST */}
          <div className="lg:col-span-2 space-y-4">
            {features.map(f => (
              <div key={f.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition">
                <h3 className="font-semibold text-gray-900">{f.name}</h3>
                <p className="text-sm text-gray-500">{f.description}</p>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* USERS TAB */}
      {activeTab === 'users' && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map(u => (
            <div key={u.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition">
              
              <h3 className="font-semibold text-gray-900">{u.name}</h3>
              <p className="text-sm text-gray-500">{u.email}</p>

              <span className={`mt-3 inline-block text-xs px-3 py-1 rounded-full font-medium ${
                u.role === 'admin'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {u.role}
              </span>

            </div>
          ))}
        </div>
      )}

      {/* DOCS TAB */}
      {activeTab === 'docs' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* FORM */}
          <form
            onSubmit={handleCreateDoc}
            className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
          >
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Create Document
            </h2>

            <input
              required
              placeholder="Title"
              value={newDoc.title}
              onChange={(e) => setNewDoc({ ...newDoc, title: e.target.value })}
              className="w-full mb-3 border border-gray-300 px-3 py-2 rounded-md text-gray-800 placeholder-gray-400"
            />

            <select
              required
              value={newDoc.feature_id}
              onChange={(e) => setNewDoc({ ...newDoc, feature_id: e.target.value })}
              className="w-full mb-3 border border-gray-300 px-3 py-2 rounded-md text-gray-800 bg-white"
            >
              <option value="">Select feature</option>
              {features.map(f => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>

            <input
              required
              placeholder="Category"
              value={newDoc.category}
              onChange={(e) => setNewDoc({ ...newDoc, category: e.target.value })}
              className="w-full mb-3 border border-gray-300 px-3 py-2 rounded-md text-gray-800"
            />

            <textarea
              required
              placeholder="Content"
              value={newDoc.content}
              onChange={(e) => setNewDoc({ ...newDoc, content: e.target.value })}
              className="w-full mb-4 border border-gray-300 px-3 py-2 rounded-md text-gray-800"
            />

            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition">
              Add Document
            </button>
          </form>

          {/* LIST */}
          <div className="lg:col-span-2 space-y-4">
            {docs.map(d => (
              <div key={d.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex justify-between items-center hover:shadow-md transition">
                
                <div>
                  <h3 className="font-semibold text-gray-900">{d.title}</h3>
                  <p className="text-sm text-gray-500">{d.category}</p>
                </div>

                <button onClick={() => handleDeleteDoc(d.id)}>
                  <Trash2 className="text-red-500 hover:text-red-700" size={18} />
                </button>

              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
};

export default Admin;