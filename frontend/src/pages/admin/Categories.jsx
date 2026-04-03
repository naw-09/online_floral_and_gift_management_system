// import { useState, useEffect } from 'react'
// import API from '../../api/axios';

// export default function AdminCategories() {
//   const [categories, setCategories] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [form, setForm] = useState({ name: '', description: '' })
//   const [editing, setEditing] = useState(null)

//   const load = () => API.get('/admin/categories').then(({ data }) => setCategories(data)).finally(() => setLoading(false))
//   useEffect(() => { load() }, [])

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     try {
//       if (editing) await API.put(`/admin/categories/${editing.id}`, form)
//       else await API.post('/admin/categories', form)
//       setForm({ name: '', description: '' })
//       setEditing(null)
//       load()
//     } catch (err) {
//       alert(err.response?.data?.message || 'Failed')
//     }
//   }

//   const deleteCat = async (id) => {
//     if (!confirm('Delete this category?')) return
//     try {
//       await API.delete(`/admin/categories/${id}`)
//       load()
//     } catch (err) {
//       alert(err.response?.data?.message || 'Failed')
//     }
//   }

//   if (loading) return <div>Loading…</div>

//   return (
//     <div>
//       <h1 className="font-display text-2xl font-semibold text-sage-900 mb-6">Categories</h1>
//       <form onSubmit={handleSubmit} className="mb-6 flex gap-2 max-w-md">
//         <input placeholder="Category name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required className="flex-1 px-3 py-2 border border-sage-300 rounded-lg" />
//         <button type="submit" className="bg-sage-600 text-white px-4 py-2 rounded-lg text-sm font-medium">{editing ? 'Update' : 'Add'}</button>
//         {editing && <button type="button" onClick={() => { setEditing(null); setForm({ name: '', description: '' }); }} className="text-sage-600 text-sm">Cancel</button>}
//       </form>
//       <ul className="space-y-2">
//         {categories.map((c) => (
//           <li key={c.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-sage-200">
//             <span className="font-medium">{c.name}</span>
//             <div>
//               <button type="button" onClick={() => { setEditing(c); setForm({ name: c.name, description: c.description || '' }); }} className="text-sage-600 hover:underline mr-2">Edit</button>
//               <button type="button" onClick={() => deleteCat(c.id)} className="text-red-600 hover:underline">Delete</button>
//             </div>
//           </li>
//         ))}
//       </ul>
//     </div>
//   )
// }


// import { useState, useEffect } from 'react'
// import API from '../../api/axios'

// export default function AdminCategories() {
//   const [categories, setCategories] = useState([])
//   const [loading, setLoading] = useState(true)

//   const [showModal, setShowModal] = useState(false)
//   const [editing, setEditing] = useState(null)

//   const [form, setForm] = useState({
//     name: '',
//     description: '',
//     image: null
//   })

//   const load = () =>
//     API.get('/admin/categories')
//       .then(({ data }) => setCategories(data))
//       .finally(() => setLoading(false))

//   useEffect(() => { load() }, [])

//   // OPEN ADD
//   const openAdd = () => {
//     setEditing(null)
//     setForm({ name: '', description: '', image: null })
//     setShowModal(true)
//   }

//   // OPEN EDIT
//   const openEdit = (cat) => {
//     setEditing(cat)
//     setForm({
//       name: cat.name,
//       description: cat.description || '',
//       image: null
//     })
//     setShowModal(true)
//   }

//   // SUBMIT
//   const handleSubmit = async (e) => {
//     e.preventDefault()

//     const formData = new FormData()
//     formData.append('name', form.name)
//     formData.append('description', form.description)
//     if (form.image) formData.append('image', form.image)

//     try {
//       if (editing) {
//         await API.post(`/admin/categories/${editing.id}?_method=PUT`, formData)
//       } else {
//         await API.post('/admin/categories', formData)
//       }

//       setShowModal(false)
//       load()
//     } catch (err) {
//       alert(err.response?.data?.message || 'Failed')
//     }
//   }

//   // DELETE
//   const deleteCat = async (id) => {
//     if (!confirm('Delete this category?')) return

//     await API.delete(`/admin/categories/${id}`)
//     load()
//   }

//   if (loading) return <div>Loading…</div>

//   return (
//     <div>
//       <div className="flex justify-between mb-6">
//         <h1 className="text-2xl font-semibold">Categories</h1>
//         <button
//           onClick={openAdd}
//           className="bg-sage-600 text-white px-4 py-2 rounded-lg"
//         >
//           + Add Category
//         </button>
//       </div>

//       {/* LIST */}
//       <ul className="space-y-2">
//         {categories.map((c) => (
//           <li key={c.id} className="flex justify-between p-3 bg-white rounded border">
//             <div>
//               <p className="font-medium">{c.name}</p>
//               {c.image && (
//                 <img
//                   src={`http://localhost:8000/storage/${c.image}`}
//                   className="w-16 mt-2"
//                 />
//               )}
//             </div>

//             <div>
//               <button onClick={() => openEdit(c)} className="mr-2 text-blue-600">
//                 Edit
//               </button>
//               <button onClick={() => deleteCat(c.id)} className="text-red-600">
//                 Delete
//               </button>
//             </div>
//           </li>
//         ))}
//       </ul>

//       {/* MODAL */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
//           <div className="bg-white p-6 rounded-lg w-96">
//             <h2 className="text-lg font-semibold mb-4">
//               {editing ? 'Edit Category' : 'Add Category'}
//             </h2>

//             <form onSubmit={handleSubmit} className="space-y-3">
              
//               <input
//                 placeholder="Name"
//                 value={form.name}
//                 onChange={(e) => setForm({ ...form, name: e.target.value })}
//                 className="w-full border p-2 rounded"
//                 required
//               />

//               <textarea
//                 placeholder="Description"
//                 value={form.description}
//                 onChange={(e) => setForm({ ...form, description: e.target.value })}
//                 className="w-full border p-2 rounded"
//               />

//               <input
//                 type="file"
//                 onChange={(e) =>
//                   setForm({ ...form, image: e.target.files[0] })
//                 }
//               />

//               <div className="flex justify-end gap-2">
//                 <button
//                   type="button"
//                   onClick={() => setShowModal(false)}
//                   className="px-3 py-1 border rounded"
//                 >
//                   Cancel
//                 </button>

//                 <button
//                   type="submit"
//                   className="bg-sage-600 text-white px-4 py-2 rounded"
//                 >
//                   {editing ? 'Update' : 'Create'}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }


import { useState, useEffect } from 'react'
import API from '../../api/axios'

export default function AdminCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)

  const [form, setForm] = useState({
    name: '',
    description: '',
    image: null
  })

  // ✅ NEW: preview state
  const [preview, setPreview] = useState(null)

  const load = () =>
    API.get('/admin/categories')
      .then(({ data }) => setCategories(data))
      .finally(() => setLoading(false))

  useEffect(() => {
    load()
  }, [])

  // ✅ OPEN ADD
  const openAdd = () => {
    setEditing(null)
    setForm({ name: '', description: '', image: null })
    setPreview(null) // reset preview
    setShowModal(true)
  }

  // OPEN EDIT
  const openEdit = (cat) => {
    setEditing(cat)
    setForm({
      name: cat.name,
      description: cat.description || '',
      image: null
    })

    // show existing image
    setPreview(
      cat.image ? `http://localhost:8000/storage/${cat.image}` : null
    )

    setShowModal(true)
  }

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append('name', form.name)
    formData.append('description', form.description)
    if (form.image) formData.append('image', form.image)

    try {
      if (editing) {
        await API.post(
          `/admin/categories/${editing.id}?_method=PUT`,
          formData
        )
      } else {
        await API.post('/admin/categories', formData)
      }

      setShowModal(false)
      load()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed')
    }
  }

  // DELETE
  const deleteCat = async (id) => {
    if (!confirm('Delete this category?')) return

    await API.delete(`/admin/categories/${id}`)
    load()
  }

  if (loading) return <div>Loading…</div>

  return (
    <div>
      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-semibold">Categories</h1>
        <button
          onClick={openAdd}
          className="bg-sage-600 text-white px-4 py-2 rounded-lg"
        >
          + Add Category
        </button>
      </div>

      {/* LIST */}
      <ul className="space-y-2">
        {categories.map((c) => (
          <li
            key={c.id}
            className="flex justify-between p-3 bg-white rounded border"
          >
            <div>
              <p className="font-medium">{c.name}</p>

              {c.image && (
                <img
                  src={`http://localhost:8000/storage/${c.image}`}
                  className="w-16 h-16 object-cover mt-2 rounded"
                />
              )}
            </div>

            <div>
              <button
                onClick={() => openEdit(c)}
                className="mr-2 text-blue-600"
              >
                Edit
              </button>

              <button
                onClick={() => deleteCat(c.id)}
                className="text-red-600"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-lg font-semibold mb-4">
              {editing ? 'Edit Category' : 'Add Category'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3">
              
              {/* NAME */}
              <input
                placeholder="Name"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                className="w-full border p-2 rounded"
                required
              />

              {/* DESCRIPTION */}
              <textarea
                placeholder="Description"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="w-full border p-2 rounded"
              />

              {/* IMAGE UPLOAD */}
              <div className="border-2 border-dashed p-4 rounded text-center">
                
                {/* PREVIEW */}
                {preview ? (
                  <img
                    src={preview}
                    alt="preview"
                    className="w-full h-40 object-cover rounded mb-3"
                  />
                ) : (
                  <div className="text-gray-400 mb-3">
                    No Image
                  </div>
                )}

                {/* FILE INPUT */}
                <input
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files[0]
                    setForm({ ...form, image: file })

                    if (file) {
                      setPreview(URL.createObjectURL(file))
                    }
                  }}
                />
              </div>

              {/* ACTIONS */}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3 py-1 border rounded"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="bg-sage-600 text-white px-4 py-2 rounded"
                >
                  {editing ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}