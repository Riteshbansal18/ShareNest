import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
    return (
        <header className="fixed top-0 w-full z-50 bg-slate-50/80 backdrop-blur-md shadow-sm">
            <div className="flex justify-between items-center px-8 h-20 w-full max-w-screen-2xl mx-auto">
                <Link to="/"><div className="text-2xl font-black tracking-tight text-blue-900">ShareNest</div></Link>
                <nav className="hidden md:flex items-center space-x-8">
                    <Link className="text-slate-600 hover:text-blue-800 transition-all duration-300 font-body body-md" to="/find-homes">Find Homes</Link>
                    <Link className="text-slate-600 hover:text-blue-800 transition-all duration-300 font-body body-md" to="/roommate-listing">Find Roommates</Link>
                    <Link className="text-slate-600 hover:text-blue-800 transition-all duration-300 font-body body-md" to="/create-post">List Property</Link>
                </nav>
                <div className="flex items-center space-x-3 sm:space-x-6">
                    <Link to="/messages" className="text-slate-500 hover:text-blue-800 transition-colors p-2 rounded-full hover:bg-slate-100 relative hidden sm:flex">
                        <span className="material-symbols-outlined">chat_bubble</span>
                        <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                    </Link>
                    <Link to="/user-dashboard" className="hidden sm:flex items-center gap-2 p-1 pr-3 rounded-full hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200">
                        <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuApwaad7ATu3wXE_Nck6uXREM8wXMy7I820pALyB0RoVPGeql9fqqXM1EPfAVaRYkMclplt7HIIzuHaeP6T5qRyUOqgmAlRaUfQCcYi5UnojJ5qS-e410fS3ow-Yo1M3BffYcnPHU-cH2T2lW6WLggx41H4-H2e30rvLosupOAtbrdLxxaxTlkw_UgSeb8IA2oieFztokgzt8lZJGSAnV-5BEAzPowqNjXJVmtTcD8hEZN9Cz9otU-tzdBi1V4j7DOw7j8uYK5cITtU" alt="Profile" className="w-8 h-8 rounded-full border border-slate-200 object-cover" />
                        <span className="text-sm font-semibold text-slate-700">Julian</span>
                    </Link>
                    <Link to="/login"><button className="text-blue-900 font-semibold px-4 py-2 hover:bg-slate-100 transition-all duration-300 rounded-full">Sign In</button></Link>
                    <Link to="/sign-up"><button className="primary-gradient text-white font-bold px-6 py-2.5 rounded-full hover:scale-95 transition-all duration-200 shadow-md hidden sm:block">Sign Up</button></Link>
                </div>
            </div>
        </header>
    );
}
