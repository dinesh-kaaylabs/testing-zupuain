import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { useAppSelector } from '../../hooks';
import { lowerCaseAllLetters } from '../../utils/commonUtils';

const Footer: React.FC = () => {
  const { defaultTenant } = useAppSelector((state) => state.tenant);
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Careers', href: '/careers' },
      { name: 'Press', href: '/press' },
      { name: 'Blog', href: '/blog' },
    ],
    support: [
      { name: 'Help Center', href: '/help' },
      { name: 'Contact Us', href: '/contact' },
      { name: 'Shipping Info', href: '/shipping' },
      { name: 'Returns', href: '/returns' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Cookie Policy', href: '/cookies' },
      { name: 'Accessibility', href: '/accessibility' },
    ],
  };

  const socialLinks = [
    { name: 'Facebook', href: '#', icon: Facebook },
    { name: 'Twitter', href: '#', icon: Twitter },
    { name: 'Instagram', href: '#', icon: Instagram },
  ];

  return (
    <footer className="bg-text text-surface">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center space-x-3 mb-4">
              <img
                src={defaultTenant?.setting?.brand_logo || "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=40&h=40&fit=crop&crop=center"}
                alt="LuxeHome"
                className="h-10 w-10 rounded-lg object-cover"
              />
              <span className="text-2xl font-bold text-primary">LuxeHome</span>
            </Link>
            <p className="text-textSecondary mb-6 leading-relaxed">
              Discover premium home decor and lifestyle products that transform your space into a sanctuary of style and comfort.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              {defaultTenant?.setting?.email_address && (
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <span className="text-sm">{defaultTenant.setting.email_address}</span>
                </div>
              )}
              {defaultTenant?.setting?.phone && (
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-primary" />
                  <span className="text-sm">{defaultTenant.setting.phone}</span>
                </div>
              )}
              {defaultTenant?.setting?.address_1 && (
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-primary mt-0.5" />
                  <span className="text-sm leading-relaxed">
                    {defaultTenant.setting.address_1}
                    {defaultTenant.setting.district_details && `, ${lowerCaseAllLetters(defaultTenant.setting.district_details.district_name)}`}
                    {defaultTenant.setting.state_details && `, ${lowerCaseAllLetters(defaultTenant.setting.state_details.state_name)}`}
                    {defaultTenant.setting.pincode && ` ${defaultTenant.setting.pincode}`}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-primary">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-textSecondary hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-primary">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-textSecondary hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-primary">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-textSecondary hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <p className="text-textSecondary text-sm">
              © {currentYear} LuxeHome. All rights reserved.
            </p>

            {/* Social Links */}
            <div className="flex items-center space-x-6">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    className="text-textSecondary hover:text-primary transition-colors"
                    aria-label={social.name}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
