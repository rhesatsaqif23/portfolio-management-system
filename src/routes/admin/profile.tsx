import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import { TextField, TextAreaField } from '#/components/forms'
import { Button } from '#/components/ui/button'
import { getProfile, updateProfile } from '#/apis'

export const Route = createFileRoute('/admin/profile')({
  component: ProfilePage,
})

function ProfilePage() {
  const queryClient = useQueryClient()
  const [form, setForm] = useState({
    fullName: '',
    currentRole: '',
    currentRoles: [''],
    bioShort: '',
    bioLong: '',
    avatarUrl: '',
    cvUrl: '',
    location: '',
    email: '',
    github: '',
    linkedin: '',
    instagram: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saved, setSaved] = useState(false)

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: () => getProfile(),
  })

  useEffect(() => {
    if (profile) {
      setForm({
        fullName: profile.fullName ?? '',
        currentRole: profile.currentRole ?? '',
        currentRoles: (profile.currentRoles?.length ? profile.currentRoles : ['']) as string[],
        bioShort: profile.bioShort ?? '',
        bioLong: profile.bioLong ?? '',
        avatarUrl: profile.avatarUrl ?? '',
        cvUrl: profile.cvUrl ?? '',
        location: profile.location ?? '',
        email: profile.email ?? '',
        github: profile.github ?? '',
        linkedin: profile.linkedin ?? '',
        instagram: profile.instagram ?? '',
      })
    }
  }, [profile])

  const updateMutation = useMutation({
    mutationFn: (data: typeof form) => updateProfile({ data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    },
  })

  function updateRole(index: number, value: string) {
    const roles = [...form.currentRoles]
    roles[index] = value
    setForm({ ...form, currentRoles: roles })
  }

  function addRole() {
    setForm({ ...form, currentRoles: [...form.currentRoles, ''] })
  }

  function removeRole(index: number) {
    const roles = form.currentRoles.filter((_, i) => i !== index)
    setForm({ ...form, currentRoles: roles.length ? roles : [''] })
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs: Record<string, string> = {}
    if (!form.fullName.trim()) errs.fullName = 'Full name is required'
    if (!form.currentRole.trim()) errs.currentRole = 'Current role is required'
    const filteredRoles = form.currentRoles.filter((r) => r.trim())
    if (filteredRoles.length === 0) errs.currentRoles = 'At least one role is required'
    setErrors(errs)
    if (Object.keys(errs).length > 0) return
    updateMutation.mutate({
      ...form,
      currentRoles: filteredRoles,
    })
  }

  if (isLoading) {
    return <p className="text-sm text-[var(--sea-ink-soft)]">Loading profile...</p>
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--sea-ink)]">Profile</h1>
        <p className="mt-1 text-sm text-[var(--sea-ink-soft)]">Edit your public profile.</p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
        <TextField label="Full Name" name="fullName" value={form.fullName} onChange={(v) => setForm({ ...form, fullName: v })} error={errors.fullName} />

        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--sea-ink)]">Roles (for typing animation)</label>
          {form.currentRoles.map((role, i) => (
            <div key={i} className="flex gap-2">
              <input
                value={role}
                onChange={(e) => updateRole(i, e.target.value)}
                placeholder="e.g. Full Stack Developer"
                className="flex h-10 w-full rounded-lg border border-[var(--line)] bg-[var(--card)] px-3 py-2 text-sm text-[var(--sea-ink)] placeholder:text-[var(--muted-foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
              />
              {form.currentRoles.length > 1 && (
                <Button type="button" size="xs" variant="destructive" onClick={() => removeRole(i)}>X</Button>
              )}
            </div>
          ))}
          {errors.currentRoles && <p className="text-xs text-red-500">{errors.currentRoles}</p>}
          <Button type="button" size="xs" variant="outline" onClick={addRole}>+ Add Role</Button>
        </div>

        <TextField label="Primary Role (single badge)" name="currentRole" value={form.currentRole} onChange={(v) => setForm({ ...form, currentRole: v })} error={errors.currentRole} />
        <TextField label="Short Bio (max 280 chars)" name="bioShort" value={form.bioShort} onChange={(v) => setForm({ ...form, bioShort: v })} />
        <TextAreaField label="Long Bio" name="bioLong" value={form.bioLong} onChange={(v) => setForm({ ...form, bioLong: v })} rows={6} />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Avatar URL" name="avatarUrl" value={form.avatarUrl} onChange={(v) => setForm({ ...form, avatarUrl: v })} />
          <TextField label="CV URL" name="cvUrl" value={form.cvUrl} onChange={(v) => setForm({ ...form, cvUrl: v })} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Location" name="location" value={form.location} onChange={(v) => setForm({ ...form, location: v })} />
          <TextField label="Email" name="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <TextField label="GitHub" name="github" value={form.github} onChange={(v) => setForm({ ...form, github: v })} />
          <TextField label="LinkedIn" name="linkedin" value={form.linkedin} onChange={(v) => setForm({ ...form, linkedin: v })} />
          <TextField label="Instagram" name="instagram" value={form.instagram} onChange={(v) => setForm({ ...form, instagram: v })} />
        </div>
        <div className="flex items-center gap-4">
          <Button type="submit" disabled={updateMutation.isPending}>
            {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
          {saved && <span className="text-sm text-green-600">Saved!</span>}
        </div>
      </form>
    </div>
  )
}
