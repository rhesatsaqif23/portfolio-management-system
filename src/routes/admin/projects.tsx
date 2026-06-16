import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { DataTable, usePagination } from '#/components/tables'
import { TextField, TextAreaField, SelectField, FileUpload } from '#/components/forms'
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

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const initialForm = {
  title: '',
  descriptionShort: '',
  thumbnailUrl: '',
  isFeatured: false,
  category: '',
  githubUrl: '',
  liveUrl: '',
  additionalLinks: '',
  techStacks: [''] as string[],
  longDescription: '',
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
  const [pendingThumbnail, setPendingThumbnail] = useState<File | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [confirm, setConfirm] = useState<ConfirmAction>(null)

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => listProjects(),
  })
  const pag = usePagination(projects, 10)

  const createMutation = useMutation({
    mutationFn: (payload: Record<string, unknown>) => createProject({ data: payload }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['projects'] }); toast.success('Project created'); closeForm() },
    onError: (err) => toast.error(err instanceof Error ? err.message : 'Failed'),
  })
  const updateMutation = useMutation({
    mutationFn: (payload: { id: string; data: Record<string, unknown> }) => updateProject({ data: payload }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['projects'] }); toast.success('Project updated'); closeForm() },
    onError: (err) => toast.error(err instanceof Error ? err.message : 'Failed'),
  })
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteProject({ data: id }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['projects'] }); toast.success('Project deleted') },
    onError: (err) => toast.error(err instanceof Error ? err.message : 'Failed'),
  })

  function updateTechStack(index: number, value: string) {
    const stacks = [...form.techStacks]
    stacks[index] = value
    setForm({ ...form, techStacks: stacks })
  }

  function addTechStack() { setForm({ ...form, techStacks: [...form.techStacks, ''] }) }

  function removeTechStack(index: number) {
    const stacks = form.techStacks.filter((_, i) => i !== index)
    setForm({ ...form, techStacks: stacks.length ? stacks : [''] })
  }

  function buildPayload(overrides?: Partial<typeof form>) {
    const f = { ...form, ...overrides }
    const links = f.additionalLinks
      ? (() => {
          try { const p = JSON.parse(f.additionalLinks); if (Array.isArray(p)) return p } catch {}
          return f.additionalLinks.split('\n').map((l) => l.trim()).filter(Boolean).map((l) => {
            const sep = l.includes('|') ? '|' : ','
            const [label, url] = l.split(sep).map((s) => s.trim())
            return { label: label ?? '', url: url ?? '' }
          }).filter((l) => l.label && l.url)
        })()
      : []
    return { ...f, additionalLinks: links, slug: slugify(f.title) || f.title, techStacks: f.techStacks.filter((s) => s.trim()) }
  }

  async function uploadPending(thumbnailUrl: string) {
    if (!pendingThumbnail) return thumbnailUrl
    const buffer = await pendingThumbnail.arrayBuffer()
    const bytes = Array.from(new Uint8Array(buffer))
    const path = `${Date.now()}-${pendingThumbnail.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
    const { replaceFile } = await import('#/apis')
    const result = await replaceFile({
      data: { bucket: 'project-images', path, oldPath: thumbnailUrl ? thumbnailUrl.split('/').pop() : undefined, file: bytes },
    })
    setPendingThumbnail(null)
    return result.url
  }

  function openCreate() { setEditing(null); setForm(initialForm); setPendingThumbnail(null); setErrors({}); setShowForm(true) }

  function openEdit(project: Project) {
    setEditing(project)
    setForm({
      title: project.title, descriptionShort: project.descriptionShort ?? '',
      thumbnailUrl: project.thumbnailUrl ?? '', isFeatured: project.isFeatured ?? false,
      category: project.category ?? '', githubUrl: project.githubUrl ?? '', liveUrl: project.liveUrl ?? '',
      additionalLinks: project.additionalLinks ? JSON.stringify(project.additionalLinks) : '',
      techStacks: (project.techStacks?.length ? project.techStacks : ['']) as string[],
      longDescription: project.longDescription ?? '',
      sortOrder: project.sortOrder ?? 0,
    })
    setPendingThumbnail(null); setErrors({}); setShowForm(true)
  }

  function closeForm() { setShowForm(false); setEditing(null); setForm(initialForm); setPendingThumbnail(null); setErrors({}) }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs: Record<string, string> = {}
    if (!form.title.trim()) errs.title = 'Title is required'
    setErrors(errs)
    if (Object.keys(errs).length > 0) return
    setConfirm(editing ? { type: 'update', id: editing.id } : { type: 'create' })
  }

  async function executeConfirm() {
    if (!confirm) return
    if (confirm.type === 'delete') { deleteMutation.mutate(confirm.id); setConfirm(null); return }
    const thumbnailUrl = await uploadPending(form.thumbnailUrl)
    const payload = buildPayload({ thumbnailUrl })
    if (confirm.type === 'create') createMutation.mutate(payload)
    else updateMutation.mutate({ id: editing!.id, data: payload })
    setConfirm(null)
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between md:mb-6">
        <div>
          <h1 className="text-lg font-bold text-[var(--sea-ink)] md:text-2xl">Projects</h1>
          <p className="mt-1 text-xs text-[var(--sea-ink-soft)] md:text-sm">Manage your portfolio projects.</p>
        </div>
        <Button onClick={openCreate} size="sm"><Plus className="size-3 md:size-4" /> Create</Button>
      </div>

      <div className="overflow-x-auto">
      <DataTable
        loading={isLoading}
        columns={[
          { key: 'title' as keyof Project, header: 'Title' },
          { key: 'descriptionShort' as keyof Project, header: 'Description', render: (v) => <span className="line-clamp-2">{String(v ?? '')}</span> },
          { key: 'isFeatured' as keyof Project, header: 'Featured', width: '90px', render: (v) => <Badge variant={v ? 'default' : 'outline'}>{v ? 'Featured' : 'No'}</Badge> },
          { key: 'category' as keyof Project, header: 'Category', width: '120px' },
          { key: 'sortOrder' as keyof Project, header: 'Order' },
          { key: 'id' as keyof Project, header: 'Actions', render: (_, r) => (
            <div className="flex gap-1 md:gap-2">
              <Button size="xs" variant="outline" onClick={() => openEdit(r)}>Edit</Button>
              <Button size="xs" variant="destructive" onClick={() => setConfirm({ type: 'delete', id: r.id })}>Delete</Button>
            </div>
          )},
        ]}
        data={pag.paginatedData}
        page={pag.page}
        totalPages={pag.totalPages}
        onPageChange={pag.setPage}
      />
      </div>

      {showForm && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/50 md:items-center">
          <div className="max-h-[85vh] w-full max-w-3xl overflow-y-auto rounded-t-2xl border bg-card p-4 shadow-lg md:rounded-2xl md:p-6">
            <div className="mb-2 flex items-center justify-between md:mb-4">
              <h2 className="text-sm font-semibold md:text-lg">{editing ? 'Edit Project' : 'Create Project'}</h2>
              <button onClick={closeForm} className="rounded p-1 text-white hover:bg-[var(--link-bg-hover)]">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
              <div>
                <TextField label="Title" name="title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} error={errors.title} />
              </div>
              <TextAreaField label="Short Description" name="descriptionShort" value={form.descriptionShort} onChange={(v) => setForm({ ...form, descriptionShort: v })} rows={3} />
              <div className="grid gap-3 md:gap-4 sm:grid-cols-2">
                <TextField label="GitHub URL" name="githubUrl" value={form.githubUrl} onChange={(v) => setForm({ ...form, githubUrl: v })} />
                <TextField label="Live URL" name="liveUrl" value={form.liveUrl} onChange={(v) => setForm({ ...form, liveUrl: v })} />
              </div>
              <SelectField label="Category" name="category" value={form.category} onChange={(v) => setForm({ ...form, category: v })} options={[
                { value: 'Web App', label: 'Web App' },
                { value: 'Mobile App', label: 'Mobile App' },
                { value: 'Others', label: 'Others' },
              ]} placeholder="Select category" />
              <TextField label="Additional Links" name="additionalLinks" value={form.additionalLinks} onChange={(v) => setForm({ ...form, additionalLinks: v })} placeholder="Paste URL here" />
              <FileUpload label="Thumbnail Image" value={form.thumbnailUrl} onChange={(url) => setForm({ ...form, thumbnailUrl: url })} accept="image/*" maxSizeMB={5} bucket="project-images" deferUpload pendingFile={pendingThumbnail} onPendingFile={setPendingThumbnail} />
              <TextAreaField label="Long Description" name="longDescription" value={form.longDescription} onChange={(v) => setForm({ ...form, longDescription: v })} rows={6} />
              <div className="space-y-2">
                <label className="text-sm font-medium">Tech Stacks</label>
                {form.techStacks.map((stack, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input value={stack} onChange={(e) => updateTechStack(i, e.target.value)} placeholder="e.g. React, Node.js" className="h-9 w-full min-w-0 rounded-md border border-input bg-[var(--card)]/50 px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 md:text-sm dark:bg-input/30" />
                    {form.techStacks.length > 1 && (
                      <Button type="button" size="xs" variant="destructive" onClick={() => removeTechStack(i)}>X</Button>
                    )}
                  </div>
                ))}
                <Button type="button" size="xs" variant="outline" onClick={addTechStack}>+ Add Stack</Button>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="isFeatured" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} className="h-4 w-4" />
                <label htmlFor="isFeatured" className="text-xs font-medium md:text-sm">Featured</label>
              </div>
              <TextField label="Sort Order" name="sortOrder" value={String(form.sortOrder)} onChange={(v) => setForm({ ...form, sortOrder: Number(v) || 0 })} />
              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" size="xs" onClick={closeForm}>Cancel</Button>
                <Button type="submit" size="xs" disabled={createMutation.isPending || updateMutation.isPending}>{editing ? 'Update' : 'Create'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <AlertDialog open={!!confirm} onOpenChange={(o) => { if (!o) setConfirm(null) }}>
        <AlertDialogContent size="sm">
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
