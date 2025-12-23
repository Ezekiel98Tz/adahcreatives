import React, { useEffect, useMemo, useState } from 'react';
import { getGalleryAdmin, createGalleryPhoto, updateGalleryPhoto, deleteGalleryPhoto, uploadImage } from '../../lib/api';
import { Plus, Edit2, Trash2, X, Save, Loader } from 'lucide-react';

const DEFAULT_CATEGORIES = [
  'Commercial',
  'Corporate Events',
  'Portraits',
  'Headshots',
  'Family Sessions',
  'Lifestyle',
  'Product',
  'Travel',
];

export function GalleryManager() {
  const [photos, setPhotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPhoto, setEditingPhoto] = useState<any | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [query, setQuery] = useState('');

  useEffect(() => {
    loadPhotos();
  }, []);

  async function loadPhotos() {
    try {
      const data = await getGalleryAdmin();
      setPhotos(data);
    } catch (e) {
      console.error(e);
      setMessage({ type: 'error', text: 'Failed to load gallery.' });
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Are you sure you want to delete this photo?')) return;
    try {
      await deleteGalleryPhoto(id);
      await loadPhotos();
      setMessage({ type: 'success', text: 'Photo deleted.' });
    } catch (e) {
      setMessage({ type: 'error', text: 'Failed to delete photo.' });
    }
  }

  function handleEdit(photo: any) {
    setEditingPhoto({ ...photo });
    setIsCreating(false);
    setMessage(null);
  }

  function handleCreate() {
    setEditingPhoto({
      url: '',
      caption: '',
      category: categoryFilter !== 'All' ? categoryFilter : 'Commercial',
    });
    setIsCreating(true);
    setMessage(null);
  }

  const availableCategories = useMemo(() => {
    const seen = new Set<string>();
    for (const c of DEFAULT_CATEGORIES) seen.add(c);
    for (const p of photos) {
      const c = typeof p?.category === 'string' ? p.category.trim() : '';
      if (c) seen.add(c);
    }
    return Array.from(seen);
  }, [photos]);

  const filteredPhotos = useMemo(() => {
    const q = query.trim().toLowerCase();
    return photos.filter((p) => {
      if (categoryFilter !== 'All' && p.category !== categoryFilter) return false;
      if (!q) return true;
      const caption = String(p.caption || '').toLowerCase();
      const category = String(p.category || '').toLowerCase();
      return caption.includes(q) || category.includes(q);
    });
  }, [photos, categoryFilter, query]);

  if (loading) return <div className="flex justify-center p-12"><Loader className="animate-spin" /></div>;

  if (editingPhoto) {
    return (
      <GalleryPhotoEditor
        photo={editingPhoto}
        isCreating={isCreating}
        availableCategories={availableCategories}
        uploading={uploading}
        onUploadingChange={setUploading}
        onCancel={() => setEditingPhoto(null)}
        onSaved={async (text: string) => {
          await loadPhotos();
          setMessage({ type: 'success', text });
          setEditingPhoto(null);
        }}
        onError={(text: string) => setMessage({ type: 'error', text })}
      />
    );
  }

  return (
    <div>
      <div className="flex items-start justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-light text-gray-900">Gallery</h1>
          <p className="text-gray-500 mt-1">Upload and manage gallery photos.</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-black focus:border-transparent outline-none"
          >
            <option value="All">All categories</option>
            {availableCategories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search caption or category"
            className="w-56 px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-black focus:border-transparent outline-none"
          />
          <button
            onClick={handleCreate}
            className="flex items-center space-x-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <Plus size={18} />
            <span>Add Photo</span>
          </button>
        </div>
      </div>

      {message && (
        <div className={`p-4 mb-6 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message.text}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 font-medium text-gray-500 text-sm">Image</th>
              <th className="px-6 py-4 font-medium text-gray-500 text-sm">Caption</th>
              <th className="px-6 py-4 font-medium text-gray-500 text-sm">Category</th>
              <th className="px-6 py-4 font-medium text-gray-500 text-sm text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredPhotos.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <img src={p.url} alt={p.caption || 'Photo'} className="w-12 h-12 rounded-lg object-cover bg-gray-100" />
                </td>
                <td className="px-6 py-4 font-medium text-gray-900">{p.caption || '—'}</td>
                <td className="px-6 py-4 text-gray-500">{p.category}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <button onClick={() => handleEdit(p)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => handleDelete(p.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredPhotos.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                  No photos found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function GalleryPhotoEditor({ photo, isCreating, onCancel, onSaved, uploading, onUploadingChange, onError, availableCategories }: any) {
  const [formData, setFormData] = useState(photo);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setFormData(photo);
  }, [photo]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { url: formData.url, caption: formData.caption || null, category: formData.category };
      if (isCreating) {
        await createGalleryPhoto(payload);
      } else {
        await updateGalleryPhoto(formData.id, payload);
      }
      await onSaved(isCreating ? 'Photo created.' : 'Photo updated.');
    } catch (e: any) {
      onError(e?.message || 'Failed to save photo');
    } finally {
      setSaving(false);
    }
  }

  async function handleUpload(file: File) {
    try {
      onUploadingChange(true);
      const result = await uploadImage(file);
      setFormData((prev: any) => ({ ...(prev || {}), url: result.url }));
    } catch (e: any) {
      onError(e?.message || 'Failed to upload image');
    } finally {
      onUploadingChange(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-light text-gray-900">{isCreating ? 'New Photo' : 'Edit Photo'}</h1>
        <button onClick={onCancel} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
          <input
            required
            type="text"
            value={formData.url || ''}
            onChange={e => setFormData({ ...formData, url: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
          />
          <div className="mt-2 flex items-center justify-between gap-3">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                handleUpload(file);
                e.currentTarget.value = '';
              }}
              className="block w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
            />
            {uploading && <div className="text-sm text-gray-500">Uploading…</div>}
          </div>
          <div className="mt-1 text-xs text-gray-500">Recommended: portrait \(1600×2000\) \(4:5\) or larger.</div>
          {formData.url && (
            <img src={formData.url} alt="Preview" className="mt-2 h-48 w-full object-cover rounded-lg bg-gray-50" />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Caption</label>
          <input
            type="text"
            value={formData.caption || ''}
            onChange={e => setFormData({ ...formData, caption: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            value={availableCategories.includes(formData.category) ? formData.category : '__custom__'}
            onChange={(e) => {
              const v = e.target.value;
              if (v === '__custom__') {
                setFormData({ ...formData, category: '' });
              } else {
                setFormData({ ...formData, category: v });
              }
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-black focus:border-transparent outline-none"
          >
            {availableCategories.map((c: string) => (
              <option key={c} value={c}>{c}</option>
            ))}
            <option value="__custom__">Custom…</option>
          </select>
          {!availableCategories.includes(formData.category) && (
            <input
              required
              type="text"
              value={formData.category || ''}
              onChange={e => setFormData({ ...formData, category: e.target.value })}
              placeholder="Enter category"
              className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
            />
          )}
        </div>

        <div className="pt-4 flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving || uploading}
            className="flex items-center space-x-2 bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors"
          >
            {saving ? <Loader size={18} className="animate-spin" /> : <Save size={18} />}
            <span>{isCreating ? 'Create Photo' : 'Save Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
