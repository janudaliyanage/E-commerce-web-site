import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, X, GripVertical, Plus } from 'lucide-react';
import { createProduct, uploadImage } from '../services/api';

const AddProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: 'FOR HIM',
    stock: '',
    status: 'active',
    sizes: '',
  });
  const [images, setImages] = useState([]); // [{url, uploading}]
  const [colors, setColors] = useState([]); // [{color, label, imageIndex}]
  const [dragIndex, setDragIndex] = useState(null);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // --- Image Handling ---
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
        alert('Failed to upload one image');
      }
    }
    e.target.value = '';
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    // update color imageIndexes
    setColors(prev => prev.map(c => ({
      ...c,
      imageIndex: c.imageIndex === index ? 0 : c.imageIndex > index ? c.imageIndex - 1 : c.imageIndex
    })));
  };

  // --- Drag & Drop reorder ---
  const onDragStart = (index) => setDragIndex(index);
  const onDragOver = (e, index) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;
    const newImages = [...images];
    const [moved] = newImages.splice(dragIndex, 1);
    newImages.splice(index, 0, moved);
    setImages(newImages);
    // fix color imageIndexes after reorder
    setColors(prev => prev.map(c => {
      let newIdx = c.imageIndex;
      if (c.imageIndex === dragIndex) newIdx = index;
      else if (dragIndex < index && c.imageIndex > dragIndex && c.imageIndex <= index) newIdx = c.imageIndex - 1;
      else if (dragIndex > index && c.imageIndex < dragIndex && c.imageIndex >= index) newIdx = c.imageIndex + 1;
      return { ...c, imageIndex: newIdx };
    }));
    setDragIndex(index);
  };
  const onDragEnd = () => setDragIndex(null);

  // --- Color Handling ---
  const addColor = () => {
    setColors(prev => [...prev, { color: '#000000', label: '', imageIndex: 0 }]);
  };
  const updateColor = (index, field, value) => {
    setColors(prev => prev.map((c, i) => i === index ? { ...c, [field]: value } : c));
  };
  const removeColor = (index) => {
    setColors(prev => prev.filter((_, i) => i !== index));
  };

  // --- Submit ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!formData.name || !formData.price || !formData.stock) {
      setError('Please fill in all required fields');
      return;
    }
    setLoading(true);
    try {
      const imageUrls = images.filter(i => i.url).map(i => i.url);
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        imgUrl: imageUrls[0] || '',
        images: JSON.stringify(imageUrls),
        colors: JSON.stringify(colors),
      };
      const result = await createProduct(productData);
      if (result && result.id) {
        alert('Product created successfully!');
        navigate('/admin/products');
      } else {
        setError('Failed to create product');
      }
    } catch (err) {
      setError('Error creating product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button onClick={() => navigate('/admin/products')} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ChevronLeft size={20} /><span>Back to Products</span>
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow p-8">
          <h1 className="text-3xl font-bold mb-1">Add New Product</h1>
          <p className="text-gray-500 mb-8">Fill in the details to add a new product.</p>

          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-8">

            {/* Basic Info */}
            <div className="space-y-4">
              <h2 className="font-semibold text-lg border-b pb-2">Basic Information</h2>
              <div>
                <label className="block text-sm font-medium mb-1">Product Name *</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange}
                  placeholder="e.g., Premium Gym Tee"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Price *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-500">$</span>
                    <input type="number" name="price" value={formData.price} onChange={handleChange}
                      placeholder="29.99" step="0.01" min="0"
                      className="w-full pl-7 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" required />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Stock *</label>
                  <input type="number" name="stock" value={formData.stock} onChange={handleChange}
                    placeholder="50" min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange}
                  placeholder="Describe your product..." rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <select name="category" value={formData.category} onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500">
                    <option>FOR HIM</option><option>FOR HER</option>
                    <option>NEW DROP</option><option>COLLABS</option><option>LOOKBOOK</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select name="status" value={formData.status} onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Sizes</label>
                <input type="text" name="sizes" value={formData.sizes} onChange={handleChange}
                  placeholder="e.g., XS, S, M, L, XL"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" />
              </div>
            </div>

            {/* Images */}
            <div className="space-y-4">
              <h2 className="font-semibold text-lg border-b pb-2">Product Images</h2>
              <p className="text-sm text-gray-500">Upload multiple images. Drag to reorder. First image is the main image.</p>

              <label className="cursor-pointer flex items-center gap-2 w-fit px-4 py-2 bg-blue-50 border border-blue-300 rounded-lg text-blue-600 hover:bg-blue-100 transition">
                <Plus size={18} /> Add Images
                <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
              </label>

              {images.length > 0 && (
                <div className="grid grid-cols-4 gap-3 mt-3">
                  {images.map((img, index) => (
                    <div key={img.tempId} draggable
                      onDragStart={() => onDragStart(index)}
                      onDragOver={(e) => onDragOver(e, index)}
                      onDragEnd={onDragEnd}
                      className={`relative group rounded-lg overflow-hidden border-2 cursor-grab active:cursor-grabbing
                        ${index === 0 ? 'border-blue-500' : 'border-gray-200'}
                        ${dragIndex === index ? 'opacity-50' : ''}`}
                    >
                      {img.uploading ? (
                        <div className="w-full h-24 bg-gray-100 flex items-center justify-center text-xs text-gray-400">
                          Uploading...
                        </div>
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

            {/* Colors */}
            <div className="space-y-4">
              <h2 className="font-semibold text-lg border-b pb-2">Color Variants</h2>
              <p className="text-sm text-gray-500">Add colors and link each to a product image.</p>

              {colors.map((c, index) => (
                <div key={index} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                  <input type="color" value={c.color}
                    onChange={(e) => updateColor(index, 'color', e.target.value)}
                    className="w-10 h-10 rounded cursor-pointer border-0 p-0" />
                  <input type="text" value={c.label}
                    onChange={(e) => updateColor(index, 'label', e.target.value)}
                    placeholder="Color name (e.g. White)"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" />
                  <div className="flex flex-col">
                    <label className="text-xs text-gray-500 mb-1">Image</label>
                    <select value={c.imageIndex}
                      onChange={(e) => updateColor(index, 'imageIndex', parseInt(e.target.value))}
                      className="px-2 py-1 border border-gray-300 rounded text-sm">
                      {images.length === 0
                        ? <option value={0}>No images</option>
                        : images.map((img, i) => (
                          <option key={i} value={i}>Image {i + 1}{i === 0 ? ' (Main)' : ''}</option>
                        ))
                      }
                    </select>
                  </div>
                  <button type="button" onClick={() => removeColor(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition">
                    <X size={16} />
                  </button>
                </div>
              ))}

              <button type="button" onClick={addColor}
                className="flex items-center gap-2 px-4 py-2 border border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:bg-gray-50 transition">
                <Plus size={16} /> Add Color
              </button>
            </div>

            {/* Submit */}
            <div className="flex gap-4 pt-4">
              <button type="button" onClick={() => navigate('/admin/products')} disabled={loading}
                className="flex-1 px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition disabled:opacity-50">
                Cancel
              </button>
              <button type="submit" disabled={loading}
                className="flex-1 px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition disabled:opacity-50">
                {loading ? 'Creating...' : 'Create Product'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AddProduct;