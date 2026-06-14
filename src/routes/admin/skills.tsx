import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { DataTable, usePagination } from '#/components/tables'
import { TextField, SelectField, FileUpload } from '#/components/forms'
import { Badge } from '#/components/shared'
import { Button } from '#/components/ui/button'
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction, AlertDialogMedia } from '#/components/ui/alert-dialog'
import { toast } from '#/components/ui/sonner'
import { listSkills, createSkill, updateSkill, deleteSkill } from '#/apis'
import type { Skill } from '#/domain/ports'
import { Plus, Trash2 } from 'lucide-react'

export const Route = createFileRoute('/admin/skills')({ component: SkillsPage })

const categories = [
  { value: 'frontend', label: 'Frontend' },
  { value: 'mobile', label: 'Mobile' },
  { value: 'backend', label: 'Backend' },
  { value: 'database', label: 'Database' },
  { value: 'devops', label: 'DevOps' },
  { value: 'deployment', label: 'Deployment' },
  { value: 'cloud', label: 'Cloud' },
  { value: 'design', label: 'Design' },
  { value: 'tools', label: 'Tools' },
  { value: 'other', label: 'Other' },
]

const initialForm = { name: '', category: 'web', iconUrl: '', sortOrder: 0 }

type ConfirmAction = { type: 'create' } | { type: 'update'; id: string } | { type: 'delete'; id: string } | null

function SkillsPage() {
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Skill | null>(null)
  const [form, setForm] = useState(initialForm)
  const [pendingIcon, setPendingIcon] = useState<File | null>(null)
  const [error, setError] = useState('')
  const [confirm, setConfirm] = useState<ConfirmAction>(null)

  const { data: skills = [], isLoading } = useQuery({ queryKey: ['skills'], queryFn: () => listSkills() })
  const pag = usePagination(skills, 10)

  const createMutation = useMutation({
    mutationFn: (payload: Record<string, unknown>) => createSkill({ data: payload }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['skills'] }); toast.success('Skill created'); closeForm() },
    onError: (err) => toast.error(err instanceof Error ? err.message : 'Failed'),
  })
  const updateMutation = useMutation({
    mutationFn: (payload: { id: string; data: Record<string, unknown> }) => updateSkill({ data: payload }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['skills'] }); toast.success('Skill updated'); closeForm() },
    onError: (err) => toast.error(err instanceof Error ? err.message : 'Failed'),
  })
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteSkill({ data: id }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['skills'] }); toast.success('Skill deleted') },
    onError: (err) => toast.error(err instanceof Error ? err.message : 'Failed'),
  })

  async function uploadPending(iconUrl: string) {
    if (!pendingIcon) return iconUrl
    const buffer = await pendingIcon.arrayBuffer()
    const bytes = Array.from(new Uint8Array(buffer))
    const path = `${Date.now()}-${pendingIcon.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
    const { replaceFile } = await import('#/apis')
    const result = await replaceFile({
      data: { bucket: 'tech-stack', path, oldPath: iconUrl ? iconUrl.split('/').pop() : undefined, file: bytes },
    })
    setPendingIcon(null)
    return result.url
  }

  function openCreate() { setEditing(null); setForm(initialForm); setPendingIcon(null); setError(''); setShowForm(true) }
  function openEdit(skill: Skill) {
    setEditing(skill)
    setForm({ name: skill.name, category: skill.category as string, iconUrl: skill.iconUrl ?? '', sortOrder: skill.sortOrder ?? 0 })
    setPendingIcon(null); setError(''); setShowForm(true)
  }
  function closeForm() { setShowForm(false); setEditing(null); setForm(initialForm); setPendingIcon(null); setError('') }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) { setError('Skill name is required'); return }
    setConfirm(editing ? { type: 'update', id: editing.id } : { type: 'create' })
  }

  async function executeConfirm() {
    if (!confirm) return
    if (confirm.type === 'delete') { deleteMutation.mutate(confirm.id); setConfirm(null); return }
    const iconUrl = await uploadPending(form.iconUrl)
    if (confirm.type === 'create') createMutation.mutate({ ...form, iconUrl })
    else updateMutation.mutate({ id: editing!.id, data: { ...form, iconUrl } })
    setConfirm(null)
  }

  return (
    <div>
      <div className="mb-4 md:mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-lg md:text-2xl font-bold text-[var(--sea-ink)]">Skills</h1>
          <p className="mt-1 text-xs md:text-sm text-[var(--sea-ink-soft)]">Manage your skills.</p>
        </div>
        <Button size="xs" onClick={openCreate}><Plus className="size-4 md:size-5" /><span className="hidden md:inline"> Add Skill</span></Button>
      </div>

      <div className="overflow-x-auto">
      <DataTable
        loading={isLoading}
        columns={[
          { key: 'name' as keyof Skill, header: 'Name' },
          { key: 'category' as keyof Skill, header: 'Category', render: (v) => <Badge variant="secondary">{String(v)}</Badge> },
          { key: 'sortOrder' as keyof Skill, header: 'Order' },
          { key: 'id' as keyof Skill, header: 'Actions', render: (_, r) => (
            <div className="flex gap-2">
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
        <div className="fixed inset-0 z-40 flex items-end md:items-center justify-center bg-black/50">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl md:rounded-2xl border bg-card p-4 md:p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm md:text-lg font-semibold">{editing ? 'Edit Skill' : 'Add Skill'}</h2>
            <Button type="button" size="xs" variant="ghost" onClick={closeForm} className="text-muted-foreground">✕</Button>
          </div>
            <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
              <TextField label="Skill Name" name="name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} error={error} />
              <SelectField label="Category" name="category" value={form.category} onChange={(v) => setForm({ ...form, category: v })} options={categories} />
              <FileUpload label="Icon / Logo" value={form.iconUrl} onChange={(url) => setForm({ ...form, iconUrl: url })} accept="image/*" maxSizeMB={5} bucket="tech-stack" deferUpload pendingFile={pendingIcon} onPendingFile={setPendingIcon} />
              <TextField label="Sort Order" name="sortOrder" value={String(form.sortOrder)} onChange={(v) => setForm({ ...form, sortOrder: Number(v) || 0 })} />
              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={closeForm}>Cancel</Button>
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>{editing ? 'Update' : 'Add'}</Button>
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
            <AlertDialogTitle>{confirm?.type === 'delete' ? 'Delete Skill' : confirm?.type === 'create' ? 'Add Skill' : 'Update Skill'}</AlertDialogTitle>
            <AlertDialogDescription>
              {confirm?.type === 'delete' ? 'This action cannot be undone. Are you sure?' : `Are you sure you want to ${confirm?.type === 'create' ? 'add' : 'update'} this skill?`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setConfirm(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={executeConfirm} className={confirm?.type === 'delete' ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90' : ''}>
              {confirm?.type === 'delete' ? 'Delete' : confirm?.type === 'create' ? 'Add' : 'Update'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
