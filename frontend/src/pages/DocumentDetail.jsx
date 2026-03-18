import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { docService, featureService } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Clock, History, Calendar, 
  Tag, ChevronRight, FileText, AlertCircle,
  Hash, Layers, Info, Trash2, Edit3
} from 'lucide-react';

const DocumentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doc, setDoc] = useState(null);
  const [featureName, setFeatureName] = useState('');
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    fetchDocData();
  }, [id]);

  const fetchDocData = async () => {
    try {
      const docRes = await docService.getById(id);
      setDoc(docRes.data);
      
      const [featureRes, versionsRes] = await Promise.all([
        featureService.getAll(),
        docService.getVersions(id)
      ]);
      
      const feature = featureRes.data.find(f => f.id === docRes.data.feature_id);
      setFeatureName(feature ? feature.name : 'Unknown Feature');
      setVersions(versionsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="pt-32 flex flex-col items-center justify-center py-20 animate-pulse">
        <Hash size={48} className="text-brand-primary animate-spin mb-4" />
        <p className="text-slate-400 font-medium tracking-widest uppercase text-xs">Accessing Knowledge...</p>
    </div>
  );

  if (!doc) return (
    <div className="pt-32 flex flex-col items-center justify-center py-20">
        <AlertCircle size={48} className="text-red-500 mb-4" />
        <p className="text-white font-bold">Document not found or access denied.</p>
        <Link to="/dashboard" className="text-brand-primary mt-4 hover:underline">Return to Dashboard</Link>
    </div>
  );

  return (
    <div className="pt-28 px-6 pb-20 max-w-5xl mx-auto min-h-screen">
      <Link 
        to="/dashboard" 
        className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-colors mb-10 group bg-white/5 px-4 py-2 rounded-xl border border-white/5 hover:border-white/10"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        Explore Base
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        <div className="lg:col-span-3">
          <motion.article 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-[40px] p-8 sm:p-12 border-white/10 relative overflow-hidden"
          >
            {/* Elegant Header */}
            <header className="mb-10 relative">
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="bg-brand-primary/10 text-brand-primary px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-brand-primary/20">
                  {doc.category}
                </span>
                <span className="bg-white/5 text-slate-400 px-4 py-1.5 rounded-full text-xs font-bold border border-white/10 flex items-center gap-2">
                  <Tag size={12} />
                  {featureName}
                </span>
                <span className="bg-white/5 text-slate-400 px-4 py-1.5 rounded-full text-xs font-bold border border-white/10 flex items-center gap-2">
                   <Clock size={12} />
                   v{doc.version}.0
                </span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl font-black text-white mb-6 leading-tight select-none">
                {doc.title}
              </h1>

              <div className="flex items-center gap-6 text-sm text-slate-500 border-b border-white/5 pb-8">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-brand-primary/20 flex items-center justify-center text-brand-primary">
                    <History size={14} />
                  </div>
                  <span>Last synchronized: {new Date(doc.updated_at).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
                </div>
              </div>
            </header>

            {/* Document Content */}
            <div className="prose prose-invert max-w-none prose-headings:text-white prose-p:text-slate-300 prose-p:leading-relaxed prose-p:text-lg">
               {doc.content.split('\n').map((para, i) => (
                 <p key={i} className="mb-6 whitespace-pre-wrap">{para}</p>
               ))}
            </div>

            <div className="mt-16 pt-10 border-t border-white/5 flex flex-wrap gap-4 justify-between items-center opacity-50 hover:opacity-100 transition-opacity">
               <div className="flex items-center gap-3 text-slate-500 text-xs font-bold uppercase tracking-widest">
                  <Info size={16} />
                  End of Knowledge Piece
               </div>
               <div className="flex items-center gap-2 text-slate-700 font-mono text-xs">
                  ID: {doc.id}
               </div>
            </div>
          </motion.article>
        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-1 space-y-6">
          {/* Metadata Card */}
          <div className="glass rounded-[32px] p-8 border-white/10 shadow-2xl">
             <h4 className="text-white font-black text-sm uppercase tracking-widest mb-6 flex items-center gap-3">
                <Layers size={18} className="text-brand-primary" />
                Evolution
             </h4>
             
             <button 
               onClick={() => setShowHistory(!showHistory)}
               className={`w-full text-left p-5 rounded-2xl transition-all border flex items-center justify-between group ${showHistory ? 'bg-brand-primary border-brand-primary text-white shadow-xl shadow-brand-primary/10' : 'bg-white/5 border-white/5 text-slate-400 hover:text-white hover:bg-white/10 hover:border-white/10'}`}
             >
                <div className="flex flex-col">
                   <span className="font-black text-lg">{versions.length + 1}</span>
                   <span className="text-[10px] uppercase font-bold opacity-60">Total Generations</span>
                </div>
                <ChevronRight className={`transition-transform duration-300 ${showHistory ? 'rotate-90' : ''}`} />
             </button>

             <AnimatePresence>
               {showHistory && (
                 <motion.div 
                   initial={{ height: 0, opacity: 0 }}
                   animate={{ height: 'auto', opacity: 1 }}
                   exit={{ height: 0, opacity: 0 }}
                   className="overflow-hidden"
                 >
                    <div className="pt-6 space-y-4">
                       {/* Current Version */}
                       <div className="relative pl-6 pb-4 border-l-2 border-brand-primary">
                          <div className="absolute top-0 -left-[9px] w-4 h-4 rounded-full bg-brand-primary shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
                          <p className="text-xs font-black text-white mb-1">Current Version (v{doc.version})</p>
                          <p className="text-[10px] text-slate-500 uppercase">{new Date(doc.updated_at).toLocaleDateString()}</p>
                       </div>

                       {/* Historical Versions */}
                       {versions.map((v, idx) => (
                         <div key={idx} className="relative pl-6 pb-4 border-l-2 border-slate-700 last:pb-0">
                            <div className="absolute top-0 -left-[5px] w-2 h-2 rounded-full bg-slate-700"></div>
                            <p className="text-xs font-bold text-slate-400 mb-1">Archived (v{v.version})</p>
                            <p className="text-[10px] text-slate-600 uppercase tracking-tighter">{new Date(v.updated_at).toLocaleDateString()}</p>
                         </div>
                       ))}
                    </div>
                 </motion.div>
               )}
             </AnimatePresence>
          </div>

          <div className="glass rounded-[32px] p-8 border-white/5 opacity-80 bg-brand-primary/5">
             <div className="flex items-center gap-3 text-brand-primary mb-4">
                <div className="p-2 bg-brand-primary/10 rounded-lg">
                   <AlertCircle size={16} />
                </div>
                <span className="text-xs font-black uppercase tracking-widest">Internal Use Only</span>
             </div>
             <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Information contained within this wiki is subject to feature-based access controls and should not be shared outside its intended feature group.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentDetail;
