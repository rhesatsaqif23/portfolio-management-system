import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { DataTable } from '#/components/tables'
import { TextField, TextAreaField } from '#/components/forms'
import { Badge, ConfirmDialog } from '#/components/shared'
import { Button } from '#/components/ui/button'
import { listProjects, createProject, updateProject, deleteProject } from '#/apis'
import type { Project } from '#/domain/ports'

export const Route = createFileRoute('/admin/projects')({
  component: ProjectsPage,
})

const initialForm = {
  title: '',
  slug: '',
  subtitle: '',
  category: '',
  description: '',
  thumbnailUrl: '',
  demoUrl: '',
  repoUrl: '',
  techStack: [] as string[],
  isFeatured: false,
  sortOrder: 0,
}

function ProjectsPage() {
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Project | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => listProjects(),
  })

  const createMutation = useMutation({
    mutationFn: (data: typeof initialForm) => createProject({ data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      closeForm()
    },
  })

  const updateMutation = useMutation({
    mutationFn: (data: { id: string; data: Partial<typeof initialForm> }) =>
      updateProject({ data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      closeForm()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteProject({ data: id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      setDeleteId(null)
    },
  })

  function openCreate() {
    setEditing(null)
    setForm(initialForm)
    setErrors({})
    setShowForm(true)
  }

  function openEdit(project: Project) {
    setEditing(project)
    setForm({
      title: project.title,
      slug: project.slug,
      subtitle: project.subtitle ?? '',
      category: project.category ?? '',
      description: project.description ?? '',
      thumbnailUrl: project.thumbnailUrl ?? '',
      demoUrl: project.demoUrl ?? '',
      repoUrl: project.repoUrl ?? '',
      techStack: project.techStack ?? [],
      isFeatured: project.isFeatured ?? false,
      sortOrder: project.sortOrder ?? 0,
    })
    setErrors({})
    setShowForm(true)
  }

  function closeForm() {
    setShowForm(false)
    setEditing(null)
    setForm(initialForm)
    setErrors({})
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title.trim()) {
      setErrors({ title: 'Title is required' })
      return
    }
    if (!form.slug.trim()) {
      setErrors({ slug: 'Slug is required' })
      return
    }
    if (editing) {
      updateMutation.mutate({ id: editing.id, data: form })
    } else {
      createMutation.mutate(form)
    }
  }

  if (isLoading) {
    return <p className="text-sm text-[var(--sea-ink-soft)]">Loading projects...</p>
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--sea-ink)]">Projects</h1>
          <p className="mt-1 text-sm text-[var(--sea-ink-soft)]">Manage your portfolio projects.</p>
        </div>
        <Button onClick={openCreate}>Create Project</Button>
      </div>

      <DataTable
        columns={[
          { key: 'title', header: 'Title' },
          {
            key: 'isFeatured',
            header: 'Featured',
            render: (value) => (
              <Badge variant={value ? 'default' : 'outline'}>
                {value ? 'Featured' : 'No'}
              </Badge>
            ),
          },
          { key: 'category', header: 'Category' },
          { key: 'slug', header: 'Slug' },
          { key: 'sortOrder', header: 'Order' },
          {
            key: 'id',
            header: 'Actions',
            render: (_, row) => (
              <div className="flex gap-2">
                <Button size="xs" variant="outline" onClick={() => openEdit(row)}>
                  Edit
                </Button>
                <Button size="xs" variant="destructive" onClick={() => setDeleteId(row.id)}>
                  Delete
                </Button>
              </div>
            ),
          },
        ]}
        data={projects}
      />

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[var(--line)] bg-[var(--card)] p-6 shadow-lg">
            <h2 className="mb-4 text-lg font-semibold text-[var(--sea-ink)]">
              {editing ? 'Edit Project' : 'Create Project'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField label="Title" name="title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} error={errors.title} />
                <TextField label="Slug" name="slug" value={form.slug} onChange={(v) => setForm({ ...form, slug: v })} error={errors.slug} />
              </div>
              <TextField label="Subtitle" name="subtitle" value={form.subtitle} onChange={(v) => setForm({ ...form, subtitle: v })} />
              <TextAreaField label="Description" name="description" value={form.description} onChange={(v) => setForm({ ...form, description: v })} rows={4} />
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField label="Thumbnail URL" name="thumbnailUrl" value={form.thumbnailUrl} onChange={(v) => setForm({ ...form, thumbnailUrl: v })} />
                <TextField label="Category" name="category" value={form.category} onChange={(v) => setForm({ ...form, category: v })} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField label="Demo URL" name="demoUrl" value={form.demoUrl} onChange={(v) => setForm({ ...form, demoUrl: v })} />
                <TextField label="Repo URL" name="repoUrl" value={form.repoUrl} onChange={(v) => setForm({ ...form, repoUrl: v })} />
              </div>
              <TextField label="Tech Stack (comma-separated)" name="techStack" value={form.techStack.join(', ')} onChange={(v) => setForm({ ...form, techStack: v.split(',').map((s) => s.trim()).filter(Boolean) })} />
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-[var(--sea-ink)]">Featured</label>
                <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} />
              </div>
              <TextField label="Sort Order" name="sortOrder" value={String(form.sortOrder)} onChange={(v) => setForm({ ...form, sortOrder: Number(v) || 0 })} />
              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={closeForm}>Cancel</Button>
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {editing ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        title="Delete Project"
        message="Are you sure you want to delete this project? This action cannot be undone."
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        onCancel={() => setDeleteId(null)}
        confirmLabel="Delete"
      />
    </div>
  )
}
