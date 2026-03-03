import ApiForm from "../../ApiForm/ApiForm";

export default function VerifyCredentialsForm({ onVerified }) {
  return (
    <ApiForm apiMethod="loginWithPassword" onSuccess={onVerified}>
      <label>
        Email:
        <input type="email" name="email" autoComplete="username" required />
      </label>
      <label>
        Password:
        <input
          type="password"
          name="password"
          autoComplete="current-password"
          required
        />
      </label>
    </ApiForm>
  );
}
