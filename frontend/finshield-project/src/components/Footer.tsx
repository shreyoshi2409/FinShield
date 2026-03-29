import logo from '@/assets/logo.png';

const Footer = () => (
  <footer className="bg-navy text-navy-foreground pt-12 pb-6 mt-20">
    <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
      <div>
        <div className="flex items-center gap-2.5 mb-3">
          <img src={logo} alt="FinShield" className="w-6 h-6 brightness-0 invert" />
          <span className="text-lg font-bold">FinShield</span>
        </div>
        <p className="text-sm opacity-70">Your AI-powered smart financial assistant for enterprise anomaly detection.</p>
      </div>
      {[
        { title: 'Product', links: ['Dashboard', 'Upload', 'Approvals', 'Audit Logs'] },
        { title: 'Company', links: ['About', 'Blog', 'Careers', 'Contact'] },
        { title: 'Legal', links: ['Privacy', 'Terms', 'Security'] },
      ].map((col) => (
        <div key={col.title}>
          <h4 className="font-semibold mb-3">{col.title}</h4>
          <ul className="space-y-2 text-sm opacity-70">
            {col.links.map((l) => (
              <li key={l} className="hover:opacity-100 cursor-pointer transition-opacity">{l}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
    <div className="container mx-auto px-4 border-t border-navy-foreground/20 pt-4 text-center text-xs opacity-50">
      © {new Date().getFullYear()} FinShield. All rights reserved.
    </div>
  </footer>
);

export default Footer;
