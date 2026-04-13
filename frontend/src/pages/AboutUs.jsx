import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

const TEAM = [
  {
    name: 'Ritesh Bansal',
    role: 'Co-Founder & Full Stack Developer',
    location: 'Rajpura, Punjab',
    university: 'Chitkara University — B.Tech CSE (3rd Year)',
    bio: 'Ritesh is the technical brain behind ShareNest. A passionate full-stack developer from Rajpura, Punjab, he built the entire platform from scratch — backend APIs, database architecture, real-time messaging, and the admin panel. At just 20, he has already shipped a production-grade MERN stack application that solves a real problem faced by millions of students and working professionals across India. When he\'s not coding, he\'s exploring new tech stacks and dreaming of scaling ShareNest to every city in India.',
    skills: ['React', 'Node.js', 'MongoDB', 'Express', 'Firebase', 'Tailwind CSS'],
    avatar: 'https://ui-avatars.com/api/?name=Ritesh+Bansal&background=1e40af&color=fff&size=200&bold=true',
    linkedin: '#',
    github: '#',
    emoji: '👨‍💻'
  }
];

const JOURNEY = [
  { year: '2024', title: 'The Idea', desc: 'Ritesh struggled to find a decent PG near his university. Tired of brokers, fake listings and overpriced rooms, he decided to build a solution.' },
  { year: 'Early 2025', title: 'Building Begins', desc: 'Ritesh and Harman teamed up — one to build, one to design. Late nights, chai, and countless commits later, ShareNest started taking shape.' },
  { year: 'Mid 2025', title: 'First Version', desc: 'The MVP launched with property listings, roommate matching, and real-time messaging. First 100 users signed up within a week.' },
  { year: '2026', title: 'Growing Strong', desc: 'ShareNest now has 10,000+ listings across 6 major Indian cities, a full booking system, and an admin dashboard. The journey has just begun.' },
];

const VALUES = [
  { icon: 'verified', title: 'Trust First', desc: 'Every listing is verified. Every owner is real. We built ShareNest on a foundation of transparency and trust.' },
  { icon: 'currency_rupee', title: 'Zero Brokerage', desc: 'No middlemen. No hidden fees. Connect directly with property owners and save thousands in brokerage.' },
  { icon: 'security', title: 'Safety Always', desc: 'Especially for women. Verified profiles, secure messaging, and background-checked listings.' },
  { icon: 'favorite', title: 'Community Driven', desc: 'We\'re not just a listing platform. We\'re building a community of compatible people who share spaces and lives.' },
];

