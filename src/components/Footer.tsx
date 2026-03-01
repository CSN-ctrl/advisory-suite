import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="relative">
    {/* Top gold line */}
    <div className="gold-line" />

    <div className="container py-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Brand */}
        <div>
          <h3 className="text-xl tracking-[0.1em] text-gold-gradient mb-4">MERIDIAN</h3>
          <p className="text-muted-foreground/70 text-sm font-body leading-relaxed max-w-xs">
            Strategic advisory for founders, executives, and professionals navigating complex decisions.
          </p>
        </div>

        {/* Links */}
        <div>
          <h4 className="text-xs uppercase tracking-[0.2em] text-primary/60 mb-5 font-body font-bold">Navigation</h4>
          <div className="flex flex-col gap-3">
            {[
              { label: "Advisory", path: "/advisory" },
              { label: "Mission", path: "/mission" },
              { label: "Insights", path: "/insights" },
              { label: "Apply / Book", path: "/apply" },
            ].map((link) => (
              <Link
                key={link.label}
                to={link.path}
                className="text-sm text-muted-foreground/60 hover:text-primary transition-colors duration-300 font-body w-fit"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-xs uppercase tracking-[0.2em] text-primary/60 mb-5 font-body font-bold">Contact</h4>
          <div className="flex flex-col gap-3 text-sm text-muted-foreground/60 font-body">
            <a href="mailto:hello@meridian.co" className="hover:text-primary transition-colors duration-300 w-fit">
              hello@meridian.co
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors duration-300 w-fit"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>

      <div className="gold-line mt-16 mb-8" />
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground/40 font-body">
        <span>© {new Date().getFullYear()} Meridian Advisory. All rights reserved.</span>
        <div className="flex gap-8">
          <Link to="/privacy" className="hover:text-primary/60 transition-colors duration-300">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-primary/60 transition-colors duration-300">Terms of Service</Link>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
