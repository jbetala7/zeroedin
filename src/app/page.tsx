'use client';

import dynamic from 'next/dynamic';
import { useScrollProgress } from '@/hooks/useScrollProgress';
import SmoothScrollProvider from '@/components/providers/SmoothScrollProvider';
import HeroOverlay from '@/components/hero/HeroOverlay';

// Dynamic import for particle components (client-side only)
const ParticleHero = dynamic(() => import('@/components/hero/ParticleHero'), {
  ssr: false,
});

export default function Home() {
  const { progress } = useScrollProgress();

  return (
    <SmoothScrollProvider>
      <main className="relative bg-[#0A0A0F]">
        {/* Particle Hero Scene */}
        <ParticleHero scrollProgress={progress} />

        {/* HTML Overlay */}
        <HeroOverlay scrollProgress={progress} />

        {/* Scroll container - creates scroll height for the animation */}
        <div className="h-[400vh]" aria-hidden="true" />

        {/* Content sections */}
        <section id="about" className="relative z-10 min-h-screen bg-[#0A1628] py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-bold mb-8">
              About <span className="text-orange-500">ZeroedIn</span>
            </h2>
            <p className="text-white/60 text-xl max-w-2xl">
              Our state-of-the-art facility offers the best air rifle training experience.
              Whether you&apos;re a beginner looking to learn the basics or a competitive
              shooter aiming to perfect your technique, we have programs tailored for you.
            </p>
          </div>
        </section>

        <section id="services" className="relative z-10 min-h-screen bg-[#0A0A0F] py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-bold mb-12">
              Our <span className="text-orange-500">Services</span>
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { title: 'Beginner Training', desc: 'Perfect for first-timers looking to learn the basics of precision shooting.' },
                { title: 'Advanced Courses', desc: 'Take your skills to the next level with our competitive shooting programs.' },
                { title: 'Private Sessions', desc: 'One-on-one coaching tailored to your specific goals and skill level.' },
              ].map((service, i) => (
                <div
                  key={i}
                  className="p-6 bg-[#0A1628]/50 rounded-lg border border-orange-500/20 hover:border-orange-500/50 transition-all hover:shadow-[0_0_30px_rgba(255,77,0,0.1)]"
                >
                  <h3 className="text-2xl font-bold mb-4 text-orange-500">{service.title}</h3>
                  <p className="text-white/50">{service.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="relative z-10 min-h-screen bg-[#0A1628] py-20 px-6">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-4xl md:text-6xl font-bold mb-8">
              Get In <span className="text-orange-500">Touch</span>
            </h2>
            <p className="text-white/60 text-xl mb-12 max-w-2xl mx-auto">
              Ready to start your precision shooting journey? Contact us today to book a session
              or learn more about our programs.
            </p>
            <button className="px-10 py-5 bg-orange-500 text-black font-bold text-xl rounded-full hover:bg-orange-400 transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(255,77,0,0.3)]">
              CONTACT US
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative z-10 bg-[#0A0A0F] border-t border-white/10 py-12 px-6">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-2xl font-bold tracking-wider">
              <span className="text-orange-500">ZEROED</span>
              <span className="text-white">IN</span>
            </div>
            <p className="text-white/30 text-sm">
              &copy; 2024 ZeroedIn. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-white/50 hover:text-orange-500 transition-colors">Instagram</a>
              <a href="#" className="text-white/50 hover:text-orange-500 transition-colors">Facebook</a>
              <a href="#" className="text-white/50 hover:text-orange-500 transition-colors">Twitter</a>
            </div>
          </div>
        </footer>
      </main>
    </SmoothScrollProvider>
  );
}
