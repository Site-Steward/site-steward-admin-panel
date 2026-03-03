import ApiForm from "../../ApiForm/ApiForm";

export default function SetPasswordForm({ onSetPassword }) {
  return (
    <ApiForm apiMethod="setPassword" onSuccess={onSetPassword}>
      <label>
        Verification Code:
        <input type="text" name="code" required />
        
      </label>
      <label>
        New Password:
        <input
          type="password"
          name="password"
          autoComplete="new-password"
          required
        />
      </label>
    </ApiForm>
  );
}
