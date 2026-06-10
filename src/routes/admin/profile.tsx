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
    bioShort: '',
    bioLong: '',
    avatarUrl: '',
    cvUrl: '',
    location: '',
    email: '',
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
        bioShort: profile.bioShort ?? '',
        bioLong: profile.bioLong ?? '',
        avatarUrl: profile.avatarUrl ?? '',
        cvUrl: profile.cvUrl ?? '',
        location: profile.location ?? '',
        email: profile.email ?? '',
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
    if (!form.currentRole.trim()) errs.currentRole = 'Current role is required'
    setErrors(errs)
    if (Object.keys(errs).length > 0) return
    updateMutation.mutate(form)
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
        <TextField label="Current Role" name="currentRole" value={form.currentRole} onChange={(v) => setForm({ ...form, currentRole: v })} error={errors.currentRole} />
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
