import { Input } from "../../ui/input.jsx";
import { Button } from "../../ui/button.jsx";
import { Label } from "../../ui/label.jsx";
import ApiForm from "../../ApiForm/ApiForm";

export default function VerifyCredentialsForm({ onVerified }) {
  return (
    <ApiForm apiMethod="loginWithPassword" onSuccess={onVerified}>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            name="email"
            autoComplete="username"
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            name="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            required
          />
        </div>
        <Button type="submit" className="w-full">
          Login
        </Button>
      </div>
    </ApiForm>
  );
}
