import React, { useEffect, useState } from 'react';
import { getProjects, createProject, updateProject, deleteProject } from '../../lib/api';
import { Plus, Edit2, Trash2, X, Save, Loader } from 'lucide-react';

export function ProjectsManager() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<any | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      // Assuming ID is numeric in backend but string in frontend model
      await deleteProject(parseInt(id));
      await loadProjects();
    } catch (e) {
      alert('Failed to delete project');
    }
  }

  function handleEdit(project: any) {
    setEditingProject({ ...project });
    setIsCreating(false);
  }

  function handleCreate() {
    setEditingProject({
      title: '',
      slug: '',
      category: '',
      description: '',
      imageUrl: ''
    });
    setIsCreating(true);
  }

  if (loading) return <div className="flex justify-center p-12"><Loader className="animate-spin" /></div>;

  if (editingProject) {
    return <ProjectEditor 
      project={editingProject} 
      isCreating={isCreating} 
      onCancel={() => setEditingProject(null)} 
      onSave={async () => {
        await loadProjects();
        setEditingProject(null);
      }} 
    />;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-light text-gray-900">Projects</h1>
          <p className="text-gray-500 mt-1">Manage your portfolio items.</p>
        </div>
        <button 
          onClick={handleCreate}
          className="flex items-center space-x-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          <Plus size={18} />
          <span>Add Project</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 font-medium text-gray-500 text-sm">Image</th>
              <th className="px-6 py-4 font-medium text-gray-500 text-sm">Title</th>
              <th className="px-6 py-4 font-medium text-gray-500 text-sm">Category</th>
              <th className="px-6 py-4 font-medium text-gray-500 text-sm text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {projects.map((project) => (
              <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <img src={project.heroImage?.url || project.imageUrl} alt={project.title} className="w-12 h-12 rounded-lg object-cover bg-gray-100" />
                </td>
                <td className="px-6 py-4 font-medium text-gray-900">{project.title}</td>
                <td className="px-6 py-4 text-gray-500">{project.category}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <button onClick={() => handleEdit(project)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => handleDelete(project.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {projects.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                  No projects found. Add one to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ProjectEditor({ project, isCreating, onCancel, onSave }: any) {
  const [formData, setFormData] = useState(project);
  const [saving, setSaving] = useState(false);

  // Map frontend fields to backend fields if necessary
  // Frontend: heroImage.url, story
  // Backend: imageUrl, description
  
  // Initialize form data properly
  useEffect(() => {
    setFormData({
      ...project,
      imageUrl: project.imageUrl || project.heroImage?.url || '',
      description: project.description || project.story || ''
    });
  }, [project]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    
    // Prepare payload for backend
    const payload = {
      title: formData.title,
      slug: formData.slug || formData.title.toLowerCase().replace(/\s+/g, '-'),
      category: formData.category,
      description: formData.description,
      imageUrl: formData.imageUrl
    };

    try {
      if (isCreating) {
        await createProject(payload);
      } else {
        await updateProject(parseInt(project.id), payload);
      }
      await onSave();
    } catch (e) {
      alert('Failed to save project');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-light text-gray-900">{isCreating ? 'New Project' : 'Edit Project'}</h1>
        <button onClick={onCancel} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input 
            required
            type="text" 
            value={formData.title} 
            onChange={e => setFormData({...formData, title: e.target.value})}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL)</label>
            <input 
              required
              type="text" 
              value={formData.slug} 
              onChange={e => setFormData({...formData, slug: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <input 
              required
              type="text" 
              value={formData.category} 
              onChange={e => setFormData({...formData, category: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
          <input 
            required
            type="text" 
            value={formData.imageUrl} 
            onChange={e => setFormData({...formData, imageUrl: e.target.value})}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
          />
          {formData.imageUrl && (
            <img src={formData.imageUrl} alt="Preview" className="mt-2 h-48 w-full object-cover rounded-lg bg-gray-50" />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea 
            required
            rows={4}
            value={formData.description} 
            onChange={e => setFormData({...formData, description: e.target.value})}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
          />
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
            disabled={saving}
            className="flex items-center space-x-2 bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors"
          >
            {saving ? <Loader size={18} className="animate-spin" /> : <Save size={18} />}
            <span>{isCreating ? 'Create Project' : 'Save Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
