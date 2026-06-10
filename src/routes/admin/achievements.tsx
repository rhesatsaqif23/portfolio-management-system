import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { DataTable } from '#/components/tables'
import { TextField } from '#/components/forms'
import { ConfirmDialog } from '#/components/shared'
import { Button } from '#/components/ui/button'
import { listAchievements, createAchievement, deleteAchievement } from '#/apis'
export const Route = createFileRoute('/admin/achievements')({
  component: AchievementsPage,
})

const initialForm = {
  title: '',
  position: '',
  issuer: '',
  category: '',
  description: '',
  date: '',
  imageUrl: '',
  credentialUrl: '',
  sortOrder: 0,
}

function AchievementsPage() {
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)
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
      setShowForm(false)
      setForm(initialForm)
      setErrors({})
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteAchievement({ data: id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['achievements'] })
      setDeleteId(null)
    },
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs: Record<string, string> = {}
    if (!form.title.trim()) errs.title = 'Title is required'
    setErrors(errs)
    if (Object.keys(errs).length > 0) return
    createMutation.mutate(form)
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
        <Button onClick={() => { setForm(initialForm); setErrors({}); setShowForm(true) }}>
          Add Achievement
        </Button>
      </div>

      <DataTable
        columns={[
          { key: 'title', header: 'Title' },
          { key: 'position', header: 'Position' },
          { key: 'issuer', header: 'Issuer' },
          { key: 'category', header: 'Category' },
          { key: 'date', header: 'Date' },
          {
            key: 'id',
            header: 'Actions',
            render: (_, row) => (
              <Button size="xs" variant="destructive" onClick={() => setDeleteId(row.id)}>
                Delete
              </Button>
            ),
          },
        ]}
        data={achievements}
      />

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-lg rounded-2xl border border-[var(--line)] bg-[var(--card)] p-6 shadow-lg">
            <h2 className="mb-4 text-lg font-semibold text-[var(--sea-ink)]">Add Achievement</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <TextField label="Title" name="title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} error={errors.title} />
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField label="Position" name="position" value={form.position} onChange={(v) => setForm({ ...form, position: v })} />
                <TextField label="Issuer" name="issuer" value={form.issuer} onChange={(v) => setForm({ ...form, issuer: v })} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField label="Category" name="category" value={form.category} onChange={(v) => setForm({ ...form, category: v })} />
                <TextField label="Date" name="date" value={form.date} onChange={(v) => setForm({ ...form, date: v })} placeholder="YYYY-MM-DD" />
              </div>
              <TextField label="Description" name="description" value={form.description} onChange={(v) => setForm({ ...form, description: v })} />
              <TextField label="Image URL" name="imageUrl" value={form.imageUrl} onChange={(v) => setForm({ ...form, imageUrl: v })} />
              <TextField label="Credential URL" name="credentialUrl" value={form.credentialUrl} onChange={(v) => setForm({ ...form, credentialUrl: v })} />
              <TextField label="Sort Order" name="sortOrder" value={String(form.sortOrder)} onChange={(v) => setForm({ ...form, sortOrder: Number(v) || 0 })} />
              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => { setShowForm(false); setForm(initialForm); setErrors({}) }}>Cancel</Button>
                <Button type="submit" disabled={createMutation.isPending}>Add</Button>
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
