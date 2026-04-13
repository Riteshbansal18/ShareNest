import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="bg-slate-100 w-full py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 px-4 md:px-12 max-w-7xl mx-auto">
                <div className="col-span-1 md:col-span-1">
                    <Link to="/"><div className="text-xl font-bold text-slate-900 mb-6">ShareNest</div></Link>
                    <p className="text-slate-500 font-body text-sm leading-relaxed">
                        © 2026 ShareNest. The Curated Sanctuary for Modern Living.
                    </p>
                </div>
                <div>
                    <h4 className="font-headline font-bold text-slate-900 mb-6 uppercase tracking-wider text-xs">Platform</h4>
                    <ul className="space-y-4">
                        <li><Link className="text-slate-500 hover:underline hover:text-teal-700 transition-opacity font-body text-sm" to="/about">About Us</Link></li>
                        <li><Link className="text-slate-500 hover:underline hover:text-teal-700 transition-opacity font-body text-sm" to="/terms">Terms of Service</Link></li>
                        <li><Link className="text-slate-500 hover:underline hover:text-teal-700 transition-opacity font-body text-sm" to="/privacy">Privacy Policy</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-headline font-bold text-slate-900 mb-6 uppercase tracking-wider text-xs">Resources</h4>
                    <ul className="space-y-4">
                        <li><Link className="text-slate-500 hover:underline hover:text-teal-700 transition-opacity font-body text-sm" to="#">Contact Support</Link></li>
                        <li><Link className="text-slate-500 hover:underline hover:text-teal-700 transition-opacity font-body text-sm" to="#">Safety Tips</Link></li>
                        <li><Link className="text-slate-500 hover:underline hover:text-teal-700 transition-opacity font-body text-sm" to="#">Community Guidelines</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-headline font-bold text-slate-900 mb-6 uppercase tracking-wider text-xs">Stay Connected</h4>
                    <div className="flex space-x-4 mb-6">
                        <Link className="text-teal-600 hover:text-teal-700 transition-all" to="#"><span className="material-symbols-outlined" data-icon="share">share</span></Link>
                        <Link className="text-teal-600 hover:text-teal-700 transition-all" to="#"><span className="material-symbols-outlined" data-icon="mail">mail</span></Link>
                    </div>
                    <p className="text-xs text-slate-400">Sign up for our curated living newsletter.</p>
                </div>
            </div>
        </footer>
    );
}
