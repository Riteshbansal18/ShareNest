import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Section = ({ title, children }) => (
  <div className="mb-8">
    <h2 className="text-xl font-bold text-slate-900 mb-3 border-l-4 border-blue-600 pl-4">{title}</h2>
    <div className="text-slate-600 leading-relaxed space-y-3 text-sm">{children}</div>
  </div>
);

export default function TermsOfService() {
  return (
    <>
      <Navbar />
      <main className="pt-28 pb-20 px-4 max-w-3xl mx-auto">
        <div className="mb-10">
          <span className="text-blue-600 font-bold text-xs uppercase tracking-widest">Legal</span>
          <h1 className="text-4xl font-extrabold text-slate-900 mt-2">Terms of Service</h1>
          <p className="text-slate-500 mt-2 text-sm">Last updated: April 2026</p>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 mb-10 text-sm text-blue-800">
          By using ShareNest, you agree to these terms. Please read them carefully.
        </div>

        <Section title="1. Acceptance of Terms">
          <p>By accessing or using ShareNest ("the Platform"), you agree to be bound by these Terms of Service. If you do not agree, please do not use the Platform.</p>
          <p>ShareNest is a platform connecting property owners with potential tenants. These terms apply to all users including property owners, tenants, and visitors.</p>
        </Section>

        <Section title="2. Use of the Platform">
          <p>You agree to:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Provide accurate and truthful information when creating an account or listing</li>
            <li>Not post fake, misleading, or fraudulent listings</li>
            <li>Not use the platform for any illegal activity</li>
            <li>Not harass, abuse, or harm other users</li>
            <li>Be at least 18 years of age to use the platform</li>
            <li>Not scrape, copy, or reproduce platform content without permission</li>
          </ul>
        </Section>

        <Section title="3. Property Listings">
          <p>Property owners are solely responsible for the accuracy of their listings. ShareNest does not verify every listing and is not liable for inaccurate information provided by owners.</p>
          <p>All new listings go through an admin moderation process before going live. We reserve the right to reject or remove any listing that violates our policies.</p>
          <p>ShareNest charges zero brokerage. We do not take any commission from bookings made on the platform.</p>
        </Section>

        <Section title="4. Bookings">
          <p>Booking requests made on ShareNest are not legally binding contracts. They are expressions of interest between tenants and property owners.</p>
          <p>ShareNest is not a party to any rental agreement between users. Any disputes between tenants and owners must be resolved between themselves.</p>
          <p>We strongly recommend verifying the property in person before making any payment.</p>
        </Section>

        <Section title="5. User Accounts">
          <p>You are responsible for maintaining the confidentiality of your account credentials. You are responsible for all activity that occurs under your account.</p>
          <p>We reserve the right to suspend or terminate accounts that violate these terms, engage in fraudulent activity, or harm other users.</p>
        </Section>

        <Section title="6. Intellectual Property">
          <p>All content on ShareNest including logos, design, and code is owned by ShareNest. You may not copy, reproduce, or distribute any part of the platform without written permission.</p>
          <p>By posting content (listings, photos, reviews) on ShareNest, you grant us a non-exclusive license to display that content on the platform.</p>
        </Section>

        <Section title="7. Limitation of Liability">
          <p>ShareNest is provided "as is" without warranties of any kind. We are not liable for:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Inaccurate listing information provided by owners</li>
            <li>Disputes between tenants and property owners</li>
            <li>Any financial loss arising from bookings made on the platform</li>
            <li>Temporary unavailability of the platform</li>
          </ul>
        </Section>

        <Section title="8. Privacy">
          <p>Your use of ShareNest is also governed by our Privacy Policy. Please review it to understand how we collect and use your data.</p>
        </Section>

        <Section title="9. Changes to Terms">
          <p>We may update these terms from time to time. Continued use of the platform after changes constitutes acceptance of the new terms. We will notify users of significant changes via email.</p>
        </Section>

        <Section title="10. Contact">
          <p>For any questions about these terms, contact us at <span className="text-blue-600 font-semibold">support@sharenest.in</span></p>
        </Section>
      </main>
      <Footer />
    </>
  );
}
