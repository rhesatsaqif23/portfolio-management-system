import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { DataTable, usePagination } from '#/components/tables'
import { TextField, TextAreaField, SelectField, DateField } from '#/components/forms'
import { Button } from '#/components/ui/button'
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction, AlertDialogMedia } from '#/components/ui/alert-dialog'
import { toast } from '#/components/ui/sonner'
import { listAchievements, createAchievement, updateAchievement, deleteAchievement } from '#/apis'
import { normalizeUrl, isValidUrl } from '#/lib/utils'
import type { Achievement } from '#/domain/ports'
import { Plus, Trash2, X } from 'lucide-react'

export const Route = createFileRoute('/admin/achievements')({ component: AchievementsPage })

const initialForm = { title: '', eventName: '', organizer: '', date: '', description: '', url: '', category: '', sortOrder: 0 }

type ConfirmAction = { type: 'create' } | { type: 'update'; id: string } | { type: 'delete'; id: string } | null

function AchievementsPage() {
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Achievement | null>(null)
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [confirm, setConfirm] = useState<ConfirmAction>(null)

  const { data: achievements = [], isLoading } = useQuery({ queryKey: ['achievements'], queryFn: () => listAchievements() })
  const pag = usePagination(achievements, 10)

  const createMutation = useMutation({
    mutationFn: (payload: Record<string, unknown>) => createAchievement({ data: payload }),
    onSuccess: async () => { await queryClient.invalidateQueries({ queryKey: ['achievements'] }); toast.success('Achievement created'); closeForm() },
    onError: (err) => toast.error(err instanceof Error ? err.message : typeof err === 'string' ? err : JSON.stringify(err)),
  })
  const updateMutation = useMutation({
    mutationFn: (payload: { id: string; data: Record<string, unknown> }) => updateAchievement({ data: payload }),
    onSuccess: async () => { await queryClient.invalidateQueries({ queryKey: ['achievements'] }); toast.success('Achievement updated'); closeForm() },
    onError: (err) => toast.error(err instanceof Error ? err.message : typeof err === 'string' ? err : JSON.stringify(err)),
  })
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteAchievement({ data: id }),
    onSuccess: async () => { await queryClient.invalidateQueries({ queryKey: ['achievements'] }); toast.success('Achievement deleted') },
    onError: (err) => toast.error(err instanceof Error ? err.message : typeof err === 'string' ? err : JSON.stringify(err)),
  })

  function openCreate() {
    const nextSort = achievements.length > 0 ? Math.max(...achievements.map((a) => a.sortOrder ?? 0)) + 1 : 0
    setEditing(null); setForm({ ...initialForm, sortOrder: nextSort }); setErrors({}); setShowForm(true)
  }
  function openEdit(ach: Achievement) {
    setEditing(ach)
    setForm({ title: ach.title, eventName: ach.eventName ?? '', organizer: ach.organizer ?? '', date: ach.date, description: ach.description ?? '', url: ach.url ?? '', category: ach.category ?? '', sortOrder: ach.sortOrder ?? 0 })
    setErrors({}); setShowForm(true)
  }
  function closeForm() { setShowForm(false); setEditing(null); setForm(initialForm); setErrors({}) }

  function clearError(field: string) {
    if (errors[field]) setErrors((prev) => { const next = { ...prev }; delete next[field]; return next })
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs: Record<string, string> = {}
    if (!form.title.trim()) errs.title = 'Title is required'
    if (!form.date.trim()) errs.date = 'Date is required'
    if (!form.category.trim()) errs.category = 'Category is required'
    if (form.url && !isValidUrl(form.url)) errs.url = 'Enter a valid URL with a domain (e.g. https://example.com)'
    setErrors(errs)
    if (Object.keys(errs).length > 0) return
    setConfirm(editing ? { type: 'update', id: editing.id } : { type: 'create' })
  }

  function executeConfirm() {
    if (!confirm) return
    if (confirm.type === 'delete') { deleteMutation.mutate(confirm.id); setConfirm(null); return }
    const data = { ...form, url: normalizeUrl(form.url) }
    if (confirm.type === 'create') {
      const { sortOrder: _sortOrder, ...createPayload } = data
      createMutation.mutate(createPayload)
    } else {
      updateMutation.mutate({ id: editing!.id, data })
    }
    setConfirm(null)
  }

  return (
    <div>
      <div className="mb-4 md:mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-lg md:text-2xl font-bold text-[var(--sea-ink)]">Achievements</h1>
          <p className="mt-1 text-xs md:text-sm text-[var(--sea-ink-soft)]">Manage your achievements.</p>
        </div>
        <Button size="sm" onClick={openCreate}><Plus className="size-4 md:size-5" /><span className="md:inline"> Create Achievement</span></Button>
      </div>

      <div className="overflow-x-auto">
      <DataTable
        loading={isLoading}
        columns={[
          { key: 'title' as keyof Achievement, header: 'Title', render: (v) => <span className="line-clamp-2">{String(v)}</span> },
          { key: 'eventName' as keyof Achievement, header: 'Event', render: (v) => <span className="line-clamp-2">{String(v ?? '')}</span> },
          { key: 'organizer' as keyof Achievement, header: 'Organizer', render: (v) => <span className="line-clamp-2">{String(v ?? '')}</span> },
          { key: 'date' as keyof Achievement, header: 'Date' },
          { key: 'id' as keyof Achievement, header: 'Actions', render: (_, r) => (
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
            <h2 className="text-sm md:text-lg font-semibold">{editing ? 'Edit Achievement' : 'Create Achievement'}</h2>
            <Button type="button" size="sm" variant="ghost" onClick={closeForm} className="flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></Button>
          </div>
            <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
              <TextField label="Title" name="title" value={form.title} onChange={(v) => { setForm({ ...form, title: v }); clearError('title') }} placeholder="e.g. Juara 1 Lomba Hackathon" error={errors.title} required />
              <div className="grid gap-3 md:gap-4 sm:grid-cols-2">
                <TextField label="Event Name" name="eventName" value={form.eventName} onChange={(v) => setForm({ ...form, eventName: v })} placeholder="e.g. Hackathon 2026" />
                <TextField label="Organizer" name="organizer" value={form.organizer} onChange={(v) => setForm({ ...form, organizer: v })} placeholder="e.g. Universitas Gadjah Mada" />
              </div>
              <div className="grid gap-3 md:gap-4 sm:grid-cols-2">
                <DateField label="Date" name="date" value={form.date} onChange={(v) => { setForm({ ...form, date: v }); clearError('date') }} error={errors.date} required />
                <SelectField label="Category" name="category" value={form.category} onChange={(v) => { setForm({ ...form, category: v }); clearError('category') }} options={[
                  { value: 'Software Development', label: 'Software Development' },
                  { value: 'Hackathon', label: 'Hackathon' },
                  { value: 'Photo & Video', label: 'Photo & Video' },
                  { value: 'Applied Technology', label: 'Applied Technology' },
                  { value: 'Others', label: 'Others' },
                ]} placeholder="Select category" error={errors.category} required />
              </div>
              <div className="grid gap-3 md:gap-4 sm:grid-cols-2">
                <TextField label="Sort Order" name="sortOrder" value={String(form.sortOrder)} onChange={(v) => setForm({ ...form, sortOrder: Number(v) || 0 })} placeholder="Auto-incremented on create" />
              </div>
              <TextAreaField label="Description" name="description" value={form.description} onChange={(v) => setForm({ ...form, description: v })} rows={3} placeholder="Describe the achievement" />
              <TextField label="URL" name="url" value={form.url} onChange={(v) => { setForm({ ...form, url: v }); clearError('url') }} placeholder="https://example.com" error={errors.url} />
              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={closeForm}>Cancel</Button>
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>{editing ? 'Update' : 'Create'}</Button>
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
            <AlertDialogTitle>{confirm?.type === 'delete' ? 'Delete Achievement' : confirm?.type === 'create' ? 'Create Achievement' : 'Update Achievement'}</AlertDialogTitle>
            <AlertDialogDescription>
              {confirm?.type === 'delete' ? 'This action cannot be undone. Are you sure?' : `Are you sure you want to ${confirm?.type === 'create' ? 'create' : 'update'} this achievement?`}
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
