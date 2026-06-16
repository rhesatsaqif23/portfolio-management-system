import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { DataTable, usePagination } from '#/components/tables'
import { TextField, SelectField, DateField, FileUpload } from '#/components/forms'
import { Button } from '#/components/ui/button'
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction, AlertDialogMedia } from '#/components/ui/alert-dialog'
import { toast } from '#/components/ui/sonner'
import { listExperiences, createExperience, updateExperience, deleteExperience } from '#/apis'
import type { Experience } from '#/domain/ports'
import { Plus, Trash2 } from 'lucide-react'

export const Route = createFileRoute('/admin/experiences')({ component: ExperiencesPage })

const expTypes = [
  { value: 'work', label: 'Work' },
  { value: 'internship', label: 'Internship' },
  { value: 'education', label: 'Education' },
  { value: 'organization', label: 'Organization' },
  { value: 'volunteer', label: 'Volunteer' },
]

const initialForm = { orgName: '', role: '', startDate: '', endDate: '', description: [''] as string[], type: 'work', imageUrl: '', sortOrder: 0 }

type ConfirmAction = { type: 'create' } | { type: 'update'; id: string } | { type: 'delete'; id: string } | null

function ExperiencesPage() {
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Experience | null>(null)
  const [form, setForm] = useState(initialForm)
  const [pendingImage, setPendingImage] = useState<File | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [confirm, setConfirm] = useState<ConfirmAction>(null)

  const { data: experiences = [], isLoading } = useQuery({ queryKey: ['experiences'], queryFn: () => listExperiences() })
  const pag = usePagination(experiences, 10)

  const createMutation = useMutation({
    mutationFn: (payload: Record<string, unknown>) => createExperience({ data: payload }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['experiences'] }); toast.success('Experience created'); closeForm() },
    onError: (err) => toast.error(err instanceof Error ? err.message : 'Failed'),
  })
  const updateMutation = useMutation({
    mutationFn: (payload: { id: string; data: Record<string, unknown> }) => updateExperience({ data: payload }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['experiences'] }); toast.success('Experience updated'); closeForm() },
    onError: (err) => toast.error(err instanceof Error ? err.message : 'Failed'),
  })
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteExperience({ data: id }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['experiences'] }); toast.success('Experience deleted') },
    onError: (err) => toast.error(err instanceof Error ? err.message : 'Failed'),
  })

  function updateDescription(index: number, value: string) {
    const desc = [...form.description]
    desc[index] = value
    setForm({ ...form, description: desc })
  }

  function addDescription() { setForm({ ...form, description: [...form.description, ''] }) }

  function removeDescription(index: number) {
    const desc = form.description.filter((_, i) => i !== index)
    setForm({ ...form, description: desc.length ? desc : [''] })
  }

  async function uploadPending(imageUrl: string) {
    if (!pendingImage) return imageUrl
    const buffer = await pendingImage.arrayBuffer()
    const bytes = Array.from(new Uint8Array(buffer))
    const path = `${Date.now()}-${pendingImage.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
    const { replaceFile } = await import('#/apis')
    const result = await replaceFile({
      data: { bucket: 'company-images', path, oldPath: imageUrl ? imageUrl.split('/').pop() : undefined, file: bytes },
    })
    setPendingImage(null)
    return result.url
  }

  function openCreate() { setEditing(null); setForm(initialForm); setPendingImage(null); setErrors({}); setShowForm(true) }
  function openEdit(exp: Experience) {
    setEditing(exp)
    setForm({ orgName: exp.orgName, role: exp.role, startDate: exp.startDate, endDate: exp.endDate ?? '', description: (exp.description?.length ? exp.description : ['']) as string[], type: exp.type as string, imageUrl: exp.imageUrl ?? '', sortOrder: exp.sortOrder ?? 0 })
    setPendingImage(null); setErrors({}); setShowForm(true)
  }
  function closeForm() { setShowForm(false); setEditing(null); setForm(initialForm); setPendingImage(null); setErrors({}) }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs: Record<string, string> = {}
    if (!form.orgName.trim()) errs.orgName = 'Organization name is required'
    if (!form.role.trim()) errs.role = 'Role is required'
    if (!form.startDate.trim()) errs.startDate = 'Start date is required'
    setErrors(errs)
    if (Object.keys(errs).length > 0) return
    setConfirm(editing ? { type: 'update', id: editing.id } : { type: 'create' })
  }

  async function executeConfirm() {
    if (!confirm) return
    if (confirm.type === 'delete') { deleteMutation.mutate(confirm.id); setConfirm(null); return }
    const imageUrl = await uploadPending(form.imageUrl)
    if (confirm.type === 'create') createMutation.mutate({ ...form, imageUrl })
    else updateMutation.mutate({ id: editing!.id, data: { ...form, imageUrl } })
    setConfirm(null)
  }

  return (
    <div>
      <div className="mb-4 md:mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-lg md:text-2xl font-bold text-[var(--sea-ink)]">Experiences</h1>
          <p className="mt-1 text-xs md:text-sm text-[var(--sea-ink-soft)]">Manage your career timeline.</p>
        </div>
        <Button size="sm" onClick={openCreate}><Plus className="size-4 md:size-5" /><span className="md:inline"> Add Experience</span></Button>
      </div>

      <div className="overflow-x-auto">
      <DataTable
        loading={isLoading}
        columns={[
          { key: 'orgName' as keyof Experience, header: 'Organization', render: (v) => <span className="line-clamp-2">{String(v)}</span> },
          { key: 'role' as keyof Experience, header: 'Role', render: (v) => <span className="line-clamp-2">{String(v)}</span> },
          { key: 'type' as keyof Experience, header: 'Type' },
          { key: 'startDate' as keyof Experience, header: 'Start' },
          { key: 'endDate' as keyof Experience, header: 'End', render: (v) => <span>{String(v || 'Present')}</span> },
          { key: 'id' as keyof Experience, header: 'Actions', render: (_, r) => (
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
        <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center bg-black/50">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-t-2xl md:rounded-2xl border bg-card p-4 md:p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm md:text-lg font-semibold">{editing ? 'Edit Experience' : 'Add Experience'}</h2>
              <Button type="button" size="xs" variant="ghost" onClick={closeForm} className="text-muted-foreground">✕</Button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
              <div className="grid gap-3 md:gap-4 sm:grid-cols-2">
                <TextField label="Organization" name="orgName" value={form.orgName} onChange={(v) => setForm({ ...form, orgName: v })} error={errors.orgName} />
                <TextField label="Role" name="role" value={form.role} onChange={(v) => setForm({ ...form, role: v })} error={errors.role} />
              </div>
              <div className="grid gap-3 md:gap-4 sm:grid-cols-2">
                <DateField label="Start Date" name="startDate" value={form.startDate} onChange={(v) => setForm({ ...form, startDate: v })} error={errors.startDate} />
                <DateField label="End Date" name="endDate" value={form.endDate} onChange={(v) => setForm({ ...form, endDate: v })} placeholder={form.endDate ? 'Pick a date' : 'Leave empty if current'} />
              </div>
              <SelectField label="Type" name="type" value={form.type} onChange={(v) => setForm({ ...form, type: v })} options={expTypes} />
              <div className="space-y-2">
                <label className="text-sm font-medium">Key Points</label>
                {form.description.map((point, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input value={point} onChange={(e) => updateDescription(i, e.target.value)} placeholder="• Bullet point" className="h-9 w-full min-w-0 rounded-md border border-input bg-[var(--card)]/50 px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 md:text-sm dark:bg-input/30" />
                    {form.description.length > 1 && (
                      <Button type="button" size="xs" variant="destructive" onClick={() => removeDescription(i)}>X</Button>
                    )}
                  </div>
                ))}
                <Button type="button" size="xs" variant="outline" onClick={addDescription}>+ Add Point</Button>
              </div>
              <FileUpload label="Organization Logo" value={form.imageUrl} onChange={(url) => setForm({ ...form, imageUrl: url })} accept="image/*" maxSizeMB={5} bucket="company-images" deferUpload pendingFile={pendingImage} onPendingFile={setPendingImage} />
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
            <AlertDialogTitle>{confirm?.type === 'delete' ? 'Delete Experience' : confirm?.type === 'create' ? 'Add Experience' : 'Update Experience'}</AlertDialogTitle>
            <AlertDialogDescription>
              {confirm?.type === 'delete' ? 'This action cannot be undone. Are you sure?' : `Are you sure you want to ${confirm?.type === 'create' ? 'add' : 'update'} this experience?`}
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
