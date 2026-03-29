import { useEffect, useState, useCallback } from 'react';
import api from '@/lib/api';
import { CheckCircle, XCircle, Inbox } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface Decision {
  id: string;
  anomalyType: string;
  severity: string;
  recommendedAction: string;
  moneyAtRisk: number;
  moneySaveable: number;
}

const severityClass = (s: string) => {
  const map: Record<string, string> = { CRITICAL: 'severity-critical', HIGH: 'severity-high', MEDIUM: 'severity-medium', LOW: 'severity-low' };
  return map[s] || 'severity-low';
};

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

const Approvals = () => {
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState<string | null>(null);

  const fetchDecisions = useCallback(() => {
    setLoading(true);
    api.get('/api/decisions/pending')
      .then((r) => setDecisions(r.data))
      .catch(() => toast.error('Failed to load pending decisions'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchDecisions(); }, [fetchDecisions]);

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    setActing(id);
    try {
      await api.post(`/api/decisions/${id}/${action}`);
      toast.success(`Decision ${action}d successfully`);
      fetchDecisions();
    } catch {
      toast.error(`Failed to ${action} decision`);
    } finally {
      setActing(null);
    }
  };

  if (loading) return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-3xl md:text-4xl font-extrabold mb-8">Pending Approvals</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="feature-card animate-pulse">
            <div className="h-4 bg-secondary rounded w-1/3 mb-4" />
            <div className="h-3 bg-secondary rounded w-full mb-2" />
            <div className="h-3 bg-secondary rounded w-2/3 mb-4" />
            <div className="flex gap-3">
              <div className="h-10 bg-secondary rounded flex-1" />
              <div className="h-10 bg-secondary rounded flex-1" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-16">
      <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl md:text-4xl font-extrabold mb-8">
        Pending Approvals
      </motion.h1>

      {decisions.length === 0 ? (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="feature-card text-center py-16">
          <Inbox className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">All Clear!</h2>
          <p className="text-muted-foreground">No pending approvals at the moment.</p>
        </motion.div>
      ) : (
        <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence>
            {decisions.map((d) => (
              <motion.div key={d.id} variants={item} layout exit={{ opacity: 0, scale: 0.9 }} className="feature-card">
                <div className="flex gap-2 mb-3">
                  <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">{d.anomalyType}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${severityClass(d.severity)}`}>{d.severity}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{d.recommendedAction}</p>
                <div className="flex gap-6 mb-4">
                  <div>
                    <span className="text-xs text-muted-foreground">Money At Risk</span>
                    <div className="text-lg font-bold text-destructive">₹{d.moneyAtRisk.toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">Money Saveable</span>
                    <div className="text-lg font-bold text-accent">₹{d.moneySaveable.toLocaleString()}</div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleAction(d.id, 'approve')}
                    disabled={acting === d.id}
                    className="flex-1 flex items-center justify-center gap-2 bg-accent text-accent-foreground py-2.5 rounded-lg text-sm font-semibold hover:shadow-lg hover:shadow-accent/25 transition-all duration-300 disabled:opacity-50"
                  >
                    <CheckCircle className="w-4 h-4" /> Approve
                  </button>
                  <button
                    onClick={() => handleAction(d.id, 'reject')}
                    disabled={acting === d.id}
                    className="flex-1 flex items-center justify-center gap-2 bg-destructive text-destructive-foreground py-2.5 rounded-lg text-sm font-semibold hover:shadow-lg hover:shadow-destructive/25 transition-all duration-300 disabled:opacity-50"
                  >
                    <XCircle className="w-4 h-4" /> Reject
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

export default Approvals;
