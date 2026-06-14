import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { DataTable, usePagination } from '#/components/tables'
import { TextField, TextAreaField, GalleryUpload } from '#/components/forms'
import type { GalleryItem } from '#/components/forms/GalleryUpload'
import { Button } from '#/components/ui/button'
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction, AlertDialogMedia } from '#/components/ui/alert-dialog'
import { toast } from '#/components/ui/sonner'
import { listCaseStudies, createCaseStudy, updateCaseStudy, deleteCaseStudy } from '#/apis'
import type { CaseStudy } from '#/domain/ports'
import { Plus, Trash2 } from 'lucide-react'

export const Route = createFileRoute('/admin/case-studies')({ component: CaseStudiesPage })

const initialForm = { projectId: '', contentMarkdown: '', galleryJsonb: [] as GalleryItem[] }

type ConfirmAction = { type: 'create' } | { type: 'update'; id: string } | { type: 'delete'; id: string } | null

function CaseStudiesPage() {
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<CaseStudy | null>(null)
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [confirm, setConfirm] = useState<ConfirmAction>(null)

  const { data: caseStudies = [], isLoading } = useQuery({ queryKey: ['caseStudies'], queryFn: () => listCaseStudies() })
  const pag = usePagination(caseStudies, 10)

  const createMutation = useMutation({
    mutationFn: () => createCaseStudy({ data: buildPayload() }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['caseStudies'] }); toast.success('Case study created'); closeForm() },
    onError: (err) => toast.error(err instanceof Error ? err.message : 'Failed'),
  })
  const updateMutation = useMutation({
    mutationFn: () => updateCaseStudy({ data: { id: editing!.id, ...buildPayload() } }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['caseStudies'] }); toast.success('Case study updated'); closeForm() },
    onError: (err) => toast.error(err instanceof Error ? err.message : 'Failed'),
  })
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteCaseStudy({ data: id }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['caseStudies'] }); toast.success('Case study deleted') },
    onError: (err) => toast.error(err instanceof Error ? err.message : 'Failed'),
  })

  function buildPayload() {
    return { projectId: form.projectId, contentMarkdown: form.contentMarkdown, galleryJsonb: form.galleryJsonb }
  }

  function openCreate() { setEditing(null); setForm(initialForm); setErrors({}); setShowForm(true) }

  function openEdit(cs: CaseStudy) {
    setEditing(cs)
    setForm({ projectId: cs.projectId, contentMarkdown: cs.contentMarkdown, galleryJsonb: cs.galleryJsonb ?? [] })
    setErrors({}); setShowForm(true)
  }

  function closeForm() { setShowForm(false); setEditing(null); setForm(initialForm); setErrors({}) }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs: Record<string, string> = {}
    if (!form.projectId.trim()) errs.projectId = 'Project ID is required'
    if (!form.contentMarkdown.trim()) errs.contentMarkdown = 'Content is required'
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
          <h1 className="text-lg md:text-2xl font-bold text-[var(--sea-ink)]">Case Studies</h1>
          <p className="mt-1 text-xs md:text-sm text-[var(--sea-ink-soft)]">Manage detailed case studies for projects.</p>
        </div>
        <Button size="xs" onClick={openCreate}><Plus className="size-4 md:size-5" /><span className="hidden md:inline"> Create Case Study</span></Button>
      </div>

      <div className="overflow-x-auto">
      <DataTable
        loading={isLoading}
        columns={[
          { key: 'projectId' as keyof CaseStudy, header: 'Project ID' },
          { key: 'contentMarkdown' as keyof CaseStudy, header: 'Content', render: (v) => <span className="line-clamp-2 max-w-xs">{String(v).slice(0, 120)}{String(v).length > 120 ? '...' : ''}</span> },
          { key: 'id' as keyof CaseStudy, header: 'Actions', render: (_, r) => (
            <div className="flex gap-2">
              <Button size="xs" variant="outline" onClick={() => openEdit(r)}>Edit</Button>
              <Button size="xs" variant="destructive" onClick={() => setConfirm({ type: 'delete', id: r.id })}>Delete</Button>
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
            <h2 className="text-sm md:text-lg font-semibold">{editing ? 'Edit Case Study' : 'Create Case Study'}</h2>
            <Button type="button" size="xs" variant="ghost" onClick={closeForm} className="text-muted-foreground">✕</Button>
          </div>
            <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
              <TextField label="Project ID" name="projectId" value={form.projectId} onChange={(v) => setForm({ ...form, projectId: v })} error={errors.projectId} />
              <TextAreaField label="Content (Markdown)" name="contentMarkdown" value={form.contentMarkdown} onChange={(v) => setForm({ ...form, contentMarkdown: v })} rows={8} error={errors.contentMarkdown} />
              <GalleryUpload items={form.galleryJsonb} onChange={(items) => setForm({ ...form, galleryJsonb: items })} />
              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={closeForm}>Cancel</Button>
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>{editing ? 'Update' : 'Create'}</Button>
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
            <AlertDialogTitle>
              {confirm?.type === 'delete' ? 'Delete Case Study' : confirm?.type === 'create' ? 'Create Case Study' : 'Update Case Study'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirm?.type === 'delete'
                ? 'This action cannot be undone. Are you sure?'
                : `Are you sure you want to ${confirm?.type === 'create' ? 'create' : 'update'} this case study?`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setConfirm(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={executeConfirm} className={confirm?.type === 'delete' ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90' : ''}>
              {confirm?.type === 'delete' ? 'Delete' : confirm?.type === 'create' ? 'Create' : 'Update'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
