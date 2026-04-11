import React from 'react';

import { Link } from 'react-router-dom';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <>
      
<Navbar />
<main className="pt-20">
{/*  Hero Section  */}
<section className="relative min-h-[870px] flex items-center justify-center overflow-hidden bg-surface">
<div className="absolute inset-0 z-0">
<div className="absolute inset-0 bg-gradient-to-b from-transparent via-surface/60 to-surface z-10"></div>
<img className="w-full h-full object-cover" data-alt="architectural interior of a modern sunlit apartment with floor-to-ceiling windows and minimalist furniture in warm daylight" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDO3cV5tUnvjaiNDjeUCaei6rrewfZKaUmBi4yjSrGsI93j6ZhTlCAB1tC04b1lhtTwwI2iRivba4tsNnsHQ53GJFqofuoigw20o5JynVnql2kBF7u_HuBnfEKVHBWys0Xah356eQ9bPytGzjFv5AgNILM4O3LtqTJNzG_d4cbYxauUZeFDl6XpodqNYb45LZV9C40UX0s2NAw4WyrWZrYz9hr2zVvCTifUXSzuFTyVQ8UdH8znzULlYClZGLQOnWOp6mTDWKhWrawc"/>
</div>
<div className="relative z-20 w-full max-w-7xl mx-auto px-8 text-center md:text-left">
<div className="max-w-3xl">
<h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter text-on-surface mb-6 leading-[0.9]">
                        Elevate <br/>Your <span className="text-primary-container">Living</span>.
                    </h1>
<p className="text-xl md:text-2xl text-on-surface-variant font-body mb-12 leading-relaxed opacity-90 max-w-xl">
                        Discover a curated collection of modern homes and compatible connections designed for the way you live today.
                    </p>
{/*  Search Bar  */}
<div className="bg-surface-container-lowest p-4 rounded-3xl md:rounded-full editorial-shadow flex flex-col md:flex-row items-stretch md:items-center gap-2 max-w-4xl">
<div className="flex-1 px-6 py-3 md:border-r border-outline-variant/15 group">
<label className="block text-[10px] uppercase tracking-widest font-bold text-on-surface-variant/60 mb-1">Location</label>
<div className="flex items-center">
<span className="material-symbols-outlined text-primary text-xl mr-2" data-icon="location_on">location_on</span>
<input className="w-full bg-transparent border-none focus:ring-0 text-on-surface font-bold p-0" placeholder="Where to?" type="text"/>
</div>
</div>
<div className="flex-1 px-6 py-3 md:border-r border-outline-variant/15 group">
<label className="block text-[10px] uppercase tracking-widest font-bold text-on-surface-variant/60 mb-1">Budget</label>
<div className="flex items-center">
<span className="material-symbols-outlined text-primary text-xl mr-2" data-icon="payments">payments</span>
<input className="w-full bg-transparent border-none focus:ring-0 text-on-surface font-bold p-0" placeholder="Your range" type="text"/>
</div>
</div>
<div className="flex-1 px-6 py-3 group">
<label className="block text-[10px] uppercase tracking-widest font-bold text-on-surface-variant/60 mb-1">Type</label>
<select className="w-full bg-transparent border-none focus:ring-0 text-on-surface font-bold p-0 appearance-none">
<option>PG / Co-Living</option>
<option>Whole Flat</option>
<option>Private Room</option>
</select>
</div>
<button className="primary-gradient text-white h-14 w-full md:w-14 rounded-full flex items-center justify-center hover:scale-95 transition-transform shrink-0">
<span className="material-symbols-outlined" data-icon="search">search</span>
</button>
</div>
</div>
</div>
</section>
{/*  Popular Filters (Horizontal Flow)  */}
<section className="py-12 bg-surface">
<div className="max-w-7xl mx-auto px-8 overflow-x-auto whitespace-nowrap pb-4 scrollbar-hide">
<div className="flex items-center space-x-3">
<span className="text-on-surface-variant font-bold text-sm mr-4">Popular:</span>
<button className="bg-secondary-fixed text-on-secondary-fixed px-6 py-2.5 rounded-full font-bold text-sm hover:scale-95 transition-all">Verified Only</button>
<button className="bg-surface-container-high text-on-surface-variant px-6 py-2.5 rounded-full font-bold text-sm hover:bg-surface-container-highest transition-all">Near Metro</button>
<button className="bg-surface-container-high text-on-surface-variant px-6 py-2.5 rounded-full font-bold text-sm hover:bg-surface-container-highest transition-all">Pet Friendly</button>
<button className="bg-surface-container-high text-on-surface-variant px-6 py-2.5 rounded-full font-bold text-sm hover:bg-surface-container-highest transition-all">Fully Furnished</button>
<button className="bg-surface-container-high text-on-surface-variant px-6 py-2.5 rounded-full font-bold text-sm hover:bg-surface-container-highest transition-all">No Brokerage</button>
<button className="bg-surface-container-high text-on-surface-variant px-6 py-2.5 rounded-full font-bold text-sm hover:bg-surface-container-highest transition-all">Girls PG</button>
</div>
</div>
</section>
{/*  Featured Listings  */}
<section className="py-24 bg-surface-container-low">
<div className="max-w-7xl mx-auto px-8">
<div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
<div>
<span className="text-secondary font-bold tracking-[0.2em] text-xs uppercase mb-4 block">Curated Listings</span>
<h2 className="text-5xl font-black text-on-surface tracking-tight">Handpicked sanctuaries</h2>
</div>
<button className="text-primary font-bold flex items-center group">
                        Explore all listings
                        <span className="material-symbols-outlined ml-2 group-hover:translate-x-2 transition-transform" data-icon="arrow_forward">arrow_forward</span>
