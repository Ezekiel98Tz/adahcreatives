import React, { useEffect, useState } from 'react';
import { getAbout, updatePageData, uploadImage } from '../../lib/api';
import { Save, Loader, Plus, Trash2 } from 'lucide-react';

export function AboutPageEditor() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const aboutData = await getAbout();
      const normalized = {
        ...aboutData,
        hero: { ...(aboutData?.hero || {}), image: aboutData?.hero?.image || { url: '' } },
        intro: { ...(aboutData?.intro || {}) },
        features: Array.isArray(aboutData?.features) ? aboutData.features : [],
        stats: Array.isArray(aboutData?.stats) ? aboutData.stats : [],
        founder: {
          ...(aboutData?.founder || {}),
          portrait: aboutData?.founder?.portrait || { url: '' },
          bio: aboutData?.founder?.bio || '',
        },
      };
      setData(normalized);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      await updatePageData('about', data);
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

  function addStat() {
    setData((prev: any) => {
      const stats = Array.isArray(prev?.stats) ? prev.stats : [];
      return { ...(prev || {}), stats: [...stats, { label: '', value: '' }] };
    });
  }

  function updateStat(index: number, patch: any) {
    setData((prev: any) => {
      const stats = Array.isArray(prev?.stats) ? prev.stats : [];
      return { ...(prev || {}), stats: stats.map((s: any, i: number) => (i === index ? { ...(s || {}), ...patch } : s)) };
    });
  }

  function removeStat(index: number) {
    setData((prev: any) => {
      const stats = Array.isArray(prev?.stats) ? prev.stats : [];
      return { ...(prev || {}), stats: stats.filter((_: any, i: number) => i !== index) };
    });
  }

  function addFeature() {
    setData((prev: any) => {
      const features = Array.isArray(prev?.features) ? prev.features : [];
      return { ...(prev || {}), features: [...features, { title: '', description: '', image: { url: '' } }] };
    });
  }

  function updateFeature(index: number, patch: any) {
    setData((prev: any) => {
      const features = Array.isArray(prev?.features) ? prev.features : [];
      const next = features.map((item: any, i: number) => {
        if (i !== index) return item;
        const nextImage = patch?.image ? { ...(item?.image || {}), ...patch.image } : item?.image;
        const nextItem = { ...(item || {}), ...patch };
        if (patch?.image) nextItem.image = nextImage;
        return nextItem;
      });
      return { ...(prev || {}), features: next };
    });
  }

  function removeFeature(index: number) {
    setData((prev: any) => {
      const features = Array.isArray(prev?.features) ? prev.features : [];
      return { ...(prev || {}), features: features.filter((_: any, i: number) => i !== index) };
    });
  }

  async function uploadToPath(key: string, file: File, onUrl: (url: string) => void) {
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

  if (loading) return <div className="flex items-center justify-center h-64"><Loader className="animate-spin text-gray-400" /></div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-light text-gray-900">Edit About Page</h1>
        <button 
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="flex items-center space-x-2 bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors"
        >
          {saving ? <Loader size={18} className="animate-spin" /> : <Save size={18} />}
          <span>Save Changes</span>
        </button>
      </div>

      {message && (
        <div className={`p-4 mb-6 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message.text}
        </div>
      )}

      <form className="space-y-8" onSubmit={handleSave}>
        {/* Hero Section */}
        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b">Hero Section</h2>
          <div className="grid gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input 
                type="text" 
                value={data.hero.title}
                onChange={(e) => handleChange('hero.title', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
              <textarea 
                value={data.hero.subtitle}
                onChange={(e) => handleChange('hero.subtitle', e.target.value)}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hero Image URL</label>
              <input 
                type="text" 
                value={data.hero.image.url || ''}
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
                    uploadToPath('about.hero.image', file, (url) => handleChange('hero.image.url', url));
                    e.currentTarget.value = '';
                  }}
                  className="block w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                />
                {uploadingKey === 'about.hero.image' && <div className="text-sm text-gray-500">Uploading…</div>}
              </div>
              <div className="mt-1 text-xs text-gray-500">Recommended: landscape \(2560×1600\) or larger.</div>
              {data.hero.image.url && (
                <img src={data.hero.image.url} alt="Preview" className="mt-2 h-40 w-full object-cover rounded-lg" />
              )}
            </div>
          </div>
        </section>

        {/* Intro Section */}
        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b">Introduction</h2>
          <div className="grid gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input 
                type="text" 
                value={data.intro.title}
                onChange={(e) => handleChange('intro.title', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
              <textarea 
                value={data.intro.content}
                onChange={(e) => handleChange('intro.content', e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
              />
            </div>
          </div>
        </section>

        {/* Philosophy Section */}
        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b">Philosophy</h2>
          <div className="grid gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Philosophy Title</label>
              <input 
                type="text" 
                value={data.intro.philosophyTitle}
                onChange={(e) => handleChange('intro.philosophyTitle', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Philosophy Content</label>
              <textarea 
                value={data.intro.philosophyContent}
                onChange={(e) => handleChange('intro.philosophyContent', e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Philosophy Quote</label>
              <input 
                type="text" 
                value={data.intro.philosophyQuote}
                onChange={(e) => handleChange('intro.philosophyQuote', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
              />
            </div>
          </div>
        </section>

        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4 pb-2 border-b">
            <h2 className="text-lg font-medium text-gray-900">Stats</h2>
            <button
              type="button"
              onClick={addStat}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-black text-white hover:bg-gray-800 transition-colors text-sm"
            >
              <Plus size={16} />
              <span>Add Stat</span>
            </button>
          </div>

          <div className="space-y-4">
            {(Array.isArray(data.stats) ? data.stats : []).map((item: any, index: number) => (
              <div key={`${item?.label || 'stat'}-${index}`} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-gray-900">Stat {index + 1}</div>
                  <button
                    type="button"
                    onClick={() => removeStat(index)}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors text-sm"
                  >
                    <Trash2 size={16} />
                    <span>Remove</span>
                  </button>
                </div>
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
                    <input
                      type="text"
                      value={item?.label || ''}
                      onChange={(e) => updateStat(index, { label: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
                    <input
                      type="text"
                      value={item?.value || ''}
                      onChange={(e) => updateStat(index, { value: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                    />
                  </div>
                </div>
              </div>
            ))}
            {(Array.isArray(data.stats) ? data.stats : []).length === 0 && (
              <div className="text-sm text-gray-500">No stats yet.</div>
            )}
          </div>
        </section>

        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4 pb-2 border-b">
            <h2 className="text-lg font-medium text-gray-900">Why We Stand Out</h2>
            <button
              type="button"
              onClick={addFeature}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-black text-white hover:bg-gray-800 transition-colors text-sm"
            >
              <Plus size={16} />
              <span>Add Card</span>
            </button>
          </div>

          <div className="space-y-4">
            {(Array.isArray(data.features) ? data.features : []).map((item: any, index: number) => {
              const url = item?.image?.url || '';
              const uploading = uploadingKey === `about.features.${index}.image`;
              return (
                <div key={`${item?.title || 'feature'}-${index}`} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-gray-900">Card {index + 1}</div>
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
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
                        value={item?.title || ''}
                        onChange={(e) => updateFeature(index, { title: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        rows={3}
                        value={item?.description || ''}
                        onChange={(e) => updateFeature(index, { description: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                      <input
                        type="text"
                        value={url}
                        onChange={(e) => updateFeature(index, { image: { url: e.target.value } })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                      />

                      <div className="mt-2 flex items-center justify-between gap-3">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            uploadToPath(`about.features.${index}.image`, file, (uploadedUrl) => updateFeature(index, { image: { url: uploadedUrl } }));
                            e.currentTarget.value = '';
                          }}
                          className="block w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                        />
                        {uploading && <div className="text-sm text-gray-500">Uploading…</div>}
                      </div>
                      <div className="mt-1 text-xs text-gray-500">Recommended: landscape \(2400×1350\) \(16:9\) or larger.</div>

                      {url && (
                        <img src={url} alt="Preview" className="mt-2 h-40 w-full object-cover rounded-lg bg-white" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            {(Array.isArray(data.features) ? data.features : []).length === 0 && (
              <div className="text-sm text-gray-500">No cards yet.</div>
            )}
          </div>
        </section>

        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b">Founder</h2>
          <div className="grid gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Portrait URL</label>
              <input
                type="text"
                value={data.founder?.portrait?.url || ''}
                onChange={(e) => handleChange('founder.portrait.url', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
              />
              <div className="mt-2 flex items-center justify-between gap-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    uploadToPath('about.founder.portrait', file, (url) => handleChange('founder.portrait.url', url));
                    e.currentTarget.value = '';
                  }}
                  className="block w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                />
                {uploadingKey === 'about.founder.portrait' && <div className="text-sm text-gray-500">Uploading…</div>}
              </div>
              <div className="mt-1 text-xs text-gray-500">Recommended: portrait \(1600×2000\) \(4:5\) or larger.</div>
              {data.founder?.portrait?.url && (
                <img src={data.founder.portrait.url} alt="Portrait preview" className="mt-2 h-40 w-full object-cover rounded-lg bg-gray-50" />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
              <textarea
                rows={4}
                value={data.founder?.bio || ''}
                onChange={(e) => handleChange('founder.bio', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
              />
            </div>
          </div>
        </section>
      </form>
    </div>
  );
}
