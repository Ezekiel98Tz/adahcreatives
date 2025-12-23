import React, { useEffect, useState } from 'react';
import { getHome, updatePageData, uploadImage } from '../../lib/api';
import { Save, Loader, Plus, Trash2 } from 'lucide-react';

export function HomePageEditor() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [pendingTrustedByFocusId, setPendingTrustedByFocusId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (!pendingTrustedByFocusId) return;
    const selector = `input[data-trusted-by-id="${pendingTrustedByFocusId}"]`;
    const input = document.querySelector(selector) as HTMLInputElement | null;
    if (!input) return;
    input.scrollIntoView({ block: 'center' });
    input.focus();
    setPendingTrustedByFocusId(null);
  }, [pendingTrustedByFocusId, data]);

  const createId = () => {
    try {
      return crypto.randomUUID();
    } catch {
      return `${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`;
    }
  };

  async function loadData() {
    try {
      const homeData = await getHome();
      const defaultServicesTeaser = {
        titleLine1: 'We Craft',
        titleLine2: 'Timeless Media.',
        description: 'From high-end photography to cinematic video production, we help brands and individuals tell stories that resonate and endure.',
        cards: [
          { title: 'Photography', image: { url: 'https://images.unsplash.com/photo-1554048612-387768052bf7?auto=format&fit=crop&q=80&w=800' } },
          { title: 'Cinematography', image: { url: 'https://images.unsplash.com/photo-1579632652768-6cb9dcf85912?auto=format&fit=crop&q=80&w=800' } },
          { title: 'Creative Strategy', image: { url: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800' } },
        ],
      };
      const defaultVisualGallery = {
        title: 'Visual Stories',
        subtitle: 'A curated selection of our most impactful moments captured through the lens.',
        ctaText: 'View Full Gallery',
      };

      const seededServicesCards = (() => {
        const rawCards = Array.isArray(homeData?.servicesTeaser?.cards) ? homeData.servicesTeaser.cards : [];
        const base = rawCards.length > 0 ? rawCards : defaultServicesTeaser.cards;
        const normalizedCards = base.slice(0, 3).map((c: any) => ({
          ...(c || {}),
          title: typeof c?.title === 'string' ? c.title : '',
          image: c?.image && typeof c.image === 'object' ? { ...(c.image || {}), url: c?.image?.url || '' } : { url: '' },
        }));

        while (normalizedCards.length < 3) {
          const next = defaultServicesTeaser.cards[normalizedCards.length];
          normalizedCards.push({ ...(next || {}), image: { ...(next?.image || {}), url: next?.image?.url || '' } });
        }

        return normalizedCards;
      })();

      const normalized = {
        ...homeData,
        hero: {
          ...(homeData?.hero || {}),
          image: homeData?.hero?.image || { url: '' },
        },
        servicesTeaser: {
          ...defaultServicesTeaser,
          ...(homeData?.servicesTeaser || {}),
          cards: seededServicesCards,
        },
        visualGallery: {
          ...defaultVisualGallery,
          ...(homeData?.visualGallery || {}),
        },
        visualStories: {
          ...(homeData?.visualStories || {}),
          image: homeData?.visualStories?.image || { url: '' },
          carousel: Array.isArray(homeData?.visualStories?.carousel) ? homeData.visualStories.carousel : [],
        },
        trustedBy: (Array.isArray(homeData?.trustedBy) ? homeData.trustedBy : []).map((item: any) => ({
          ...(item || {}),
          id: item?.id || createId(),
          logo: item?.logo || { url: '' },
        })),
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
      await updatePageData('home', data);
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

  function addCarouselItem() {
    const id = `${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`;
    setData((prev: any) => {
      const carousel = Array.isArray(prev?.visualStories?.carousel) ? prev.visualStories.carousel : [];
      return {
        ...(prev || {}),
        visualStories: {
          ...(prev?.visualStories || {}),
          carousel: [...carousel, { id, title: '', image: { url: '' } }],
        },
      };
    });
  }

  function updateCarouselItem(index: number, patch: any) {
    setData((prev: any) => {
      const carousel = Array.isArray(prev?.visualStories?.carousel) ? prev.visualStories.carousel : [];
      const next = carousel.map((item: any, i: number) => {
        if (i !== index) return item;
        const nextImage = patch?.image ? { ...(item?.image || {}), ...patch.image } : item?.image;
        const nextItem = { ...(item || {}), ...patch };
        if (patch?.image) nextItem.image = nextImage;
        return nextItem;
      });
      return { ...(prev || {}), visualStories: { ...(prev?.visualStories || {}), carousel: next } };
    });
  }

  function removeCarouselItem(index: number) {
    setData((prev: any) => {
      const carousel = Array.isArray(prev?.visualStories?.carousel) ? prev.visualStories.carousel : [];
      return {
        ...(prev || {}),
        visualStories: {
          ...(prev?.visualStories || {}),
          carousel: carousel.filter((_: any, i: number) => i !== index),
        },
      };
    });
  }

  function addTrustedBy() {
    const id = createId();
    setData((prev: any) => {
      const trustedBy = Array.isArray(prev?.trustedBy) ? prev.trustedBy : [];
      return { ...(prev || {}), trustedBy: [{ id, name: '', logo: { url: '' } }, ...trustedBy] };
    });
    setPendingTrustedByFocusId(id);
  }

  function updateTrustedBy(index: number, patch: any) {
    setData((prev: any) => {
      const trustedBy = Array.isArray(prev?.trustedBy) ? prev.trustedBy : [];
      const next = trustedBy.map((item: any, i: number) => {
        if (i !== index) return item;
        const nextLogo = patch?.logo ? { ...(item?.logo || {}), ...patch.logo } : item?.logo;
        const nextItem = { ...(item || {}), ...patch };
        if (patch?.logo) nextItem.logo = nextLogo;
        return nextItem;
      });
      return { ...(prev || {}), trustedBy: next };
    });
  }

  function removeTrustedBy(index: number) {
    setData((prev: any) => {
      const trustedBy = Array.isArray(prev?.trustedBy) ? prev.trustedBy : [];
      return { ...(prev || {}), trustedBy: trustedBy.filter((_: any, i: number) => i !== index) };
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
        <h1 className="text-2xl font-light text-gray-900">Edit Home Page</h1>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Headline</label>
              <input 
                type="text" 
                value={data.hero.headline}
                onChange={(e) => handleChange('hero.headline', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subhead</label>
              <textarea 
                value={data.hero.subhead}
                onChange={(e) => handleChange('hero.subhead', e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tagline</label>
              <textarea 
                value={data.hero.tagline}
                onChange={(e) => handleChange('hero.tagline', e.target.value)}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Call to Action (Button Text)</label>
              <input 
                type="text" 
                value={data.hero.cta}
                onChange={(e) => handleChange('hero.cta', e.target.value)}
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
                    uploadToPath('home.hero.image', file, (url) => handleChange('hero.image.url', url));
                    e.currentTarget.value = '';
                  }}
                  className="block w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                />
                {uploadingKey === 'home.hero.image' && <div className="text-sm text-gray-500">Uploading…</div>}
              </div>
              <div className="mt-1 text-xs text-gray-500">Recommended: landscape \(2560×1600\) or larger.</div>
              {data.hero.image.url && (
                <img src={data.hero.image.url} alt="Preview" className="mt-2 h-40 w-full object-cover rounded-lg" />
              )}
            </div>
          </div>
        </section>

        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b">We Craft Timeless Media Section</h2>
          <div className="grid gap-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title Line 1</label>
                <input
                  type="text"
                  value={data.servicesTeaser?.titleLine1 || ''}
                  onChange={(e) => handleChange('servicesTeaser.titleLine1', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title Line 2</label>
                <input
                  type="text"
                  value={data.servicesTeaser?.titleLine2 || ''}
                  onChange={(e) => handleChange('servicesTeaser.titleLine2', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={data.servicesTeaser?.description || ''}
                onChange={(e) => handleChange('servicesTeaser.description', e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
              />
            </div>

            <div>
              <div className="text-sm font-medium text-gray-900">Cards</div>

              <div className="mt-4 space-y-4">
                {(Array.isArray(data.servicesTeaser?.cards) ? data.servicesTeaser.cards : []).map((card: any, index: number) => {
                  const url = card?.image?.url || '';
                  const uploading = uploadingKey === `home.servicesTeaser.cards.${index}`;
                  return (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="text-sm font-medium text-gray-900">Card {index + 1}</div>

                      <div className="mt-3 grid gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                          <input
                            type="text"
                            value={card?.title || ''}
                            onChange={(e) => {
                              setData((prev: any) => {
                                const cards = Array.isArray(prev?.servicesTeaser?.cards) ? prev.servicesTeaser.cards : [];
                                const next = cards.map((c: any, i: number) => (i === index ? { ...(c || {}), title: e.target.value } : c));
                                return { ...(prev || {}), servicesTeaser: { ...(prev?.servicesTeaser || {}), cards: next } };
                              });
                            }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                          <input
                            type="text"
                            value={url}
                            onChange={(e) => {
                              setData((prev: any) => {
                                const cards = Array.isArray(prev?.servicesTeaser?.cards) ? prev.servicesTeaser.cards : [];
                                const next = cards.map((c: any, i: number) => (i === index ? { ...(c || {}), image: { ...(c?.image || {}), url: e.target.value } } : c));
                                return { ...(prev || {}), servicesTeaser: { ...(prev?.servicesTeaser || {}), cards: next } };
                              });
                            }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                          />
                          <div className="mt-2 flex items-center justify-between gap-3">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                uploadToPath(`home.servicesTeaser.cards.${index}`, file, (uploadedUrl) => {
                                  setData((prev: any) => {
                                    const cards = Array.isArray(prev?.servicesTeaser?.cards) ? prev.servicesTeaser.cards : [];
                                    const next = cards.map((c: any, i: number) => (i === index ? { ...(c || {}), image: { ...(c?.image || {}), url: uploadedUrl } } : c));
                                    return { ...(prev || {}), servicesTeaser: { ...(prev?.servicesTeaser || {}), cards: next } };
                                  });
                                });
                                e.currentTarget.value = '';
                              }}
                              className="block w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                            />
                            {uploading && <div className="text-sm text-gray-500">Uploading…</div>}
                          </div>
                          {url && (
                            <img src={url} alt="Preview" className="mt-2 h-32 w-full object-cover rounded-lg bg-white" />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {(Array.isArray(data.servicesTeaser?.cards) ? data.servicesTeaser.cards : []).length === 0 && (
                  <div className="text-sm text-gray-500">No cards yet.</div>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b">Visual Stories (Gallery Teaser)</h2>
          <div className="grid gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={data.visualGallery?.title || ''}
                onChange={(e) => handleChange('visualGallery.title', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
              <textarea
                value={data.visualGallery?.subtitle || ''}
                onChange={(e) => handleChange('visualGallery.subtitle', e.target.value)}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
              <input
                type="text"
                value={data.visualGallery?.ctaText || ''}
                onChange={(e) => handleChange('visualGallery.ctaText', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
              />
            </div>
          </div>
        </section>

        {/* Legacy / Philosophy Section */}
        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b">Legacy / Philosophy Section</h2>
          <div className="grid gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input 
                type="text" 
                value={data.visualStories.title}
                onChange={(e) => handleChange('visualStories.title', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea 
                value={data.visualStories.description}
                onChange={(e) => handleChange('visualStories.description', e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
              <input 
                type="text" 
                value={data.visualStories.cta}
                onChange={(e) => handleChange('visualStories.cta', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Feature Image URL</label>
              <input
                type="text"
                value={data.visualStories.image?.url || ''}
                onChange={(e) => handleChange('visualStories.image.url', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
              />
              <div className="mt-2 flex items-center justify-between gap-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    uploadToPath('home.visualStories.image', file, (url) => handleChange('visualStories.image.url', url));
                    e.currentTarget.value = '';
                  }}
                  className="block w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                />
                {uploadingKey === 'home.visualStories.image' && <div className="text-sm text-gray-500">Uploading…</div>}
              </div>
              <div className="mt-1 text-xs text-gray-500">Recommended: landscape \(2400×1600\) or larger.</div>
              {data.visualStories.image?.url && (
                <img src={data.visualStories.image.url} alt="Preview" className="mt-2 h-40 w-full object-cover rounded-lg bg-gray-50" />
              )}
            </div>

            <div className="pt-2">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-gray-900">Carousel Images</div>
                <button
                  type="button"
                  onClick={addCarouselItem}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-black text-white hover:bg-gray-800 transition-colors text-sm"
                >
                  <Plus size={16} />
                  <span>Add Image</span>
                </button>
              </div>

              <div className="mt-4 space-y-4">
                {(Array.isArray(data.visualStories.carousel) ? data.visualStories.carousel : []).map((item: any, index: number) => {
                  const url = item?.image?.url || item?.url || '';
                  const uploading = uploadingKey === `home.visualStories.carousel.${index}`;
                  return (
                    <div key={item?.id || index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium text-gray-900">Item {index + 1}</div>
                        <button
                          type="button"
                          onClick={() => removeCarouselItem(index)}
                          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors text-sm"
                        >
                          <Trash2 size={16} />
                          <span>Remove</span>
                        </button>
                      </div>

                      <div className="mt-3 grid gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Title (optional)</label>
                          <input
                            type="text"
                            value={item?.title || ''}
                            onChange={(e) => updateCarouselItem(index, { title: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                          <input
                            type="text"
                            value={url}
                            onChange={(e) => updateCarouselItem(index, { image: { url: e.target.value } })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                          />

                          <div className="mt-2 flex items-center justify-between gap-3">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                uploadToPath(`home.visualStories.carousel.${index}`, file, (uploadedUrl) => updateCarouselItem(index, { image: { url: uploadedUrl } }));
                                e.currentTarget.value = '';
                              }}
                              className="block w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                            />
                            {uploading && <div className="text-sm text-gray-500">Uploading…</div>}
                          </div>
                          <div className="mt-1 text-xs text-gray-500">Recommended: portrait \(1600×2000\) \(4:5\) or larger.</div>

                          {url && (
                            <img src={url} alt="Preview" className="mt-2 h-40 w-full object-cover rounded-lg bg-white" />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {(Array.isArray(data.visualStories.carousel) ? data.visualStories.carousel : []).length === 0 && (
                  <div className="text-sm text-gray-500">No carousel images yet.</div>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4 pb-2 border-b">
            <h2 className="text-lg font-medium text-gray-900">Trusted By</h2>
            <button
              type="button"
              onClick={addTrustedBy}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-black text-white hover:bg-gray-800 transition-colors text-sm"
            >
              <Plus size={16} />
              <span>Add Company</span>
            </button>
          </div>

          <div className="space-y-4">
            {(Array.isArray(data.trustedBy) ? data.trustedBy : []).map((item: any, index: number) => {
              const logoUrl = item?.logo?.url || '';
              const uploading = uploadingKey === `home.trustedBy.${index}.logo`;
              return (
                <div key={item?.id || `${index}`} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-gray-900">Company {index + 1}</div>
                    <button
                      type="button"
                      onClick={() => removeTrustedBy(index)}
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors text-sm"
                    >
                      <Trash2 size={16} />
                      <span>Remove</span>
                    </button>
                  </div>

                  <div className="mt-3 grid gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        value={item?.name || ''}
                        onChange={(e) => updateTrustedBy(index, { name: e.target.value })}
                        data-trusted-by-id={item?.id || ''}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL (optional)</label>
                      <input
                        type="text"
                        value={logoUrl}
                        onChange={(e) => updateTrustedBy(index, { logo: { url: e.target.value } })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                      />

                      <div className="mt-2 flex items-center justify-between gap-3">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            uploadToPath(`home.trustedBy.${index}.logo`, file, (url) => updateTrustedBy(index, { logo: { url } }));
                            e.currentTarget.value = '';
                          }}
                          className="block w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                        />
                        {uploading && <div className="text-sm text-gray-500">Uploading…</div>}
                      </div>
                      <div className="mt-1 text-xs text-gray-500">Recommended: transparent logo \(600×300\) or SVG.</div>

                      {logoUrl && (
                        <img src={logoUrl} alt="Logo preview" className="mt-2 h-16 object-contain bg-white rounded-lg border border-gray-200 p-2" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {(Array.isArray(data.trustedBy) ? data.trustedBy : []).length === 0 && (
              <div className="text-sm text-gray-500">No companies yet.</div>
            )}
          </div>
        </section>
      </form>
    </div>
  );
}
