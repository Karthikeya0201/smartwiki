import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { docService, featureService } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {
  ArrowLeft, Clock, History, Tag, ChevronRight,
  AlertCircle, Hash, Layers, Info, Download, ExternalLink,
  Printer, ZoomIn, ZoomOut, Maximize2, FileOutput
} from 'lucide-react';

const DocumentDetail = () => {
  const { id } = useParams();

  const [doc, setDoc] = useState(null);
  const [featureName, setFeatureName] = useState('');
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const [zoom, setZoom] = useState(1);

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

      const feature = featureRes.data.find(
        f => f.id === docRes.data.feature_id
      );

      setFeatureName(feature ? feature.name : 'Unknown Feature');
      setVersions(versionsRes.data);
    } catch (err) {
      console.error('Error fetching document:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = async (openOnline = false) => {
    const element = document.getElementById('document-content');
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      
      if (openOnline) {
        window.open(pdf.output('bloburl'), '_blank');
      } else {
        pdf.save(`${doc.title.replace(/\s+/g, '_')}.pdf`);
      }
    } catch (err) {
      console.error('PDF Export Error:', err);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  const handleExportDoc = () => {
    const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export DOC</title></head><body>";
    const footer = "</body></html>";
    const sourceHTML = header + `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h1 style="font-size: 24pt; margin-bottom: 5px;">${doc.title}</h1>
        <p style="color: #666; font-size: 10pt; margin-bottom: 20px;">Category: ${doc.category || 'General'} | Feature: ${featureName} | v${doc.version}.0</p>
        <div style="font-size: 12pt; line-height: 1.6;">
          ${doc.content.split('\n').map(p => `<p>${p}</p>`).join('')}
        </div>
      </div>
    ` + footer;
    
    const blob = new Blob(['\ufeff', sourceHTML], {
      type: 'application/msword'
    });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${doc.title.replace(/\s+/g, '_')}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  /* ---------------- LOADING ---------------- */
  if (loading)
    return (
      <div className="pt-32 flex flex-col items-center justify-center py-20">
        <Hash size={48} className="text-blue-600 animate-spin mb-4" />
        <p className="text-gray-500 font-medium text-sm uppercase tracking-widest">
          Loading document...
        </p>
      </div>
    );

  /* ---------------- ERROR ---------------- */
  if (!doc)
    return (
      <div className="pt-32 flex flex-col items-center justify-center py-20">
        <AlertCircle size={48} className="text-red-500 mb-4" />
        <p className="text-gray-800 font-bold">
          Document not found or access denied.
        </p>
        <Link
          to="/dashboard"
          className="text-blue-600 mt-4 hover:underline"
        >
          Return to Dashboard
        </Link>
      </div>
    );

  return (
    <div className="pt-24 pb-20 min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-6">

      {/* Reader Toolbar */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-white border border-gray-200 rounded-xl p-3 mb-8 shadow-sm gap-4 sticky top-24 z-20">
        <div className="flex items-center gap-3">
          <Link
            to="/dashboard"
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition"
            title="Back to Dashboard"
          >
            <ArrowLeft size={20} />
          </Link>
          <div className="h-6 w-px bg-gray-200 mx-2 hidden sm:block"></div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
              className="p-2 text-gray-400 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition"
              title="Zoom Out"
            >
              <ZoomOut size={18} />
            </button>
            <span className="text-xs font-bold text-gray-600 w-12 text-center uppercase tracking-widest">
              {Math.round(zoom * 100)}%
            </span>
            <button 
              onClick={() => setZoom(Math.min(2, zoom + 0.1))}
              className="p-2 text-gray-400 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition"
              title="Zoom In"
            >
              <ZoomIn size={18} />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          
          <button
            onClick={() => handleExportPDF(true)}
            className="flex items-center gap-2 px-3 py-1.5 text-gray-600 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition font-bold text-xs uppercase tracking-wider"
          >
            <ExternalLink size={16} />
            Browser View
          </button>
          
          <button
            onClick={handleExportDoc}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md shadow-blue-200 font-bold text-xs uppercase tracking-widest"
          >
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 items-start">

        {/* ---------------- MAIN READER ---------------- */}
        <div className="lg:col-span-3">
          <motion.div
            style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
            className="transition-transform duration-200"
          >
            <article
              id="document-content"
              className="bg-white rounded-sm p-12 sm:p-20 border border-gray-300 shadow-2xl mx-auto ring-1 ring-gray-200 print:shadow-none print:border-none print:p-0"
              style={{ minHeight: '297mm', maxWidth: '210mm' }}
            >

            {/* Header */}
            <header className="mb-8">
              <div className="flex flex-wrap gap-3 mb-5">

                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                  {doc.category}
                </span>

                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs flex items-center gap-1">
                  <Tag size={12} />
                  {featureName}
                </span>

                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs flex items-center gap-1">
                  <Clock size={12} />
                  v{doc.version}.0
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                {doc.title}
              </h1>

              <div className="flex items-center gap-3 text-sm text-gray-500 border-b pb-5">
                <History size={16} />
                <span>
                  Last updated:{" "}
                  {new Date(doc.updated_at).toLocaleDateString()}
                </span>
              </div>
            </header>

            {/* Content */}
            <div className="prose max-w-none text-gray-700 leading-relaxed">
              {doc.content.split('\n').map((para, i) => (
                <p key={i} className="mb-4">
                  {para}
                </p>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-12 pt-6 border-t flex justify-between text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Info size={16} />
                End of Document
              </div>

              <div>ID: {doc.id}</div>
            </div>
          </article>
          </motion.div>
        </div>

        {/* ---------------- SIDEBAR ---------------- */}
        <div className="space-y-6">

          {/* Version Card */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">

            <h4 className="text-gray-900 font-semibold text-sm mb-4 flex items-center gap-2">
              <Layers size={16} className="text-blue-600" />
              Version History
            </h4>

            <button
              onClick={() => setShowHistory(!showHistory)}
              className="w-full flex justify-between items-center p-4 rounded-lg border border-gray-200 hover:bg-blue-50 transition"
            >
              <div>
                <p className="text-lg font-bold text-gray-900">
                  {versions.length + 1}
                </p>
                <p className="text-xs text-gray-500">
                  Total Versions
                </p>
              </div>

              <ChevronRight
                className={`transition ${showHistory ? "rotate-90" : ""}`}
              />
            </button>

            <AnimatePresence>
              {showHistory && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden mt-4"
                >
                  <div className="space-y-3 text-sm">

                    <div className="text-blue-600 font-semibold">
                      Current (v{doc.version})
                    </div>

                    {versions.map((v, idx) => (
                      <div key={idx} className="text-gray-600">
                        v{v.version} —{" "}
                        {new Date(v.updated_at).toLocaleDateString()}
                      </div>
                    ))}

                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
            <div className="flex items-center gap-2 text-blue-700 mb-3">
              <AlertCircle size={16} />
              <span className="text-sm font-semibold">
                Internal Use Only
              </span>
            </div>

            <p className="text-sm text-gray-600">
              This document is restricted to authorized users and
              should not be shared externally.
            </p>
          </div>

        </div>
      </div>
    </div>
    </div>
  );
};

export default DocumentDetail;