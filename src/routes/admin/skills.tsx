import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { DataTable } from '#/components/tables'
import { TextField, SelectField } from '#/components/forms'
import { Badge, ConfirmDialog } from '#/components/shared'
import { Button } from '#/components/ui/button'
import { listSkills, createSkill, updateSkill, deleteSkill } from '#/apis'
import type { Skill } from '#/domain/ports'

export const Route = createFileRoute('/admin/skills')({
  component: SkillsPage,
})

const categories = [
  { value: 'mobile', label: 'Mobile' },
  { value: 'web', label: 'Web' },
  { value: 'backend', label: 'Backend' },
  { value: 'devops', label: 'DevOps' },
  { value: 'design', label: 'Design' },
  { value: 'other', label: 'Other' },
]

const initialForm = { name: '', category: 'web', iconUrl: '', sortOrder: 0 }

function SkillsPage() {
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Skill | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState('')

  const { data: skills = [], isLoading } = useQuery({
    queryKey: ['skills'],
    queryFn: () => listSkills(),
  })

  const createMutation = useMutation({
    mutationFn: (data: typeof initialForm) => createSkill({ data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] })
      closeForm()
    },
  })

  const updateMutation = useMutation({
    mutationFn: (data: { id: string; data: Partial<typeof initialForm> }) =>
      updateSkill({ data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] })
      closeForm()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteSkill({ data: id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] })
      setDeleteId(null)
    },
  })

  function openCreate() {
    setEditing(null)
    setForm(initialForm)
    setError('')
    setShowForm(true)
  }

  function openEdit(skill: Skill) {
    setEditing(skill)
    setForm({
      name: skill.name,
      category: skill.category as string,
      iconUrl: skill.iconUrl ?? '',
      sortOrder: skill.sortOrder ?? 0,
    })
    setError('')
    setShowForm(true)
  }

  function closeForm() {
    setShowForm(false)
    setEditing(null)
    setForm(initialForm)
    setError('')
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) {
      setError('Skill name is required')
      return
    }
    if (editing) {
      updateMutation.mutate({ id: editing.id, data: form })
    } else {
      createMutation.mutate(form)
    }
  }

  if (isLoading) {
    return <p className="text-sm text-[var(--sea-ink-soft)]">Loading skills...</p>
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--sea-ink)]">Skills</h1>
          <p className="mt-1 text-sm text-[var(--sea-ink-soft)]">Manage your skills.</p>
        </div>
        <Button onClick={openCreate}>Add Skill</Button>
      </div>

      <DataTable
        columns={[
          { key: 'name' as keyof Skill, header: 'Name' },
          {
            key: 'category' as keyof Skill,
            header: 'Category',
            render: (value) => <Badge variant="secondary">{String(value)}</Badge>,
          },
          { key: 'sortOrder' as keyof Skill, header: 'Order' },
          {
            key: 'id' as keyof Skill,
            header: 'Actions',
            render: (_, row) => (
              <div className="flex gap-2">
                <Button size="xs" variant="outline" onClick={() => openEdit(row)}>Edit</Button>
                <Button size="xs" variant="destructive" onClick={() => setDeleteId(row.id)}>Delete</Button>
              </div>
            ),
          },
        ]}
        data={skills}
      />

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-2xl border border-[var(--line)] bg-[var(--card)] p-6 shadow-lg">
            <h2 className="mb-4 text-lg font-semibold text-[var(--sea-ink)]">
              {editing ? 'Edit Skill' : 'Add Skill'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <TextField label="Skill Name" name="name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} error={error} />
              <SelectField label="Category" name="category" value={form.category} onChange={(v) => setForm({ ...form, category: v })} options={categories} />
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField label="Icon URL" name="iconUrl" value={form.iconUrl} onChange={(v) => setForm({ ...form, iconUrl: v })} />
                <TextField label="Sort Order" name="sortOrder" value={String(form.sortOrder)} onChange={(v) => setForm({ ...form, sortOrder: Number(v) || 0 })} />
              </div>
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
        title="Delete Skill"
        message="Are you sure you want to delete this skill?"
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        onCancel={() => setDeleteId(null)}
        confirmLabel="Delete"
      />
    </div>
  )
}
