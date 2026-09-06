import React, { useState, useEffect } from 'react';
import { Save, CheckCircle2, AlertCircle, Loader2, DollarSign, Store, Phone, Mail, MapPin } from 'lucide-react';
import { StoreSettings } from '../../types';
import { useAdminAuth } from '../../context/AdminAuthContext';

interface AdminSettingsViewProps {
  settings: StoreSettings | null;
  onRefresh: () => void;
}

export const AdminSettingsView: React.FC<AdminSettingsViewProps> = ({
  settings,
  onRefresh
}) => {
  const { token } = useAdminAuth();

  const [storeName, setStoreName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [email, setEmail] = useState('');
  const [storeAddress, setStoreAddress] = useState('');

  // Delivery Charges (Configurable)
  const [insideDhaka, setInsideDhaka] = useState('70');
  const [dhakaSuburbs, setDhakaSuburbs] = useState('100');
  const [outsideDhaka, setOutsideDhaka] = useState('120');

  // Hero Banner Settings
  const [bannerBadge, setBannerBadge] = useState('');
  const [bannerTitle, setBannerTitle] = useState('');
  const [bannerSubtitle, setBannerSubtitle] = useState('');

  // Social Links
  const [socialFacebook, setSocialFacebook] = useState('');
  const [socialInstagram, setSocialInstagram] = useState('');
  const [socialYoutube, setSocialYoutube] = useState('');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (settings) {
      setStoreName(settings.store_name || 'SHOP BD BAZAR');
      setContactNumber(settings.contact_number || '+880 1712-345678');
      setEmail(settings.email || 'support@shopbdbazar.com');
      setStoreAddress(settings.store_address || 'Level 4, Banani, Dhaka-1213, Bangladesh');
      setInsideDhaka(settings.delivery_inside_dhaka?.toString() || '70');
      setDhakaSuburbs(settings.delivery_dhaka_suburbs?.toString() || '100');
      setOutsideDhaka(settings.delivery_outside_dhaka?.toString() || '120');
      setBannerBadge(settings.banner_badge || 'Cash on Delivery Across All 64 Districts');
      setBannerTitle(settings.banner_title || 'Exclusive Lifestyle & Eid Collection 2026');
      setBannerSubtitle(settings.banner_subtitle || 'Premium quality handcrafted panjabis, authentic leather gear, and smart gadgets with Cash on Delivery nationwide.');
      setSocialFacebook(settings.social_facebook || 'https://facebook.com');
      setSocialInstagram(settings.social_instagram || 'https://instagram.com');
      setSocialYoutube(settings.social_youtube || 'https://youtube.com');
    }
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          store_name: storeName.trim(),
          contact_number: contactNumber.trim(),
          email: email.trim(),
          store_address: storeAddress.trim(),
          delivery_inside_dhaka: parseFloat(insideDhaka) || 70,
          delivery_dhaka_suburbs: parseFloat(dhakaSuburbs) || 100,
          delivery_outside_dhaka: parseFloat(outsideDhaka) || 120,
          banner_badge: bannerBadge.trim(),
          banner_title: bannerTitle.trim(),
          banner_subtitle: bannerSubtitle.trim(),
          social_facebook: socialFacebook.trim(),
          social_instagram: socialInstagram.trim(),
          social_youtube: socialYoutube.trim()
        })
      });

      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        onRefresh();
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(data.error || 'Failed to update settings.');
      }
    } catch (err: any) {
      setError(err.message || 'Error occurred while saving settings.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Store & Delivery Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Configure delivery rates, business information, and homepage banner content.
        </p>
      </div>

      {success && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Store settings have been successfully updated!</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 1. Delivery Charges Card (Requirement #17 & #43) */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <DollarSign className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-bold text-slate-900">
              Bangladesh Delivery Charges (৳ Taka)
            </h3>
          </div>

          <p className="text-xs text-slate-500">
            These rates are dynamically used at checkout when customers select their Division and District.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Inside Dhaka City (৳)
              </label>
              <input
                type="number"
                required
                min="0"
                value={insideDhaka}
                onChange={e => setInsideDhaka(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-extrabold text-emerald-700 outline-hidden"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Default: ৳70</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Other Dhaka Suburbs (৳)
              </label>
              <input
                type="number"
                required
                min="0"
                value={dhakaSuburbs}
                onChange={e => setDhakaSuburbs(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-extrabold text-emerald-700 outline-hidden"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Savar, Gazipur, Narayanganj (Default: ৳100)
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Outside Dhaka (৳)
              </label>
              <input
                type="number"
                required
                min="0"
                value={outsideDhaka}
                onChange={e => setOutsideDhaka(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-extrabold text-emerald-700 outline-hidden"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                All 63 Other Districts (Default: ৳120)
              </span>
            </div>
          </div>
        </div>

        {/* 2. Store Business Profile */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Store className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-bold text-slate-900">Store Profile</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Store Name
              </label>
              <input
                type="text"
                required
                value={storeName}
                onChange={e => setStoreName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Customer Support Phone
              </label>
              <input
                type="text"
                required
                value={contactNumber}
                onChange={e => setContactNumber(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm outline-hidden font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Customer Support Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Store Physical Address
              </label>
              <input
                type="text"
                value={storeAddress}
                onChange={e => setStoreAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* 3. Hero Banner Settings */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100">
            Homepage Hero Banner
          </h3>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Banner Promo Badge
              </label>
              <input
                type="text"
                value={bannerBadge}
                onChange={e => setBannerBadge(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Main Headline
              </label>
              <input
                type="text"
                value={bannerTitle}
                onChange={e => setBannerTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Subtitle Text
              </label>
              <textarea
                rows={2}
                value={bannerSubtitle}
                onChange={e => setBannerSubtitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* 4. Social Links */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100">
            Social Media Links
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Facebook Page URL
              </label>
              <input
                type="url"
                value={socialFacebook}
                onChange={e => setSocialFacebook(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Instagram URL
              </label>
              <input
                type="url"
                value={socialInstagram}
                onChange={e => setSocialInstagram(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                YouTube Channel URL
              </label>
              <input
                type="url"
                value={socialYoutube}
                onChange={e => setSocialYoutube(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs outline-hidden"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-md transition-colors flex items-center gap-2"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Save Store Settings</span>
        </button>
      </form>
    </div>
  );
};