export default function AboutUs() {
  return (
    <>
      <Navbar />
      <main>

        {/* ── HERO ── */}
        <section className="relative bg-slate-950 pt-32 pb-24 overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-[120px]"></div>
          </div>
          <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
            <span className="inline-block bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
              Our Story
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-tight mb-6">
              Built by students,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">for everyone.</span>
            </h1>
            <p className="text-slate-300 text-xl leading-relaxed max-w-2xl mx-auto">
              ShareNest was born out of frustration — the kind every student and working professional in India knows too well. Finding a good PG shouldn't be this hard. So we built something better.
            </p>
          </div>
        </section>

        {/* ── MISSION ── */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <span className="text-blue-600 font-bold text-xs uppercase tracking-widest">Our Mission</span>
                <h2 className="text-4xl font-extrabold text-slate-900 mt-3 leading-tight">
                  Making finding a home as easy as ordering food online
                </h2>
                <p className="text-slate-500 mt-5 leading-relaxed">
                  In India, millions of students and professionals move to new cities every year. They face the same nightmare — shady brokers, fake listings, overpriced rooms, and zero transparency. ShareNest is our answer to that problem.
                </p>
                <p className="text-slate-500 mt-4 leading-relaxed">
                  We connect tenants directly with verified property owners. No brokerage. No middlemen. Just honest listings, real photos, and a smooth booking experience — all built by two college students who lived this problem firsthand.
                </p>
                <div className="flex gap-4 mt-8">
                  <Link to="/find-homes" className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-full transition-all">
                    Find a Room
                  </Link>
                  <Link to="/create-post" className="border-2 border-slate-200 hover:border-blue-600 text-slate-700 hover:text-blue-600 font-bold px-6 py-3 rounded-full transition-all">
                    List Property
                  </Link>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { num: '10,000+', label: 'Verified Listings', color: 'bg-blue-50 text-blue-600' },
                  { num: '50,000+', label: 'Happy Tenants', color: 'bg-violet-50 text-violet-600' },
                  { num: '6', label: 'Major Cities', color: 'bg-emerald-50 text-emerald-600' },
                  { num: '₹0', label: 'Brokerage Fee', color: 'bg-amber-50 text-amber-600' },
                ].map(({ num, label, color }) => (
                  <div key={label} className={`${color} rounded-2xl p-6 text-center`}>
                    <p className="text-4xl font-extrabold">{num}</p>
                    <p className="text-sm font-semibold mt-2 opacity-80">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── TEAM ── */}
        <section className="py-20 bg-slate-50">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <span className="text-blue-600 font-bold text-xs uppercase tracking-widest">The Builders</span>
              <h2 className="text-4xl font-extrabold text-slate-900 mt-3">Meet the Team</h2>
              <p className="text-slate-500 mt-3">Two students. One mission. Zero brokerage.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {TEAM.map(({ name, role, location, university, bio, skills, avatar, emoji }) => (
                <div key={name} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl transition-all">
                  {/* Card Header */}
                  <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 flex items-center gap-6">
                    <div className="relative">
                      <img src={avatar} alt={name} className="w-24 h-24 rounded-2xl object-cover border-4 border-white/20" />
                      <span className="absolute -bottom-2 -right-2 text-2xl">{emoji}</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-extrabold text-white">{name}</h3>
                      <p className="text-blue-300 font-semibold text-sm mt-1">{role}</p>
                      <p className="text-slate-400 text-xs mt-2 flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">location_on</span>{location}
                      </p>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-8 space-y-5">
                    <div className="flex items-center gap-2 bg-blue-50 rounded-xl px-4 py-2.5">
                      <span className="material-symbols-outlined text-blue-600 text-sm">school</span>
                      <span className="text-blue-700 text-sm font-semibold">{university}</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed text-sm">{bio}</p>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Skills</p>
                      <div className="flex flex-wrap gap-2">
                        {skills.map(skill => (
                          <span key={skill} className="bg-slate-100 text-slate-600 text-xs font-semibold px-3 py-1.5 rounded-full">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── OUR JOURNEY ── */}
        <section className="py-20 bg-slate-950">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-16">
              <span className="text-blue-400 font-bold text-xs uppercase tracking-widest">Timeline</span>
              <h2 className="text-4xl font-extrabold text-white mt-3">Our Journey</h2>
            </div>
            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-px bg-slate-800"></div>
              <div className="space-y-10">
                {JOURNEY.map(({ year, title, desc }, i) => (
                  <div key={year} className="flex gap-8 items-start">
                    <div className="relative flex-shrink-0">
                      <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center z-10 relative">
                        <span className="text-white font-extrabold text-xs text-center leading-tight">{year.replace(' ', '\n')}</span>
                      </div>
                    </div>
                    <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 flex-1">
                      <h3 className="text-white font-bold text-lg mb-2">{title}</h3>
                      <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── VALUES ── */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <span className="text-blue-600 font-bold text-xs uppercase tracking-widest">What We Stand For</span>
              <h2 className="text-4xl font-extrabold text-slate-900 mt-3">Our Values</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {VALUES.map(({ icon, title, desc }) => (
                <div key={title} className="text-center p-8 rounded-2xl bg-slate-50 hover:bg-blue-50 transition-colors group">
                  <div className="w-14 h-14 bg-blue-600 group-hover:bg-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-5 transition-colors">
                    <span className="material-symbols-outlined text-white text-2xl">{icon}</span>
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-lg mb-3">{title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-20 bg-gradient-to-br from-blue-600 to-blue-800 text-center">
          <div className="max-w-2xl mx-auto px-6">
            <h2 className="text-4xl font-extrabold text-white mb-5">Join the ShareNest family</h2>
            <p className="text-blue-100 text-lg mb-10">Whether you're looking for a room or listing one — we've got you covered.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/sign-up" className="bg-white text-blue-600 font-bold px-8 py-4 rounded-full hover:shadow-xl transition-all">
                Get Started Free
              </Link>
              <Link to="/find-homes" className="bg-white/10 border border-white/30 text-white font-bold px-8 py-4 rounded-full hover:bg-white/20 transition-all">
                Browse Listings
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
