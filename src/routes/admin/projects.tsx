import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { DataTable } from '#/components/tables'
import { TextField, TextAreaField } from '#/components/forms'
import { Badge } from '#/components/shared'
import { Button } from '#/components/ui/button'
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction, AlertDialogMedia } from '#/components/ui/alert-dialog'
import { toast } from '#/components/ui/sonner'
import { listProjects, createProject, updateProject, deleteProject } from '#/apis'
import type { Project } from '#/domain/ports'
import { Plus, Trash2 } from 'lucide-react'

export const Route = createFileRoute('/admin/projects')({
  component: ProjectsPage,
})

const initialForm = {
  title: '',
  slug: '',
  descriptionShort: '',
  thumbnailUrl: '',
  isFeatured: false,
  category: '',
  githubUrl: '',
  liveUrl: '',
  additionalLinks: '',
  sortOrder: 0,
}

type ConfirmAction =
  | { type: 'create' }
  | { type: 'update'; id: string }
  | { type: 'delete'; id: string }
  | null

function ProjectsPage() {
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Project | null>(null)
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [confirm, setConfirm] = useState<ConfirmAction>(null)

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => listProjects(),
  })

  const createMutation = useMutation({
    mutationFn: () => createProject({ data: buildPayload() }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['projects'] }); toast.success('Project created'); closeForm() },
    onError: (err) => toast.error(err instanceof Error ? err.message : 'Failed'),
  })
  const updateMutation = useMutation({
    mutationFn: () => updateProject({ data: { id: editing!.id, data: buildPayload() } }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['projects'] }); toast.success('Project updated'); closeForm() },
    onError: (err) => toast.error(err instanceof Error ? err.message : 'Failed'),
  })
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteProject({ data: id }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['projects'] }); toast.success('Project deleted') },
    onError: (err) => toast.error(err instanceof Error ? err.message : 'Failed'),
  })

  function buildPayload() {
    const links = form.additionalLinks
      ? (() => {
          try { const p = JSON.parse(form.additionalLinks); if (Array.isArray(p)) return p } catch {}
          return form.additionalLinks.split('\n').map((l) => l.trim()).filter(Boolean).map((l) => {
            const sep = l.includes('|') ? '|' : ','
            const [label, url] = l.split(sep).map((s) => s.trim())
            return { label: label ?? '', url: url ?? '' }
          }).filter((l) => l.label && l.url)
        })()
      : []
    return { ...form, additionalLinks: links }
  }

  function openCreate() { setEditing(null); setForm(initialForm); setErrors({}); setShowForm(true) }

  function openEdit(project: Project) {
    setEditing(project)
    setForm({
      title: project.title, slug: project.slug, descriptionShort: project.descriptionShort ?? '',
      thumbnailUrl: project.thumbnailUrl ?? '', isFeatured: project.isFeatured ?? false,
      category: project.category ?? '', githubUrl: project.githubUrl ?? '', liveUrl: project.liveUrl ?? '',
      additionalLinks: project.additionalLinks ? JSON.stringify(project.additionalLinks) : '', sortOrder: project.sortOrder ?? 0,
    })
    setErrors({}); setShowForm(true)
  }

  function closeForm() { setShowForm(false); setEditing(null); setForm(initialForm); setErrors({}) }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs: Record<string, string> = {}
    if (!form.title.trim()) errs.title = 'Title is required'
    if (!form.slug.trim()) errs.slug = 'Slug is required'
    setErrors(errs)
    if (Object.keys(errs).length > 0) return
    setConfirm(editing ? { type: 'update', id: editing.id } : { type: 'create' })
  }

  function executeConfirm() {
    if (!confirm) return
    if (confirm.type === 'create') createMutation.mutate()
    else if (confirm.type === 'update') updateMutation.mutate()
    else deleteMutation.mutate(confirm.id)
    setConfirm(null)
  }

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading projects...</p>

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--sea-ink)]">Projects</h1>
          <p className="mt-1 text-sm text-[var(--sea-ink-soft)]">Manage your portfolio projects.</p>
        </div>
        <Button onClick={openCreate}><Plus /> Create Project</Button>
      </div>

      <DataTable
        columns={[
          { key: 'title' as keyof Project, header: 'Title' },
          { key: 'slug' as keyof Project, header: 'Slug' },
          { key: 'isFeatured' as keyof Project, header: 'Featured', render: (v) => <Badge variant={v ? 'default' : 'outline'}>{v ? 'Featured' : 'No'}</Badge> },
          { key: 'category' as keyof Project, header: 'Category' },
          { key: 'sortOrder' as keyof Project, header: 'Order' },
          { key: 'id' as keyof Project, header: 'Actions', render: (_, r) => (
            <div className="flex gap-2">
              <Button size="xs" variant="outline" onClick={() => openEdit(r)}>Edit</Button>
              <Button size="xs" variant="destructive" onClick={() => setConfirm({ type: 'delete', id: r.id })}>Delete</Button>
            </div>
          )},
        ]}
        data={projects}
      />

      {showForm && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border bg-card p-6 shadow-lg">
            <h2 className="mb-4 text-lg font-semibold">{editing ? 'Edit Project' : 'Create Project'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField label="Title" name="title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} error={errors.title} />
                <TextField label="Slug" name="slug" value={form.slug} onChange={(v) => setForm({ ...form, slug: v })} error={errors.slug} />
              </div>
              <TextAreaField label="Short Description" name="descriptionShort" value={form.descriptionShort} onChange={(v) => setForm({ ...form, descriptionShort: v })} rows={3} />
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField label="Thumbnail URL" name="thumbnailUrl" value={form.thumbnailUrl} onChange={(v) => setForm({ ...form, thumbnailUrl: v })} />
                <TextField label="Category" name="category" value={form.category} onChange={(v) => setForm({ ...form, category: v })} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField label="GitHub URL" name="githubUrl" value={form.githubUrl} onChange={(v) => setForm({ ...form, githubUrl: v })} />
                <TextField label="Live URL" name="liveUrl" value={form.liveUrl} onChange={(v) => setForm({ ...form, liveUrl: v })} />
              </div>
              <TextAreaField label="Additional Links" name="additionalLinks" value={form.additionalLinks} onChange={(v) => setForm({ ...form, additionalLinks: v })} rows={3} />
              <div className="flex items-center gap-2">
                <input type="checkbox" id="isFeatured" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} className="h-4 w-4" />
                <label htmlFor="isFeatured" className="text-sm font-medium">Featured</label>
              </div>
              <TextField label="Sort Order" name="sortOrder" value={String(form.sortOrder)} onChange={(v) => setForm({ ...form, sortOrder: Number(v) || 0 })} />
              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={closeForm}>Cancel</Button>
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>{editing ? 'Update' : 'Create'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <AlertDialog open={!!confirm} onOpenChange={(o) => { if (!o) setConfirm(null) }}>
        <AlertDialogContent className="sm:max-w-sm">
          {confirm?.type === 'delete' ? (
            <AlertDialogMedia><Trash2 className="size-6 text-destructive" /></AlertDialogMedia>
          ) : (
            <AlertDialogMedia><Plus className="size-6 text-primary" /></AlertDialogMedia>
          )}
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirm?.type === 'delete' ? 'Delete Project' : confirm?.type === 'create' ? 'Create Project' : 'Update Project'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirm?.type === 'delete'
                ? 'This action cannot be undone. Are you sure?'
                : `Are you sure you want to ${confirm?.type === 'create' ? 'create' : 'update'} this project?`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setConfirm(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={executeConfirm} className={confirm?.type === 'delete' ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90' : ''}>
              {confirm?.type === 'delete' ? 'Delete' : confirm?.type === 'create' ? 'Create' : 'Update'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
