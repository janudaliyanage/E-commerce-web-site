import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ChevronLeft, X, GripVertical, Plus, Upload } from 'lucide-react';
import { fetchProductById, updateProduct, uploadImage } from '../services/api';

const EditProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: 'FOR HIM',
    stock: '',
    status: 'active',
    sizes: '',
  });
  const [images, setImages] = useState([]);   // [{ url, uploading, tempId }]
  const [colors, setColors] = useState([]);   // [{ label, imageUrl, uploading }]
  const [dragIndex, setDragIndex] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProduct();
  }, [id]);

  // ---------- Load ----------
  const loadProduct = async () => {
    try {
      setLoading(true);
      const product = await fetchProductById(id);
      if (!product) { setError('Product not found'); return; }

      setFormData({
        name: product.name || '',
        price: product.price || '',
        description: product.description || '',
        category: product.category || 'FOR HIM',
        stock: product.stock || '',
        status: product.status || 'active',
        sizes: product.sizes || '',
      });

      // Restore images array
      let parsedImages = [];
      try {
        const raw = product.images;
        if (raw) {
          const arr = typeof raw === 'string' ? JSON.parse(raw) : raw;
          parsedImages = Array.isArray(arr) ? arr.map(url => ({ url, uploading: false, tempId: Math.random() })) : [];
        }
      } catch (_) { }
      // Fallback: if no images array but imgUrl exists
      if (parsedImages.length === 0 && product.imgUrl) {
        parsedImages = [{ url: product.imgUrl, uploading: false, tempId: Math.random() }];
      }
      setImages(parsedImages);

      // Restore colors array
      let parsedColors = [];
      try {
        const raw = product.colors;
        if (raw) {
          const arr = typeof raw === 'string' ? JSON.parse(raw) : raw;
          parsedColors = Array.isArray(arr) ? arr.map(c => ({ label: c.label || '', imageUrl: c.imageUrl || '', uploading: false })) : [];
        }
      } catch (_) { }
      setColors(parsedColors);

      setError('');
    } catch (err) {
      console.error('Error loading product:', err);
      setError('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // ---------- Main Images ----------
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    for (const file of files) {
      const tempId = Date.now() + Math.random();
      setImages(prev => [...prev, { url: null, uploading: true, tempId }]);
      const imageUrl = await uploadImage(file);
      if (imageUrl) {
        setImages(prev => prev.map(img =>
          img.tempId === tempId ? { url: imageUrl, uploading: false, tempId } : img
        ));
      } else {
        setImages(prev => prev.filter(img => img.tempId !== tempId));
        alert('Failed to upload image');
      }
    }
    e.target.value = '';
  };

  const removeImage = (index) => setImages(prev => prev.filter((_, i) => i !== index));

  // ---------- Drag & Drop ----------
  const onDragStart = (index) => setDragIndex(index);
  const onDragOver = (e, index) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;
    const newImages = [...images];
    const [moved] = newImages.splice(dragIndex, 1);
    newImages.splice(index, 0, moved);
    setImages(newImages);
    setDragIndex(index);
  };
  const onDragEnd = () => setDragIndex(null);

  // ---------- Color Variants ----------
  const addColor = () => setColors(prev => [...prev, { label: '', imageUrl: null, uploading: false }]);

  const updateColorLabel = (index, value) =>
    setColors(prev => prev.map((c, i) => i === index ? { ...c, label: value } : c));

  const handleColorImageUpload = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;
    setColors(prev => prev.map((c, i) => i === index ? { ...c, uploading: true } : c));
    const imageUrl = await uploadImage(file);
    if (imageUrl) {
      setColors(prev => prev.map((c, i) => i === index ? { ...c, imageUrl, uploading: false } : c));
    } else {
      setColors(prev => prev.map((c, i) => i === index ? { ...c, uploading: false } : c));
      alert('Failed to upload color image');
    }
    e.target.value = '';
  };

  const removeColor = (index) => setColors(prev => prev.filter((_, i) => i !== index));

  // ---------- Submit ----------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!formData.name || !formData.price || !formData.stock) {
      setError('Please fill in all required fields');
      return;
    }
    setSubmitting(true);
    try {
      const imageUrls = images.filter(i => i.url).map(i => i.url);
      const colorData = colors.map(c => ({ label: c.label, imageUrl: c.imageUrl || '' }));

      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        imgUrl: imageUrls[0] || (colors[0]?.imageUrl || ''),
        images: JSON.stringify(imageUrls),
        colors: JSON.stringify(colorData),
      };

      const result = await updateProduct(id, productData);
      if (result && result.id) {
        alert('Product updated successfully!');
        navigate('/admin/products');
      } else {
        setError('Failed to update product');
      }
    } catch (err) {
      console.error('Error updating product:', err);
      setError('Error updating product. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // ---------- Render ----------
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600">Loading product...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link to="/admin/products" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition">
            <ChevronLeft size={20} />
            <span>Back to Products</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Edit Product</h1>
          <p className="text-gray-500 mb-8">Update the product details below.</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">

            {/* ── Basic Info ── */}
            <div className="space-y-4">
              <h2 className="font-semibold text-lg border-b pb-2">Basic Information</h2>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input type="text" name="name" value={formData.name} onChange={handleChange}
                  placeholder="e.g., Premium Gym Tee"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-gray-50"
                  disabled={submitting} required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Price <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-500">$</span>
                    <input type="number" name="price" value={formData.price} onChange={handleChange}
                      placeholder="29.99" step="0.01" min="0"
                      className="w-full pl-7 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-gray-50"
                      disabled={submitting} required />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Stock <span className="text-red-500">*</span>
                  </label>
                  <input type="number" name="stock" value={formData.stock} onChange={handleChange}
                    placeholder="50" min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-gray-50"
                    disabled={submitting} required />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange}
                  placeholder="Describe your product..." rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-gray-50"
                  disabled={submitting} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <select name="category" value={formData.category} onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-gray-50"
                    disabled={submitting}>
                    <option>FOR HIM</option>
                    <option>FOR HER</option>
                    <option>NEW DROP</option>
                    <option>COLLABS</option>
                    <option>LOOKBOOK</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select name="status" value={formData.status} onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-gray-50"
                    disabled={submitting}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Sizes</label>
                <input type="text" name="sizes" value={formData.sizes} onChange={handleChange}
                  placeholder="e.g., XS, S, M, L, XL"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-gray-50"
                  disabled={submitting} />
              </div>
            </div>

            {/* ── Product Images ── */}
            <div className="space-y-4">
              <h2 className="font-semibold text-lg border-b pb-2">Product Images</h2>
              <p className="text-sm text-gray-500">Upload multiple images. Drag to reorder. First image is the main image.</p>

              <label className="cursor-pointer flex items-center gap-2 w-fit px-4 py-2 bg-blue-50 border border-blue-300 rounded-lg text-blue-600 hover:bg-blue-100 transition">
                <Plus size={18} /> Add Images
                <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" disabled={submitting} />
              </label>

              {images.length > 0 && (
                <div className="grid grid-cols-4 gap-3 mt-3">
                  {images.map((img, index) => (
                    <div key={img.tempId} draggable
                      onDragStart={() => onDragStart(index)}
                      onDragOver={(e) => onDragOver(e, index)}
                      onDragEnd={onDragEnd}
                      className={`relative group rounded-lg overflow-hidden border-2 cursor-grab
                        ${index === 0 ? 'border-blue-500' : 'border-gray-200'}
                        ${dragIndex === index ? 'opacity-50' : ''}`}>
                      {img.uploading ? (
                        <div className="w-full h-24 bg-gray-100 flex items-center justify-center text-xs text-gray-400">Uploading...</div>
                      ) : (
                        <img src={img.url} alt="" className="w-full h-24 object-cover" />
                      )}
                      <div className="absolute top-1 left-1 p-1 bg-white bg-opacity-80 rounded text-gray-500">
                        <GripVertical size={14} />
                      </div>
                      {index === 0 && (
                        <div className="absolute bottom-1 left-1 text-xs bg-blue-500 text-white px-1 rounded">Main</div>
                      )}
                      <button type="button" onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded opacity-0 group-hover:opacity-100 transition">
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ── Color Variants ── */}
            <div className="space-y-4">
              <h2 className="font-semibold text-lg border-b pb-2">Color Variants</h2>
              <p className="text-sm text-gray-500">Add color variants — upload an image and give it a color name.</p>

              {colors.map((c, index) => (
                <div key={index} className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl bg-gray-50">

                  {/* Image Upload / Preview */}
                  <div className="relative flex-shrink-0">
                    {c.imageUrl ? (
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden border-2 border-gray-300 group">
                        <img src={c.imageUrl} alt="" className="w-full h-full object-cover" />
                        <label className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition">
                          <Upload size={16} className="text-white" />
                          <input type="file" accept="image/*" onChange={(e) => handleColorImageUpload(e, index)} className="hidden" />
                        </label>
                      </div>
                    ) : (
                      <label className="w-20 h-20 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition bg-white">
                        {c.uploading ? (
                          <span className="text-xs text-gray-400">Uploading...</span>
                        ) : (
                          <>
                            <Upload size={18} className="text-gray-400 mb-1" />
                            <span className="text-xs text-gray-400">Upload</span>
                          </>
                        )}
                        <input type="file" accept="image/*" onChange={(e) => handleColorImageUpload(e, index)} className="hidden" disabled={c.uploading} />
                      </label>
                    )}
                  </div>

                  {/* Color Name */}
                  <div className="flex-1">
                    <label className="block text-xs text-gray-500 mb-1">Color Name</label>
                    <input type="text" value={c.label} onChange={(e) => updateColorLabel(index, e.target.value)}
                      placeholder="e.g., White, Black, Navy Blue"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" />
                  </div>

                  {/* Remove */}
                  <button type="button" onClick={() => removeColor(index)}
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition flex-shrink-0">
                    <X size={18} />
                  </button>
                </div>
              ))}

              <button type="button" onClick={addColor}
                className="flex items-center gap-2 px-4 py-2 border border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:bg-gray-50 transition w-full justify-center">
                <Plus size={16} /> Add Color Variant
              </button>
            </div>

            {/* ── Submit ── */}
            <div className="flex gap-4 pt-4">
              <Link to="/admin/products"
                className="flex-1 px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition text-center">
                Cancel
              </Link>
              <button type="submit" disabled={submitting}
                className="flex-1 px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition disabled:opacity-50">
                {submitting ? 'Updating...' : 'Update Product'}
              </button>
            </div>

          </form>
        </div>
      </main>
    </div>
  );
};

export default EditProduct;