</button>
</div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-12">
{/*  Listing Card 1  */}
<div className="bg-surface-container-lowest rounded-3xl overflow-hidden editorial-shadow group cursor-pointer transition-transform hover:-translate-y-2">
<div className="h-80 relative">
<img className="w-full h-full object-cover" data-alt="interior of a high-end luxury bedroom with teal accents and warm ambient lighting from designer floor lamps" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB4Cc1eCALUtS95cpGv77lRjaOl42HRV_mdb1WnZRbrVLLmDdVeLwN_mqgjMqoPR4VdDrhIdcmv1WH2NQ9oGr-rf-T_xbsl8jqXr5NK3NMB4Z8cXkMRUh4rbk7j4ly2GF8aUaDyZGgdor_kRBK2aE1dVEsvBkBZhERrrMVeafos7YQeJmKUTFEuOEK8yr_zC7O_q0rXcZgBeFBRFEKy81DEtotHdQmw350OVCaaT8gQCmBjUnZO85Adn4pQkgPWMlclDtrSIMPxVnZl"/>
<div className="absolute top-4 right-4 bg-surface/90 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-primary flex items-center">
<span className="material-symbols-outlined text-sm mr-1" data-icon="verified" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                                Verified
                            </div>
</div>
<div className="p-8">
<div className="flex justify-between items-start mb-4">
<h3 className="text-2xl font-bold text-on-surface">The Nordic Nest</h3>
<div className="text-right">
<span className="text-xl font-extrabold text-primary">$1,200</span>
<span className="block text-[10px] text-on-surface-variant font-bold uppercase">/ month</span>
</div>
</div>
<p className="text-on-surface-variant text-sm mb-6 line-clamp-2">A minimalist's dream in the heart of downtown. Fully furnished with sustainable materials.</p>
<div className="flex items-center gap-4 text-xs font-bold text-on-surface-variant">
<span className="flex items-center"><span className="material-symbols-outlined mr-1 text-base" data-icon="bed">bed</span> 1 Room</span>
<span className="flex items-center"><span className="material-symbols-outlined mr-1 text-base" data-icon="wifi">wifi</span> Gigabit Fiber</span>
</div>
</div>
</div>
{/*  Listing Card 2  */}
<div className="bg-surface-container-lowest rounded-3xl overflow-hidden editorial-shadow group cursor-pointer transition-transform hover:-translate-y-2">
<div className="h-80 relative">
<img className="w-full h-full object-cover" data-alt="sunny open plan living room with lots of green houseplants and a comfortable grey sofa in an urban apartment" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBXO1SGnyrCkU2f4VTtBvk83FAyzTX6es0pHN_StihxyyJTYamI4jLqcJ_KND9W2lUtFWm7AZF7mgZBFiw_Oj1_jehAz-Y5nVSg_oNeK7ljV8fHgW5xhSZ41mq9QIYoASaJ7tO-qHYhOSnMmxJs7hWDX2XbOMBni7z2OB3GzFCKLOLNYMxile0tzdJsiEXhbJRfxZURhkZp4tqiXaCkcDSa4_0t32VzKi5uW0fM4UlWhthOchkbnWL7xKbIMpf8f9NyuVIQXS9cti_b"/>
<div className="absolute top-4 right-4 bg-tertiary-fixed text-on-tertiary-fixed px-4 py-1.5 rounded-full text-xs font-bold flex items-center">
                                Popular
                            </div>
