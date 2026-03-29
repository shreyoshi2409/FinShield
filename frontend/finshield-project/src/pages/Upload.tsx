import { useState, useRef } from 'react';
import api from '@/lib/api';
import { Upload as UploadIcon, CheckCircle, XCircle, FileText, CloudUpload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Upload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const f = e.dataTransfer.files[0];
    if (f) setFile(f);
  };

  const handleSubmit = async () => {
    if (!file) return;
    setLoading(true);
    setError('');
    setSuccess(false);
    try {
      const fd = new FormData();
      fd.append('file', file);
      await api.post('/api/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setSuccess(true);
      setFile(null);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl md:text-4xl font-extrabold mb-2 text-center">Upload Transaction File</h1>
        <p className="text-center text-muted-foreground mb-8">Our AI agents will analyze your data for anomalies</p>

        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="feature-card text-center py-12"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
              >
                <CheckCircle className="w-20 h-20 text-accent mx-auto mb-4" />
              </motion.div>
              <h2 className="text-xl font-bold mb-2">Pipeline Triggered!</h2>
              <p className="text-muted-foreground">ML agents are analyzing your data.</p>
              <button onClick={() => setSuccess(false)} className="mt-6 bg-primary text-primary-foreground px-6 py-2.5 rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-primary/25 transition-all duration-300">
                Upload Another
              </button>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="feature-card">
              <div
                className={`drop-zone ${dragActive ? 'border-primary bg-primary/5 scale-[1.02]' : ''} transition-transform`}
                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
              >
                <input ref={inputRef} type="file" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                <motion.div animate={{ y: dragActive ? -5 : 0 }} transition={{ duration: 0.2 }}>
                  <CloudUpload className="w-14 h-14 text-primary/40 mx-auto mb-4" />
                </motion.div>
                <p className="text-muted-foreground font-medium">Drag & drop your file here, or click to browse</p>
                <p className="text-xs text-muted-foreground/60 mt-2">Supports CSV, XLSX, JSON</p>
              </div>

              <AnimatePresence>
                {file && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="flex items-center gap-3 mt-4 p-3 bg-secondary rounded-lg">
                      <FileText className="w-5 h-5 text-primary" />
                      <span className="text-sm font-medium flex-1 truncate">{file.name}</span>
                      <button onClick={(e) => { e.stopPropagation(); setFile(null); }} className="text-muted-foreground hover:text-destructive transition-colors">
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {error && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
                  {error}
                </motion.div>
              )}

              <button
                onClick={handleSubmit}
                disabled={!file || loading}
                className="mt-6 w-full bg-primary text-primary-foreground py-3 rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Uploading...
                  </span>
                ) : 'Upload & Analyze'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Upload;
