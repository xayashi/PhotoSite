import React, { useEffect, useState } from 'react';
import { X, Calendar, ChevronRight } from 'lucide-react';

const ArchiveOverlay = ({ onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 50);
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 500);
  };

  // Placeholder seasons/archives - can be expanded later
  const seasons = [
    { year: 2024, title: "Autumn Collection", count: 12 },
    { year: 2024, title: "Summer Stories", count: 8 },
    { year: 2023, title: "Winter Chronicles", count: 15 },
    { year: 2023, title: "Spring Awakening", count: 10 },
    { year: 2022, title: "Year in Review", count: 24 },
  ];

  return (
    <div 
      className={`fixed inset-0 z-[100] bg-[#121212] text-white overflow-y-auto transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]
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
      <div className="min-h-screen flex flex-col items-center justify-center p-8 md:p-16">
        <div className="max-w-2xl w-full">
          <span className="text-xs font-mono tracking-[0.3em] text-crimson uppercase mb-6 block">
            Archive
          </span>
          
          <h2 className="text-4xl md:text-6xl font-serif mb-12 leading-tight">
            Additional Seasons
          </h2>

          {/* Season List */}
          <div className="space-y-4">
            {seasons.map((season, index) => (
              <button
                key={index}
                className={`w-full group flex items-center justify-between p-6 border border-white/10 
                  hover:border-crimson/50 hover:bg-white/5 transition-all duration-300
                  ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                style={{ transitionDelay: `${200 + index * 100}ms` }}
              >
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2 text-sm text-stone-500">
                    <Calendar size={14} className="text-crimson" />
                    {season.year}
                  </div>
                  <span className="text-xl font-serif text-white/80 group-hover:text-white transition-colors">
                    {season.title}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-stone-500">{season.count} photos</span>
                  <ChevronRight size={18} className="text-stone-600 group-hover:text-crimson group-hover:translate-x-1 transition-all" />
                </div>
              </button>
            ))}
          </div>

          {/* Coming Soon Message */}
          <p className="mt-12 text-center text-stone-500 text-sm">
            More seasons coming soon...
          </p>
        </div>
      </div>
    </div>
  );
};

export default ArchiveOverlay;
