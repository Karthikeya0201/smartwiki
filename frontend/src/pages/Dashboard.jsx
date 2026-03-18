import React, { useState, useEffect } from 'react';
import { docService, featureService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Search, FileText, Calendar, Tag,
  Clock, Ghost, ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [documents, setDocuments] = useState([]);
  const [features, setFeatures] = useState({});
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [docsRes, featuresRes] = await Promise.all([
        docService.getAll(),
        featureService.getAll()
      ]);

      setDocuments(docsRes.data);

      const featureMap = {};
      featuresRes.data.forEach(f => {
        featureMap[f.id] = f.name;
      });

      setFeatures(featureMap);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearch(query);

    if (query.length > 2) {
      const res = await docService.search(query);
      setDocuments(res.data);
    } else if (query.length === 0) {
      fetchData();
    }
  };

  return (
    <div className="pt-20 px-6 pb-16 max-w-7xl mx-auto min-h-screen bg-gray-50">

      {/* Header */}
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-black mb-2">
            Knowledge Base
          </h1>
          <p className="text-black">
            Access documentation based on your assigned features.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md py-2.5 pl-10 pr-3 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search documents..."
            value={search}
            onChange={handleSearch}
          />
        </div>
      </header>

      {/* Loading */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-blue-700 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-black">Loading documents...</p>
        </div>
      ) : (
        <>
          {/* Documents */}
          {documents.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-white border border-gray-300 rounded-lg p-5 flex flex-col"
                >
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-blue-100 p-2 rounded">
                      <FileText size={18} className="text-blue-700" />
                    </div>
                    <span className="text-sm text-black font-medium">
                      {doc.category || 'General'}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-semibold text-black mb-2">
                    {doc.title}
                  </h3>

                  {/* Content */}
                  <p className="text-black text-sm mb-4 line-clamp-3">
                    {doc.content}
                  </p>

                  {/* Meta */}
                  <div className="mt-auto space-y-3 text-xs text-black">

                    {doc.feature_id && (
                      <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-2 py-1 rounded w-fit">
                        <Tag size={12} />
                        {features[doc.feature_id] || 'Unknown'}
                      </div>
                    )}

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Clock size={12} />
                        v{doc.version}
                      </div>

                      <div className="flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(doc.created_at).toLocaleDateString()}
                      </div>
                    </div>

                    {/* Read More */}
                    <Link
                      to={`/documents/${doc.id}`}
                      className="inline-flex items-center gap-2 text-blue-700 font-medium mt-2"
                    >
                      Read More
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              ))}

            </div>
          ) : (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <Ghost size={60} className="text-gray-400 mb-4" />
              <h2 className="text-xl font-semibold text-black mb-2">
                No Documents Found
              </h2>
              <p className="text-black max-w-md">
                {user?.assigned_features?.length === 0
                  ? "You haven't been assigned any features yet."
                  : "Try a different search query."}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;