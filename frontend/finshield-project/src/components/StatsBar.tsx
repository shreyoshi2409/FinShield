import { useEffect, useState, useRef } from 'react';
import api from '@/lib/api';
import { DollarSign, AlertTriangle, TrendingUp, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface ImpactSummary {
  totalMoneyAtRisk: number;
  totalMoneySaveable: number;
  totalAnomalies: number;
  totalDecisionsPending: number;
}

const AnimatedCounter = ({ value, prefix = '' }: { value: number; prefix?: string }) => {
  const [display, setDisplay] = useState(0);
  const ref = useRef<number>();

  useEffect(() => {
    const duration = 1200;
    const start = performance.now();
    const from = 0;

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(from + (value - from) * eased));
      if (progress < 1) ref.current = requestAnimationFrame(tick);
    };

    ref.current = requestAnimationFrame(tick);
    return () => { if (ref.current) cancelAnimationFrame(ref.current); };
  }, [value]);

  return <span>{prefix}{display.toLocaleString()}</span>;
};

const StatsBar = () => {
  const [data, setData] = useState<ImpactSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/impact-summary')
      .then((r) => setData(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const stats = [
    { icon: DollarSign, label: 'Money At Risk', value: data?.totalMoneyAtRisk, prefix: '₹' },
    { icon: TrendingUp, label: 'Money Saveable', value: data?.totalMoneySaveable, prefix: '₹' },
    { icon: AlertTriangle, label: 'Anomalies Detected', value: data?.totalAnomalies, prefix: '' },
    { icon: Clock, label: 'Pending Approvals', value: data?.totalDecisionsPending, prefix: '' },
  ];

  return (
    <div className="stats-bar">
      <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="text-center"
          >
            <s.icon className="w-6 h-6 mx-auto mb-2 opacity-80" />
            <div className="text-2xl md:text-3xl font-extrabold">
              {loading || s.value == null ? (
                <span className="inline-block w-16 h-8 bg-primary-foreground/20 rounded animate-pulse" />
              ) : (
                <AnimatedCounter value={s.value} prefix={s.prefix} />
              )}
            </div>
            <div className="text-sm opacity-80 mt-1">{s.label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default StatsBar;