import { useState, useEffect } from 'react';
import API from '../../api/axios';

export default function AdminProducts() {
  const [products, setProducts] = useState({ data: [] });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  
  // Added 'image' and 'imagePreview' to form state
  const [form, setForm] = useState({ 
    name: '', description: '', price: '', category_id: '', 
    type: 'floral', is_active: true, stock: 0, image: null 
  });
  const [imagePreview, setImagePreview] = useState(null);

  const load = () => {
    API.get('/admin/products').then(({ data }) => setProducts(data)).finally(() => setLoading(false));
  };

  useEffect(() => {
    API.get('/admin/categories').then(({ data }) => setCategories(data)).catch(() => {});
    load();
  }, []);

  const openModal = (product = null) => {
    setImagePreview(product?.image || null); // Show existing image if editing
    if (product) {
      setEditing(product);
      setForm({
        name: product.name,
        description: product.description || '',
        price: product.price,
        category_id: product.category_id,
        type: product.type,
        is_active: product.is_active,
        stock: product.stock ?? 0,
        image: null // Keep null unless user picks a NEW file
      });
    } else {
      setEditing(null);
      setForm({ name: '', description: '', price: '', category_id: '', type: 'floral', is_active: true, stock: 0, image: null });
    }
    setShowModal(true);
  };

const handleFileChange = (e) => {
 const file = e.target.files[0]; 
  if (file) {
    setForm({ ...form, image: file }); 
    setImagePreview(URL.createObjectURL(file)); 
  }
};

const handleSubmit = async (e) => {
  e.preventDefault();
  const data = new FormData();
  
  data.append('name', form.name);
  data.append('price', form.price);
  data.append('category_id', form.category_id);
  data.append('type', form.type);
  data.append('stock', form.stock);
  data.append('is_active', form.is_active ? 1 : 0);
  data.append('description', form.description || '');

  // Only send image if it's a NEW file object
  if (form.image instanceof File) {
    data.append('image', form.image);
  }

  if (editing) {
    data.append('_method', 'PUT'); // Trick Laravel into a PUT while using POST
  }

  try {
    const url = editing ? `/admin/products/${editing.id}` : '/admin/products';
    await API.post(url, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    setShowModal(false);
    load();
  } catch (err) {
    alert(err.response?.data?.message || 'Failed');
  }
};


  const deleteProduct = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await API.delete(`/admin/products/${id}`);
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed');
    }
  };

  if (loading) return <div className="p-8 text-center text-sage-600">Loading…</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-display text-2xl font-semibold text-sage-900">Products</h1>
        <button 
          onClick={() => openModal()}
          className="bg-sage-600 hover:bg-sage-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          + Add Product
        </button>
      </div>

      <div className="bg-white rounded-xl border border-sage-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-sage-50 border-b border-sage-200">
              <th className="px-6 py-3 text-left font-semibold text-sage-700">Image</th>
              <th className="px-6 py-3 text-left font-semibold text-sage-700">Name</th>
              <th className="px-6 py-3 text-left font-semibold text-sage-700">Category</th>
              <th className="px-6 py-3 text-left font-semibold text-sage-700">Price</th>
              <th className="px-6 py-3 text-right font-semibold text-sage-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sage-100">
            {products.data?.map((p) => (
              <tr key={p.id} className="hover:bg-sage-50/50">
                <td className="px-6 py-4">
                  <img src={p.image} alt="" className="w-12 h-12 object-cover rounded-md border border-sage-200 bg-sage-50" />
                </td>
                <td className="px-6 py-4 text-sage-900 font-medium">{p.name}</td>
                <td className="px-6 py-4 text-sage-600">{p.category?.name || 'N/A'}</td>
                <td className="px-6 py-4 text-sage-900">${Number(p.price).toFixed(2)}</td>
                <td className="px-6 py-4 text-right space-x-3">
                  <button onClick={() => openModal(p)} className="text-sage-600 hover:text-sage-900">Edit</button>
                  <button onClick={() => deleteProduct(p.id)} className="text-red-500 hover:text-red-700">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-sage-200">
            <div className="px-6 py-4 border-b border-sage-100 flex justify-between items-center text-sage-900">
              <h2 className="text-lg font-semibold">{editing ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={() => setShowModal(false)} className="text-2xl">&times;</button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Image Upload Section */}
              <div className="flex items-center gap-4 p-3 bg-sage-50 rounded-xl border border-dashed border-sage-300">
                <div className="w-20 h-20 bg-white rounded-lg border border-sage-200 overflow-hidden flex-shrink-0">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] text-sage-400 text-center p-1">No Image</div>
                  )}
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-bold text-sage-600 uppercase mb-1">Product Photo</label>
                  <input type="file" accept="image/*" onChange={handleFileChange} className="text-xs text-sage-500 file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-sage-600 file:text-white hover:file:bg-sage-700" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-sage-500 uppercase">Product Name</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full mt-1 px-3 py-2 border border-sage-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:outline-none text-sage-900" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-sage-500 uppercase">Price ($)</label>
                  <input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required className="w-full mt-1 px-3 py-2 border border-sage-300 rounded-lg text-sage-900" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-sage-500 uppercase">Stock</label>
                  <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="w-full mt-1 px-3 py-2 border border-sage-300 rounded-lg text-sage-900" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-sage-500 uppercase">Category</label>
                  <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} required className="w-full mt-1 px-3 py-2 border border-sage-300 rounded-lg text-sage-900">
                    <option value="">Select</option>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-sage-500 uppercase">Type</label>
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full mt-1 px-3 py-2 border border-sage-300 rounded-lg text-sage-900">
                    <option value="floral">Floral</option>
                    <option value="gift">Gift</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-sage-100">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="accent-sage-600" />
                  <span className="text-sm text-sage-700">Active</span>
                </label>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-sage-600 font-medium">Cancel</button>
                  <button type="submit" className="px-6 py-2 bg-sage-600 text-white rounded-lg text-sm font-semibold hover:bg-sage-700 transition-colors shadow-md shadow-sage-200">
                    {editing ? 'Update Product' : 'Create Product'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}