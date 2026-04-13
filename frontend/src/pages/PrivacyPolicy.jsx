import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Section = ({ title, children }) => (
  <div className="mb-8">
    <h2 className="text-xl font-bold text-slate-900 mb-3 border-l-4 border-blue-600 pl-4">{title}</h2>
    <div className="text-slate-600 leading-relaxed space-y-3 text-sm">{children}</div>
  </div>
);

export default function PrivacyPolicy() {
  return (
    <>
      <Navbar />
      <main className="pt-28 pb-20 px-4 max-w-3xl mx-auto">
        <div className="mb-10">
          <span className="text-blue-600 font-bold text-xs uppercase tracking-widest">Legal</span>
          <h1 className="text-4xl font-extrabold text-slate-900 mt-2">Privacy Policy</h1>
          <p className="text-slate-500 mt-2 text-sm">Last updated: April 2026</p>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 mb-10 text-sm text-blue-800">
          Your privacy matters to us. This policy explains what data we collect, how we use it, and your rights.
        </div>

        <Section title="1. Information We Collect">
          <p>We collect the following information when you use ShareNest:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><span className="font-semibold">Account info:</span> Name, email address, phone number, profile photo</li>
            <li><span className="font-semibold">Listing info:</span> Property address, photos, price, description</li>
            <li><span className="font-semibold">Usage data:</span> Pages visited, search queries, booking history</li>
            <li><span className="font-semibold">Messages:</span> Conversations between users on the platform</li>
            <li><span className="font-semibold">Device info:</span> Browser type, IP address, operating system</li>
          </ul>
        </Section>

        <Section title="2. How We Use Your Information">
          <p>We use your information to:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Create and manage your account</li>
            <li>Display your listings to potential tenants</li>
            <li>Send OTP verification and password reset emails</li>
            <li>Send booking notifications and platform updates</li>
            <li>Improve platform features and user experience</li>
            <li>Detect and prevent fraud or abuse</li>
          </ul>
        </Section>

        <Section title="3. Data Sharing">
          <p>We do not sell your personal data to third parties. We may share data with:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><span className="font-semibold">Other users:</span> Your public profile (name, photo, listings) is visible to other users</li>
            <li><span className="font-semibold">Service providers:</span> Email services (Gmail/Nodemailer) for sending notifications</li>
            <li><span className="font-semibold">Legal authorities:</span> If required by law or to protect user safety</li>
          </ul>
        </Section>

        <Section title="4. Data Storage & Security">
          <p>Your data is stored securely on MongoDB Atlas (cloud database) with encryption at rest. We use JWT tokens for authentication and bcrypt for password hashing.</p>
          <p>While we take reasonable security measures, no system is 100% secure. We encourage you to use a strong password and not share your credentials.</p>
        </Section>

        <Section title="5. Cookies">
          <p>ShareNest uses localStorage to store your login session (JWT token and user data). We do not use tracking cookies or third-party advertising cookies.</p>
        </Section>

        <Section title="6. Your Rights">
          <p>You have the right to:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Access the personal data we hold about you</li>
            <li>Update or correct your information via your dashboard</li>
            <li>Delete your account and associated data</li>
            <li>Opt out of non-essential communications</li>
          </ul>
          <p>To exercise these rights, contact us at <span className="text-blue-600 font-semibold">support@sharenest.in</span></p>
        </Section>

        <Section title="7. Children's Privacy">
          <p>ShareNest is not intended for users under 18 years of age. We do not knowingly collect data from minors. If you believe a minor has created an account, please contact us immediately.</p>
        </Section>

        <Section title="8. Third-Party Links">
          <p>Our platform may contain links to external websites. We are not responsible for the privacy practices of those sites. We encourage you to review their privacy policies.</p>
        </Section>

        <Section title="9. Changes to This Policy">
          <p>We may update this Privacy Policy from time to time. We will notify you of significant changes via email or a notice on the platform. Continued use after changes means you accept the updated policy.</p>
        </Section>

        <Section title="10. Contact Us">
          <p>For any privacy-related questions or requests, reach us at:</p>
          <p className="font-semibold text-slate-800">Email: <span className="text-blue-600">support@sharenest.in</span></p>
          <p className="font-semibold text-slate-800">Platform: ShareNest, India</p>
        </Section>
      </main>
      <Footer />
    </>
  );
}
