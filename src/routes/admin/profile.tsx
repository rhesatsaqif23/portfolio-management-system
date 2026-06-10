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
    currentRoles: [] as string[],
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
        currentRoles: profile.currentRoles ?? [],
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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs: Record<string, string> = {}
    if (!form.fullName.trim()) errs.fullName = 'Full name is required'
    setErrors(errs)
    if (Object.keys(errs).length > 0) return
    updateMutation.mutate(form)
  }

  function addRole() {
    setForm({ ...form, currentRoles: [...form.currentRoles, ''] })
  }

  function updateRole(index: number, value: string) {
    const roles = [...form.currentRoles]
    roles[index] = value
    setForm({ ...form, currentRoles: roles })
  }

  function removeRole(index: number) {
    setForm({ ...form, currentRoles: form.currentRoles.filter((_, i) => i !== index) })
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
          <label className="text-sm font-medium text-[var(--sea-ink)]">Roles (typing rotation)</label>
          {form.currentRoles.map((role, i) => (
            <div key={i} className="flex gap-2">
              <input
                className="flex h-10 w-full rounded-lg border border-[var(--line)] bg-[var(--card)] px-3 py-2 text-sm text-[var(--sea-ink)] placeholder:text-[var(--muted-foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                value={role}
                onChange={(e) => updateRole(i, e.target.value)}
                placeholder="e.g. Full-stack Developer"
              />
              <Button type="button" variant="destructive" size="xs" onClick={() => removeRole(i)}>
                &times;
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={addRole}>
            + Add Role
          </Button>
        </div>

        <TextField label="Short Bio (max 280 chars)" name="bioShort" value={form.bioShort} onChange={(v) => setForm({ ...form, bioShort: v })} />
        <TextAreaField label="Long Bio" name="bioLong" value={form.bioLong} onChange={(v) => setForm({ ...form, bioLong: v })} rows={6} />

        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Avatar URL" name="avatarUrl" value={form.avatarUrl} onChange={(v) => setForm({ ...form, avatarUrl: v })} />
          <TextField label="CV URL" name="cvUrl" value={form.cvUrl} onChange={(v) => setForm({ ...form, cvUrl: v })} />
        </div>

        <TextField label="Location" name="location" value={form.location} onChange={(v) => setForm({ ...form, location: v })} />

        <div className="border-t border-[var(--line)] pt-4">
          <h3 className="mb-3 text-sm font-semibold text-[var(--sea-ink)]">Contact & Social</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label="Email" name="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
            <TextField label="GitHub URL" name="github" value={form.github} onChange={(v) => setForm({ ...form, github: v })} />
            <TextField label="LinkedIn URL" name="linkedin" value={form.linkedin} onChange={(v) => setForm({ ...form, linkedin: v })} />
            <TextField label="Instagram URL" name="instagram" value={form.instagram} onChange={(v) => setForm({ ...form, instagram: v })} />
          </div>
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
