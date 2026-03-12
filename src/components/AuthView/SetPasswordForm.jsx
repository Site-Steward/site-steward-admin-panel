import ApiForm from "../ApiForm/ApiForm.jsx";

export default function SetPasswordForm({ email, onSetPassword }) {
  return (
    <ApiForm
      apiMethod="setPassword"
      onSuccess={onSetPassword}
      extraArgs={{ email }}
    >
      <div>
        <div>
          <label htmlFor="code">Verification Code</label>
          <input
            id="code"
            type="text"
            name="code"
            placeholder="Enter the verification code"
            required
          />
        </div>
        <div>
          <label htmlFor="new-password">New Password</label>
          <input
            id="new-password"
            type="password"
            name="password"
            autoComplete="new-password"
            placeholder="Enter your new password"
            required
          />
        </div>
        <button className="ui" type="submit">Set Password</button>
      </div>
    </ApiForm>
  );
}
