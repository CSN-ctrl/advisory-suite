import { Link } from "react-router-dom";
import logoDark from "@/assets/logo-dark.png";

const Footer = () => (
  <footer className="relative bg-foreground text-background">
    <div className="h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />

    <div className="container py-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div>
          <img src={logoDark} alt="DestinyQ" className="h-8 w-auto mb-4 invert" />
          <p className="text-background/60 text-sm font-body leading-relaxed max-w-xs">
            Strategic advisory for founders, executives, and professionals navigating complex decisions.
          </p>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-[0.2em] text-accent/80 mb-5 font-body font-bold">Navigation</h4>
          <div className="flex flex-col gap-3">
            {[
              { label: "About", path: "/mission" },
              { label: "Applications", path: "/applications" },
              { label: "Who Benefits", path: "/who-benefits" },
              { label: "Advisory", path: "/advisory" },
              { label: "Apply / Book", path: "/apply" },
            ].map((link) => (
              <Link
                key={link.label}
                to={link.path}
                className="text-sm text-background/50 hover:text-accent transition-colors duration-300 font-body w-fit"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-[0.2em] text-accent/80 mb-5 font-body font-bold">Contact</h4>
          <div className="flex flex-col gap-3 text-sm text-background/50 font-body">
            <a href="mailto:hello@meridian.co" className="hover:text-accent transition-colors duration-300 w-fit">
              hello@meridian.co
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent transition-colors duration-300 w-fit"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent mt-16 mb-8" />
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-background/30 font-body">
        <span>© {new Date().getFullYear()} Meridian Advisory. All rights reserved.</span>
        <div className="flex gap-8">
          <Link to="/privacy" className="hover:text-accent/60 transition-colors duration-300">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-accent/60 transition-colors duration-300">Terms of Service</Link>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
