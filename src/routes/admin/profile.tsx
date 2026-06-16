import React from 'react';
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { TextField, TextAreaField, FileUpload } from "#/components/forms";
import { Skeleton } from "#/components/ui/skeleton";
import { Input } from "#/components/ui/input";
import { Button } from "#/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogMedia,
} from "#/components/ui/alert-dialog";
import { toast } from "#/components/ui/sonner";
import { getProfile, updateProfile } from "#/apis";
import { TriangleAlert } from "lucide-react";

export const Route = createFileRoute("/admin/profile")({
  component: ProfilePage,
});

const initialForm = {
  fullName: "",
  currentRole: "",
  currentRoles: [""],
  bioShort: "",
  bioLong: "",
  avatarUrl: "",
  cvUrl: "",
  location: "",
  email: "",
  github: "",
  linkedin: "",
  instagram: "",
};

function ProfileFormSkeleton() {
  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <div className="space-y-1">
        <Skeleton className="h-3.5 w-16" />
        <Skeleton className="h-10 w-full" />
      </div>

      <div className="space-y-2">
        <Skeleton className="h-3.5 w-48" />
        <div className="flex gap-2">
          <Skeleton className="h-10 flex-1" />
        </div>
        <Skeleton className="h-8 w-24" />
      </div>

      <div className="space-y-1">
        <Skeleton className="h-3.5 w-20" />
        <Skeleton className="h-10 w-full" />
      </div>

      <div className="space-y-1">
        <Skeleton className="h-3.5 w-36" />
        <Skeleton className="h-10 w-full" />
      </div>

      <div className="space-y-1">
        <Skeleton className="h-3.5 w-16" />
        <Skeleton className="h-36 w-full" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <Skeleton className="h-3.5 w-16" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-1">
          <Skeleton className="h-3.5 w-14" />
          <Skeleton className="h-9 w-32" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <Skeleton className="h-3.5 w-14" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-1">
          <Skeleton className="h-3.5 w-10" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-1">
          <Skeleton className="h-3.5 w-12" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-1">
          <Skeleton className="h-3.5 w-14" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-1">
          <Skeleton className="h-3.5 w-16" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>

      <Skeleton className="h-10 w-32" />
    </div>
  );
}

