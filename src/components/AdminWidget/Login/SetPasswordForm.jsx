import { Input } from "../../ui/input.jsx";
import { Button } from "../../ui/button.jsx";
import { Label } from "../../ui/label.jsx";
import ApiForm from "../../ApiForm/ApiForm";

export default function SetPasswordForm({ onSetPassword }) {
  return (
    <ApiForm apiMethod="setPassword" onSuccess={onSetPassword}>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="code">Verification Code</Label>
          <Input
            id="code"
            type="text"
            name="code"
            placeholder="Enter the verification code"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="new-password">New Password</Label>
          <Input
            id="new-password"
            type="password"
            name="password"
            autoComplete="new-password"
            placeholder="Enter your new password"
            required
          />
        </div>
        <Button type="submit" className="w-full">
          Set Password
        </Button>
      </div>
    </ApiForm>
  );
}
