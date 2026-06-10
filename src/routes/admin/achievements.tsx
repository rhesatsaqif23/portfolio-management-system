import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { DataTable } from '#/components/tables'
import { TextField, TextAreaField } from '#/components/forms'
import { ConfirmDialog } from '#/components/shared'
import { Button } from '#/components/ui/button'
import { listAchievements, createAchievement, updateAchievement, deleteAchievement } from '#/apis'
import type { Achievement } from '#/domain/ports'

export const Route = createFileRoute('/admin/achievements')({
  component: AchievementsPage,
})

const initialForm = {
  title: '',
  eventName: '',
  organizer: '',
  date: '',
  description: '',
  url: '',
  sortOrder: 0,
}

function AchievementsPage() {
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Achievement | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const { data: achievements = [], isLoading } = useQuery({
    queryKey: ['achievements'],
    queryFn: () => listAchievements(),
  })

  const createMutation = useMutation({
    mutationFn: (data: typeof initialForm) => createAchievement({ data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['achievements'] })
      closeForm()
    },
  })

  const updateMutation = useMutation({
    mutationFn: (data: { id: string; data: Partial<typeof initialForm> }) =>
      updateAchievement({ data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['achievements'] })
      closeForm()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteAchievement({ data: id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['achievements'] })
      setDeleteId(null)
    },
  })

  function openCreate() {
    setEditing(null)
    setForm(initialForm)
    setErrors({})
    setShowForm(true)
  }

  function openEdit(ach: Achievement) {
    setEditing(ach)
    setForm({
      title: ach.title,
      eventName: ach.eventName ?? '',
      organizer: ach.organizer ?? '',
      date: ach.date,
      description: ach.description ?? '',
      url: ach.url ?? '',
      sortOrder: ach.sortOrder ?? 0,
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
    const errs: Record<string, string> = {}
    if (!form.title.trim()) errs.title = 'Title is required'
    if (!form.date.trim()) errs.date = 'Date is required'
    setErrors(errs)
    if (Object.keys(errs).length > 0) return
    if (editing) {
      updateMutation.mutate({ id: editing.id, data: form })
    } else {
      createMutation.mutate(form)
    }
  }

  if (isLoading) {
    return <p className="text-sm text-[var(--sea-ink-soft)]">Loading achievements...</p>
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--sea-ink)]">Achievements</h1>
          <p className="mt-1 text-sm text-[var(--sea-ink-soft)]">Manage your achievements.</p>
        </div>
        <Button onClick={openCreate}>Add Achievement</Button>
      </div>

      <DataTable
        columns={[
          { key: 'title' as keyof Achievement, header: 'Title' },
          { key: 'eventName' as keyof Achievement, header: 'Event' },
          { key: 'organizer' as keyof Achievement, header: 'Organizer' },
          { key: 'date' as keyof Achievement, header: 'Date' },
          {
            key: 'id' as keyof Achievement,
            header: 'Actions',
            render: (_, row) => (
              <div className="flex gap-2">
                <Button size="xs" variant="outline" onClick={() => openEdit(row)}>Edit</Button>
                <Button size="xs" variant="destructive" onClick={() => setDeleteId(row.id)}>Delete</Button>
              </div>
            ),
          },
        ]}
        data={achievements}
      />

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-lg rounded-2xl border border-[var(--line)] bg-[var(--card)] p-6 shadow-lg">
            <h2 className="mb-4 text-lg font-semibold text-[var(--sea-ink)]">
              {editing ? 'Edit Achievement' : 'Add Achievement'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <TextField label="Title" name="title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} error={errors.title} />
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField label="Event Name" name="eventName" value={form.eventName} onChange={(v) => setForm({ ...form, eventName: v })} />
                <TextField label="Organizer" name="organizer" value={form.organizer} onChange={(v) => setForm({ ...form, organizer: v })} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField label="Date" name="date" value={form.date} onChange={(v) => setForm({ ...form, date: v })} error={errors.date} placeholder="YYYY-MM-DD" />
                <TextField label="Sort Order" name="sortOrder" value={String(form.sortOrder)} onChange={(v) => setForm({ ...form, sortOrder: Number(v) || 0 })} />
              </div>
              <TextAreaField label="Description" name="description" value={form.description} onChange={(v) => setForm({ ...form, description: v })} rows={3} />
              <TextField label="URL (optional)" name="url" value={form.url} onChange={(v) => setForm({ ...form, url: v })} />
              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={closeForm}>Cancel</Button>
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {editing ? 'Update' : 'Add'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        title="Delete Achievement"
        message="Are you sure you want to delete this achievement?"
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        onCancel={() => setDeleteId(null)}
        confirmLabel="Delete"
      />
    </div>
  )
}