function ProfilePage() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState(initialForm);
  const [pendingAvatar, setPendingAvatar] = useState<File | null>(null);
  const [pendingCv, setPendingCv] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showConfirm, setShowConfirm] = useState(false);

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: () => getProfile(),
  });

  useEffect(() => {
    if (profile) {
      setForm({
        fullName: profile.fullName ?? "",
        currentRole: profile.currentRole ?? "",
        currentRoles: (profile.currentRoles?.length
          ? profile.currentRoles
          : [""]) as string[],
        bioShort: profile.bioShort ?? "",
        bioLong: profile.bioLong ?? "",
        avatarUrl: profile.avatarUrl ?? "",
        cvUrl: profile.cvUrl ?? "",
        location: profile.location ?? "",
        email: profile.email ?? "",
        github: profile.github ?? "",
        linkedin: profile.linkedin ?? "",
        instagram: profile.instagram ?? "",
      });
    }
  }, [profile]);

  const updateMutation = useMutation({
    mutationFn: (data: Record<string, unknown>) => updateProfile({ data }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Profile saved");
    },
    onError: (err) =>
      toast.error(
        err instanceof Error
          ? err.message
          : typeof err === "string"
            ? err
            : JSON.stringify(err),
      ),
  });

  function updateRole(index: number, value: string) {
    const roles = [...form.currentRoles];
    roles[index] = value;
    setForm({ ...form, currentRoles: roles });
  }

  function addRole() {
    setForm({ ...form, currentRoles: [...form.currentRoles, ""] });
  }

  function removeRole(index: number) {
    const roles = form.currentRoles.filter((_, i) => i !== index);
    setForm({ ...form, currentRoles: roles.length ? roles : [""] });
  }

  async function uploadPending(url: string, file: File | null, bucket: string) {
    if (!file) return url;
    const path = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const { replaceFile } = await import('#/apis');
    
    const formData = new FormData();
    formData.append('bucket', bucket);
    formData.append('path', path);
    if (url) {
      const oldPath = url.split('/').pop();
      if (oldPath) formData.append('oldPath', oldPath);
    }
    formData.append('file', file);
    
    const result = await replaceFile({ data: formData });
    return result.url;
  }

  function clearError(field: string) {
    if (errors[field]) setErrors((prev) => { const next = { ...prev }; delete next[field]; return next })
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!form.fullName.trim()) errs.fullName = "Full name is required";
    if (!form.currentRole.trim()) errs.currentRole = "Current role is required";
    if (!form.currentRoles.filter((r) => r.trim()).length)
      errs.currentRoles = "At least one role is required";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setShowConfirm(true);
  }

  async function executeSave() {
    setShowConfirm(false);
    const avatarUrl = await uploadPending(
      form.avatarUrl,
      pendingAvatar,
      "avatars",
    );
    const cvUrl = await uploadPending(form.cvUrl, pendingCv, "cv");
    setPendingAvatar(null);
    setPendingCv(null);
    updateMutation.mutate({
      ...form,
      avatarUrl,
      cvUrl,
      currentRoles: form.currentRoles.filter((r) => r.trim()),
    });
  }

  if (isLoading)
    return (
      <div>
        <div className="mb-4 md:mb-6">
          <h1 className="text-lg font-bold text-(--sea-ink) md:text-2xl">
            Profile
          </h1>
          <p className="mt-1 text-xs text-(--sea-ink-soft) md:text-sm">
            Edit your public profile.
          </p>
        </div>
        <ProfileFormSkeleton />
      </div>
    );

  return (
    <div>
      <div className="mb-4 md:mb-6">
        <h1 className="text-lg font-bold text-(--sea-ink) md:text-2xl">
          Profile
        </h1>
        <p className="mt-1 text-xs text-(--sea-ink-soft) md:text-sm">
          Edit your public profile.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-4xl space-y-3 md:space-y-4"
      >
        <TextField
          label="Full Name"
          name="fullName"
          value={form.fullName}
          onChange={(v) => { setForm({ ...form, fullName: v }); clearError('fullName') }}
          error={errors.fullName}
        />

        <div className="space-y-2">
          <label className="text-xs font-medium md:text-sm">
            Roles (for typing animation)
          </label>
          {form.currentRoles.map((role, i) => (
            <div key={i} className="flex items-center gap-2">
              <Input
                value={role}
                onChange={(e) => { updateRole(i, e.target.value); clearError('currentRoles') }}
                placeholder="e.g. Full Stack Developer"
              />
              {form.currentRoles.length > 1 && (
                <Button
                  type="button"
                  size="xs"
                  variant="destructive"
                  onClick={() => removeRole(i)}
                >
                  X
                </Button>
              )}
            </div>
          ))}
          {errors.currentRoles && (
            <p className="text-[10px] text-destructive md:text-xs">
              {errors.currentRoles}
            </p>
          )}
          <Button type="button" size="xs" variant="outline" onClick={addRole}>
            + Add Role
          </Button>
        </div>

        <TextField
          label="Primary Role"
          name="currentRole"
          value={form.currentRole}
          onChange={(v) => { setForm({ ...form, currentRole: v }); clearError('currentRole') }}
          error={errors.currentRole}
        />
        <TextField
          label="Short Bio (max 280 chars)"
          name="bioShort"
          value={form.bioShort}
          onChange={(v) => setForm({ ...form, bioShort: v })}
        />
        <TextAreaField
          label="Long Bio"
          name="bioLong"
          value={form.bioLong}
          onChange={(v) => setForm({ ...form, bioLong: v })}
          rows={6}
        />
        <div className="grid gap-3 md:gap-4 sm:grid-cols-2">
          <FileUpload
            label="Avatar Image"
            value={form.avatarUrl}
            onChange={(url) => setForm({ ...form, avatarUrl: url })}
            accept="image/*"
            maxSizeMB={5}
            bucket="avatars"
            deferUpload
            pendingFile={pendingAvatar}
            onPendingFile={setPendingAvatar}
          />
          <FileUpload
            label="CV (PDF)"
            value={form.cvUrl}
            onChange={(url) => setForm({ ...form, cvUrl: url })}
            bucket="cv"
            deferUpload
            pendingFile={pendingCv}
            onPendingFile={setPendingCv}
          />
        </div>
        <div className="grid gap-3 md:gap-4 sm:grid-cols-2">
          <TextField
            label="Location"
            name="location"
            value={form.location}
            onChange={(v) => setForm({ ...form, location: v })}
          />
          <TextField
            label="Email"
            name="email"
            value={form.email}
            onChange={(v) => setForm({ ...form, email: v })}
          />
        </div>
        <div className="grid gap-3 md:gap-4 sm:grid-cols-3">
          <TextField
            label="GitHub"
            name="github"
            value={form.github}
            onChange={(v) => setForm({ ...form, github: v })}
          />
          <TextField
            label="LinkedIn"
            name="linkedin"
            value={form.linkedin}
            onChange={(v) => setForm({ ...form, linkedin: v })}
          />
          <TextField
            label="Instagram"
            name="instagram"
            value={form.instagram}
            onChange={(v) => setForm({ ...form, instagram: v })}
          />
        </div>
        <div className="flex items-center gap-4">
          <Button type="submit" disabled={updateMutation.isPending}>
            {updateMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>

      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent size="sm">
          <AlertDialogMedia>
            <TriangleAlert className="size-6 text-primary" />
          </AlertDialogMedia>
          <AlertDialogHeader>
            <AlertDialogTitle>Save Profile</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to save these changes?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowConfirm(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={executeSave}>Save</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
