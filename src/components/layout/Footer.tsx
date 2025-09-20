import { ArrowUpRight, EnvelopeSimple, InstagramLogo, XLogo } from '@phosphor-icons/react';
import React, { useState } from 'react';
import FooterLogo from '@/assets/images/footerLogo.png';
import Image from 'next/image';
import { Button } from '@/components/ui';

interface FooterProps {
  bannerDisplayed?: 'subscribe' | 'enquire';
}

const Footer: React.FC<FooterProps> = React.memo(({ bannerDisplayed = 'subscribe' }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [email, setEmail] = useState('');
  
  const openWindow = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);
  
  const handleSubscribe = () => {
    // TODO: Implement newsletter subscription API call
    setEmail('');
  };

  return (
    <footer className="bg-gray-900 text-white py-12">
      {/* Banner Section */}
      {bannerDisplayed === 'enquire' ? (
        <EnquireBanner onEnquire={openWindow} />
      ) : (
        <NewsletterBanner 
          email={email} 
          onEmailChange={setEmail} 
          onSubscribe={handleSubscribe} 
        />
      )}
      
      {/* Divider */}
      <hr className="mx-8 border-gray-700" />
      
      {/* Footer Content */}
      <FooterContent />
      
    </footer>
  );
});

Footer.displayName = 'Footer';

// Sub-components for better organization
interface EnquireBannerProps {
  onEnquire: () => void;
}

const EnquireBanner: React.FC<EnquireBannerProps> = React.memo(({ onEnquire }) => (
  <div className="container mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center mb-12 space-y-4 md:space-y-0">
    <h2 className="text-2xl md:text-3xl font-bold text-center md:text-left">
      Enquire now for this trip
    </h2>
    <div className="flex justify-center items-center">
      <button
        onClick={onEnquire}
        className="text-heavy-metal bg-milk-white rounded-full p-3 flex justify-center items-center hover:scale-110 transition-transform duration-200"
        aria-label="Open enquiry form"
      >
        <ArrowUpRight size={32} weight="regular" />
      </button>
    </div>
  </div>
));

EnquireBanner.displayName = 'EnquireBanner';

interface NewsletterBannerProps {
  email: string;
  onEmailChange: (email: string) => void;
  onSubscribe: () => void;
}

const NewsletterBanner: React.FC<NewsletterBannerProps> = React.memo(({ email, onEmailChange, onSubscribe }) => (
  <div className="container mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center mb-12 space-y-6 md:space-y-0">
    <h2 className="text-2xl md:text-3xl font-bold text-center md:text-left">
      Subscribe to our newsletter
    </h2>
    <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => onEmailChange(e.target.value)}
        className="px-6 py-3 w-full sm:w-64 md:w-80 rounded-full bg-white text-gray-900 border-none focus:outline-none focus:ring-2 focus:ring-carrot-orange"
      />
      <Button
        onClick={onSubscribe}
        className="px-8 py-3 rounded-full shadow-lg"
        disabled={!email.trim()}
      >
        Subscribe
      </Button>
    </div>
  </div>
));

NewsletterBanner.displayName = 'NewsletterBanner';

const FooterContent: React.FC = React.memo(() => {
  const footerLinks = {
    resources: [
      { label: 'Hotels', href: '/hotels' },
      { label: 'Tours and Packages', href: '/tours' },
      { label: 'Air Charter Facility', href: '/air-charter' },
      { label: 'Transportation', href: '/transport' },
      { label: 'Plan My Tour', href: '/plan-tour' }
    ],
    about: [
      { label: 'Our Services', href: '/services' },
      { label: 'Recognition and Awards', href: '/awards' },
      { label: 'Our Partners', href: '/partners' },
      { label: 'Contact Us', href: '/contact' },
      { label: 'Help & FAQ', href: '/help' }
    ],
    getInvolved: [
      { label: 'Subscribe our Newsletter', href: '/newsletter' },
      { label: 'Volunteer', href: '/volunteer' },
      { label: 'Careers', href: '/careers' },
      { label: 'Feedback', href: '/feedback' }
    ]
  };

  const socialLinks = [
    { icon: <XLogo size={32} />, href: '#', label: 'Twitter' },
    { icon: <InstagramLogo size={32} />, href: '#', label: 'Instagram' },
    { icon: <EnvelopeSimple size={32} />, href: '#', label: 'Email' }
  ];

  return (
    <div className="container mx-auto px-4 md:px-8 mt-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Company Info */}
        <div className="md:col-span-1">
          <Image
            src={FooterLogo}
            alt="WaytoIndia Logo"
            className="mb-4"
            priority
          />
          <p className="text-sm text-gray-300 leading-relaxed">
            Way to India has created a niche for itself in the travel industry in India by providing customized tour options to discerning tourists.
          </p>
          <p className="text-xs mt-8 text-gray-400">
            © 2014 - 2024 WaytoIndia. All Rights Reserved.
          </p>
        </div>

        {/* Links Sections */}
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-8">
          <FooterLinkSection title="Resources" links={footerLinks.resources} />
          <FooterLinkSection title="About" links={footerLinks.about} />
          <FooterLinkSection title="Get Involved" links={footerLinks.getInvolved} />
        </div>

        {/* Social Links */}
        <div className="md:col-span-1 flex flex-row md:flex-col justify-center md:justify-start items-center md:items-start gap-4">
          {socialLinks.map((social, index) => (
            <a
              key={index}
              href={social.href}
              className="text-white hover:text-gray-400 hover:scale-110 transition-all duration-200"
              aria-label={social.label}
            >
              {social.icon}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
});

FooterContent.displayName = 'FooterContent';

interface FooterLinkSectionProps {
  title: string;
  links: Array<{ label: string; href: string }>;
}

const FooterLinkSection: React.FC<FooterLinkSectionProps> = React.memo(({ title, links }) => (
  <div>
    <h3 className="font-bold mb-4 text-lg">{title}</h3>
    <ul className="space-y-2">
      {links.map((link, index) => (
        <li key={index}>
          <a
            href={link.href}
            className="text-sm text-gray-300 hover:text-white transition-colors duration-200"
          >
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  </div>
));

FooterLinkSection.displayName = 'FooterLinkSection';

export default Footer;
