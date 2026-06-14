import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { DataTable, usePagination } from '#/components/tables'
import { TextField, TextAreaField } from '#/components/forms'
import { Button } from '#/components/ui/button'
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction, AlertDialogMedia } from '#/components/ui/alert-dialog'
import { toast } from '#/components/ui/sonner'
import { listAchievements, createAchievement, updateAchievement, deleteAchievement } from '#/apis'
import type { Achievement } from '#/domain/ports'
import { Plus, Trash2 } from 'lucide-react'

export const Route = createFileRoute('/admin/achievements')({ component: AchievementsPage })

const initialForm = { title: '', eventName: '', organizer: '', date: '', description: '', url: '', sortOrder: 0 }

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
    mutationFn: () => createAchievement({ data: form }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['achievements'] }); toast.success('Achievement created'); closeForm() },
    onError: (err) => toast.error(err instanceof Error ? err.message : 'Failed'),
  })
  const updateMutation = useMutation({
    mutationFn: () => updateAchievement({ data: { id: editing!.id, data: form } }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['achievements'] }); toast.success('Achievement updated'); closeForm() },
    onError: (err) => toast.error(err instanceof Error ? err.message : 'Failed'),
  })
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteAchievement({ data: id }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['achievements'] }); toast.success('Achievement deleted') },
    onError: (err) => toast.error(err instanceof Error ? err.message : 'Failed'),
  })

  function openCreate() { setEditing(null); setForm(initialForm); setErrors({}); setShowForm(true) }
  function openEdit(ach: Achievement) {
    setEditing(ach)
    setForm({ title: ach.title, eventName: ach.eventName ?? '', organizer: ach.organizer ?? '', date: ach.date, description: ach.description ?? '', url: ach.url ?? '', sortOrder: ach.sortOrder ?? 0 })
    setErrors({}); setShowForm(true)
  }
  function closeForm() { setShowForm(false); setEditing(null); setForm(initialForm); setErrors({}) }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs: Record<string, string> = {}
    if (!form.title.trim()) errs.title = 'Title is required'
    if (!form.date.trim()) errs.date = 'Date is required'
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

  return (
    <div>
      <div className="mb-4 md:mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-lg md:text-2xl font-bold text-[var(--sea-ink)]">Achievements</h1>
          <p className="mt-1 text-xs md:text-sm text-[var(--sea-ink-soft)]">Manage your achievements.</p>
        </div>
        <Button size="xs" onClick={openCreate}><Plus className="size-4 md:size-5" /><span className="hidden md:inline"> Add Achievement</span></Button>
      </div>

      <div className="overflow-x-auto">
      <DataTable
        loading={isLoading}
        columns={[
          { key: 'title' as keyof Achievement, header: 'Title' },
          { key: 'eventName' as keyof Achievement, header: 'Event' },
          { key: 'organizer' as keyof Achievement, header: 'Organizer' },
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
        <div className="fixed inset-0 z-40 flex items-end md:items-center justify-center bg-black/50">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl md:rounded-2xl border bg-card p-4 md:p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm md:text-lg font-semibold">{editing ? 'Edit Achievement' : 'Add Achievement'}</h2>
            <Button type="button" size="xs" variant="ghost" onClick={closeForm} className="text-muted-foreground">✕</Button>
          </div>
            <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
              <TextField label="Title" name="title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} error={errors.title} />
              <div className="grid gap-3 md:gap-4 sm:grid-cols-2">
                <TextField label="Event Name" name="eventName" value={form.eventName} onChange={(v) => setForm({ ...form, eventName: v })} />
                <TextField label="Organizer" name="organizer" value={form.organizer} onChange={(v) => setForm({ ...form, organizer: v })} />
              </div>
              <div className="grid gap-3 md:gap-4 sm:grid-cols-2">
                <TextField label="Date" name="date" value={form.date} onChange={(v) => setForm({ ...form, date: v })} error={errors.date} placeholder="YYYY-MM-DD" />
                <TextField label="Sort Order" name="sortOrder" value={String(form.sortOrder)} onChange={(v) => setForm({ ...form, sortOrder: Number(v) || 0 })} />
              </div>
              <TextAreaField label="Description" name="description" value={form.description} onChange={(v) => setForm({ ...form, description: v })} rows={3} />
              <TextField label="URL" name="url" value={form.url} onChange={(v) => setForm({ ...form, url: v })} />
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
            <AlertDialogTitle>{confirm?.type === 'delete' ? 'Delete Achievement' : confirm?.type === 'create' ? 'Add Achievement' : 'Update Achievement'}</AlertDialogTitle>
            <AlertDialogDescription>
              {confirm?.type === 'delete' ? 'This action cannot be undone. Are you sure?' : `Are you sure you want to ${confirm?.type === 'create' ? 'add' : 'update'} this achievement?`}
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
