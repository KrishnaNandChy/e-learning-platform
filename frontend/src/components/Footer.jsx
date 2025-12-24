import { Link } from 'react-router-dom';
import { 
  GraduationCap, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Youtube,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { label: 'About Us', path: '/about' },
      { label: 'Careers', path: '/careers' },
      { label: 'Press', path: '/press' },
      { label: 'Blog', path: '/blog' },
      { label: 'Affiliates', path: '/affiliates' },
    ],
    community: [
      { label: 'Become an Instructor', path: '/teach' },
      { label: 'Partner with Us', path: '/partners' },
      { label: 'Student Stories', path: '/stories' },
      { label: 'Community Guidelines', path: '/guidelines' },
    ],
    support: [
      { label: 'Help Center', path: '/help' },
      { label: 'Contact Us', path: '/contact' },
      { label: 'FAQs', path: '/faqs' },
      { label: 'Accessibility', path: '/accessibility' },
    ],
    legal: [
      { label: 'Terms of Service', path: '/terms' },
      { label: 'Privacy Policy', path: '/privacy' },
      { label: 'Cookie Policy', path: '/cookies' },
      { label: 'Sitemap', path: '/sitemap' },
    ],
  };

  const socialLinks = [
    { icon: Facebook, label: 'Facebook', href: 'https://facebook.com' },
    { icon: Twitter, label: 'Twitter', href: 'https://twitter.com' },
    { icon: Instagram, label: 'Instagram', href: 'https://instagram.com' },
    { icon: Linkedin, label: 'LinkedIn', href: 'https://linkedin.com' },
    { icon: Youtube, label: 'YouTube', href: 'https://youtube.com' },
  ];

  return (
    <footer className="footer">
      {/* Main Footer */}
      <div className="footer-main">
        <div className="footer-container">
          {/* Brand Section */}
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <div className="footer-logo-icon">
                <GraduationCap size={24} />
              </div>
              <span className="footer-logo-text">EduLearn</span>
            </Link>
            <p className="footer-description">
              Transform your future with world-class online courses from expert instructors. 
              Learn at your own pace, anywhere, anytime.
            </p>
            <div className="footer-contact">
              <a href="mailto:support@edulearn.com" className="footer-contact-item">
                <Mail size={16} />
                <span>support@edulearn.com</span>
              </a>
              <a href="tel:+1234567890" className="footer-contact-item">
                <Phone size={16} />
                <span>+1 (234) 567-890</span>
              </a>
              <div className="footer-contact-item">
                <MapPin size={16} />
                <span>San Francisco, CA</span>
              </div>
            </div>
          </div>

          {/* Links Sections */}
          <div className="footer-links-grid">
            <div className="footer-links-section">
              <h4 className="footer-links-title">Company</h4>
              <ul className="footer-links-list">
                {footerLinks.company.map((link) => (
                  <li key={link.path}>
                    <Link to={link.path} className="footer-link">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-links-section">
              <h4 className="footer-links-title">Community</h4>
              <ul className="footer-links-list">
                {footerLinks.community.map((link) => (
                  <li key={link.path}>
                    <Link to={link.path} className="footer-link">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-links-section">
              <h4 className="footer-links-title">Support</h4>
              <ul className="footer-links-list">
                {footerLinks.support.map((link) => (
                  <li key={link.path}>
                    <Link to={link.path} className="footer-link">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-links-section">
              <h4 className="footer-links-title">Legal</h4>
              <ul className="footer-links-list">
                {footerLinks.legal.map((link) => (
                  <li key={link.path}>
                    <Link to={link.path} className="footer-link">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="footer-bottom">
        <div className="footer-container footer-bottom-content">
          <p className="footer-copyright">
            © {currentYear} EduLearn. All rights reserved.
          </p>
          <div className="footer-social">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-link"
                aria-label={social.label}
              >
                <social.icon size={18} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
