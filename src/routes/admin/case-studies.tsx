import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { DataTable, usePagination } from '#/components/tables'
import { TextField, TextAreaField, SelectField, DateField, GalleryUpload } from '#/components/forms'
import type { GalleryItem } from '#/components/forms/GalleryUpload'
import { Button } from '#/components/ui/button'
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction, AlertDialogMedia } from '#/components/ui/alert-dialog'
import { toast } from '#/components/ui/sonner'
import { listCaseStudies, createCaseStudy, updateCaseStudy, deleteCaseStudy, listProjects } from '#/apis'
import type { CaseStudy } from '#/domain/ports'
import { Plus, Trash2 } from 'lucide-react'

export const Route = createFileRoute('/admin/case-studies')({ component: CaseStudiesPage })

type SectionItem = { title: string; description: string }

const initialForm = {
  projectId: '',
  role: 'full-stack developer',
  startDate: '',
  endDate: '',
  overview: '',
  problems: [] as SectionItem[],
  solutions: [] as SectionItem[],
  features: [] as SectionItem[],
  contributions: [] as SectionItem[],
  results: [] as SectionItem[],
  gallery: [] as GalleryItem[],
}

type ConfirmAction = { type: 'create' } | { type: 'update'; id: string } | { type: 'delete'; id: string } | null

function CaseStudiesPage() {
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<CaseStudy | null>(null)
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [confirm, setConfirm] = useState<ConfirmAction>(null)

  const { data: caseStudies = [], isLoading } = useQuery({ queryKey: ['caseStudies'], queryFn: () => listCaseStudies() })
  const { data: projects = [] } = useQuery({ queryKey: ['projects'], queryFn: () => listProjects() })
  const pag = usePagination(caseStudies, 10)

  const projectOptions = projects.map((p: { id: string; title: string }) => ({ value: p.id, label: p.title }))

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
    return {
      projectId: form.projectId,
      role: form.role,
      startDate: form.startDate || null,
      endDate: form.endDate || null,
      overview: form.overview,
      problems: form.problems,
      solutions: form.solutions,
      features: form.features,
      contributions: form.contributions,
      results: form.results,
      gallery: form.gallery,
    }
  }

  function openCreate() { setEditing(null); setForm(initialForm); setErrors({}); setShowForm(true) }

  function openEdit(cs: CaseStudy) {
    setEditing(cs)
    setForm({
      projectId: cs.projectId,
      role: cs.role ?? 'full-stack developer',
      startDate: cs.startDate ?? '',
      endDate: cs.endDate ?? '',
      overview: cs.overview ?? '',
      problems: (cs.problems ?? []) as SectionItem[],
      solutions: (cs.solutions ?? []) as SectionItem[],
      features: (cs.features ?? []) as SectionItem[],
      contributions: (cs.contributions ?? []) as SectionItem[],
      results: (cs.results ?? []) as SectionItem[],
      gallery: (cs.gallery ?? []) as GalleryItem[],
    })
    setErrors({}); setShowForm(true)
  }

  function closeForm() { setShowForm(false); setEditing(null); setForm(initialForm); setErrors({}) }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs: Record<string, string> = {}
    if (!form.projectId.trim()) errs.projectId = 'Project is required'
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

  function updateSection(section: keyof typeof initialForm, index: number, field: keyof SectionItem, value: string) {
    const items = [...(form[section] as SectionItem[])]
    items[index] = { ...items[index], [field]: value }
    setForm({ ...form, [section]: items })
  }

  function addSection(section: keyof typeof initialForm) {
    setForm({ ...form, [section]: [...(form[section] as SectionItem[]), { title: '', description: '' }] })
  }

  function removeSection(section: keyof typeof initialForm, index: number) {
    const items = (form[section] as SectionItem[]).filter((_, i) => i !== index)
    setForm({ ...form, [section]: items })
  }

  function SectionEditor({ section, label }: { section: keyof typeof initialForm; label: string }) {
    const items = form[section] as SectionItem[]
    return (
      <div className="space-y-2 border rounded-lg p-3">
        <label className="text-sm font-medium">{label}</label>
        {items.map((item, i) => (
          <div key={i} className="flex flex-col gap-1 p-2 border rounded bg-muted/20">
            <div className="flex items-center gap-2">
              <TextField label="Title" name={`${section}[${i}].title`} value={item.title} onChange={(v) => updateSection(section, i, 'title', v)} />
              <button type="button" onClick={() => removeSection(section, i)} className="shrink-0 mt-5 text-muted-foreground hover:text-destructive"><Trash2 className="size-4" /></button>
            </div>
            <TextAreaField label="Description" name={`${section}[${i}].description`} value={item.description} onChange={(v) => updateSection(section, i, 'description', v)} rows={2} />
          </div>
        ))}
        <Button type="button" size="xs" variant="outline" onClick={() => addSection(section)}>+ Add Item</Button>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-4 md:mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-lg md:text-2xl font-bold text-[var(--sea-ink)]">Case Studies</h1>
          <p className="mt-1 text-xs md:text-sm text-[var(--sea-ink-soft)]">Manage detailed case studies for projects.</p>
        </div>
        <Button size="sm" onClick={openCreate}><Plus className="size-4 md:size-5" /><span className="md:inline"> Create Case Study</span></Button>
      </div>

      <div className="overflow-x-auto">
      <DataTable
        loading={isLoading}
        columns={[
          { key: 'projectId' as keyof CaseStudy, header: 'Project', render: (_, r) => {
            const p = projects.find((p: { id: string; title: string }) => p.id === r.projectId)
            return <span>{p?.title ?? r.projectId}</span>
          }},
          { key: 'role' as keyof CaseStudy, header: 'Role' },
          { key: 'startDate' as keyof CaseStudy, header: 'Start' },
          { key: 'endDate' as keyof CaseStudy, header: 'End', render: (v) => <span>{String(v || 'Present')}</span> },
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
        <div className="fixed inset-0 z-60 flex items-end md:items-center justify-center bg-black/50">
          <div className="max-h-[95vh] w-full max-w-4xl overflow-y-auto rounded-t-2xl md:rounded-2xl border bg-card p-4 md:p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm md:text-lg font-semibold">{editing ? 'Edit Case Study' : 'Create Case Study'}</h2>
            <Button type="button" size="xs" variant="ghost" onClick={closeForm} className="text-muted-foreground">✕</Button>
          </div>
            <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
              <SelectField label="Project" name="projectId" value={form.projectId} onChange={(v) => setForm({ ...form, projectId: v })} options={projectOptions} placeholder="Select project" error={errors.projectId} />
              <TextField label="Role" name="role" value={form.role} onChange={(v) => setForm({ ...form, role: v })} />
              <div className="grid gap-3 md:gap-4 sm:grid-cols-2">
                <DateField label="Start Date" name="startDate" value={form.startDate} onChange={(v) => setForm({ ...form, startDate: v })} />
                <DateField label="End Date" name="endDate" value={form.endDate} onChange={(v) => setForm({ ...form, endDate: v })} placeholder="Leave empty if current" />
              </div>
              <TextAreaField label="Overview" name="overview" value={form.overview} onChange={(v) => setForm({ ...form, overview: v })} rows={3} />
              <SectionEditor section="problems" label="Problems" />
              <SectionEditor section="solutions" label="Solutions" />
              <SectionEditor section="features" label="Features" />
              <SectionEditor section="contributions" label="Contributions" />
              <SectionEditor section="results" label="Results" />
              <GalleryUpload items={form.gallery} onChange={(items) => setForm({ ...form, gallery: items })} />
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
