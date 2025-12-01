import React, { useEffect, useState } from 'react';
import { X, MapPin, Calendar } from 'lucide-react';
import { siteConfig } from '../config';

const AboutOverlay = ({ onClose }) => {
  const [visible, setVisible] = useState(false);
  const { about } = siteConfig;

  useEffect(() => {
    setTimeout(() => setVisible(true), 50);
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 500);
  };

  return (
    <div 
      className={`fixed inset-0 z-[100] bg-[#0a0a0a] text-white overflow-y-auto transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]
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
      <div className="min-h-screen flex flex-col md:flex-row">
        {/* Portrait Side */}
        <div className={`w-full md:w-1/2 h-[50vh] md:h-screen relative overflow-hidden transition-all duration-1000 delay-100 ${visible ? 'opacity-100' : 'opacity-0'}`}>
          <img 
            src={about.portrait} 
            alt="Photographer portrait"
            className={`w-full h-full object-cover transition-transform duration-[2000ms] ${visible ? 'scale-100' : 'scale-110'}`}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutOverlay;

