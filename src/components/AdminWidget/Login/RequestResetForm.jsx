import { Input } from "../../ui/input.jsx";
import { Button } from "../../ui/button.jsx";
import { Label } from "../../ui/label.jsx";
import ApiForm from "../../ApiForm/ApiForm.jsx";

export default function RequestResetForm({ onCodeSent }) {
  return (
    <ApiForm
      apiMethod="requestPasswordReset"
      onSuccess={(apiCall) => onCodeSent(apiCall.args.email)}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="reset-email">Email</Label>
          <Input
            id="reset-email"
            type="email"
            name="email"
            placeholder="Enter your email"
            required
          />
        </div>
        <Button type="submit" className="w-full">
          Request reset code
        </Button>
      </div>
    </ApiForm>
  );
}
