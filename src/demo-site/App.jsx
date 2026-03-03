import { useState } from "react";
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
import "./App.css";

function App() {
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
    <div className="mx-auto max-w-xl space-y-4 py-10 text-center">
      <h1 className="text-3xl font-semibold tracking-tight">
        shadcn/ui dialog form example
      </h1>

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
    </div>
  );
}

export default App;
