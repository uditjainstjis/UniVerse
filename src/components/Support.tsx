import React from 'react';
import { 
  LifeBuoy, 
  Phone, 
  Mail, 
  Shield, 
  BookOpen, 
  MessageCircle,
  ExternalLink,
  ChevronRight,
  HelpCircle
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

const Support: React.FC = () => {
  const contacts = [
    { role: 'Warden Office', name: 'Dr. Rajesh Kumar', phone: '+91 98765 43210', email: 'warden@univ.edu', icon: Shield },
    { role: 'IT Support', name: 'Campus Tech Desk', phone: '+91 11223 34455', email: 'it.support@univ.edu', icon: LifeBuoy },
    { role: 'Counseling', name: 'Student Wellness', phone: '+91 55667 78899', email: 'wellness@univ.edu', icon: HelpCircle },
  ];

  const faqs = [
    { q: 'How to reset my campus WiFi password?', a: 'Visit the IT portal at portal.univ.edu or visit Block B, Room 102.' },
    { q: 'What are the library timings?', a: 'The central library is open 24/7 during exam weeks, otherwise 8 AM to 10 PM.' },
    { q: 'How to apply for a room change?', a: 'Room change requests are open during the first week of each semester via the Warden portal.' },
  ];

  return (
    <div className="max-w-5xl mx-auto pt-8 pb-24 px-4">
      <div className="mb-12">
        <h2 className="text-4xl font-black text-white tracking-tighter mb-2">Campus Support</h2>
        <p className="text-white/40 text-sm font-medium">Everything you need to navigate campus life smoothly.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
        {contacts.map((contact, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white/5 border border-white/10 rounded-[40px] p-8 hover:bg-white/[0.08] transition-all group"
          >
            <div className="p-4 rounded-2xl bg-orange-500/10 text-orange-500 w-fit mb-6 group-hover:scale-110 transition-transform">
              <contact.icon className="w-8 h-8" />
            </div>
            <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-1">{contact.role}</p>
            <h3 className="text-2xl font-black text-white mb-6 tracking-tight">{contact.name}</h3>
            
            <div className="space-y-4">
              <a href={`tel:${contact.phone}`} className="flex items-center space-x-3 text-white/60 hover:text-white transition-colors">
                <div className="p-2 rounded-lg bg-white/5">
                  <Phone className="w-4 h-4" />
                </div>
                <span className="text-sm font-bold">{contact.phone}</span>
              </a>
              <a href={`mailto:${contact.email}`} className="flex items-center space-x-3 text-white/60 hover:text-white transition-colors">
                <div className="p-2 rounded-lg bg-white/5">
                  <Mail className="w-4 h-4" />
                </div>
                <span className="text-sm font-bold">{contact.email}</span>
              </a>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* FAQs */}
        <div className="space-y-8">
          <h3 className="text-2xl font-black text-white tracking-tight flex items-center space-x-3">
            <HelpCircle className="w-6 h-6 text-orange-500" />
            <span>Frequently Asked Questions</span>
          </h3>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="p-6 rounded-3xl bg-white/5 border border-white/5 hover:border-white/20 transition-all">
                <h4 className="font-bold text-white mb-2 flex items-start space-x-3">
                  <span className="text-orange-500">Q:</span>
                  <span>{faq.q}</span>
                </h4>
                <p className="text-sm text-white/40 leading-relaxed pl-7">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Resources */}
        <div className="space-y-8">
          <h3 className="text-2xl font-black text-white tracking-tight flex items-center space-x-3">
            <BookOpen className="w-6 h-6 text-orange-500" />
            <span>Quick Resources</span>
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {[
              { label: 'Academic Calendar 2026', desc: 'Important dates and holidays' },
              { label: 'Campus Map (Interactive)', desc: 'Find your way around Block A to Z' },
              { label: 'Hostel Rules & Regulations', desc: 'Updated for 2026' },
              { label: 'Student Portal', desc: 'Grades, attendance, and more' },
            ].map((res, i) => (
              <button key={i} className="flex items-center justify-between p-6 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all group text-left">
                <div>
                  <h4 className="font-bold text-white mb-1 group-hover:text-orange-500 transition-colors">{res.label}</h4>
                  <p className="text-xs text-white/40">{res.desc}</p>
                </div>
                <ExternalLink className="w-5 h-5 text-white/20 group-hover:text-white transition-colors" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
