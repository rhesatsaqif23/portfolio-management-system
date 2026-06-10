import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { DataTable } from '#/components/tables'
import { TextField, SelectField } from '#/components/forms'
import { Badge } from '#/components/shared'
import { Button } from '#/components/ui/button'
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction, AlertDialogMedia } from '#/components/ui/alert-dialog'
import { toast } from '#/components/ui/sonner'
import { listSkills, createSkill, updateSkill, deleteSkill } from '#/apis'
import type { Skill } from '#/domain/ports'
import { Plus, Trash2 } from 'lucide-react'

export const Route = createFileRoute('/admin/skills')({ component: SkillsPage })

const categories = [
  { value: 'mobile', label: 'Mobile' },
  { value: 'web', label: 'Web' },
  { value: 'backend', label: 'Backend' },
  { value: 'devops', label: 'DevOps' },
  { value: 'design', label: 'Design' },
  { value: 'other', label: 'Other' },
]

const initialForm = { name: '', category: 'web', iconUrl: '', sortOrder: 0 }

type ConfirmAction = { type: 'create' } | { type: 'update'; id: string } | { type: 'delete'; id: string } | null

function SkillsPage() {
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Skill | null>(null)
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState('')
  const [confirm, setConfirm] = useState<ConfirmAction>(null)

  const { data: skills = [], isLoading } = useQuery({ queryKey: ['skills'], queryFn: () => listSkills() })

  const createMutation = useMutation({
    mutationFn: () => createSkill({ data: form }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['skills'] }); toast.success('Skill created'); closeForm() },
    onError: (err) => toast.error(err instanceof Error ? err.message : 'Failed'),
  })
  const updateMutation = useMutation({
    mutationFn: () => updateSkill({ data: { id: editing!.id, data: form } }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['skills'] }); toast.success('Skill updated'); closeForm() },
    onError: (err) => toast.error(err instanceof Error ? err.message : 'Failed'),
  })
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteSkill({ data: id }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['skills'] }); toast.success('Skill deleted') },
    onError: (err) => toast.error(err instanceof Error ? err.message : 'Failed'),
  })

  function openCreate() { setEditing(null); setForm(initialForm); setError(''); setShowForm(true) }
  function openEdit(skill: Skill) {
    setEditing(skill)
    setForm({ name: skill.name, category: skill.category as string, iconUrl: skill.iconUrl ?? '', sortOrder: skill.sortOrder ?? 0 })
    setError(''); setShowForm(true)
  }
  function closeForm() { setShowForm(false); setEditing(null); setForm(initialForm); setError('') }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) { setError('Skill name is required'); return }
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
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--sea-ink)]">Skills</h1>
          <p className="mt-1 text-sm text-[var(--sea-ink-soft)]">Manage your skills.</p>
        </div>
        <Button onClick={openCreate}><Plus /> Add Skill</Button>
      </div>

      <DataTable
        loading={isLoading}
        columns={[
          { key: 'name' as keyof Skill, header: 'Name' },
          { key: 'category' as keyof Skill, header: 'Category', render: (v) => <Badge variant="secondary">{String(v)}</Badge> },
          { key: 'sortOrder' as keyof Skill, header: 'Order' },
          { key: 'id' as keyof Skill, header: 'Actions', render: (_, r) => (
            <div className="flex gap-2">
              <Button size="xs" variant="outline" onClick={() => openEdit(r)}>Edit</Button>
              <Button size="xs" variant="destructive" onClick={() => setConfirm({ type: 'delete', id: r.id })}>Delete</Button>
            </div>
          )},
        ]}
        data={skills}
      />

      {showForm && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-2xl border bg-card p-6 shadow-lg">
            <h2 className="mb-4 text-lg font-semibold">{editing ? 'Edit Skill' : 'Add Skill'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <TextField label="Skill Name" name="name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} error={error} />
              <SelectField label="Category" name="category" value={form.category} onChange={(v) => setForm({ ...form, category: v })} options={categories} />
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField label="Icon URL" name="iconUrl" value={form.iconUrl} onChange={(v) => setForm({ ...form, iconUrl: v })} />
                <TextField label="Sort Order" name="sortOrder" value={String(form.sortOrder)} onChange={(v) => setForm({ ...form, sortOrder: Number(v) || 0 })} />
              </div>
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
            <AlertDialogTitle>{confirm?.type === 'delete' ? 'Delete Skill' : confirm?.type === 'create' ? 'Add Skill' : 'Update Skill'}</AlertDialogTitle>
            <AlertDialogDescription>
              {confirm?.type === 'delete' ? 'This action cannot be undone. Are you sure?' : `Are you sure you want to ${confirm?.type === 'create' ? 'add' : 'update'} this skill?`}
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
