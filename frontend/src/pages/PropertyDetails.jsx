import React from 'react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

export default function PropertyDetails() {
  return (
    <>
      
<Navbar />
<main className="pt-24 pb-20 max-w-screen-2xl mx-auto px-8">
{/*  Hero Gallery Section  */}
<section className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-[500px] mb-12">
<div className="md:col-span-2 md:row-span-2 overflow-hidden rounded-xl">
<img className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 cursor-pointer" data-alt="Stunning modern minimalist apartment interior with floor-to-ceiling windows, soft afternoon sunlight, and premium hardwood floors" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBCHLOx1I_i3qlpuoKyj_ZEUReBJ4qvY0qJU1WjLeOmetKlHLpXTFnS7qAwSddSMxnebFfFHzKNKKbyZpJIJvcxzfKC_I8c0r2fgGsAmkP0cfIsJ5AQsj4kZVN6XfmrYOjD5njJL_aarfeFmsVUmjoInXbNY0G75UidrfgDhQI3KSObwKxfPvZlGADRCy3GGlvWvMXGnue-7e19aunSGUroM7-KuwAfgOgo8iwSD4yZpFy2GBN52k5S6hHMRKNzu234VIna8ToNmBr1"/>
</div>
<div className="hidden md:block overflow-hidden rounded-xl">
<img className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 cursor-pointer" data-alt="Close-up of a designer kitchen featuring white marble countertops and matte black fixtures in a bright open-plan space" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBv7Mejzs5140F9838VCwDPGl6z2u7nH1uE2vXCT9beZNtVCfMrhklCLtttTOq1PqrVSLOGE33YV1ZYY--bwmSpNa6eOCIgEHYpNXHEE9k9kHDO_JMZGrXXMvxaMipEWYGUKBUGPKZtNYoduttRyP1OaHxgpw8CgL-rzqNsCYZgs_gpJJazrj29ksuAxPe4MiR3TDT-4UebSnnGuYxdPRGKMT3tF2mvp6J3WMKnp0S-Z9o3WgMU-HhX1GtdFqhoFI5vga2ntCAfkZhG"/>
</div>
<div className="hidden md:block overflow-hidden rounded-xl">
<img className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 cursor-pointer" data-alt="Sunlit bedroom with organic linen bedding, a large potted Monstera plant, and soft neutral color palette" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDL4GEDc2m6kvgWFMZZJZW8GZPgIxZ0F4QSk04Sc41UwUw91X6VXf8g-O_s2g_miduz_vR52htJ5pyvvOCnyT9DWmmz8BDsWwqbrY4lYDE28HYJ-z_x2L_pHCBD35CJrWkn7jrhF-11-oRXLb04bRhr6KERvo0nrOVpqy_m4aG9UsjpnPFzJR962y5i33hXjmNmuUYS5rrLJQ1EDSymltHHOk3vKkDE30Bv0tHSY9DRKPNoZOijsYdQGYWThDSlaU1JOzxjln8Pag7z"/>
</div>
<div className="hidden md:block md:col-span-2 overflow-hidden rounded-xl relative">
<img className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 cursor-pointer" data-alt="Spacious rooftop terrace with modern outdoor furniture and panoramic city skyline views at dusk" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDoEFKe3Y-_EZtyYab0aod4sEqQZSzmhWPnArkZN_vMGQJOCqA5gSkxh8Z2QjOOKsqnY4DN7XMbkunnGfKdRUeVQ7_Zg166xMtZpiBglpl7VHlvCul0vS80k4TPj0E-BzkxUzUlOYz0nLJojA9Q9YAg4-WOzdokJMKtYv2iUKrUIeEQvBAF4fguyuWgTdQKdfNdWCOl2u7iJtNJ8r8rCM5vId556g85cn8GUbtofdS2KjWrB8kfYfkm81E7rlSwRKqyKLQBIZBMTHwG"/>
<button className="absolute bottom-6 right-6 bg-surface-container-lowest px-6 py-3 rounded-full flex items-center gap-2 shadow-lg font-label text-sm font-bold text-primary hover:bg-surface-container-highest transition-colors">
<span className="material-symbols-outlined text-sm">grid_view</span>
                    View all photos
                </button>
</div>
</section>
<div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
{/*  Left Column: Details  */}
<div className="lg:col-span-2 space-y-12">
{/*  Title & Location Header  */}
<div className="space-y-4">
<div className="flex items-center gap-3">
<span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Verified Listing</span>
<span className="text-on-surface-variant flex items-center gap-1 text-sm"><span className="material-symbols-outlined text-sm">schedule</span>Posted 2 days ago</span>
</div>
<h1 className="text-4xl md:text-5xl font-extrabold text-on-surface tracking-tight leading-tight">Serene Scandinavian Loft in High Street</h1>
<p className="text-lg text-on-surface-variant flex items-center gap-2">
<span className="material-symbols-outlined text-primary">location_on</span>
                        High Street Kensington, London, W8 4SG
                    </p>
</div>
{/*  Pricing Bento Section  */}
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
<div className="bg-surface-container-lowest p-8 rounded-xl border-outline-variant/15 border flex flex-col justify-between">
<span className="text-on-surface-variant font-label text-sm font-semibold uppercase tracking-widest">Monthly Rent</span>
<div className="mt-4">
<span className="text-4xl font-black text-primary">£1,450</span>
<span className="text-on-surface-variant text-sm font-medium">/month</span>
</div>
</div>
<div className="bg-surface-container-low p-8 rounded-xl flex flex-col justify-between">
<span className="text-on-surface-variant font-label text-sm font-semibold uppercase tracking-widest">Security Deposit</span>
<div className="mt-4">
<span className="text-4xl font-bold text-on-surface">£2,000</span>
</div>
</div>
</div>
{/*  Description  */}
<div className="space-y-6">
<h2 className="text-2xl font-bold text-on-surface border-l-4 border-primary pl-4">The Space</h2>
<p className="text-on-surface-variant leading-relaxed text-lg">
                        Nestled in the heart of Kensington, this masterfully designed Scandinavian-inspired loft offers a sanctuary from the urban rush. Featuring double-height ceilings, oak flooring throughout, and a curated selection of minimalist furniture. You will be sharing with one professional who values a peaceful home environment and clean shared spaces.
                    </p>
</div>
{/*  Amenities Grid  */}
<div className="space-y-6">
<h2 className="text-2xl font-bold text-on-surface">What this place offers</h2>
<div className="grid grid-cols-2 sm:grid-cols-3 gap-y-6 gap-x-4">
<div className="flex items-center gap-4 text-on-surface">
<span className="material-symbols-outlined p-3 bg-surface-container-low rounded-xl text-primary">wifi</span>
<span className="font-medium">Ultra-fast Wi-Fi</span>
</div>
<div className="flex items-center gap-4 text-on-surface">
<span className="material-symbols-outlined p-3 bg-surface-container-low rounded-xl text-primary">local_laundry_service</span>
<span className="font-medium">In-unit Laundry</span>
</div>
<div className="flex items-center gap-4 text-on-surface">
<span className="material-symbols-outlined p-3 bg-surface-container-low rounded-xl text-primary">ac_unit</span>
<span className="font-medium">Air Conditioning</span>
</div>
<div className="flex items-center gap-4 text-on-surface">
<span className="material-symbols-outlined p-3 bg-surface-container-low rounded-xl text-primary">desk</span>
<span className="font-medium">Dedicated Workspace</span>
</div>
<div className="flex items-center gap-4 text-on-surface">
<span className="material-symbols-outlined p-3 bg-surface-container-low rounded-xl text-primary">kitchen</span>
<span className="font-medium">Chef's Kitchen</span>
</div>
<div className="flex items-center gap-4 text-on-surface">
<span className="material-symbols-outlined p-3 bg-surface-container-low rounded-xl text-primary">balcony</span>
<span className="font-medium">Private Balcony</span>
</div>
</div>
</div>
{/*  Location Map Placeholder  */}
<div className="space-y-6">
<h2 className="text-2xl font-bold text-on-surface">Location</h2>
<div className="relative w-full h-[400px] rounded-xl overflow-hidden bg-surface-container">
<img className="w-full h-full object-cover grayscale opacity-80" data-alt="Minimalist map view of High Street Kensington area with subtle blue and grey color scheme" data-location="London" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAwf_fkSRhaqyiyAm0GY-FDdu5bRONYHBGFkj4RhhL3lqflXFWeS1QntiZ7mlM5ZZxVeob42vX86nYDGUrRk9p4rI402CzXWSIKhBbBKVOBOFTUwM_qKukHmIVIkfb_UU_vr96pJl7iNTmNHLHcY8vATRwQ4yMAamT5OPg-X8e5FMXW8fBZDwPwqT5DtW8k2EKfDvyxvAHy6fJa78BYr76UIiE11J6cOfEyIuB92pYZmtobNNQkk4fzF_0XjRJiaf2UUoJsNyz58iks"/>
<div className="absolute inset-0 flex items-center justify-center">
<div className="bg-primary p-4 rounded-full shadow-2xl text-white animate-pulse">
<span className="material-symbols-outlined text-4xl" data-weight="fill">location_on</span>
</div>
</div>
<div className="absolute bottom-6 left-6 bg-white p-4 rounded-lg shadow-sm max-w-xs">
<p className="text-sm font-bold text-on-surface">Kensington Court Gardens</p>
<p className="text-xs text-on-surface-variant">2 mins walk to Kensington High St Station</p>
</div>
</div>
</div>
</div>
{/*  Right Column: Contact Sidebar  */}
<aside className="relative">
<div className="sticky top-32 space-y-8">
{/*  Owner Card  */}
<div className="bg-surface-container-lowest p-8 rounded-xl shadow-sm border-outline-variant/15 border space-y-6">
<div className="flex items-center gap-4">
<img className="w-16 h-16 rounded-full object-cover" data-alt="Portrait of a friendly young professional woman in a creative studio environment" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB_Sigf8R-k8PPo8gnsWkCBrYGChToxMDcylBc7GSgPMIFj8jEngH4qQSw3PDKk-aVTucdaqXPtT4c2ccyKlK7VnzwMdyz7TtYRuS5fYEie0L3eNKEufYj0QKV6GYrikXophRhEwx75sOQYxxg-kxFRSXRarohKHhadhGG9YUfilMaImaYbBipeOiCwjpTd4LPmmmUvr9hwT-VkM_MDh3KsS55gffv0a0WHJZPTdLdf0XF-r0cfnR2FYB36A5rAfjNUGtv36RE-q-6w"/>
<div>
<h3 className="text-xl font-bold text-on-surface">Clara Sterling</h3>
<p className="text-sm text-on-tertiary-container flex items-center gap-1 font-semibold">
<span className="material-symbols-outlined text-sm" data-weight="fill">verified</span>
                                    Verified Owner
                                </p>
</div>
</div>
<div className="space-y-3 pt-4 border-t border-surface-container">
<div className="flex justify-between items-center text-sm">
<span className="text-on-surface-variant">Response rate</span>
<span className="font-bold text-on-surface">100%</span>
</div>
<div className="flex justify-between items-center text-sm">
<span className="text-on-surface-variant">Response time</span>
<span className="font-bold text-on-surface">Within an hour</span>
</div>
</div>
<div className="space-y-4 pt-4">
<button className="w-full signature-gradient text-white py-4 rounded-full font-bold shadow-lg flex items-center justify-center gap-2 hover:scale-[0.98] transition-all duration-200">
<span className="material-symbols-outlined">mail</span>
                                Interested
                            </button>
<button className="w-full bg-secondary-container text-on-secondary-container py-4 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-secondary-fixed transition-colors duration-200">
<span className="material-symbols-outlined">bookmark</span>
                                Save for Later
                            </button>
</div>
<p className="text-xs text-center text-on-surface-variant italic">
                            Member since May 2021
                        </p>
</div>
{/*  Roommate Preference Card  */}
<div className="bg-primary-container p-8 rounded-xl text-on-primary-container space-y-4">
<h4 className="font-bold text-lg flex items-center gap-2">
<span className="material-symbols-outlined">group</span>
                            Looking for
                        </h4>
<ul className="space-y-2 text-sm">
<li className="flex items-center gap-2"><span className="material-symbols-outlined text-xs">check_circle</span> Working professional</li>
<li className="flex items-center gap-2"><span className="material-symbols-outlined text-xs">check_circle</span> Clean and tidy</li>
<li className="flex items-center gap-2"><span className="material-symbols-outlined text-xs">check_circle</span> No smoking indoors</li>
<li className="flex items-center gap-2"><span className="material-symbols-outlined text-xs">check_circle</span> Respectful of quiet hours</li>
</ul>
</div>
</div>
</aside>
</div>
</main>
<Footer />

    </>
  );
}
