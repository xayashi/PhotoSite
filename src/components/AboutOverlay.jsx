import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, MapPin, Calendar, ArrowRight } from 'lucide-react';
import { siteConfig } from '../config';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import OptimizedImage from './OptimizedImage';

const AboutOverlay = ({ onClose }) => {
  const [visible, setVisible] = useState(false);
  const { about } = siteConfig;
  const navigate = useNavigate();
  const trapRef = useFocusTrap(visible);
  useDocumentTitle('About — 林');

  useEffect(() => {
    setTimeout(() => setVisible(true), 50);
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 500);
  };

  return (
    <div
      ref={trapRef}
      role="dialog"
      aria-modal="true"
      aria-label="About"
      className={`fixed inset-0 z-[100] bg-[#121212] text-white overflow-y-auto transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]
      ${visible ? 'opacity-100' : 'opacity-0'}`}
    >
      {/* Close Button */}
      <button
        onClick={handleClose}
        aria-label="Close"
        className="fixed top-6 right-6 md:top-8 md:right-8 z-50 p-2 hover:text-crimson transition-colors"
      >
        <X size={24} />
      </button>

      {/* Content */}
      <div className="min-h-screen flex flex-col md:flex-row">
        {/* Portrait Side */}
        <div className={`w-full md:w-1/2 h-[50vh] md:h-screen relative overflow-hidden transition-all duration-1000 delay-100 ${visible ? 'opacity-100' : 'opacity-0'}`}>
          <OptimizedImage
            src={about.portrait}
            alt="Photographer portrait"
            className="w-full h-full"
            imgClassName={`transition-transform duration-[2000ms] ${visible ? 'scale-100' : 'scale-110'}`}
            sizes="(min-width: 768px) 50vw, 100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#0a0a0a] via-transparent to-transparent"></div>
        </div>

        {/* Bio Side */}
        <div className={`w-full md:w-1/2 flex items-center justify-center p-8 md:p-16 transition-all duration-1000 delay-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="max-w-lg">
            <span className="text-xs font-mono tracking-[0.3em] text-crimson uppercase mb-6 block">
              About
            </span>

            <h2 className="text-4xl md:text-6xl font-serif mb-8 leading-tight">
              {about.headline}
            </h2>

            <div className="space-y-6 text-stone-400 leading-relaxed">
              {about.bio.split('\n\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            {/* Meta Info */}
            <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row gap-6">
              <div className="flex items-center gap-2 text-sm text-stone-500">
                <MapPin size={14} className="text-crimson" />
                {about.location}
              </div>
              <div className="flex items-center gap-2 text-sm text-stone-500">
                <Calendar size={14} className="text-crimson" />
                {about.availability}
              </div>
            </div>

            {/* Get in Touch Button */}
            <div className="mt-8">
              <button
                onClick={() => navigate('/contact')}
                className="group inline-flex items-center gap-2 text-sm font-mono tracking-widest uppercase text-crimson hover:text-white transition-colors"
              >
                Get in Touch
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutOverlay;

