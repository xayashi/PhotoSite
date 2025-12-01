import React, { useEffect, useState } from 'react';
import { X, Mail, Instagram, Twitter, Linkedin, ExternalLink } from 'lucide-react';
import { siteConfig } from '../config';

const ContactOverlay = ({ onClose }) => {
  const [visible, setVisible] = useState(false);
  const { email, social } = siteConfig;

  useEffect(() => {
    setTimeout(() => setVisible(true), 50);
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 500);
  };

  // Filter out empty social links
  const activeSocials = Object.entries(social).filter(([_, url]) => url);

  const socialIcons = {
    instagram: Instagram,
    twitter: Twitter,
    linkedin: Linkedin,
    behance: ExternalLink,
    dribbble: ExternalLink,
  };

  return (
    <div 
      className={`fixed inset-0 z-[100] bg-[#0a0a0a] text-white overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]
      ${visible ? 'opacity-100' : 'opacity-0'}`}
    >
      {/* Close Button */}
      <button 
        onClick={handleClose} 
        className="fixed top-6 right-6 md:top-8 md:right-8 z-50 p-2 hover:text-crimson transition-colors"
      >
        <X size={24} />
      </button>

      {/* Content */}
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className={`text-center transition-all duration-1000 delay-100 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <span className="text-xs font-mono tracking-[0.3em] text-crimson uppercase mb-8 block">
            Get in Touch
          </span>
          
          <h2 className="text-5xl md:text-8xl font-serif mb-6">
            Let's work together
          </h2>
          
          <p className="text-stone-500 max-w-md mx-auto mb-12">
            Available for commercial projects, collaborations, and creative partnerships.
          </p>

          {/* Email Link */}
          <a 
            href={`mailto:${email}`}
            className="group inline-flex items-center gap-3 text-2xl md:text-4xl font-mono hover:text-crimson transition-colors mb-16"
          >
            <Mail size={28} className="opacity-50 group-hover:opacity-100 transition-opacity" />
            {email}
          </a>

          {/* Social Links */}
          {activeSocials.length > 0 && (
            <div className={`flex justify-center gap-6 transition-all duration-1000 delay-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              {activeSocials.map(([platform, url]) => {
                const Icon = socialIcons[platform] || ExternalLink;
                return (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col items-center gap-2"
                  >
                    <div className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center group-hover:border-crimson group-hover:bg-crimson/10 transition-all">
                      <Icon size={20} className="group-hover:text-crimson transition-colors" />
                    </div>
                    <span className="text-xs uppercase tracking-widest text-stone-600 group-hover:text-crimson transition-colors">
                      {platform}
                    </span>
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Footer Text */}
      <div className="absolute bottom-8 left-0 right-0 flex flex-col items-center gap-2">
        <img 
          src="/logo.png" 
          alt="Logo"
          className="h-8 w-auto invert opacity-30"
        />
        <span className="text-xs text-stone-700">© {new Date().getFullYear()}</span>
      </div>
    </div>
  );
};

export default ContactOverlay;

