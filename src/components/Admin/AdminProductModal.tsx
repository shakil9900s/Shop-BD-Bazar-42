import React, { useState, useEffect } from 'react';
import { X, Upload, Trash2, ArrowLeft, ArrowRight, Plus, Loader2, AlertCircle } from 'lucide-react';
import { Product, Category, ProductStatus } from '../../types';
import { useAdminAuth } from '../../context/AdminAuthContext';

interface AdminProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  categories: Category[];
  onSaved: () => void;
}

export const AdminProductModal: React.FC<AdminProductModalProps> = ({
  isOpen,
  onClose,
  product,
  categories,
  onSaved
}) => {
  const { token } = useAdminAuth();

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [previousPrice, setPreviousPrice] = useState('');
  const [discount, setDiscount] = useState('');
  const [stock, setStock] = useState('10');
  const [status, setStatus] = useState<ProductStatus>('Active');

  // Images (Max 4)
  const [images, setImages] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');

  // Variants (Sizes & Colors)
  const [sizes, setSizes] = useState<string[]>([]);
  const [newSizeInput, setNewSizeInput] = useState('');
  const [colors, setColors] = useState<string[]>([]);
  const [newColorInput, setNewColorInput] = useState('');

  // Specifications Key-Value
  const [specs, setSpecs] = useState<Array<{ key: string; value: string }>>([
    { key: 'Fabric', value: '100% Cotton' },
    { key: 'Fit', value: 'Slim Fit' }
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (product) {
      setName(product.name);
      setSlug(product.slug);
      setDescription(product.description);
      setCategory(product.category);
      setPrice(product.price.toString());
      setPreviousPrice(product.previous_price ? product.previous_price.toString() : '');
      setDiscount(product.discount ? product.discount.toString() : '');
      setStock(product.stock.toString());
      setStatus(product.status);
      setImages(product.images ? [...product.images] : []);
      setSizes(product.sizes ? [...product.sizes] : []);
      setColors(product.colors ? [...product.colors] : []);
      if (product.specifications && typeof product.specifications === 'object') {
        setSpecs(Object.entries(product.specifications).map(([key, value]) => ({ key, value })));
      } else {
        setSpecs([]);
      }
    } else {
      setName('');
      setSlug('');
      setDescription('');
      setCategory(categories[0]?.name || "Men's Fashion");
      setPrice('');
      setPreviousPrice('');
      setDiscount('');
      setStock('25');
      setStatus('Active');
      setImages([
        'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80'
      ]);
      setSizes(['M', 'L', 'XL', 'XXL']);
      setColors(['Black', 'White', 'Navy Blue']);
      setSpecs([
        { key: 'Fabric', value: '100% Cotton' },
        { key: 'Country of Origin', value: 'Bangladesh' }
      ]);
    }
  }, [product, categories, isOpen]);

  if (!isOpen) return null;

  // Auto calculate discount percentage when price and previous_price change
  const handlePriceChange = (newPrice: string) => {
    setPrice(newPrice);
    const p = parseFloat(newPrice);
    const prev = parseFloat(previousPrice);
    if (!isNaN(p) && !isNaN(prev) && prev > p) {
      setDiscount(Math.round(((prev - p) / prev) * 100).toString());
    }
  };

  const handlePreviousPriceChange = (newPrev: string) => {
    setPreviousPrice(newPrev);
    const prev = parseFloat(newPrev);
    const p = parseFloat(price);
    if (!isNaN(p) && !isNaN(prev) && prev > p) {
      setDiscount(Math.round(((prev - p) / prev) * 100).toString());
    }
  };

  // Image Upload handler (with compression canvas)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (images.length >= 4) {
      alert('Maximum 4 images allowed per product.');
      return;
    }

    const file = files[0];
    const reader = new FileReader();
    reader.onload = event => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 900;
        const scaleSize = MAX_WIDTH / img.width;
        canvas.width = Math.min(img.width, MAX_WIDTH);
        canvas.height = img.height * (canvas.width / img.width);

        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);

        setImages(prev => (prev.length < 4 ? [...prev, dataUrl] : prev));
      };
      if (event.target?.result) {
        img.src = event.target.result as string;
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleAddImageUrl = () => {
    if (!newImageUrl.trim()) return;
    if (images.length >= 4) {
      alert('Maximum 4 images allowed per product.');
      return;
    }
    setImages([...images, newImageUrl.trim()]);
    setNewImageUrl('');
  };

  const handleDeleteImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleMoveImage = (from: number, to: number) => {
    if (to < 0 || to >= images.length) return;
    const updated = [...images];
    const item = updated.splice(from, 1)[0];
    updated.splice(to, 0, item);
    setImages(updated);
  };

  // Size tag handlers
  const handleAddSize = () => {
    if (!newSizeInput.trim()) return;
    if (!sizes.includes(newSizeInput.trim().toUpperCase())) {
      setSizes([...sizes, newSizeInput.trim().toUpperCase()]);
    }
    setNewSizeInput('');
  };

  const handleRemoveSize = (s: string) => {
    setSizes(sizes.filter(item => item !== s));
  };

  // Color tag handlers
  const handleAddColor = () => {
    if (!newColorInput.trim()) return;
    if (!colors.includes(newColorInput.trim())) {
      setColors([...colors, newColorInput.trim()]);
    }
    setNewColorInput('');
  };

  const handleRemoveColor = (c: string) => {
    setColors(colors.filter(item => item !== c));
  };

  // Spec handlers
  const handleAddSpec = () => {
    setSpecs([...specs, { key: '', value: '' }]);
  };

  const handleRemoveSpec = (idx: number) => {
    setSpecs(specs.filter((_, i) => i !== idx));
  };

  const handleSpecChange = (idx: number, field: 'key' | 'value', val: string) => {
    const updated = [...specs];
    updated[idx][field] = val;
    setSpecs(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Product name is required.');
      return;
    }
    if (!price || parseFloat(price) <= 0) {
      setError('Please provide a valid price.');
      return;
    }
    if (images.length === 0) {
      setError('Please add at least 1 product image.');
      return;
    }

    setLoading(true);

    const specificationsObj: Record<string, string> = {};
    specs.forEach(s => {
      if (s.key.trim()) {
        specificationsObj[s.key.trim()] = s.value.trim();
      }
    });

    const payload = {
      name: name.trim(),
      slug: slug.trim() || undefined,
      description: description.trim(),
      category,
      price: parseFloat(price),
      previous_price: previousPrice ? parseFloat(previousPrice) : null,
      discount: discount ? parseFloat(discount) : null,
      images: images.slice(0, 4),
      sizes,
      colors,
      stock: parseInt(stock, 10) || 0,
      status,
      specifications: specificationsObj
    };

    try {
      const url = product ? `/api/admin/products/${product.id}` : '/api/admin/products';
      const method = product ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success) {
        onSaved();
        onClose();
      } else {
        setError(data.error || 'Failed to save product.');
      }
    } catch (err: any) {
      setError(err.message || 'Network error while saving product.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200 my-8">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold">
              {product ? 'Edit Product' : 'Add New Product'}
            </h2>
            <p className="text-xs text-slate-400">
              Configure details, images, variants, and stock
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Product Name & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Product Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Premium Embroidered Cotton Panjabi"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-emerald-500 outline-hidden font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Category <span className="text-rose-500">*</span>
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:border-emerald-500 outline-hidden font-medium"
              >
                {categories.map(c => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Pricing & Stock Section */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Price (৳) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                required
                min="1"
                value={price}
                onChange={e => handlePriceChange(e.target.value)}
                placeholder="1850"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-bold text-emerald-700 outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Previous Price (৳)
              </label>
              <input
                type="number"
                min="0"
                value={previousPrice}
                onChange={e => handlePreviousPriceChange(e.target.value)}
                placeholder="2450"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm text-slate-500 outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Discount (%)
              </label>
              <input
                type="number"
                min="0"
                max="99"
                value={discount}
                onChange={e => setDiscount(e.target.value)}
                placeholder="24"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Stock Qty <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                required
                min="0"
                value={stock}
                onChange={e => setStock(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 outline-hidden"
              />
            </div>
          </div>

          {/* Status Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Product Status
              </label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as ProductStatus)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:border-emerald-500 outline-hidden font-medium"
              >
                <option value="Active">Active (Visible in Store)</option>
                <option value="Inactive">Inactive (Hidden from public)</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                SEO Slug (Optional auto-generated)
              </label>
              <input
                type="text"
                value={slug}
                onChange={e => setSlug(e.target.value)}
                placeholder="e.g. premium-cotton-panjabi"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-mono outline-hidden"
              />
            </div>
          </div>

          {/* Product Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Detailed description of the product, fabric quality, and features..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm outline-hidden leading-relaxed"
            />
          </div>

          {/* 4 Product Images Upload (Requirement #9) */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Product Images ({images.length}/4 Max)
              </label>
              <span className="text-[11px] text-slate-400">First image is the primary cover</span>
            </div>

            {/* Images Previews & Management */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {images.map((img, idx) => (
                <div
                  key={idx}
                  className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 bg-slate-100 group shadow-2xs"
                >
                  <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                  
                  {/* Overlay controls for reorder and delete */}
                  <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-1">
                    {idx > 0 && (
                      <button
                        type="button"
                        onClick={() => handleMoveImage(idx, idx - 1)}
                        className="p-1.5 rounded-md bg-white/20 hover:bg-white text-white hover:text-slate-900"
                        title="Move left"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDeleteImage(idx)}
                      className="p-1.5 rounded-md bg-rose-600 hover:bg-rose-700 text-white"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    {idx < images.length - 1 && (
                      <button
                        type="button"
                        onClick={() => handleMoveImage(idx, idx + 1)}
                        className="p-1.5 rounded-md bg-white/20 hover:bg-white text-white hover:text-slate-900"
                        title="Move right"
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {idx === 0 && (
                    <span className="absolute bottom-1 left-1 bg-emerald-600 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded">
                      Cover
                    </span>
                  )}
                </div>
              ))}

              {/* Upload Slot if less than 4 */}
              {images.length < 4 && (
                <label className="aspect-square rounded-xl border-2 border-dashed border-slate-300 hover:border-emerald-500 bg-slate-50 hover:bg-emerald-50/50 flex flex-col items-center justify-center cursor-pointer transition-colors p-2 text-center">
                  <Upload className="w-6 h-6 text-slate-400 mb-1" />
                  <span className="text-xs font-bold text-slate-700">Upload Image</span>
                  <span className="text-[10px] text-slate-400">File / Camera</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Direct Image URL input option */}
            {images.length < 4 && (
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="Or paste an image web URL..."
                  value={newImageUrl}
                  onChange={e => setNewImageUrl(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-200 outline-hidden"
                />
                <button
                  type="button"
                  onClick={handleAddImageUrl}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                >
                  Add URL
                </button>
              </div>
            )}
          </div>

          {/* Sizes (Requirement #11) */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
              Available Sizes (Leave empty if no size applies)
            </label>
            <div className="flex flex-wrap gap-2 items-center">
              {sizes.map((s, idx) => (
                <span
                  key={idx}
                  className="bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg text-xs font-bold text-slate-800 flex items-center gap-1.5"
                >
                  <span>{s}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSize(s)}
                    className="text-slate-400 hover:text-rose-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  placeholder="Add size (e.g. XL)"
                  value={newSizeInput}
                  onChange={e => setNewSizeInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSize();
                    }
                  }}
                  className="px-2.5 py-1 rounded-lg border border-slate-200 text-xs w-28 outline-hidden"
                />
                <button
                  type="button"
                  onClick={handleAddSize}
                  className="p-1 rounded-lg bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Colors (Requirement #12) */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
              Available Colors
            </label>
            <div className="flex flex-wrap gap-2 items-center">
              {colors.map((c, idx) => (
                <span
                  key={idx}
                  className="bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-800 flex items-center gap-1.5"
                >
                  <span>{c}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveColor(c)}
                    className="text-slate-400 hover:text-rose-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  placeholder="Add color (e.g. Black)"
                  value={newColorInput}
                  onChange={e => setNewColorInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddColor();
                    }
                  }}
                  className="px-2.5 py-1 rounded-lg border border-slate-200 text-xs w-32 outline-hidden"
                />
                <button
                  type="button"
                  onClick={handleAddColor}
                  className="p-1 rounded-lg bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Specifications */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Product Specifications
              </label>
              <button
                type="button"
                onClick={handleAddSpec}
                className="text-xs text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Spec</span>
              </button>
            </div>
            <div className="space-y-2">
              {specs.map((s, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <input
                    type="text"
                    placeholder="Feature name (e.g. Fabric)"
                    value={s.key}
                    onChange={e => handleSpecChange(idx, 'key', e.target.value)}
                    className="w-1/3 px-3 py-1.5 rounded-lg border border-slate-200 text-xs outline-hidden"
                  />
                  <input
                    type="text"
                    placeholder="Value (e.g. 100% Cotton)"
                    value={s.value}
                    onChange={e => handleSpecChange(idx, 'value', e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveSpec(idx)}
                    className="text-slate-400 hover:text-rose-600 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition-colors flex items-center gap-1.5 disabled:opacity-75"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{product ? 'Update Product' : 'Create Product'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
