import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { DataTable } from '#/components/tables'
import { TextField } from '#/components/forms'
import { ConfirmDialog } from '#/components/shared'
import { Button } from '#/components/ui/button'
import { listExperiences, createExperience, updateExperience, deleteExperience } from '#/apis'
import type { Experience } from '#/domain/ports'

export const Route = createFileRoute('/admin/experiences')({
  component: ExperiencesPage,
})

const initialForm = {
  title: '',
  company: '',
  location: '',
  startDate: '',
  endDate: '',
  description: [] as string[],
  image: '',
  sortOrder: 0,
}

function ExperiencesPage() {
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Experience | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const { data: experiences = [], isLoading } = useQuery({
    queryKey: ['experiences'],
    queryFn: () => listExperiences(),
  })

  const createMutation = useMutation({
    mutationFn: (data: typeof initialForm) => createExperience({ data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experiences'] })
      closeForm()
    },
  })

  const updateMutation = useMutation({
    mutationFn: (data: { id: string; data: Partial<typeof initialForm> }) =>
      updateExperience({ data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experiences'] })
      closeForm()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteExperience({ data: id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experiences'] })
      setDeleteId(null)
    },
  })

  function openEdit(exp: Experience) {
    setEditing(exp)
    setForm({
      title: exp.title,
      company: exp.company,
      location: exp.location,
      startDate: exp.startDate,
      endDate: exp.endDate ?? '',
      description: exp.description ?? [],
      image: exp.image ?? '',
      sortOrder: exp.sortOrder ?? 0,
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
    if (!form.company.trim()) errs.company = 'Company is required'
    if (!form.location.trim()) errs.location = 'Location is required'
    if (!form.startDate.trim()) errs.startDate = 'Start date is required'
    setErrors(errs)
    if (Object.keys(errs).length > 0) return
    if (editing) {
      updateMutation.mutate({ id: editing.id, data: form })
    } else {
      createMutation.mutate(form)
    }
  }

  if (isLoading) {
    return <p className="text-sm text-[var(--sea-ink-soft)]">Loading experiences...</p>
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--sea-ink)]">Experiences</h1>
          <p className="mt-1 text-sm text-[var(--sea-ink-soft)]">Manage your career timeline.</p>
        </div>
        <Button onClick={() => { setEditing(null); setForm(initialForm); setErrors({}); setShowForm(true) }}>
          Add Experience
        </Button>
      </div>

      <DataTable
        columns={[
          { key: 'title', header: 'Title' },
          { key: 'company', header: 'Company' },
          { key: 'location', header: 'Location' },
          { key: 'startDate', header: 'Start Date' },
          { key: 'endDate', header: 'End Date' },
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
        data={experiences}
      />

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-lg rounded-2xl border border-[var(--line)] bg-[var(--card)] p-6 shadow-lg">
            <h2 className="mb-4 text-lg font-semibold text-[var(--sea-ink)]">
              {editing ? 'Edit Experience' : 'Add Experience'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <TextField label="Title" name="title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} error={errors.title} />
              <TextField label="Company" name="company" value={form.company} onChange={(v) => setForm({ ...form, company: v })} error={errors.company} />
              <TextField label="Location" name="location" value={form.location} onChange={(v) => setForm({ ...form, location: v })} error={errors.location} />
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField label="Start Date" name="startDate" value={form.startDate} onChange={(v) => setForm({ ...form, startDate: v })} error={errors.startDate} placeholder="YYYY-MM-DD" />
                <TextField label="End Date" name="endDate" value={form.endDate} onChange={(v) => setForm({ ...form, endDate: v })} placeholder="YYYY-MM-DD (leave empty if current)" />
              </div>
              <TextField label="Description (one item per line)" name="description" value={form.description.join('\n')} onChange={(v) => setForm({ ...form, description: v.split('\n').filter(Boolean) })} />
              <TextField label="Company Image URL" name="image" value={form.image} onChange={(v) => setForm({ ...form, image: v })} />
              <TextField label="Sort Order" name="sortOrder" value={String(form.sortOrder)} onChange={(v) => setForm({ ...form, sortOrder: Number(v) || 0 })} />
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
        title="Delete Experience"
        message="Are you sure you want to delete this experience entry?"
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        onCancel={() => setDeleteId(null)}
        confirmLabel="Delete"
      />
    </div>
  )
}
