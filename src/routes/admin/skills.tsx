import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { DataTable } from '#/components/tables'
import { TextField, SelectField } from '#/components/forms'
import { Badge, ConfirmDialog } from '#/components/shared'
import { Button } from '#/components/ui/button'
import { listSkills, createSkill, deleteSkill } from '#/apis'
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

function SkillsPage() {
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [category, setCategory] = useState('web')
  const [iconUrl, setIconUrl] = useState('')
  const [error, setError] = useState('')

  const { data: skills = [], isLoading } = useQuery({
    queryKey: ['skills'],
    queryFn: () => listSkills(),
  })

  const createMutation = useMutation({
    mutationFn: (data: { name: string; category: string; iconUrl?: string }) => createSkill({ data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] })
      setShowForm(false)
      setName('')
      setCategory('web')
      setIconUrl('')
      setError('')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteSkill({ data: id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] })
      setDeleteId(null)
    },
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) {
      setError('Skill name is required')
      return
    }
    createMutation.mutate({ name: name.trim(), category, iconUrl })
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
        <Button onClick={() => setShowForm(true)}>Add Skill</Button>
      </div>

      <DataTable
        columns={[
          { key: 'name', header: 'Name' },
          {
            key: 'category',
            header: 'Category',
            render: (value) => <Badge variant="secondary">{String(value)}</Badge>,
          },
          { key: 'sortOrder', header: 'Order' },
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
        data={skills}
      />

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-2xl border border-[var(--line)] bg-[var(--card)] p-6 shadow-lg">
            <h2 className="mb-4 text-lg font-semibold text-[var(--sea-ink)]">Add Skill</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <TextField label="Skill Name" name="name" value={name} onChange={setName} error={error} />
              <SelectField label="Category" name="category" value={category} onChange={setCategory} options={categories} />
              <TextField label="Icon URL (optional)" name="iconUrl" value={iconUrl} onChange={setIconUrl} />
              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
                <Button type="submit" disabled={createMutation.isPending}>Add</Button>
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
