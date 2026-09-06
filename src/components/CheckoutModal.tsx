import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Truck, Banknote, AlertCircle, Loader2 } from 'lucide-react';
import { Product, StoreSettings, Order } from '../types';
import { BANGLADESH_DATA, calculateDeliveryCharge } from '../data/bangladeshData';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  selectedSize?: string;
  selectedColor?: string;
  initialQuantity?: number;
  settings: StoreSettings | null;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  product,
  selectedSize: initialSize,
  selectedColor: initialColor,
  initialQuantity = 1,
  settings,
  onOrderSuccess
}) => {
  // Variants and quantity
  const [size, setSize] = useState<string | undefined>(
    initialSize || (product.sizes && product.sizes.length > 0 ? product.sizes[0] : undefined)
  );
  const [color, setColor] = useState<string | undefined>(
    initialColor || (product.colors && product.colors.length > 0 ? product.colors[0] : undefined)
  );
  const [quantity, setQuantity] = useState<number>(initialQuantity);

  // Customer Address Form
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [altPhone, setAltPhone] = useState('');
  
  // Cascading Address Fields
  const [selectedDivision, setSelectedDivision] = useState('Dhaka');
  const [selectedDistrict, setSelectedDistrict] = useState('Dhaka');
  const [selectedUpazila, setSelectedUpazila] = useState('Dhanmondi');
  const [area, setArea] = useState('');
  const [fullAddress, setFullAddress] = useState('');
  const [deliveryNote, setDeliveryNote] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Sync state if product changes
  useEffect(() => {
    setSize(initialSize || (product.sizes && product.sizes.length > 0 ? product.sizes[0] : undefined));
    setColor(initialColor || (product.colors && product.colors.length > 0 ? product.colors[0] : undefined));
    setQuantity(initialQuantity);
  }, [product, initialSize, initialColor, initialQuantity]);

  if (!isOpen) return null;

  // Available districts for selected division
  const currentDivisionObj = BANGLADESH_DATA.divisions.find(d => d.name === selectedDivision);
  const availableDistricts = currentDivisionObj ? currentDivisionObj.districts : [];

  // Available upazilas for selected district
  const currentDistrictObj = availableDistricts.find(d => d.name === selectedDistrict);
  const availableUpazilas = currentDistrictObj ? currentDistrictObj.upazilas : [];

  // Dynamic delivery charge calculation
  const deliveryRates = {
    inside_dhaka: settings?.delivery_inside_dhaka ?? 70,
    dhaka_suburbs: settings?.delivery_dhaka_suburbs ?? 100,
    outside_dhaka: settings?.delivery_outside_dhaka ?? 120
  };

  const { amount: deliveryCharge, zone: deliveryZoneName } = calculateDeliveryCharge(
    selectedDivision,
    selectedDistrict,
    selectedUpazila,
    deliveryRates
  );

  const productTotal = product.price * quantity;
  const grandTotal = productTotal + deliveryCharge;

  // Handlers for cascading change
  const handleDivisionChange = (newDivision: string) => {
    setSelectedDivision(newDivision);
    const divObj = BANGLADESH_DATA.divisions.find(d => d.name === newDivision);
    if (divObj && divObj.districts.length > 0) {
      const firstDist = divObj.districts[0];
      setSelectedDistrict(firstDist.name);
      setSelectedUpazila(firstDist.upazilas.length > 0 ? firstDist.upazilas[0] : '');
    } else {
      setSelectedDistrict('');
      setSelectedUpazila('');
    }
  };

  const handleDistrictChange = (newDistrict: string) => {
    setSelectedDistrict(newDistrict);
    const distObj = availableDistricts.find(d => d.name === newDistrict);
    if (distObj && distObj.upazilas.length > 0) {
      setSelectedUpazila(distObj.upazilas[0]);
    } else {
      setSelectedUpazila('');
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Validation
    if (!fullName.trim() || fullName.trim().length < 2) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    const cleanPhone = phone.replace(/[\s-]/g, '');
    const bdRegex = /^(?:\+?88)?01[3-9]\d{8}$/;
    if (!bdRegex.test(cleanPhone)) {
      setErrorMessage('Please enter a valid 11-digit Bangladesh phone number (e.g. 01712345678).');
      return;
    }

    if (!selectedDivision || !selectedDistrict || !selectedUpazila) {
      setErrorMessage('Please select your Division, District, and Upazila.');
      return;
    }

    if (!fullAddress.trim() || fullAddress.trim().length < 5) {
      setErrorMessage('Please provide your complete delivery address (House, Road, etc.).');
      return;
    }

    if (product.sizes && product.sizes.length > 0 && !size) {
      setErrorMessage('Please select a size for this product.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: fullName.trim(),
          phone: cleanPhone,
          alternative_phone: altPhone.trim() || undefined,
          division: selectedDivision,
          district: selectedDistrict,
          upazila: selectedUpazila,
          area: area.trim() || undefined,
          address: fullAddress.trim(),
          delivery_note: deliveryNote.trim() || undefined,
          product_id: product.id,
          selected_size: size,
          selected_color: color,
          quantity: quantity,
          delivery_charge: deliveryCharge
        })
      });

      const json = await res.json();
      if (json.success && json.data) {
        onOrderSuccess(json.data);
      } else {
        setErrorMessage(json.error || 'Failed to submit order. Please try again.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Network error occurred while submitting order.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200 my-8"
        id="checkout-modal-container"
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/30 flex items-center justify-center">
              <Banknote className="w-4 h-4 text-emerald-300" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold leading-tight">
                Cash on Delivery Checkout
              </h2>
              <p className="text-xs text-emerald-200">
                Confirm your order • Pay in cash when you receive
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmitOrder} className="p-5 sm:p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* 1. Product Summary & Variant Selector */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/90 space-y-3">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Product Order Summary
            </h3>
            <div className="flex gap-3 sm:gap-4 items-center">
              <img
                src={product.images[0] || ''}
                alt={product.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border border-slate-200 bg-white shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-slate-900 truncate">{product.name}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-base font-extrabold text-emerald-700">
                    ৳{product.price.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-slate-400">each</span>
                </div>

                {/* Live Variant & Quantity Summary */}
                <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-slate-600">
                  {size && (
                    <span className="bg-white px-2 py-0.5 rounded-md border border-slate-200 font-semibold">
                      Size: {size}
                    </span>
                  )}
                  {color && (
                    <span className="bg-white px-2 py-0.5 rounded-md border border-slate-200 font-semibold">
                      Color: {color}
                    </span>
                  )}
                  <div className="flex items-center gap-1.5 border border-slate-200 bg-white rounded-md px-2 py-0.5">
                    <span className="text-slate-400 font-medium">Qty:</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="font-bold text-slate-700 hover:text-emerald-600 px-1"
                    >
                      -
                    </button>
                    <span className="font-bold text-slate-900">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="font-bold text-slate-700 hover:text-emerald-600 px-1"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Variant Switchers inside modal if required */}
            {(product.sizes && product.sizes.length > 0) || (product.colors && product.colors.length > 0) ? (
              <div className="pt-3 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {product.sizes && product.sizes.length > 0 && (
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Select Size:</label>
                    <div className="flex flex-wrap gap-1.5">
                      {product.sizes.map((s, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSize(s)}
                          className={`px-2.5 py-1 rounded-lg font-bold border transition-colors ${
                            size === s
                              ? 'bg-emerald-600 text-white border-emerald-600'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {product.colors && product.colors.length > 0 && (
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Select Color:</label>
                    <div className="flex flex-wrap gap-1.5">
                      {product.colors.map((c, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setColor(c)}
                          className={`px-2.5 py-1 rounded-lg font-medium border transition-colors ${
                            color === c
                              ? 'bg-emerald-600 text-white border-emerald-600'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </div>

          {/* 2. Customer Information */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <span>Customer Information</span>
              <span className="text-rose-500">*</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tanvir Ahmed"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 outline-hidden"
                  id="checkout-name-input"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mobile Number (01XXXXXXXXX) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 01712345678"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 outline-hidden font-mono"
                  id="checkout-phone-input"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Alternative Phone Number (Optional)
                </label>
                <input
                  type="tel"
                  placeholder="e.g. 01812345678 (Family / Office)"
                  value={altPhone}
                  onChange={e => setAltPhone(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:border-emerald-500 outline-hidden font-mono"
                />
              </div>
            </div>
          </div>

          {/* 3. Bangladesh Cascading Address Selection */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <span>Delivery Address in Bangladesh</span>
              <span className="text-rose-500">*</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Division */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Division <span className="text-rose-500">*</span>
                </label>
                <select
                  value={selectedDivision}
                  onChange={e => handleDivisionChange(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 bg-white focus:border-emerald-500 outline-hidden font-medium"
                  id="checkout-division-select"
                >
                  {BANGLADESH_DATA.divisions.map(div => (
                    <option key={div.name} value={div.name}>
                      {div.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* District */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  District <span className="text-rose-500">*</span>
                </label>
                <select
                  value={selectedDistrict}
                  onChange={e => handleDistrictChange(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 bg-white focus:border-emerald-500 outline-hidden font-medium"
                  id="checkout-district-select"
                >
                  {availableDistricts.map(dist => (
                    <option key={dist.name} value={dist.name}>
                      {dist.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Upazila / Thana */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Upazila / Thana <span className="text-rose-500">*</span>
                </label>
                <select
                  value={selectedUpazila}
                  onChange={e => setSelectedUpazila(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 bg-white focus:border-emerald-500 outline-hidden font-medium"
                  id="checkout-upazila-select"
                >
                  {availableUpazilas.map(upz => (
                    <option key={upz} value={upz}>
                      {upz}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Area & Full Address */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Area / Sector / Village
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sector 4, Block C"
                  value={area}
                  onChange={e => setArea(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-emerald-500 outline-hidden"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Street Address (House, Road, Flat) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. House 42, Road 7, Flat 4B"
                  value={fullAddress}
                  onChange={e => setFullAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-emerald-500 outline-hidden"
                  id="checkout-address-input"
                />
              </div>
            </div>

            {/* Delivery Note */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Delivery Note (Optional)
              </label>
              <input
                type="text"
                placeholder="Special instruction for delivery rider..."
                value={deliveryNote}
                onChange={e => setDeliveryNote(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:border-emerald-500 outline-hidden"
              />
            </div>
          </div>

          {/* 4. Delivery Calculation & Grand Total Breakdown */}
          <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200 space-y-2.5">
            <div className="flex items-center justify-between text-xs text-slate-700">
              <span>
                Product Total ({quantity} {quantity > 1 ? 'items' : 'item'}):
              </span>
              <span className="font-bold">৳{productTotal.toLocaleString('en-IN')}</span>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-700">
              <span className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-emerald-700" />
                <span>Delivery Charge ({deliveryZoneName}):</span>
              </span>
              <span className="font-bold text-emerald-800">৳{deliveryCharge}</span>
            </div>

            <div className="pt-2 border-t border-emerald-200/80 flex items-center justify-between text-base sm:text-lg font-black text-slate-900">
              <span>Grand Total:</span>
              <span className="text-emerald-700 text-xl font-extrabold">
                ৳{grandTotal.toLocaleString('en-IN')}
              </span>
            </div>

            {/* Formula display requested by user */}
            <div className="text-[11px] text-emerald-800 font-medium text-center pt-1">
              Calculation: ৳{productTotal} (Product) + ৳{deliveryCharge} ({deliveryZoneName}) = ৳{grandTotal}
            </div>

            <div className="flex items-center justify-center gap-1.5 pt-1 text-xs font-bold text-emerald-900">
              <Banknote className="w-4 h-4 text-emerald-700" />
              <span>Payment Method: Cash on Delivery (COD)</span>
            </div>
          </div>

          {/* Submit Order Button */}
          <div className="space-y-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-extrabold text-base shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-75 cursor-pointer"
              id="confirm-order-submit-btn"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processing Your Order...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5" />
                  <span>CONFIRM ORDER (PAY ৳{grandTotal} IN CASH)</span>
                </>
              )}
            </button>
            <p className="text-[11px] text-slate-400 text-center">
              No online card or advance payment required. Pay cash to courier rider upon delivery.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
