"use client";

import { useAuthGuard } from "@/hooks/use-auth-guard";

export default function ProfilePage() {
  const { user, initialized } = useAuthGuard();

  if (!initialized) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return null;
  }

  return (
    <section className="space-y-3 rounded-xl border border-slate-200 bg-white p-6">
      <h1 className="text-2xl font-semibold">Profile</h1>
      <p>
        <span className="font-medium">Email:</span> {user.email}
      </p>
      <p>
        <span className="font-medium">Role:</span> {user.role}
      </p>
      <p>
        <span className="font-medium">Joined:</span> {new Date(user.createdAt).toLocaleDateString()}
      </p>
    </section>
  );
}
