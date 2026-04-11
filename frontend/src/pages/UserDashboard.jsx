import React from 'react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

export default function UserDashboard() {
  return (
    <>
      <Navbar />
      <main className="pt-24 pb-32 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left Column: Identity & Verification */}
          <div className="lg:col-span-4 space-y-8">

            {/* Hero/Profile Header Section */}
            <section className="bg-surface-container-lowest rounded-xl p-8 text-center space-y-6">
              <div className="relative w-32 h-32 mx-auto">
                <div className="w-full h-full rounded-full overflow-hidden border-4 border-surface-container-low">
                  <img className="w-full h-full object-cover" alt="Profile" src="https://lh3.googleusercontent.com/aida-public/AB6AXuApwaad7ATu3wXE_Nck6uXREM8wXMy7I820pALyB0RoVPGeql9fqqXM1EPfAVaRYkMclplt7HIIzuHaeP6T5qRyUOqgmAlRaUfQCcYi5UnojJ5qS-e410fS3ow-Yo1M3BffYcnPHU-cH2T2lW6WLggx41H4-H2e30rvLosupOAtbrdLxxaxTlkw_UgSeb8IA2oieFztokgzt8lZJGSAnV-5BEAzPowqNjXJVmtTcD8hEZN9Cz9otU-tzdBi1V4j7DOw7j8uYK5cITtU" />
                </div>
                <button className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full shadow-lg hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-sm">photo_camera</span>
                </button>
              </div>
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-on-surface">Julian Rivers</h1>
                <p className="text-on-surface-variant flex items-center justify-center gap-1 mt-1">
                  <span className="material-symbols-outlined text-sm">location_on</span>
                  San Francisco, CA
                </p>
              </div>
              <button className="w-full py-3 bg-primary-container text-white font-bold rounded-full hover:opacity-90 transition-opacity">
                View Public Profile
              </button>
            </section>

            {/* Verification Status */}
            <section className="bg-surface-container-low rounded-xl p-8 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-primary">Identity Trust</h3>
                <span className="px-3 py-1 bg-on-tertiary-container/10 text-on-tertiary-container text-xs font-bold rounded-full flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                  Level 2
                </span>
              </div>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Verified users are 3x more likely to find compatible roommates within the first week.
              </p>
              <div className="pt-2">
                <button className="w-full py-3 bg-surface-container-highest text-primary font-semibold rounded-full flex items-center justify-center gap-2 hover:bg-surface-container-high transition-colors">
                  <span className="material-symbols-outlined">upload_file</span>
                  Upgrade Verification
                </button>
              </div>
            </section>

            {/* Quick Account Settings */}
            <section className="bg-surface-container-lowest rounded-xl p-8 space-y-6">
              <h3 className="text-lg font-bold text-on-surface">Account Settings</h3>
              <div className="space-y-4">
                <Link to="#" className="flex items-center justify-between group">
                  <span className="text-on-surface-variant group-hover:text-primary transition-colors">Security &amp; Password</span>
                  <span className="material-symbols-outlined text-outline">chevron_right</span>
                </Link>
                <Link to="#" className="flex items-center justify-between group">
                  <span className="text-on-surface-variant group-hover:text-primary transition-colors">Notifications</span>
                  <span className="material-symbols-outlined text-outline">chevron_right</span>
                </Link>
                <Link to="#" className="flex items-center justify-between group">
                  <span className="text-on-surface-variant group-hover:text-primary transition-colors">Privacy Preferences</span>
                  <span className="material-symbols-outlined text-outline">chevron_right</span>
                </Link>
              </div>
            </section>

          </div>

          {/* Right Column: Details & Preferences */}
          <div className="lg:col-span-8 space-y-8">

            {/* Personal Information */}
            <section className="bg-surface-container-lowest rounded-xl p-10 space-y-8">
              <div className="flex items-center justify-between border-b border-surface-container-high pb-6">
                <h2 className="text-2xl font-extrabold tracking-tight">Personal Details</h2>
                <button className="text-secondary font-bold text-sm uppercase tracking-widest flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">edit</span>
                  Edit Info
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Full Name</label>
                  <p className="text-lg font-medium">Julian Rivers</p>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Email Address</label>
                  <p className="text-lg font-medium">julian.rivers@example.com</p>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Phone Number</label>
                  <p className="text-lg font-medium">+1 (415) 555-0123</p>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Work / Occupation</label>
                  <p className="text-lg font-medium">UI Architect</p>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">About Me</label>
                  <p className="text-on-surface-variant leading-relaxed italic">
                    "Moving to SF for a new role. I value a clean shared space and a morning coffee ritual. When I'm not designing, I'm usually exploring coastal trails or hunting for the city's best sourdough."
                  </p>
                </div>
              </div>
            </section>

            {/* Favorites Section */}
            <section className="space-y-6">
              <div className="flex justify-between items-center border-b border-outline-variant pb-4 px-2">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-error" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                  <h2 className="text-2xl font-extrabold tracking-tight text-on-surface">Favorites</h2>
                  <span className="bg-error-container text-on-error-container px-2 py-0.5 rounded-md text-xs font-bold">2 ITEMS</span>
                </div>
                <Link to="#" className="text-secondary font-bold hover:underline text-sm">Manage Favorites</Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Property Card 1 (Favorite) */}
                <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm group">
                  <div className="relative h-64">
                    <img alt="Modern Apartment Interior" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDvjnVT8PXfaN-bMMhjKvdUBQZoP2PpPcT_dxipe9YdAfQHeAu_VaLmrDFeZw1MjfPPvIqx3mNRpL2sTiLDn5KPtk0BrZ_Q2lSG4qSjja3PCb4CdNTIMTdIDbgzXCeRdFugLWILr7WOl7E4eFO5c6noGGrW1wKIZf1lJnKxjK8LUysFng5-l9wFR0vw_z_bJtQF8yHxEmg0ziZiVZ1Z_4ZpqchwA2awcdfBy6irZyFR7NlEoers8pJ5FGQxkbiufz5ZpZYdKZE7W3XL" />
                    <div className="absolute top-4 right-4">
                      <button className="bg-white/90 backdrop-blur-md p-2 rounded-full text-error shadow-md">
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                      </button>
                    </div>
                    <div className="absolute bottom-4 left-4">
                      <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Top Match</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-headline text-xl font-bold text-on-surface">The Glass House</h3>
                      <p className="text-primary font-extrabold text-xl">$1,450<span className="text-xs font-normal text-on-surface-variant">/mo</span></p>
                    </div>
                    <p className="text-on-surface-variant text-sm mb-4 flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">location_on</span> West Village, NY
                    </p>
                    <div className="flex items-center gap-4 text-on-surface-variant text-sm">
                      <span className="flex items-center gap-1"><span className="material-symbols-outlined text-lg">bed</span> 2 Bed</span>
                      <span className="flex items-center gap-1"><span className="material-symbols-outlined text-lg">bathtub</span> 1 Bath</span>
                      <span className="flex items-center gap-1 font-bold text-on-tertiary-container">
                        <span className="material-symbols-outlined text-lg">verified</span> Verified
                      </span>
                    </div>
                  </div>
                </div>

                {/* Property Card 2 (Favorite) */}
                <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm group">
                  <div className="relative h-64">
                    <img alt="Bright Minimalist Loft" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDIogMbAPIqur9BhDyp-GkEO3jtOxTGxYxSy63ZOzxpo18PD3k8poEICPDgh_z_X4W47Li9uQ7-CWrX6ywnZdiE3WI6oICnqOiTCtX8TsqtlsCyP8nOanqVuR_2X98mc0VV3z_ChourxHptV5M4GiidVAMNOZDH0ncYW4s85gYazBEHqWEdJzEIcSECSIqE2SWxnBaMtKUYRqhv-SHGxqwBtmlIBqibYtypiSAZHZFWVlcSwu0lzCA49JosczDQ1jri_UsImStpf9wh" />
                    <div className="absolute top-4 right-4">
                      <button className="bg-white/90 backdrop-blur-md p-2 rounded-full text-error shadow-md">
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-headline text-xl font-bold text-on-surface">Urban Loft Studio</h3>
                      <p className="text-primary font-extrabold text-xl">$2,100<span className="text-xs font-normal text-on-surface-variant">/mo</span></p>
                    </div>
                    <p className="text-on-surface-variant text-sm mb-4 flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">location_on</span> Brooklyn, NY
                    </p>
                    <div className="flex items-center gap-4 text-on-surface-variant text-sm">
                      <span className="flex items-center gap-1"><span className="material-symbols-outlined text-lg">bed</span> 1 Bed</span>
                      <span className="flex items-center gap-1"><span className="material-symbols-outlined text-lg">bathtub</span> 1.5 Bath</span>
                      <span className="flex items-center gap-1 font-bold text-on-tertiary-container">
                        <span className="material-symbols-outlined text-lg">verified</span> Verified
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            </section>

            {/* Saved for Later Section */}
            <section className="space-y-6">
              <div className="flex justify-between items-center border-b border-outline-variant pb-4 px-2">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-outline">schedule</span>
                  <h2 className="text-2xl font-extrabold tracking-tight text-on-surface opacity-80">Saved for Later</h2>
                  <span className="bg-surface-container-high text-on-surface-variant px-2 py-0.5 rounded-md text-xs font-bold uppercase">Archive</span>
                </div>
                <Link to="#" className="text-outline font-bold hover:underline text-sm">View All</Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Smaller Property Card 3 */}
                <div className="bg-surface-container rounded-xl overflow-hidden opacity-90 hover:opacity-100 transition-opacity group">
                  <div className="relative h-40">
                    <img alt="Cozy Room" className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAEi6gjH4wfLfqTqW2Sju-9Rj71jB9hLvqhlLGZYCZ7vw8M0wL_bTKkxFxaW2661SlzeOq4xYAq8xDnCpo5oAc_7W-LOzytRuCOQsybEcDyaOACDhZwuDs8GVvovZFU-9X2K-Ce9YPUrF00bLl2sK3GWlHp7UoS2SpgIUhaEPG7-XIiEojYjTF4rRtItKF-tszibUvU-oxceX3GRIdXwaIubAqppaTiowtW608sNKrWwgRb1nbx7wfM2sQlGpekr80v5Wc2Qc-aLjQe" />
                    <div className="absolute top-2 right-2">
                      <button className="bg-white/80 p-1.5 rounded-full text-outline shadow-sm">
                        <span className="material-symbols-outlined text-lg">bookmark</span>
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="font-headline font-bold text-on-surface text-sm mb-1 truncate">East Side Hideaway</h4>
                    <p className="text-on-surface-variant text-xs mb-3">$950/mo</p>
                    <button className="w-full py-2 border border-outline-variant rounded-full text-xs font-bold text-on-surface-variant hover:bg-surface-container-lowest transition-colors">
                      Move to Favorites
                    </button>
                  </div>
                </div>

                {/* Smaller Property Card 4 */}
                <div className="bg-surface-container rounded-xl overflow-hidden opacity-90 hover:opacity-100 transition-opacity group">
                  <div className="relative h-40">
                    <img alt="Modern Studio" className="w-full h-full object-cover grayscale-[20%]" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAB0mQPrOxsNCOYCGAKLx2WOuN6rUhrwemChH8O1DZ7WJu7vBkZvjkEOvgsTTqrCLQ0txfVjUJbnHydWB1j-NHuG1Uz5BNXC82T2toNQYZL0u90e_LqaP5kJLXazDMYALl3QZTP6Svb_Mo_D-1Z3DyWlW-SXfEH67pNeIYtTkBHmvhz3UDngdxPKve-mJ7_7Ng8jVszytPweSYoYPLU-f8ctsg2xoZRyP7JymYxQZOHIvUVdaIiGyNq1KyYmvKysVOCUppi53WObR56" />
                    <div className="absolute top-2 right-2">
                      <button className="bg-white/80 p-1.5 rounded-full text-outline shadow-sm">
                        <span className="material-symbols-outlined text-lg">bookmark</span>
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="font-headline font-bold text-on-surface text-sm mb-1 truncate">Minimalist Studio</h4>
                    <p className="text-on-surface-variant text-xs mb-3">$1,800/mo</p>
                    <button className="w-full py-2 border border-outline-variant rounded-full text-xs font-bold text-on-surface-variant hover:bg-surface-container-lowest transition-colors">
                      Move to Favorites
                    </button>
                  </div>
                </div>

                {/* Empty Placeholder for Later */}
                <div className="border-2 border-dashed border-outline-variant rounded-xl flex flex-col items-center justify-center p-6 text-center">
                  <span className="material-symbols-outlined text-outline-variant text-4xl mb-2">add_circle</span>
                  <p className="text-outline-variant text-xs font-bold uppercase tracking-widest">Add more to later</p>
                </div>

              </div>
            </section>

            {/* Interests Section */}
            <section className="bg-surface-container-lowest rounded-xl p-10 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-extrabold tracking-tight">Interests &amp; Hobbies</h2>
                <button className="bg-surface-container-low text-primary p-2 rounded-full hover:bg-surface-container-high">
                  <span className="material-symbols-outlined">add</span>
                </button>
              </div>
              <div className="flex flex-wrap gap-3">
                <span className="px-6 py-3 bg-secondary-container text-on-secondary-container rounded-full font-bold text-sm flex items-center gap-2">
                  Hiking <span className="material-symbols-outlined text-sm cursor-pointer">close</span>
                </span>
                <span className="px-6 py-3 bg-secondary-container text-on-secondary-container rounded-full font-bold text-sm flex items-center gap-2">
                  Architecture <span className="material-symbols-outlined text-sm cursor-pointer">close</span>
                </span>
                <span className="px-6 py-3 bg-secondary-container text-on-secondary-container rounded-full font-bold text-sm flex items-center gap-2">
                  Cooking <span className="material-symbols-outlined text-sm cursor-pointer">close</span>
                </span>
                <span className="px-6 py-3 bg-secondary-container text-on-secondary-container rounded-full font-bold text-sm flex items-center gap-2">
                  Urban Cycling <span className="material-symbols-outlined text-sm cursor-pointer">close</span>
                </span>
                <span className="px-6 py-3 bg-secondary-container text-on-secondary-container rounded-full font-bold text-sm flex items-center gap-2">
                  Photography <span className="material-symbols-outlined text-sm cursor-pointer">close</span>
                </span>
                <span className="px-6 py-3 bg-surface-container-high text-on-surface-variant rounded-full font-bold text-sm border border-dashed border-outline-variant">
                  Add New +
                </span>
              </div>
            </section>

          </div>
        </div>
      </main>

      {/* BottomNavBar (Mobile Only) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pb-6 pt-3 bg-white/80 backdrop-blur-xl border-t border-slate-100 z-50">
        <div className="flex flex-col items-center justify-center text-slate-400">
          <span className="material-symbols-outlined">explore</span>
          <span className="font-inter text-[10px] font-semibold uppercase tracking-widest mt-1">Discover</span>
        </div>
        <div className="flex flex-col items-center justify-center text-slate-400">
          <span className="material-symbols-outlined">favorite</span>
          <span className="font-inter text-[10px] font-semibold uppercase tracking-widest mt-1">Matches</span>
        </div>
        <div className="flex flex-col items-center justify-center text-slate-400">
          <span className="material-symbols-outlined">chat_bubble</span>
          <span className="font-inter text-[10px] font-semibold uppercase tracking-widest mt-1">Messages</span>
        </div>
        <div className="flex flex-col items-center justify-center bg-teal-50 text-teal-700 rounded-full px-5 py-2">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
          <span className="font-inter text-[10px] font-semibold uppercase tracking-widest mt-1">Profile</span>
        </div>
      </nav>

      <Footer />
    </>
  );
}
