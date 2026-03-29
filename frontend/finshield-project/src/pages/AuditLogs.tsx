import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Search } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

interface AuditLog {
  id: string;
  createdAt: string;
  eventType: string;
  entityType: string;
  entityId: string;
  description: string;
  performedBy: string;
}

const AuditLogs = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    api.get('/api/audit-logs')
      .then((r) => setLogs(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter
    ? logs.filter((l) => l.eventType.toLowerCase().includes(filter.toLowerCase()))
    : logs;

  return (
    <div className="container mx-auto px-4 py-16">
      <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl md:text-4xl font-extrabold mb-8">
        Audit Trail
      </motion.h1>

      <div className="flex items-center gap-3 mb-6 max-w-md">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Filter by event type..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-input bg-card text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
          />
        </div>
      </div>

      {loading ? (
        <div className="feature-card animate-pulse space-y-3">
          {[1, 2, 3, 4, 5].map((n) => (
            <div key={n} className="h-10 bg-secondary rounded" />
          ))}
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="overflow-x-auto rounded-2xl border border-border shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-primary text-primary-foreground">
                <th className="text-left px-4 py-3.5 font-semibold">Timestamp</th>
                <th className="text-left px-4 py-3.5 font-semibold">Event Type</th>
                <th className="text-left px-4 py-3.5 font-semibold">Entity</th>
                <th className="text-left px-4 py-3.5 font-semibold">Entity ID</th>
                <th className="text-left px-4 py-3.5 font-semibold">Description</th>
                <th className="text-left px-4 py-3.5 font-semibold">Performed By</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((log, i) => (
                <motion.tr
                  key={log.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className={`${i % 2 === 0 ? 'bg-card' : 'bg-primary/[0.03]'} hover:bg-primary/5 transition-colors`}
                >
                  <td className="px-4 py-3 whitespace-nowrap">
                    {format(new Date(log.createdAt), 'dd MMM yyyy, HH:mm')}
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">{log.eventType}</span>
                  </td>
                  <td className="px-4 py-3">{log.entityType}</td>
                  <td className="px-4 py-3">{log.entityId}</td>
                  <td className="px-4 py-3 text-muted-foreground">{log.description}</td>
                  <td className="px-4 py-3 font-medium">{log.performedBy}</td>
                </motion.tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="text-center py-8 text-muted-foreground">No logs found.</td></tr>
              )}
            </tbody>
          </table>
        </motion.div>
      )}
    </div>
  );
};

export default AuditLogs;