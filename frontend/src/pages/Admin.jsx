import React, { useState, useEffect } from 'react';
import { userService, featureService, docService } from '../services/api';
import { Plus, Users, Grid, FilePlus, Trash2, Settings, CheckCircle, Upload, Eye, Info } from 'lucide-react';
import * as mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const Admin = () => {
  const [activeTab, setActiveTab] = useState('features');
  const [users, setUsers] = useState([]);
  const [features, setFeatures] = useState([]);
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [userSearch, setUserSearch] = useState('');

  const [newFeature, setNewFeature] = useState({ name: '', description: '' });
  const [newDoc, setNewDoc] = useState({ title: '', content: '', feature_id: '', category: '', is_public: true });
  const [importInfo, setImportInfo] = useState(null);

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
    setNewDoc({ title: '', content: '', feature_id: '', category: '', is_public: true });
    setMessage('Document created successfully');
    fetchData();
    setTimeout(() => setMessage(''), 3000);
  };

  const handleImportFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const extension = file.name.split('.').pop().toLowerCase();
    const title = file.name.replace(/\.[^/.]+$/, "");

    try {
      if (extension === 'docx' || extension === 'doc') {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const arrayBuffer = e.target.result;
          const result = await mammoth.extractRawText({ arrayBuffer });
          updateDocState(title, result.value, file);
        };
        reader.readAsArrayBuffer(file);
      } 
      else if (extension === 'pdf') {
        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            const arrayBuffer = e.target.result;
            const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
            const pdf = await loadingTask.promise;
            let fullText = "";
            
            for (let i = 1; i <= pdf.numPages; i++) {
              const page = await pdf.getPage(i);
              const textContent = await page.getTextContent();
              let lastY, text = '';
              for (let item of textContent.items) {
                if (lastY !== undefined && Math.abs(item.transform[5] - lastY) > 5) {
                  text += '\n';
                }
                text += item.str;
                lastY = item.transform[5];
              }
              fullText += text + "\n---\n";
            }
            
            updateDocState(title, fullText, file);
          } catch (pdfErr) {
            console.error('PDF parsing error:', pdfErr);
            setMessage('Error reading PDF structure');
          }
        };
        reader.readAsArrayBuffer(file);
      }
      else {
        // Handle txt, md, etc.
        const reader = new FileReader();
        reader.onload = (e) => {
          updateDocState(title, e.target.result, file);
        };
        reader.readAsText(file);
      }
    } catch (err) {
      console.error('Import error:', err);
      setMessage('Failed to import file');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const updateDocState = (title, content, file) => {
    setNewDoc(prev => ({ ...prev, title, content }));
    setImportInfo({
      name: file.name,
      size: (file.size / 1024).toFixed(2) + ' KB',
      type: file.name.split('.').pop().toUpperCase()
    });
    setMessage(`Imported: ${file.name}`);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleDeleteDoc = async (id) => {
    if (!window.confirm('Delete this document?')) return;
    await docService.delete(id);
    fetchData();
  };

  const handleToggleFeature = async (user, featureId) => {
    const currentFeatures = user.assigned_features || [];
    const isAssigned = currentFeatures.includes(featureId);
    const newFeatures = isAssigned 
      ? currentFeatures.filter(id => id !== featureId)
      : [...currentFeatures, featureId];
    
    try {
      await userService.assignFeatures(user.id, newFeatures);
      setMessage(`Access updated for ${user.name}`);
      fetchData();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Assign error:', err);
    }
  };

  const handleToggleRole = async (user) => {
    const newRole = user.role?.toLowerCase() === 'admin' ? 'user' : 'admin';
    if (!window.confirm(`Change ${user.name}'s role to ${newRole.toUpperCase()}?`)) return;
    
    try {
      await userService.updateRole(user.id, newRole);
      setMessage(`Role updated for ${user.name}`);
      fetchData();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Role update error:', err);
    }
  };

  const handleToggleStatus = async (user) => {
    const newStatus = !user.is_active;
    try {
      await userService.updateStatus(user.id, newStatus);
      setMessage(`${newStatus ? 'Access granted' : 'Access revoked'} for ${user.name}`);
      fetchData();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Status update error:', err);
    }
  };

  const handleDeleteUser = async (user) => {
    if (user.role?.toLowerCase() === 'admin') {
      alert("Cannot delete an administrator.");
      return;
    }
    if (!window.confirm(`Are you sure you want to delete user ${user.name}? This action cannot be undone.`)) return;
    
    try {
      await userService.delete(user.id);
      setMessage(`User ${user.name} deleted`);
      fetchData();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(userSearch.toLowerCase()) || 
    u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

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
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-200">
            <div className="relative w-full max-w-sm">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text"
                placeholder="Search users..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div className="text-sm text-gray-500 font-medium">
              Total Users: {filteredUsers.length}
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map(u => (
              <div key={u.id} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition flex flex-col group">
                
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{u.name}</h3>
                    <p className="text-sm text-gray-500">{u.email}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <button 
                      onClick={() => handleToggleRole(u)}
                      className={`text-[10px] px-2 py-1 rounded-full font-black uppercase tracking-widest transition-colors ${
                        u.role?.toLowerCase() === 'admin'
                          ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                          : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                      }`}
                    >
                      {u.role}
                    </button>
                    
                    <button 
                      onClick={() => handleToggleStatus(u)}
                      className={`text-[10px] px-2 py-1 rounded-md font-bold transition-all shadow-sm ${
                        u.is_active 
                          ? 'bg-green-100 text-green-700 border border-green-200 hover:bg-green-200'
                          : 'bg-red-100 text-red-700 border border-red-200 hover:bg-red-200'
                      }`}
                    >
                      {u.is_active ? 'ACTIVE' : 'INACTIVE'}
                    </button>

                    {u.role !== 'admin' && (
                      <button 
                        onClick={() => handleDeleteUser(u)}
                        className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Feature Assignment UI */}
                <div className="mt-auto pt-4 border-t border-gray-100">
                  <p className="text-[10px] font-black text-gray-400 uppercase mb-3 tracking-tighter">Assigned Access</p>
                  <div className="flex flex-wrap gap-1.5">
                    {features.map(f => (
                      <button
                        key={f.id}
                        onClick={() => handleToggleFeature(u, f.id)}
                        className={`text-[10px] px-2.5 py-1.5 rounded-lg border font-bold transition-all ${
                          u.assigned_features?.includes(f.id)
                            ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200'
                            : 'bg-white border-gray-200 text-gray-500 hover:border-blue-300 hover:text-blue-600'
                        }`}
                      >
                        {f.name}
                      </button>
                    ))}
                    {features.length === 0 && <p className="text-[10px] text-gray-400 italic">No features created yet</p>}
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* DOCS TAB */}
      {activeTab === 'docs' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* FORM */}
          <div className="space-y-6">
            <form
              onSubmit={handleCreateDoc}
              className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  Create Document
                </h2>
                <div className="relative">
                  <input
                    type="file"
                    id="fileImport"
                    className="hidden"
                    accept=".txt,.md,.js,.json,.pdf,.doc,.docx"
                    onChange={handleImportFile}
                  />
                  <label 
                    htmlFor="fileImport"
                    className="flex items-center gap-1.5 text-xs font-bold text-blue-600 cursor-pointer hover:bg-blue-50 px-2 py-1 rounded transition"
                  >
                    <Upload size={14} />
                    IMPORT
                  </label>
                </div>
              </div>

              {importInfo && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-100 rounded-lg flex items-center gap-3">
                   <Info className="text-blue-500" size={16} />
                   <div className="text-[10px] text-blue-700">
                      <p className="font-bold uppercase tracking-widest leading-tight">Import Info</p>
                      <p className="opacity-80">{importInfo.name} ({importInfo.size})</p>
                   </div>
                   <button 
                     type="button" 
                     onClick={() => setImportInfo(null)}
                     className="ml-auto text-blue-400 hover:text-blue-600"
                   >
                     <Plus className="rotate-45" size={14} />
                   </button>
                </div>
              )}

              <input
                required
                placeholder="Title"
                value={newDoc.title}
                onChange={(e) => setNewDoc({ ...newDoc, title: e.target.value })}
                className="w-full mb-3 border border-gray-300 px-3 py-2 rounded-md text-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
              />

              <select
                required
                value={newDoc.feature_id}
                onChange={(e) => setNewDoc({ ...newDoc, feature_id: e.target.value })}
                className="w-full mb-3 border border-gray-300 px-3 py-2 rounded-md text-gray-800 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
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
                className="w-full mb-3 border border-gray-300 px-3 py-2 rounded-md text-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
              />

              <textarea
                required
                placeholder="Content"
                value={newDoc.content}
                rows={6}
                onChange={(e) => setNewDoc({ ...newDoc, content: e.target.value })}
                className="w-full mb-4 border border-gray-300 px-3 py-2 rounded-md text-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
              />
              
              <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={newDoc.is_public}
                  onChange={(e) => setNewDoc({ ...newDoc, is_public: e.target.value === 'on' ? true : false, is_public: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <label 
                  htmlFor="isPublic"
                  className="text-sm font-semibold text-gray-700 cursor-pointer"
                >
                  Make Public (visible to all users)
                </label>
              </div>

              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-md font-bold transition flex items-center justify-center gap-2">
                <FilePlus size={18} />
                Create Document
              </button>
            </form>
          </div>

          {/* LIST */}
          <div className="lg:col-span-2 space-y-4">
            {docs.map(d => (
              <div key={d.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex justify-between items-center hover:shadow-md transition">
                
                <div className="flex items-center gap-4">
                  <div className="bg-blue-50 p-3 rounded-lg text-blue-600">
                    <Eye size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{d.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                       <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded font-black text-gray-500 uppercase tracking-widest">{d.category}</span>
                       <span className={`text-[10px] px-2 py-0.5 rounded font-black uppercase tracking-widest ${d.is_public ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                         {d.is_public ? 'Public' : 'Private'}
                       </span>
                       <span className="text-[10px] text-gray-400">• v{d.version}.0</span>
                    </div>
                  </div>
                </div>

                <button onClick={() => handleDeleteDoc(d.id)} className="p-2 hover:bg-red-50 rounded-lg text-red-500 transition">
                  <Trash2 size={18} />
                </button>

              </div>
            ))}
            {docs.length === 0 && (
              <div className="bg-gray-100 rounded-xl p-12 text-center border-2 border-dashed border-gray-200">
                 <Upload className="mx-auto text-gray-400 mb-3" size={32} />
                 <p className="text-gray-500 font-medium">No documents created yet.</p>
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
};

export default Admin;