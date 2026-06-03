import React from 'react';
import { GraduationCap, Heart, Briefcase, Users, ArrowRight } from 'lucide-react';
import ContactForm from '../components/ContactForm';

const Home = ({ showToast }) => {
  const pillars = [
    {
      icon: <GraduationCap className="text-primary-400" size={24} />,
      title: "Education & Skills",
      description: "Providing girls and women with scholarships, vocational training, and modern digital literacy programs."
    },
    {
      icon: <Users className="text-accent-400" size={24} />,
      title: "Leadership Mentorship",
      description: "Connecting aspiring leaders with seasoned mentors to guide their career and personal development journeys."
    },
    {
      icon: <Briefcase className="text-amber-400" size={24} />,
      title: "Entrepreneurship Support",
      description: "Offering seed funding, business incubators, and networking opportunities to launch women-led start-ups."
    },
    {
      icon: <Heart className="text-rose-400" size={24} />,
      title: "Advocacy & Support",
      description: "Standing against inequality and providing resources for physical, mental, and legal well-being."
    }
  ];

  return (
    <div className="relative min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Decorative background blur shapes */}
      <div className="mesh-bg">
        <div className="mesh-glow-1"></div>
        <div className="mesh-glow-2"></div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Brand/Hero Text Left Column */}
          <div className="lg:col-span-6 space-y-8 text-left animate-slide-up">
            <div className="inline-flex items-center space-x-2 bg-primary-500/10 border border-primary-500/20 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider text-primary-300 uppercase">
              <span>Empowerment Portal 2026</span>
              <ArrowRight size={12} />
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                Empowering Women,<br />
                <span className="bg-gradient-to-r from-primary-400 via-accent-400 to-amber-400 bg-clip-text text-transparent">
                  Shaping Futures.
                </span>
              </h1>
              <p className="text-slate-400 text-base sm:text-lg max-w-xl leading-relaxed">
                She Can Foundation is dedicated to dismantling barriers, creating equal opportunities, and cultivating a community where every woman has the tools, skills, and confidence to lead.
              </p>
            </div>

            {/* Core Pillars List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              {pillars.map((pillar, idx) => (
                <div key={idx} className="glass-panel p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-all duration-300">
                  <div className="bg-slate-900/60 p-2.5 rounded-xl inline-block mb-3 border border-white/5">
                    {pillar.icon}
                  </div>
                  <h4 className="text-white font-bold text-sm mb-1.5">{pillar.title}</h4>
                  <p className="text-slate-400 text-xs leading-relaxed">{pillar.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Form Card Right Column */}
          <div className="lg:col-span-6 lg:pl-4">
            <ContactForm showToast={showToast} />
          </div>

        </div>
      </div>
    </div>
  );
};

export default Home;