</div>
<div className="p-8">
<div className="flex justify-between items-start mb-4">
<h3 className="text-2xl font-bold text-on-surface">Urban Oasis PG</h3>
<div className="text-right">
<span className="text-xl font-extrabold text-primary">$850</span>
<span className="block text-[10px] text-on-surface-variant font-bold uppercase">/ month</span>
</div>
</div>
<p className="text-on-surface-variant text-sm mb-6 line-clamp-2">Community focused co-living with shared rooftop garden and weekly house events.</p>
<div className="flex items-center gap-4 text-xs font-bold text-on-surface-variant">
<span className="flex items-center"><span className="material-symbols-outlined mr-1 text-base" data-icon="groups">groups</span> 3 Roommates</span>
<span className="flex items-center"><span className="material-symbols-outlined mr-1 text-base" data-icon="coffee">coffee</span> Cafe On-site</span>
</div>
</div>
</div>
{/*  Listing Card 3  */}
<div className="bg-surface-container-lowest rounded-3xl overflow-hidden editorial-shadow group cursor-pointer transition-transform hover:-translate-y-2">
<div className="h-80 relative">
<img className="w-full h-full object-cover" data-alt="modern industrial style loft with exposed brick walls and high ceilings with large industrial windows" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBp2tmirz3QFqBEl8C4mjxXho_XeWPzfH3hsVSFsZoa7mX1DMKkkYQY2dTPgRfb0BQD-KFp2axwoMwPvZZP1LyM9OOqedTkyQHEv806rQyo7QY_9YThsmr_k3QB078vPzKY65pmHEq10RrqhBSZpOJKQNnLEKHj0gVx0B4VHw0Td9HcsRT-gklRHrIivCToXlVxIKFRKo9EerxAeT_psvYe14nDJW5Go8bdCD_8gz4zJshl57UOcaBHmCX847x3D96vPS30ZStZhfW5"/>
</div>
<div className="p-8">
<div className="flex justify-between items-start mb-4">
<h3 className="text-2xl font-bold text-on-surface">Loft 712</h3>
<div className="text-right">
<span className="text-xl font-extrabold text-primary">$2,400</span>
<span className="block text-[10px] text-on-surface-variant font-bold uppercase">/ month</span>
</div>
</div>
<p className="text-on-surface-variant text-sm mb-6 line-clamp-2">Authentic industrial loft conversion with high ceilings and private elevator access.</p>
<div className="flex items-center gap-4 text-xs font-bold text-on-surface-variant">
<span className="flex items-center"><span className="material-symbols-outlined mr-1 text-base" data-icon="aspect_ratio">aspect_ratio</span> 1200 sqft</span>
<span className="flex items-center"><span className="material-symbols-outlined mr-1 text-base" data-icon="local_parking">local_parking</span> Parking</span>
</div>
</div>
</div>
</div>
</div>
</section>
{/*  CTA Section  */}
<section className="py-24 bg-surface">
<div className="max-w-7xl mx-auto px-8">
<div className="primary-gradient rounded-[3rem] p-12 md:p-20 relative overflow-hidden flex flex-col md:flex-row items-center gap-16">
<div className="absolute top-0 right-0 w-1/3 h-full bg-white/5 skew-x-12 transform translate-x-20"></div>
<div className="relative z-10 flex-1">
<h2 className="text-4xl md:text-6xl font-black text-white leading-tight mb-8">Not just a room,<br/>a compatible life.</h2>
<p className="text-lg text-primary-fixed-dim font-body mb-12 max-w-lg leading-relaxed">
                            Our proprietary algorithm matches you based on lifestyle habits, personality, and values. Stop searching for roommates, start finding family.
                        </p>
