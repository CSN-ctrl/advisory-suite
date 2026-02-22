import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="bg-background border-t border-primary/20">
    {/* Gold divider */}
    <div className="gold-line" />

    <div className="container py-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Brand */}
        <div>
          <h3 className="text-xl tracking-wide text-foreground mb-4">MERIDIAN</h3>
          <p className="text-muted-foreground text-sm font-body leading-relaxed">
            Strategic advisory for founders, executives, and professionals navigating complex decisions.
          </p>
        </div>

        {/* Links */}
        <div>
          <h4 className="text-xs uppercase tracking-[0.15em] text-primary mb-4 font-body font-bold">Navigation</h4>
          <div className="flex flex-col gap-2">
            {["Advisory", "Mission", "Insights", "Apply / Book"].map((label) => (
              <Link
                key={label}
                to={`/${label.toLowerCase().replace(" / ", "-").replace(" ", "-")}`}
                className="text-sm text-muted-foreground hover:text-primary transition-colors font-body"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-xs uppercase tracking-[0.15em] text-primary mb-4 font-body font-bold">Contact</h4>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground font-body">
            <a href="mailto:hello@meridian.co" className="hover:text-primary transition-colors">
              hello@meridian.co
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>

      <div className="gold-line mt-12 mb-6" />
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground font-body">
        <span>© {new Date().getFullYear()} Meridian Advisory. All rights reserved.</span>
        <div className="flex gap-6">
          <Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
