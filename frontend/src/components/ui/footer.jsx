import React from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AppLogo, AppLogoDarkText } from '@/components/ui/logo';

const FacebookIcon = (props) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>;
const TwitterIcon = (props) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>;
const InstagramIcon = (props) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>;
const GithubIcon = (props) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>;
const DribbbleIcon = (props) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32"/></svg>;

const data = {
  facebookLink: '#',
  instaLink: '#',
  twitterLink: '#',
  githubLink: '#',
  dribbbleLink: '#',
  services: {
    quotes: '/features#quotes',
    invoices: '/features#invoices',
    payments: '/features#payments',
    tracking: '/features#tracking',
  },
  about: {
    history: '/about#history',
    team: '/about#team',
    handbook: '/about#handbook',
    careers: '/about#careers',
  },
  help: {
    faqs: '/faq#faqs',
    support: '/faq#support',
    livechat: '/faq#support',
  },
  contact: {
    email: 'hello@quickquotepro.com',
    phone: '+254 745 131 817',
    address: 'Nairobi, Kenya',
  },
  company: {
    name: 'QuickQuote Pro',
    description:
      'Generate branded quotations, send them securely via email or SMS, and track customer responses from one simple dashboard.',
    logo: <div className="bg-white px-3 py-1.5 rounded-lg inline-flex items-center justify-center"><AppLogo className="h-8 w-auto sm:h-10" /></div>,
  },
};

const socialLinks = [
  { icon: FacebookIcon, label: 'Facebook', href: data.facebookLink },
  { icon: InstagramIcon, label: 'Instagram', href: data.instaLink },
  { icon: TwitterIcon, label: 'Twitter', href: data.twitterLink },
  { icon: GithubIcon, label: 'GitHub', href: data.githubLink },
  { icon: DribbbleIcon, label: 'Dribbble', href: data.dribbbleLink },
];

const aboutLinks = [
  { text: 'Company History', href: data.about.history },
  { text: 'Meet the Team', href: data.about.team },
  { text: 'Employee Handbook', href: data.about.handbook },
  { text: 'Careers', href: data.about.careers },
];

const serviceLinks = [
  { text: 'Quotations', href: data.services.quotes },
  { text: 'Invoices', href: data.services.invoices },
  { text: 'Daraja Payments', href: data.services.payments },
  { text: 'Tracking & Analytics', href: data.services.tracking },
];

const helpfulLinks = [
  { text: 'FAQs', href: data.help.faqs },
  { text: 'Support', href: data.help.support },
  { text: 'Live Chat', href: data.help.livechat, hasIndicator: true },
];

const contactInfo = [
  { icon: Mail, text: data.contact.email },
  { icon: Phone, text: data.contact.phone },
  { icon: MapPin, text: data.contact.address, isAddress: true },
];

export default function Footer() {
  return (
    <footer className="relative z-10 w-full border-t border-white/10 bg-zinc-950/40 backdrop-blur-xl">
      <div className="mx-auto max-w-screen-xl px-4 pt-16 pb-6 sm:px-6 lg:px-8 lg:pt-24 text-white">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div>
            <div className="flex justify-center sm:justify-start items-center">
              {data.company.logo}
            </div>

            <p className="mt-6 max-w-md text-center leading-relaxed sm:max-w-xs sm:text-left text-white/60">
              {data.company.description}
            </p>

            <ul className="mt-8 flex justify-center gap-6 sm:justify-start md:gap-8">
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <li key={label}>
                  <Link
                    to={href}
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    <span className="sr-only">{label}</span>
                    <Icon className="size-6" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4 lg:col-span-2">
            <div className="text-center sm:text-left">
              <p className="text-lg font-bold text-white">About Us</p>
              <ul className="mt-8 space-y-4 text-sm">
                {aboutLinks.map(({ text, href }) => (
                  <li key={text}>
                    <Link
                      className="text-white/60 hover:text-white transition-colors"
                      to={href}
                    >
                      {text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-center sm:text-left">
              <p className="text-lg font-bold text-white">Our Services</p>
              <ul className="mt-8 space-y-4 text-sm">
                {serviceLinks.map(({ text, href }) => (
                  <li key={text}>
                    <Link
                      className="text-white/60 hover:text-white transition-colors"
                      to={href}
                    >
                      {text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-center sm:text-left">
              <p className="text-lg font-bold text-white">Helpful Links</p>
              <ul className="mt-8 space-y-4 text-sm">
                {helpfulLinks.map(({ text, href, hasIndicator }) => (
                  <li key={text}>
                    <Link
                      to={href}
                      className={`text-white/60 hover:text-white transition-colors ${
                        hasIndicator
                          ? 'group flex justify-center gap-2 sm:justify-start items-center'
                          : ''
                      }`}
                    >
                      <span>{text}</span>
                      {hasIndicator && (
                        <span className="relative flex size-2">
                          <span className="bg-blue-400 absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" />
                          <span className="bg-blue-500 relative inline-flex size-2 rounded-full" />
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-center sm:text-left">
              <p className="text-lg font-bold text-white">Contact Us</p>
              <ul className="mt-8 space-y-4 text-sm">
                {contactInfo.map(({ icon: Icon, text, isAddress }) => (
                  <li key={text}>
                    <a
                      className="flex items-center justify-center gap-3 sm:justify-start text-white/60 hover:text-white transition-colors"
                      href="#"
                    >
                      <Icon className="size-5 shrink-0" />
                      {isAddress ? (
                        <address className="flex-1 not-italic">
                          {text}
                        </address>
                      ) : (
                        <span className="flex-1">
                          {text}
                        </span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-white/10 pt-8 pb-12">
          <div className="text-center sm:flex sm:justify-between sm:text-left">
            <p className="text-sm text-white/40">
              <span className="block sm:inline">All rights reserved.</span>
            </p>

            <p className="text-sm text-white/40 sm:order-first">
              &copy; 2026 {data.company.name}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
