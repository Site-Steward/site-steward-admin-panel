import { useState } from "react";
import { NavLink, Route, Routes } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { AdminWidget } from "..";

function HomePage() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [savedProfile, setSavedProfile] = useState(null);

  function updateField(event) {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  }

  function submitForm(event) {
    event.preventDefault();
    setSavedProfile(formData);
    setOpen(false);
  }

  return (
    <section className="space-y-4 text-center">
      <h1 className="text-3xl font-semibold tracking-tight">Home</h1>
      <p className="text-zinc-600">Dialog + form demo page.</p>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>Edit profile</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Update your profile information and save your changes.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={submitForm} className="space-y-4">
            <div className="grid gap-2 text-left">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={updateField}
                placeholder="Ada Lovelace"
              />
            </div>
            <div className="grid gap-2 text-left">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={updateField}
                placeholder="ada@example.com"
              />
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {savedProfile && (
        <div className="rounded-md border border-zinc-200 bg-zinc-50 p-4 text-left text-sm">
          <p className="font-medium">Saved profile</p>
          <p>Name: {savedProfile.name || "-"}</p>
          <p>Email: {savedProfile.email || "-"}</p>
        </div>
      )}
    </section>
  );
}

function TasksPage() {
  return (
    <section className="space-y-3 text-left">
      <h1 className="text-3xl font-semibold tracking-tight">Tasks</h1>
      <p className="text-zinc-600">Dummy task listing page.</p>
      <div className="rounded-md border border-zinc-200 p-4">
        <ul className="list-disc space-y-1 pl-5 text-sm">
          <li>Review inbound assets</li>
          <li>Approve site update draft</li>
          <li>Schedule deployment window</li>
        </ul>
      </div>
    </section>
  );
}

function SettingsPage() {
  return (
    <section className="space-y-3 text-left">
      <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>
      <p className="text-zinc-600">Dummy settings page.</p>
      <div className="rounded-md border border-zinc-200 p-4 text-sm">
        Notifications: Enabled
      </div>
    </section>
  );
}

function NotFoundPage() {
  return (
    <section className="space-y-2 text-center">
      <h1 className="text-3xl font-semibold tracking-tight">Page not found</h1>
      <p className="text-zinc-600">Try one of the navigation links above.</p>
    </section>
  );
}

function App() {
  const links = [
    { to: "/", label: "Home" },
    { to: "/tasks", label: "Tasks" },
    { to: "/settings", label: "Settings" },
  ];

  return (
    <div className="mx-auto max-w-3xl space-y-8 py-8">
      <header className="flex items-center justify-between rounded-md border border-zinc-200 px-4 py-3">
        <p className="font-semibold">Demo Site</p>
        <nav className="flex items-center gap-2">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                [
                  "rounded-md px-3 py-1.5 text-sm",
                  isActive
                    ? "bg-zinc-900 text-zinc-50"
                    : "border border-zinc-200 text-zinc-700 hover:bg-zinc-100",
                ].join(" ")
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFoundPage />} />
          <Route path="/admin" element={<AdminWidget />} />
        </Routes>
        <AdminWidget />
      </main>

     

    </div>
  );
}

export default App;
