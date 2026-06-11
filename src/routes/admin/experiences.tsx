import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { DataTable } from '#/components/tables'
import { TextField, TextAreaField, SelectField } from '#/components/forms'
import { Button } from '#/components/ui/button'
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction, AlertDialogMedia } from '#/components/ui/alert-dialog'
import { toast } from '#/components/ui/sonner'
import { listExperiences, createExperience, updateExperience, deleteExperience } from '#/apis'
import type { Experience } from '#/domain/ports'
import { Plus, Trash2 } from 'lucide-react'

export const Route = createFileRoute('/admin/experiences')({ component: ExperiencesPage })

const expTypes = [
  { value: 'work', label: 'Work' },
  { value: 'organization', label: 'Organization' },
  { value: 'volunteer', label: 'Volunteer' },
  { value: 'education', label: 'Education' },
]

const initialForm = { orgName: '', role: '', startDate: '', endDate: '', description: '', type: 'work', sortOrder: 0 }

type ConfirmAction = { type: 'create' } | { type: 'update'; id: string } | { type: 'delete'; id: string } | null

function ExperiencesPage() {
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Experience | null>(null)
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [confirm, setConfirm] = useState<ConfirmAction>(null)

  const { data: experiences = [], isLoading } = useQuery({ queryKey: ['experiences'], queryFn: () => listExperiences() })

  const createMutation = useMutation({
    mutationFn: () => createExperience({ data: form }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['experiences'] }); toast.success('Experience created'); closeForm() },
    onError: (err) => toast.error(err instanceof Error ? err.message : 'Failed'),
  })
  const updateMutation = useMutation({
    mutationFn: () => updateExperience({ data: { id: editing!.id, data: form } }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['experiences'] }); toast.success('Experience updated'); closeForm() },
    onError: (err) => toast.error(err instanceof Error ? err.message : 'Failed'),
  })
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteExperience({ data: id }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['experiences'] }); toast.success('Experience deleted') },
    onError: (err) => toast.error(err instanceof Error ? err.message : 'Failed'),
  })

  function openCreate() { setEditing(null); setForm(initialForm); setErrors({}); setShowForm(true) }
  function openEdit(exp: Experience) {
    setEditing(exp)
    setForm({ orgName: exp.orgName, role: exp.role, startDate: exp.startDate, endDate: exp.endDate ?? '', description: exp.description ?? '', type: exp.type as string, sortOrder: exp.sortOrder ?? 0 })
    setErrors({}); setShowForm(true)
  }
  function closeForm() { setShowForm(false); setEditing(null); setForm(initialForm); setErrors({}) }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs: Record<string, string> = {}
    if (!form.orgName.trim()) errs.orgName = 'Organization name is required'
    if (!form.role.trim()) errs.role = 'Role is required'
    if (!form.startDate.trim()) errs.startDate = 'Start date is required'
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
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--sea-ink)]">Experiences</h1>
          <p className="mt-1 text-sm text-[var(--sea-ink-soft)]">Manage your career timeline.</p>
        </div>
        <Button onClick={openCreate}><Plus /> Add Experience</Button>
      </div>

      <DataTable
        loading={isLoading}
        columns={[
          { key: 'orgName' as keyof Experience, header: 'Organization' },
          { key: 'role' as keyof Experience, header: 'Role' },
          { key: 'type' as keyof Experience, header: 'Type' },
          { key: 'startDate' as keyof Experience, header: 'Start' },
          { key: 'endDate' as keyof Experience, header: 'End', render: (v) => <span>{String(v || 'Present')}</span> },
          { key: 'id' as keyof Experience, header: 'Actions', render: (_, r) => (
            <div className="flex gap-2">
              <Button size="xs" variant="outline" onClick={() => openEdit(r)}>Edit</Button>
              <Button size="xs" variant="destructive" onClick={() => setConfirm({ type: 'delete', id: r.id })}>Delete</Button>
            </div>
          )},
        ]}
        data={experiences}
      />

      {showForm && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-lg rounded-2xl border bg-card p-6 shadow-lg">
            <h2 className="mb-4 text-lg font-semibold">{editing ? 'Edit Experience' : 'Add Experience'}</h2>
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
            <AlertDialogTitle>{confirm?.type === 'delete' ? 'Delete Experience' : confirm?.type === 'create' ? 'Add Experience' : 'Update Experience'}</AlertDialogTitle>
            <AlertDialogDescription>
              {confirm?.type === 'delete' ? 'This action cannot be undone. Are you sure?' : `Are you sure you want to ${confirm?.type === 'create' ? 'add' : 'update'} this experience?`}
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
