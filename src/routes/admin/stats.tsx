import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { DataTable } from '#/components/tables'
import { TextField } from '#/components/forms'
import { ConfirmDialog } from '#/components/shared'
import { Button } from '#/components/ui/button'
import { listStats, createStat, updateStat, deleteStat } from '#/apis'
import type { Stat } from '#/domain/ports'

export const Route = createFileRoute('/admin/stats')({
  component: StatsPage,
})

const initialForm = {
  key: '',
  value: '',
  category: '',
  subValue: '',
  icon: '',
  sortOrder: 0,
}

function StatsPage() {
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Stat | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const { data: stats = [], isLoading } = useQuery({
    queryKey: ['stats'],
    queryFn: () => listStats(),
  })

  const createMutation = useMutation({
    mutationFn: (data: typeof initialForm) => createStat({ data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stats'] })
      closeForm()
    },
  })

  const updateMutation = useMutation({
    mutationFn: (data: { id: string; data: Partial<typeof initialForm> }) =>
      updateStat({ data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stats'] })
      closeForm()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteStat({ data: id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stats'] })
      setDeleteId(null)
    },
  })

  function openCreate() {
    setEditing(null)
    setForm(initialForm)
    setErrors({})
    setShowForm(true)
  }

  function openEdit(stat: Stat) {
    setEditing(stat)
    setForm({
      key: stat.key,
      value: stat.value,
      category: stat.category ?? '',
      subValue: stat.subValue ?? '',
      icon: stat.icon ?? '',
      sortOrder: stat.sortOrder ?? 0,
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
    if (!form.key.trim()) errs.key = 'Key is required'
    if (!form.value.trim()) errs.value = 'Value is required'
    setErrors(errs)
    if (Object.keys(errs).length > 0) return
    if (editing) {
      updateMutation.mutate({ id: editing.id, data: form })
    } else {
      createMutation.mutate(form)
    }
  }

  if (isLoading) {
    return <p className="text-sm text-[var(--sea-ink-soft)]">Loading stats...</p>
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--sea-ink)]">Stats</h1>
          <p className="mt-1 text-sm text-[var(--sea-ink-soft)]">Manage About section stats (education, counters, focus areas, etc.).</p>
        </div>
        <Button onClick={openCreate}>Add Stat</Button>
      </div>

      <DataTable
        columns={[
          { key: 'key', header: 'Key' },
          { key: 'value', header: 'Value' },
          { key: 'category', header: 'Category' },
          { key: 'subValue', header: 'Sub Value' },
          { key: 'sortOrder', header: 'Order' },
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
        data={stats}
      />

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-lg rounded-2xl border border-[var(--line)] bg-[var(--card)] p-6 shadow-lg">
            <h2 className="mb-4 text-lg font-semibold text-[var(--sea-ink)]">
              {editing ? 'Edit Stat' : 'Add Stat'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField label="Key" name="key" value={form.key} onChange={(v) => setForm({ ...form, key: v })} error={errors.key} placeholder="e.g. education" />
                <TextField label="Category" name="category" value={form.category} onChange={(v) => setForm({ ...form, category: v })} placeholder="e.g. education, counter, focus" />
              </div>
              <TextField label="Value" name="value" value={form.value} onChange={(v) => setForm({ ...form, value: v })} error={errors.value} placeholder="e.g. Informatics Engineering" />
              <TextField label="Sub Value (optional)" name="subValue" value={form.subValue} onChange={(v) => setForm({ ...form, subValue: v })} placeholder="e.g. 2023—Present" />
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField label="Icon (optional)" name="icon" value={form.icon} onChange={(v) => setForm({ ...form, icon: v })} />
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
        title="Delete Stat"
        message="Are you sure you want to delete this stat entry?"
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        onCancel={() => setDeleteId(null)}
        confirmLabel="Delete"
      />
    </div>
  )
}
