import React from 'react';
import { Banknote, Truck, Award, ShieldCheck, Headphones, RefreshCw } from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const features = [
    {
      icon: Banknote,
      title: 'Cash on Delivery',
      desc: 'Pay cash directly at your doorstep once your package arrives safely.'
    },
    {
      icon: Truck,
      title: 'Fast Delivery Across BD',
      desc: 'Reliable doorstep delivery in Dhaka within 24-48h, and 2-4 days nationwide.'
    },
    {
      icon: Award,
      title: '100% Quality Products',
      desc: 'Every item is manually inspected for fabric, finishing, and packaging.'
    },
    {
      icon: ShieldCheck,
      title: 'Secure Ordering',
      desc: 'No upfront card or mobile banking risk required. Direct authentic order verification.'
    },
    {
      icon: RefreshCw,
      title: '7-Day Easy Exchange',
      desc: 'Hassle-free size and defect replacement policy for peace of mind.'
    },
    {
      icon: Headphones,
      title: 'Dedicated Customer Support',
      desc: 'Prompt assistance via phone and WhatsApp during business hours.'
    }
  ];

  return (
    <section className="py-14 bg-slate-50 border-t border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest bg-emerald-100/60 px-3 py-1 rounded-full">
            Our Promise to You
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
            Why Shop with SHOP BD BAZAR?
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Built for Bangladesh with trust, speed, and genuine product authenticity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow flex items-start gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center shrink-0">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