<div className="flex flex-wrap gap-4">
<button className="bg-secondary-fixed text-on-secondary-fixed font-bold px-10 py-5 rounded-full hover:scale-105 transition-all shadow-xl">Find Your Roommate</button>
<button className="bg-white/10 backdrop-blur-md text-white font-bold px-10 py-5 rounded-full border border-white/20 hover:bg-white/20 transition-all">How it Works</button>
</div>
</div>
<div className="relative z-10 flex-1 w-full max-w-md">
<div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/10 editorial-shadow">
<div className="flex items-center gap-4 mb-8">
<div className="w-16 h-16 rounded-full overflow-hidden border-2 border-secondary-fixed">
<img className="w-full h-full object-cover" data-alt="professional portrait of a young creative woman smiling in a natural office setting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBjcMnN1rqM3-8LFnoIjVl-NNIiRb-FpaipCPa2klYDyR3Fjv9o0fcEI7VDw_Z7OnL121PBtMhBrQ8vSMEPRcYNZTsJGykVCIRozUdY7PmIjsknXxFv3FXGSBlzqHvRqWi2iny0xZ8Kmv6xEAP3KuaARz5xzFwJo84FvWnig_jND5f4XPgLLxzIyai2tPAnV_RJj3_wxXj1YAILWccYTGAlN6JvSx8YTcCExgmzQv556_IBsfFTauAEeqDaC4fnXTU1ZiY7WWrMJk1Q"/>
</div>
<div>
<h4 className="text-white font-bold">Sarah Jenkins</h4>
<p className="text-white/60 text-xs uppercase tracking-widest font-bold">Graphic Designer</p>
</div>
</div>
<div className="space-y-4 mb-8">
<div className="flex justify-between items-center bg-white/5 p-4 rounded-xl">
<span className="text-white/80 text-sm">Cleanliness</span>
<div className="flex gap-1">
<div className="w-2 h-2 rounded-full bg-secondary-fixed"></div>
<div className="w-2 h-2 rounded-full bg-secondary-fixed"></div>
<div className="w-2 h-2 rounded-full bg-secondary-fixed"></div>
<div className="w-2 h-2 rounded-full bg-secondary-fixed"></div>
<div className="w-2 h-2 rounded-full bg-white/20"></div>
</div>
</div>
<div className="flex justify-between items-center bg-white/5 p-4 rounded-xl">
<span className="text-white/80 text-sm">Social level</span>
<div className="flex gap-1">
<div className="w-2 h-2 rounded-full bg-secondary-fixed"></div>
<div className="w-2 h-2 rounded-full bg-secondary-fixed"></div>
<div className="w-2 h-2 rounded-full bg-white/20"></div>
<div className="w-2 h-2 rounded-full bg-white/20"></div>
<div className="w-2 h-2 rounded-full bg-white/20"></div>
</div>
</div>
</div>
<button className="w-full bg-white text-primary font-black py-4 rounded-full flex items-center justify-center gap-2">
<span className="material-symbols-outlined" data-icon="bolt">bolt</span>
                                Connect with Sarah
                            </button>
</div>
</div>
</div>
</div>
</section>
</main>
<Footer />

    </>
  );
}
