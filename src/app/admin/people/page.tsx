"use client";

import { useState, useEffect } from "react";

type TeamMember = {
  id: string;
  name: string;
  role: string;
  photo: string | null;
  bio: string | null;
  linkedin: string | null;
  twitter: string | null;
  instagram: string | null;
};

export default function PeoplePage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<TeamMember | null>(null);
  const [form, setForm] = useState({ name: "", role: "", photo: "", bio: "", linkedin: "", twitter: "", instagram: "" });

  useEffect(() => {
    fetchMembers();
  }, []);

  async function fetchMembers() {
    const res = await fetch("/admin/api/crm/team-members");
    const data = await res.json();
    setMembers(data.members || []);
    setLoading(false);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const method = editing ? "PATCH" : "POST";
    const url = editing ? `/admin/api/crm/team-members/${editing.id}` : "/admin/api/crm/team-members";
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, photo: form.photo || null, bio: form.bio || null, linkedin: form.linkedin || null, twitter: form.twitter || null, instagram: form.instagram || null }),
    });
    setShowForm(false);
    setEditing(null);
    setForm({ name: "", role: "", photo: "", bio: "", linkedin: "", twitter: "", instagram: "" });
    fetchMembers();
  }

  async function onDelete(id: string) {
    if (!confirm("Remove this team member?")) return;
    await fetch(`/admin/api/crm/team-members/${id}`, { method: "DELETE" });
    fetchMembers();
  }

  function startEdit(member: TeamMember) {
    setEditing(member);
    setForm({ name: member.name, role: member.role, photo: member.photo || "", bio: member.bio || "", linkedin: member.linkedin || "", twitter: member.twitter || "", instagram: member.instagram || "" });
    setShowForm(true);
  }

  return (
    <div className="px-8 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">People</h1>
          <p className="mt-1 text-sm text-ink/50">Team members displayed on your website.</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditing(null); setForm({ name: "", role: "", photo: "", bio: "", linkedin: "", twitter: "", instagram: "" }); }}
          className="inline-flex items-center gap-2 rounded-[3px] bg-brand px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-brand-dark"
        >
          + Add Member
        </button>
      </div>

      {showForm && (
        <form onSubmit={onSubmit} className="mt-6 rounded-[3px] border border-line bg-white p-6">
          <h2 className="font-display text-lg font-semibold text-ink mb-4">{editing ? "Edit Member" : "Add Member"}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Name" required className="rounded-[3px] border border-line bg-white px-3 py-2.5 text-sm text-ink focus:outline-none focus:border-brand" />
            <input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="Role (e.g. Founder)" required className="rounded-[3px] border border-line bg-white px-3 py-2.5 text-sm text-ink focus:outline-none focus:border-brand" />
            <input value={form.photo} onChange={(e) => setForm({ ...form, photo: e.target.value })} placeholder="Photo URL" className="rounded-[3px] border border-line bg-white px-3 py-2.5 text-sm text-ink focus:outline-none focus:border-brand" />
            <input value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="Bio" className="rounded-[3px] border border-line bg-white px-3 py-2.5 text-sm text-ink focus:outline-none focus:border-brand" />
            <input value={form.linkedin} onChange={(e) => setForm({ ...form, linkedin: e.target.value })} placeholder="LinkedIn URL" className="rounded-[3px] border border-line bg-white px-3 py-2.5 text-sm text-ink focus:outline-none focus:border-brand" />
            <input value={form.twitter} onChange={(e) => setForm({ ...form, twitter: e.target.value })} placeholder="Twitter/X URL" className="rounded-[3px] border border-line bg-white px-3 py-2.5 text-sm text-ink focus:outline-none focus:border-brand" />
          </div>
          <div className="mt-4 flex gap-3">
            <button type="submit" className="rounded-[3px] bg-brand px-4 py-2.5 text-sm font-bold text-white hover:bg-brand-dark">
              {editing ? "Save Changes" : "Add Member"}
            </button>
            <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="rounded-[3px] border border-line bg-white px-4 py-2.5 text-sm font-bold text-ink hover:border-brand">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="mt-8">
        {loading ? (
          <p className="text-sm text-ink/50">Loading...</p>
        ) : members.length === 0 ? (
          <div className="rounded-[3px] border border-line bg-white p-12 text-center">
            <p className="text-sm text-ink/50">No team members yet. Add your first one.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {members.map((member) => (
              <div key={member.id} className="rounded-[3px] border border-line bg-white p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {member.photo ? (
                      <img src={member.photo} alt={member.name} className="w-12 h-12 rounded-full object-cover" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-mist flex items-center justify-center font-display text-lg font-semibold text-ink/40">
                        {member.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h3 className="font-display text-sm font-semibold text-ink">{member.name}</h3>
                      <p className="text-xs text-ink/50">{member.role}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => startEdit(member)} className="p-1.5 text-ink/40 hover:text-brand">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                      </svg>
                    </button>
                    <button onClick={() => onDelete(member.id)} className="p-1.5 text-ink/40 hover:text-red-600">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    </button>
                  </div>
                </div>
                {member.bio && <p className="mt-3 text-xs text-ink/60 line-clamp-2">{member.bio}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
