import React from 'react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

export default function ViewRommate() {
  return (
    <>
      
<Navbar />
<main className="pt-28 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
{/*  Profile Header Strategy: Asymmetric Layout  */}
<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
{/*  Left Section (Main Content)  */}
<div className="lg:col-span-8 space-y-8">
{/*  Main Profile Card  */}
<div className="bg-surface-container-lowest rounded-xl p-8 shadow-sm">
<div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
<div className="relative w-48 h-48 md:w-64 md:h-64 flex-shrink-0">
<img alt="Elena Vance" className="w-full h-full object-cover rounded-xl shadow-md" data-alt="Close-up portrait of Elena Vance, a woman with warm eyes and curly hair, smiling softly in a brightly lit architectural studio workspace" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDiicKPuLK3awacppc7ll47vjAQmlpwNpS1lAUWA3Z7NwrJxpISfoetW2y2ANsCulo_1zwUj8lylQMAIaxTCm-iPfaLFv9tYvvyYZTUXzORVCBii47uPb1huj84uCxeYDOYMj7v5-6n8RkDvzpdOsKFdC8TuJqtLTDeCnYkEUwKHrbysFR5wbX7Z5xlSim_gGRD1W4h62GcHd8hKu3xub7nIaVXmVs5RuUrFsbGyookwkXdd-8vR4ibXGgvxyzg5aTghiVBrk0XDJEX"/>
<div className="absolute -bottom-3 -right-3 bg-on-tertiary-container text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
<span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                                Verified
                            </div>
</div>
<div className="flex-1 text-center md:text-left space-y-4">
<div>
<h1 className="text-4xl md:text-5xl font-extrabold text-primary tracking-tight">Elena Vance, 27</h1>
<p className="text-xl text-on-surface-variant font-medium mt-1">Senior UX Designer • Brooklyn, NY</p>
</div>
<div className="flex flex-wrap justify-center md:justify-start gap-2">
<span className="bg-surface-container text-on-surface px-4 py-1.5 rounded-full text-sm font-medium">Non-smoker</span>
<span className="bg-surface-container text-on-surface px-4 py-1.5 rounded-full text-sm font-medium">Pet friendly</span>
<span className="bg-surface-container text-on-surface px-4 py-1.5 rounded-full text-sm font-medium">Early bird</span>
<span className="bg-secondary-container text-on-secondary-container px-4 py-1.5 rounded-full text-sm font-bold">Vegan</span>
</div>
<p className="text-on-surface-variant leading-relaxed pt-4 max-w-xl">
                                Hi! I'm Elena. I’ve lived in NYC for five years and I’m looking for a calm, creative sanctuary to call home. I work in tech but spend my weekends exploring galleries or hiking upstate. I’m a big fan of shared dinners but also respect the need for quiet "recharge" time.
                            </p>
</div>
</div>
</div>
{/*  Secondary Content Grid (Bento Style)  */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
{/*  Interests Section  */}
<div className="bg-surface-container-low rounded-xl p-8 space-y-4">
<h3 className="text-xl font-bold text-primary flex items-center gap-2">
<span className="material-symbols-outlined text-secondary">palette</span>
                            Interests
                        </h3>
<div className="flex flex-wrap gap-3">
<div className="flex flex-col items-center justify-center w-24 h-24 bg-white rounded-xl shadow-sm border border-outline-variant/10">
<span className="material-symbols-outlined text-primary mb-1">draw</span>
<span className="text-xs font-semibold">Art</span>
</div>
<div className="flex flex-col items-center justify-center w-24 h-24 bg-white rounded-xl shadow-sm border border-outline-variant/10">
<span className="material-symbols-outlined text-primary mb-1">hiking</span>
<span className="text-xs font-semibold">Hiking</span>
</div>
<div className="flex flex-col items-center justify-center w-24 h-24 bg-white rounded-xl shadow-sm border border-outline-variant/10">
<span className="material-symbols-outlined text-primary mb-1">restaurant</span>
<span className="text-xs font-semibold">Cooking</span>
</div>
</div>
</div>
{/*  Looking For Section  */}
<div className="bg-surface-container-low rounded-xl p-8 space-y-4">
<h3 className="text-xl font-bold text-primary flex items-center gap-2">
<span className="material-symbols-outlined text-secondary">search_check</span>
                            Looking for
                        </h3>
<p className="text-on-surface-variant text-sm leading-relaxed italic">
                            "A roommate who values a clean kitchen and open communication. Ideally someone who works a standard 9-5 and enjoys the occasional Sunday brunch together."
                        </p>
</div>
</div>
{/*  Featured Space Preview  */}
<div className="bg-surface-container-low rounded-xl overflow-hidden">
<div className="p-8 pb-4">
<h3 className="text-xl font-bold text-primary">The Property</h3>
<p className="text-on-surface-variant text-sm">Sun-drenched loft in Bushwick</p>
</div>
<div className="grid grid-cols-3 gap-1 h-48">
<img alt="living room" className="w-full h-full object-cover" data-alt="minimalist modern living room with large windows, light wood floors, and many green plants in terracotta pots" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB0huWgVefcnwkypbIL4rMarjedBh5544XJastLw5_Y_69U0dRB5lPxIL5GdZgUvtMPZ65ZUEkbaqHnMq4i9MbfZmaFHRQ8kh1Im1mCPTfAZedOQybvuaOePifa_34wcOf3P5-HRiPA5ziQQbvDJnzbM4UNxTM7pbuxL59R4EQ6jdHiDX0GGGuilQ7b_IS-nknRI90rYOdH7MGC5_6Nn2rGCobNRkXcsegvDHBtUPam2HmNACfIjC6WaQGZTMdQXr6MlOFJiJrpxYG2"/>
<img alt="kitchen" className="w-full h-full object-cover" data-alt="clean white modern kitchen with marble countertops and minimalist shelving" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDROtZMf3B7X8kiiQa0x58PVHG8jRGk_eBp0Zba_5TsHH9F3RQSil1VTxbokLhM8T22xGEsZZ4LC2bhNNdL5jOt3d0mAlTwhgggIMMlNkLdObf2kRUaWglm27LFL6sAUP2cG9ej6SO5ecpnIXW-UfY_EH0XTCntQ5WdMoK2iH_y6rj1Xyj7XexdjLh5j_hro-BR6IYWOtqMFWv_DJi9q3y8WhGhEOQgn4PCXsGqdQHZDJJkgZrk6AfIqiRZQiBsqcSiJMsib0Tl7WqR"/>
<img alt="bedroom" className="w-full h-full object-cover" data-alt="cozy bedroom with linen bedding and soft warm lighting from a designer floor lamp" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC4AO6xE8xXf9-kpmpL7PziVpqoXjWXZGVm2WKO-bKcSqt6KzvPWVUiIidJB9VHcONRGp26qxTi_S3eZVzw9DK2IgQkAT4HacLWFQtp7F4pbQG34gbChkjY-bSln2ORee9Ul03-zwXIjILq23aEeeiERspZ9OcgvUqOxwDAGm7dmpkwd7QzoBmK5u2Fj15CZcPi3grOBq_ViZXDtsvC6TOHfTU1t4SVS8TM9qZHTZmkd_-8EYz88-yDj74lkR4CwFKSpXTcnhAo0cCV"/>
</div>
</div>
</div>
{/*  Right Sidebar  */}
<div className="lg:col-span-4 space-y-8 sticky top-28">
{/*  Conversation Card  */}
<div className="bg-surface-container-lowest rounded-xl p-8 shadow-sm border border-outline-variant/10">
<h3 className="text-2xl font-bold text-primary mb-6">Start a conversation</h3>
{/*  Mini Chat Preview  */}
<div className="space-y-4 mb-8">
<div className="flex gap-3 items-end">
<div className="w-8 h-8 rounded-full bg-surface-container flex-shrink-0">
<img alt="Elena" className="w-full h-full object-cover rounded-full" data-alt="small thumbnail of a smiling woman" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBw5XXgfR8VGLtuxQIWWYgqlTyE-rHvXajQxptd-PMm_k2JabpocgBIBkkPuetVrWnEowQ0mxyGSimyMFJ-ND2r48gHpmdllDtmdj6pKQYnNE9sdKVE9n66pOEqAmV-76wdFvVw14ssX59nxJxiXFOhKNiYZ0MmW8KO0n23tqBXzHEx1wmmaIL1rnpzHQiiI2gipkmSgkzQvNWwQF5qS_omkysaiGttVEAxTOECj4oL9tLU9G4j8JXZxa4dymZqqvQkbolcc4JY8X2e"/>
</div>
<div className="bg-surface-container-low px-4 py-2 rounded-xl rounded-bl-none text-sm text-on-surface-variant">
                                Hey! Saw you liked my profile. Are you still looking for a place in Brooklyn?
                            </div>
</div>
</div>
<button className="editorial-gradient w-full py-4 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2">
<span className="material-symbols-outlined">send</span>
                        Send Message
                    </button>
<p className="text-center text-xs text-on-surface-variant mt-4 font-medium uppercase tracking-widest">Typical response time: 2 hours</p>
</div>
{/*  Common Ground  */}
<div className="bg-surface-container-low rounded-xl p-8 space-y-6">
<h4 className="text-sm font-black uppercase tracking-widest text-primary flex items-center justify-between">
                        Common Ground
                        <span className="material-symbols-outlined text-secondary-container bg-secondary px-2 py-0.5 rounded-full text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
</h4>
<div className="space-y-4">
<div className="flex items-center gap-4">
<div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
<span className="material-symbols-outlined text-primary">palette</span>
</div>
<div>
<p className="text-sm font-bold">Mutual Interest: Art</p>
<p className="text-xs text-on-surface-variant">Both listed "Art" in top 3 interests</p>
</div>
</div>
<div className="flex items-center gap-4">
<div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
<span className="material-symbols-outlined text-primary">group</span>
</div>
<div>
<p className="text-sm font-bold">12 Mutual Friends</p>
<p className="text-xs text-on-surface-variant">Including Sarah L. and James W.</p>
</div>
</div>
<div className="flex items-center gap-4">
<div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
<span className="material-symbols-outlined text-primary">apartment</span>
</div>
<div>
<p className="text-sm font-bold">Preferred Neighborhood</p>
<p className="text-xs text-on-surface-variant">Both searching in North Brooklyn</p>
</div>
</div>
</div>
</div>
{/*  Quick Action Buttons  */}
<div className="flex flex-col gap-3">
<button className="bg-secondary-container text-on-secondary-container font-bold py-3 px-6 rounded-full flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
<span className="material-symbols-outlined text-xl">favorite</span>
                        Save to Favorites
                    </button>
<button className="text-on-surface-variant font-semibold py-3 px-6 rounded-full flex items-center justify-center gap-2 hover:bg-surface-container transition-colors">
<span className="material-symbols-outlined text-xl">ios_share</span>
                        Share Profile
                    </button>
</div>
</div>
</div>
</main>
<Footer />

    </>
  );
}
