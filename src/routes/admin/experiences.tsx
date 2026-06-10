import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { DataTable } from '#/components/tables'
import { TextField, TextAreaField, SelectField } from '#/components/forms'
import { ConfirmDialog } from '#/components/shared'
import { Button } from '#/components/ui/button'
import { listExperiences, createExperience, updateExperience, deleteExperience } from '#/apis'
import type { Experience } from '#/domain/ports'

export const Route = createFileRoute('/admin/experiences')({
  component: ExperiencesPage,
})

const expTypes = [
  { value: 'work', label: 'Work' },
  { value: 'organization', label: 'Organization' },
  { value: 'volunteer', label: 'Volunteer' },
  { value: 'education', label: 'Education' },
]

const initialForm = {
  orgName: '',
  role: '',
  startDate: '',
  endDate: '',
  description: '',
  type: 'work',
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

  function openCreate() {
    setEditing(null)
    setForm(initialForm)
    setErrors({})
    setShowForm(true)
  }

  function openEdit(exp: Experience) {
    setEditing(exp)
    setForm({
      orgName: exp.orgName,
      role: exp.role,
      startDate: exp.startDate,
      endDate: exp.endDate ?? '',
      description: exp.description ?? '',
      type: exp.type as string,
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
    if (!form.orgName.trim()) errs.orgName = 'Organization name is required'
    if (!form.role.trim()) errs.role = 'Role is required'
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
        <Button onClick={openCreate}>Add Experience</Button>
      </div>

      <DataTable
        columns={[
          { key: 'orgName' as keyof Experience, header: 'Organization' },
          { key: 'role' as keyof Experience, header: 'Role' },
          { key: 'type' as keyof Experience, header: 'Type' },
          { key: 'startDate' as keyof Experience, header: 'Start Date' },
          {
            key: 'endDate' as keyof Experience,
            header: 'End Date',
            render: (value) => <span>{String(value || 'Present')}</span>,
          },
          {
            key: 'id' as keyof Experience,
            header: 'Actions',
            render: (_, row) => (
              <div className="flex gap-2">
                <Button size="xs" variant="outline" onClick={() => openEdit(row)}>Edit</Button>
                <Button size="xs" variant="destructive" onClick={() => setDeleteId(row.id)}>Delete</Button>
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
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField label="Organization" name="orgName" value={form.orgName} onChange={(v) => setForm({ ...form, orgName: v })} error={errors.orgName} />
                <TextField label="Role" name="role" value={form.role} onChange={(v) => setForm({ ...form, role: v })} error={errors.role} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField label="Start Date" name="startDate" value={form.startDate} onChange={(v) => setForm({ ...form, startDate: v })} error={errors.startDate} placeholder="YYYY-MM-DD" />
                <TextField label="End Date" name="endDate" value={form.endDate} onChange={(v) => setForm({ ...form, endDate: v })} placeholder="YYYY-MM-DD (leave empty if current)" />
              </div>
              <SelectField label="Type" name="type" value={form.type} onChange={(v) => setForm({ ...form, type: v })} options={expTypes} />
              <TextAreaField label="Description" name="description" value={form.description} onChange={(v) => setForm({ ...form, description: v })} rows={4} />
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
