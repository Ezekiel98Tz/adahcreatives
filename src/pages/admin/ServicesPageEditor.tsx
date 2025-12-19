import React, { useEffect, useState } from 'react';
import { getServicesAdmin, getServicesPage, updatePageData, createService, updateService, deleteService, uploadImage } from '../../lib/api';
import { Save, Loader, Plus, Trash2, Edit2, X } from 'lucide-react';

export function ServicesPageEditor() {
  const [data, setData] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [editingService, setEditingService] = useState<any | null>(null);
  const [isCreatingService, setIsCreatingService] = useState(false);

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    try {
      const [pageData, svc] = await Promise.all([getServicesPage(), getServicesAdmin()]);
      const normalized = {
        ...pageData,
        hero: {
          ...(pageData?.hero || {}),
          image: pageData?.hero?.image || { url: '' },
        },
        categories: Array.isArray(pageData?.categories) ? pageData.categories.map((c: any) => ({
          ...(c || {}),
          image: c?.image || { url: '' },
          items: Array.isArray(c?.items) ? c.items : [],
        })) : [],
        process: Array.isArray(pageData?.process) ? pageData.process : [],
      };
      setData(normalized);
      setServices(svc);
    } catch (e) {
      console.error(e);
      setMessage({ type: 'error', text: 'Failed to load services page data.' });
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      await updatePageData('services', data);
      setMessage({ type: 'success', text: 'Changes saved successfully!' });
    } catch (e) {
      setMessage({ type: 'error', text: 'Failed to save changes.' });
    } finally {
      setSaving(false);
    }
  }

  const handleChange = (path: string, value: any) => {
    const keys = path.split('.');
    setData((prev: any) => {
      const newData = { ...(prev || {}) };
      let current: any = newData;
      for (let i = 0; i < keys.length - 1; i++) {
        const k = keys[i];
        const nextVal = current?.[k];
        const next =
          Array.isArray(nextVal) ? [...nextVal] :
          nextVal && typeof nextVal === 'object' ? { ...nextVal } :
          {};
        current[k] = next;
        current = next;
      }
      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  function addCategory() {
    setData((prev: any) => {
      const categories = Array.isArray(prev?.categories) ? prev.categories : [];
      return {
        ...(prev || {}),
        categories: [...categories, { title: '', description: '', image: { url: '' }, items: [] }],
      };
    });
  }

  function updateCategory(index: number, patch: any) {
    setData((prev: any) => {
      const categories = Array.isArray(prev?.categories) ? prev.categories : [];
      const next = categories.map((c: any, i: number) => {
        if (i !== index) return c;
        const nextImage = patch?.image ? { ...(c?.image || {}), ...patch.image } : c?.image;
        const nextCat = { ...(c || {}), ...patch };
        if (patch?.image) nextCat.image = nextImage;
        return nextCat;
      });
      return { ...(prev || {}), categories: next };
    });
  }

  function removeCategory(index: number) {
    setData((prev: any) => {
      const categories = Array.isArray(prev?.categories) ? prev.categories : [];
      return { ...(prev || {}), categories: categories.filter((_: any, i: number) => i !== index) };
    });
  }

  function addProcessStep() {
    setData((prev: any) => {
      const process = Array.isArray(prev?.process) ? prev.process : [];
      const nextStep = String(process.length + 1).padStart(2, '0');
      return { ...(prev || {}), process: [...process, { step: nextStep, title: '', description: '' }] };
    });
  }

  function updateProcessStep(index: number, patch: any) {
    setData((prev: any) => {
      const process = Array.isArray(prev?.process) ? prev.process : [];
      return { ...(prev || {}), process: process.map((p: any, i: number) => (i === index ? { ...(p || {}), ...patch } : p)) };
    });
  }

  function removeProcessStep(index: number) {
    setData((prev: any) => {
      const process = Array.isArray(prev?.process) ? prev.process : [];
      return { ...(prev || {}), process: process.filter((_: any, i: number) => i !== index) };
    });
  }

  async function uploadToKey(key: string, file: File, onUrl: (url: string) => void) {
    try {
      setUploadingKey(key);
      const result = await uploadImage(file);
      onUrl(result.url);
    } catch (e: any) {
      setMessage({ type: 'error', text: e?.message || 'Failed to upload image.' });
    } finally {
      setUploadingKey(null);
    }
  }

  async function handleDeleteService(id: number) {
    if (!confirm('Are you sure you want to delete this service?')) return;
    try {
      await deleteService(id);
      const refreshed = await getServicesAdmin();
      setServices(refreshed);
    } catch (e) {
      setMessage({ type: 'error', text: 'Failed to delete service.' });
    }
  }

  function handleCreateService() {
    setEditingService({ title: '', description: '', icon: '' });
    setIsCreatingService(true);
  }

  function handleEditService(svc: any) {
    setEditingService({ ...svc, icon: svc.icon || '' });
    setIsCreatingService(false);
  }

  async function handleSaveService(e: React.FormEvent) {
    e.preventDefault();
    if (!editingService) return;
    try {
      const payload = { title: editingService.title, description: editingService.description, icon: editingService.icon || null };
      if (isCreatingService) {
        await createService(payload);
      } else {
        await updateService(editingService.id, payload);
      }
      setEditingService(null);
      const refreshed = await getServicesAdmin();
      setServices(refreshed);
    } catch (e) {
      setMessage({ type: 'error', text: 'Failed to save service.' });
    }
  }

  if (loading) return <div className="flex items-center justify-center h-64"><Loader className="animate-spin text-gray-400" /></div>;
  if (!data) return null;

  if (editingService) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-light text-gray-900">{isCreatingService ? 'New Service' : 'Edit Service'}</h1>
          <button onClick={() => setEditingService(null)} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSaveService} className="space-y-6 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              required
              type="text"
              value={editingService.title || ''}
              onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              required
              rows={4}
              value={editingService.description || ''}
              onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Icon (optional)</label>
            <input
              type="text"
              value={editingService.icon || ''}
              onChange={(e) => setEditingService({ ...editingService, icon: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
            />
          </div>
          <div className="pt-4 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={() => setEditingService(null)}
              className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center space-x-2 bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <Save size={18} />
              <span>{isCreatingService ? 'Create Service' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-light text-gray-900">Edit Services</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center space-x-2 bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors"
        >
          {saving ? <Loader size={18} className="animate-spin" /> : <Save size={18} />}
          <span>Save Page</span>
        </button>
      </div>

      {message && (
        <div className={`p-4 mb-6 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message.text}
        </div>
      )}

      <form className="space-y-8">
        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b">Hero</h2>
          <div className="grid gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={data.hero?.title || ''}
                onChange={(e) => handleChange('hero.title', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
              <textarea
                rows={2}
                value={data.hero?.subtitle || ''}
                onChange={(e) => handleChange('hero.subtitle', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hero Image URL</label>
              <input
                type="text"
                value={data.hero?.image?.url || ''}
                onChange={(e) => handleChange('hero.image.url', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
              />
              <div className="mt-2 flex items-center justify-between gap-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    uploadToKey('services.hero.image', file, (url) => handleChange('hero.image.url', url));
                    e.currentTarget.value = '';
                  }}
                  className="block w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                />
                {uploadingKey === 'services.hero.image' && <div className="text-sm text-gray-500">Uploading…</div>}
              </div>
              {data.hero?.image?.url && (
                <img src={data.hero.image.url} alt="Preview" className="mt-2 h-40 w-full object-cover rounded-lg bg-gray-50" />
              )}
            </div>
          </div>
        </section>

        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4 pb-2 border-b">
            <h2 className="text-lg font-medium text-gray-900">Service Categories</h2>
            <button
              type="button"
              onClick={addCategory}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-black text-white hover:bg-gray-800 transition-colors text-sm"
            >
              <Plus size={16} />
              <span>Add Category</span>
            </button>
          </div>

          <div className="space-y-4">
            {(Array.isArray(data.categories) ? data.categories : []).map((cat: any, index: number) => {
              const url = cat?.image?.url || '';
              const uploading = uploadingKey === `services.categories.${index}.image`;
              return (
                <div key={`${cat?.title || 'category'}-${index}`} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-gray-900">Category {index + 1}</div>
                    <button
                      type="button"
                      onClick={() => removeCategory(index)}
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors text-sm"
                    >
                      <Trash2 size={16} />
                      <span>Remove</span>
                    </button>
                  </div>

                  <div className="mt-3 grid gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                      <input
                        type="text"
                        value={cat?.title || ''}
                        onChange={(e) => updateCategory(index, { title: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        rows={3}
                        value={cat?.description || ''}
                        onChange={(e) => updateCategory(index, { description: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                      <input
                        type="text"
                        value={url}
                        onChange={(e) => updateCategory(index, { image: { url: e.target.value } })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                      />
                      <div className="mt-2 flex items-center justify-between gap-3">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            uploadToKey(`services.categories.${index}.image`, file, (uploadedUrl) => updateCategory(index, { image: { url: uploadedUrl } }));
                            e.currentTarget.value = '';
                          }}
                          className="block w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                        />
                        {uploading && <div className="text-sm text-gray-500">Uploading…</div>}
                      </div>
                      {url && (
                        <img src={url} alt="Preview" className="mt-2 h-40 w-full object-cover rounded-lg bg-white" />
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Items (comma-separated)</label>
                      <input
                        type="text"
                        value={Array.isArray(cat?.items) ? cat.items.join(', ') : ''}
                        onChange={(e) => updateCategory(index, { items: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
            {(Array.isArray(data.categories) ? data.categories : []).length === 0 && (
              <div className="text-sm text-gray-500">No categories yet.</div>
            )}
          </div>
        </section>

        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4 pb-2 border-b">
            <h2 className="text-lg font-medium text-gray-900">Process</h2>
            <button
              type="button"
              onClick={addProcessStep}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-black text-white hover:bg-gray-800 transition-colors text-sm"
            >
              <Plus size={16} />
              <span>Add Step</span>
            </button>
          </div>

          <div className="space-y-4">
            {(Array.isArray(data.process) ? data.process : []).map((step: any, index: number) => (
              <div key={`${step?.step || 'step'}-${index}`} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-gray-900">Step {index + 1}</div>
                  <button
                    type="button"
                    onClick={() => removeProcessStep(index)}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors text-sm"
                  >
                    <Trash2 size={16} />
                    <span>Remove</span>
                  </button>
                </div>

                <div className="mt-3 grid gap-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Step</label>
                      <input
                        type="text"
                        value={step?.step || ''}
                        onChange={(e) => updateProcessStep(index, { step: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                      <input
                        type="text"
                        value={step?.title || ''}
                        onChange={(e) => updateProcessStep(index, { title: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      rows={3}
                      value={step?.description || ''}
                      onChange={(e) => updateProcessStep(index, { description: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                    />
                  </div>
                </div>
              </div>
            ))}
            {(Array.isArray(data.process) ? data.process : []).length === 0 && (
              <div className="text-sm text-gray-500">No steps yet.</div>
            )}
          </div>
        </section>

        <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div>
              <h2 className="text-lg font-medium text-gray-900">Service Packages</h2>
              <p className="text-sm text-gray-500 mt-1">These are loaded from the database.</p>
            </div>
            <button
              type="button"
              onClick={handleCreateService}
              className="flex items-center space-x-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <Plus size={18} />
              <span>Add Service</span>
            </button>
          </div>

          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-medium text-gray-500 text-sm">Title</th>
                <th className="px-6 py-4 font-medium text-gray-500 text-sm">Icon</th>
                <th className="px-6 py-4 font-medium text-gray-500 text-sm text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {services.map((svc) => (
                <tr key={svc.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{svc.title}</td>
                  <td className="px-6 py-4 text-gray-500">{svc.icon || '—'}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button onClick={() => handleEditService(svc)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => handleDeleteService(svc.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {services.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                    No services found. Add one to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      </form>
    </div>
  );
}
