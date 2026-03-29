import { useEffect, useState } from 'react';
import api from '@/lib/api';
import StatsBar from '@/components/StatsBar';
import { AlertTriangle, TrendingUp, FileWarning, Brain, Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Anomaly {
  id: string;
  type: string;
  severity: string;
  description: string;
  status: string;
  detectedAt?: string;
}

const features = [
  { icon: FileWarning, title: 'Duplicate Payment Detection', desc: 'ML agents identify duplicate invoices and payments automatically across vendors.', color: 'text-destructive' },
  { icon: TrendingUp, title: 'Cost Spike Alerts', desc: 'Real-time detection of unusual spending patterns and sudden cost increases.', color: 'text-warning' },
  { icon: Brain, title: 'SLA Breach Prevention', desc: 'AI-driven proactive alerts before service level agreements are violated.', color: 'text-accent' },
];

const severityClass = (s: string) => {
  const map: Record<string, string> = { CRITICAL: 'severity-critical', HIGH: 'severity-high', MEDIUM: 'severity-medium', LOW: 'severity-low' };
  return map[s] || 'severity-low';
};

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

const Dashboard = () => {
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/anomalies')
      .then((r) => setAnomalies(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const chartData = anomalies.reduce<Record<string, number>>((acc, a) => {
    const date = a.detectedAt ? new Date(a.detectedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : 'Unknown';
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});
  const chartArray = Object.entries(chartData).map(([date, count]) => ({ date, count }));

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
        <div className="container mx-auto px-4 py-20 md:py-28 relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
                <Sparkles className="w-3.5 h-3.5" /> AI-Powered Financial Intelligence
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold leading-[1.1] mb-5">
                Smart Financial<br />
                <span className="text-primary">Assistant</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg mb-8 leading-relaxed">
                Automatically detect duplicate payments, cost spikes, and SLA breaches before they hurt your bottom line.
              </p>
              <div className="flex flex-wrap gap-3">
                <a href="/upload" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-7 py-3 rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 hover:-translate-y-0.5">
                  Get Started <ArrowRight className="w-4 h-4" />
                </a>
                <a href="/approvals" className="inline-flex items-center gap-2 bg-card text-foreground border border-border px-7 py-3 rounded-xl font-semibold text-sm hover:bg-secondary transition-all duration-300">
                  View Approvals
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40, rotateY: -10 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hidden md:block"
            >
              {/* Floating AI Assistant Visual */}
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl blur-2xl" />
                <div className="relative bg-card rounded-2xl border border-border p-6 shadow-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Brain className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm font-bold">AI Analysis Engine</div>
                      <div className="text-xs text-accent font-medium flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" /> Active
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {['Scanning for duplicate payments...', 'Checking vendor cost patterns...', 'Monitoring SLA compliance...'].map((t, i) => (
                      <motion.div
                        key={t}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 + i * 0.3, duration: 0.4 }}
                        className="flex items-center gap-2 text-xs bg-secondary rounded-lg px-3 py-2"
                      >
                        <span className="w-1 h-1 rounded-full bg-primary" />
                        <span className="text-muted-foreground">{t}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
                {/* Floating badge */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                  className="absolute -top-4 -right-4 bg-accent text-accent-foreground text-xs font-bold px-3 py-1.5 rounded-full shadow-lg"
                >
                  3 Alerts
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <StatsBar />

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {features.map((f) => (
            <motion.div key={f.title} variants={item} className="feature-card group cursor-pointer">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <f.icon className={`w-6 h-6 ${f.color}`} />
              </div>
              <h3 className="text-lg font-bold mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Anomalies Feed */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-2xl font-bold">Live Anomalies Feed</h2>
          <span className="flex items-center gap-1.5 text-xs font-medium text-accent bg-accent/10 px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" /> Live
          </span>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="feature-card animate-pulse">
                <div className="h-4 bg-secondary rounded w-1/3 mb-3" />
                <div className="h-3 bg-secondary rounded w-full mb-2" />
                <div className="h-3 bg-secondary rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : anomalies.length === 0 ? (
          <div className="text-center text-muted-foreground py-12">No anomalies detected yet.</div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {anomalies.slice(0, 9).map((a) => (
              <motion.div key={a.id} variants={item} className="feature-card">
                <div className="flex gap-2 mb-3">
                  <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">{a.type}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${severityClass(a.severity)}`}>{a.severity}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{a.description}</p>
                <span className="text-xs font-medium text-muted-foreground">{a.status}</span>
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      {/* Chart */}
      {chartArray.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="container mx-auto px-4 py-8"
        >
          <h2 className="text-2xl font-bold mb-6">Anomalies Over Time</h2>
          <div className="feature-card" style={{ height: 350 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartArray}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(221, 83%, 53%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(221, 83%, 53%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid hsl(214, 32%, 91%)', fontSize: 13 }} />
                <Area type="monotone" dataKey="count" stroke="hsl(221, 83%, 53%)" fill="url(#colorCount)" strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.section>
      )}
    </div>
  );
};

export default Dashboard;
