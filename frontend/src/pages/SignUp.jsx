import React from 'react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

export default function SignUp() {
  return (
    <>
      
<Navbar />
{/*  Top Navigation Bar - Contextually Suppressed for Transactional Page (Simplified Shell)  */}
<nav className="bg-white/80 backdrop-blur-md fixed top-0 w-full z-50">
<div className="flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
<span className="text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-blue-900 to-blue-700 font-headline">RoomieMatch</span>
<div className="flex items-center gap-4">
<span className="font-label text-sm text-on-surface-variant">Already have an account?</span>
<Link className="text-primary font-bold text-sm hover:text-primary-container transition-colors" to="#">Login</Link>
</div>
</div>
</nav>
{/*  Main Content: Split Screen Layout  */}
<main className="flex-grow flex items-stretch">
{/*  Left Section: Hero Image  */}
<section className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
<div className="absolute inset-0 bg-primary/20 mix-blend-multiply z-10"></div>
<img alt="The Curated Sanctuary" className="absolute inset-0 h-full w-full object-cover" data-alt="Modern minimalist sun-drenched living room with clean lines, architectural furniture, and large windows showing urban greenery at mid-day" src="https://lh3.googleusercontent.com/aida-public/AB6AXuApP0VEN40pasGxHG4qTSOeZiZ1qRcV7ureFnDWHV8xQhD5f4Nc898DZ5WqJtvHOV6zdQcJbOheaWr_nd77GHcMM1W47Wg3VkOYRjMQemck3MFsFFEd7KB1U0kbYxS7yThP-QU6jKoMfHlA0ggSbPBDXBgLH00eE64OW0zF-J9_gAMQxeXavPrgOzl3DxfPwcSsxplrelObbj2QAF5q9ZC992FyQowKI4QNII6YazArkGGE78BcHHd_qjru03el0NEmxrlcgkOg36wP"/>
{/*  Atmospheric Branding Layer  */}
<div className="relative z-20 flex flex-col justify-end p-20 w-full text-white">
<div className="max-w-md">
<h2 className="text-5xl font-extrabold tracking-tight mb-6 leading-tight">Find your place in the world.</h2>
<p className="text-lg text-white/90 font-body leading-relaxed">Experience a curated journey to discovering your perfect home and the ideal roommate to share it with.</p>
</div>
</div>
</section>
{/*  Right Section: Form Content  */}
<section className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16 lg:p-24 bg-surface pt-32 lg:pt-24">
<div className="w-full max-w-md space-y-10">
{/*  Editorial Header  */}
<div className="space-y-2">
<span className="text-secondary font-bold tracking-widest text-xs uppercase">Begin Your Journey</span>
<h1 className="text-4xl font-extrabold text-primary tracking-tight">Create Account</h1>
<p className="text-on-surface-variant text-sm">Join the curated sanctuary for modern living.</p>
</div>
{/*  Form  */}
<form className="space-y-6">
<div className="space-y-5">
<div className="flex flex-col gap-2">
<label className="text-sm font-semibold text-on-surface-variant font-label ml-1">Full Name</label>
<div className="relative">
<span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-xl">person</span>
<input className="w-full pl-12 pr-4 py-4 bg-surface-container-highest rounded-xl border-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline/60 text-on-surface font-body" placeholder="Julianne Smith" type="text"/>
</div>
</div>
<div className="flex flex-col gap-2">
<label className="text-sm font-semibold text-on-surface-variant font-label ml-1">Email Address</label>
<div className="relative">
<span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-xl">alternate_email</span>
<input className="w-full pl-12 pr-4 py-4 bg-surface-container-highest rounded-xl border-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline/60 text-on-surface font-body" placeholder="name@example.com" type="email"/>
</div>
</div>
<div className="flex flex-col gap-2">
<label className="text-sm font-semibold text-on-surface-variant font-label ml-1">Password</label>
<div className="relative">
<span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-xl">lock</span>
<input className="w-full pl-12 pr-4 py-4 bg-surface-container-highest rounded-xl border-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline/60 text-on-surface font-body" placeholder="••••••••" type="password"/>
</div>
<p className="text-[11px] text-outline ml-1">Must be at least 8 characters with a mix of letters and numbers.</p>
</div>
</div>
<button className="w-full bg-gradient-brand text-white font-bold py-5 rounded-full shadow-lg shadow-primary/10 hover:opacity-90 active:scale-[0.98] transition-all text-base tracking-wide mt-2" type="submit">
                        Create Account
                    </button>
</form>
{/*  Divider Section  */}
<div className="relative flex items-center gap-4 py-2">
<div className="flex-grow h-[1px] bg-outline-variant/30"></div>
<span className="text-xs font-bold text-outline font-label">OR CONTINUE WITH</span>
<div className="flex-grow h-[1px] bg-outline-variant/30"></div>
</div>
{/*  Social Signups  */}
<div className="grid grid-cols-1 gap-4">
<button className="flex items-center justify-center gap-3 w-full py-4 bg-surface-container-lowest text-on-surface border border-outline-variant/20 rounded-full font-bold text-sm hover:bg-surface-container-low transition-colors shadow-sm">
<svg className="w-5 h-5" viewbox="0 0 24 24">
<path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
<path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
<path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
<path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
</svg>
                        Sign up with Google
                    </button>
</div>
{/*  Footer Links (Contextual)  */}
<p className="text-center text-sm text-outline-variant px-4">
                    By creating an account, you agree to our 
                    <Link className="text-on-surface-variant font-bold hover:text-primary underline decoration-primary/20" to="#">Terms of Service</Link> 
                    and 
                    <Link className="text-on-surface-variant font-bold hover:text-primary underline decoration-primary/20" to="#">Privacy Policy</Link>.
                </p>
</div>
</section>
</main>
{/*  Global Footer - Simplified for Auth Flow  */}
<footer className="bg-slate-50 border-t border-slate-100">
<div className="flex flex-col md:flex-row justify-between items-center px-8 py-12 max-w-7xl mx-auto w-full">
<span className="font-inter text-sm text-slate-500">© 2024 RoomieMatch. The Curated Sanctuary.</span>
<div className="flex gap-8 mt-6 md:mt-0">
<Link className="text-slate-500 hover:text-blue-900 font-inter text-sm transition-all focus:ring-2 focus:ring-blue-500 ring-offset-2 rounded px-1" to="#">Privacy Policy</Link>
<Link className="text-slate-500 hover:text-blue-900 font-inter text-sm transition-all focus:ring-2 focus:ring-blue-500 ring-offset-2 rounded px-1" to="#">Terms of Service</Link>
<Link className="text-slate-500 hover:text-blue-900 font-inter text-sm transition-all focus:ring-2 focus:ring-blue-500 ring-offset-2 rounded px-1" to="#">Contact Support</Link>
</div>
</div>
</footer>
<Footer />

    </>
  );
}
