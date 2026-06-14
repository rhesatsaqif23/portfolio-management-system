import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { DataTable, usePagination } from '#/components/tables'
import { TextField } from '#/components/forms'
import { Button } from '#/components/ui/button'
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction, AlertDialogMedia } from '#/components/ui/alert-dialog'
import { toast } from '#/components/ui/sonner'
import { listStats, createStat, updateStat, deleteStat } from '#/apis'
import type { Stat } from '#/domain/ports'
import { Plus, Trash2 } from 'lucide-react'

export const Route = createFileRoute('/admin/stats')({ component: StatsPage })

const initialForm = { key: '', value: '', category: '', subValue: '', icon: '', sortOrder: 0 }

type ConfirmAction = { type: 'create' } | { type: 'update'; id: string } | { type: 'delete'; id: string } | null

function StatsPage() {
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Stat | null>(null)
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [confirm, setConfirm] = useState<ConfirmAction>(null)

  const { data: stats = [], isLoading } = useQuery({ queryKey: ['stats'], queryFn: () => listStats() })
  const pag = usePagination(stats, 10)

  const createMutation = useMutation({
    mutationFn: () => createStat({ data: form }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['stats'] }); toast.success('Stat created'); closeForm() },
    onError: (err) => toast.error(err instanceof Error ? err.message : 'Failed'),
  })
  const updateMutation = useMutation({
    mutationFn: () => updateStat({ data: { id: editing!.id, data: form } }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['stats'] }); toast.success('Stat updated'); closeForm() },
    onError: (err) => toast.error(err instanceof Error ? err.message : 'Failed'),
  })
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteStat({ data: id }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['stats'] }); toast.success('Stat deleted') },
    onError: (err) => toast.error(err instanceof Error ? err.message : 'Failed'),
  })

  function openCreate() { setEditing(null); setForm(initialForm); setErrors({}); setShowForm(true) }
  function openEdit(stat: Stat) {
    setEditing(stat)
    setForm({ key: stat.key, value: stat.value, category: stat.category ?? '', subValue: stat.subValue ?? '', icon: stat.icon ?? '', sortOrder: stat.sortOrder ?? 0 })
    setErrors({}); setShowForm(true)
  }
  function closeForm() { setShowForm(false); setEditing(null); setForm(initialForm); setErrors({}) }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs: Record<string, string> = {}
    if (!form.key.trim()) errs.key = 'Key is required'
    if (!form.value.trim()) errs.value = 'Value is required'
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
          <h1 className="text-lg md:text-2xl font-bold text-[var(--sea-ink)]">Stats</h1>
          <p className="mt-1 text-xs md:text-sm text-[var(--sea-ink-soft)]">Manage About section stats.</p>
        </div>
        <Button size="sm" onClick={openCreate}><Plus className="size-4 md:size-5" /><span className="md:inline"> Add Stat</span></Button>
      </div>

      <div className="overflow-x-auto">
      <DataTable
        loading={isLoading}
        columns={[
          { key: 'key' as keyof Stat, header: 'Key' },
          { key: 'value' as keyof Stat, header: 'Value' },
          { key: 'category' as keyof Stat, header: 'Category' },
          { key: 'subValue' as keyof Stat, header: 'Sub Value' },
          { key: 'sortOrder' as keyof Stat, header: 'Order' },
          { key: 'id' as keyof Stat, header: 'Actions', render: (_, r) => (
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => openEdit(r)}>Edit</Button>
              <Button size="sm" variant="destructive" onClick={() => setConfirm({ type: 'delete', id: r.id })}>Delete</Button>
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
            <h2 className="text-sm md:text-lg font-semibold">{editing ? 'Edit Stat' : 'Add Stat'}</h2>
            <Button type="button" size="xs" variant="ghost" onClick={closeForm} className="text-muted-foreground">✕</Button>
          </div>
            <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
              <div className="grid gap-3 md:gap-4 sm:grid-cols-2">
                <TextField label="Key" name="key" value={form.key} onChange={(v) => setForm({ ...form, key: v })} error={errors.key} />
                <TextField label="Category" name="category" value={form.category} onChange={(v) => setForm({ ...form, category: v })} />
              </div>
              <TextField label="Value" name="value" value={form.value} onChange={(v) => setForm({ ...form, value: v })} error={errors.value} />
              <TextField label="Sub Value" name="subValue" value={form.subValue} onChange={(v) => setForm({ ...form, subValue: v })} />
              <div className="grid gap-3 md:gap-4 sm:grid-cols-2">
                <TextField label="Icon" name="icon" value={form.icon} onChange={(v) => setForm({ ...form, icon: v })} />
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
            <AlertDialogTitle>{confirm?.type === 'delete' ? 'Delete Stat' : confirm?.type === 'create' ? 'Add Stat' : 'Update Stat'}</AlertDialogTitle>
            <AlertDialogDescription>
              {confirm?.type === 'delete' ? 'This action cannot be undone. Are you sure?' : `Are you sure you want to ${confirm?.type === 'create' ? 'add' : 'update'} this stat?`}
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
