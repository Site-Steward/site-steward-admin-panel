import ApiForm from "../ApiForm/ApiForm.jsx";

export default function VerifyCredentialsForm({ onVerified }) {
  return (
    <ApiForm apiMethod="loginWithPassword" onSuccess={onVerified}>
      <div>
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            autoComplete="username"
            placeholder="Enter your email"
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            required
          />
        </div>
        <button className="ui" type="submit">Login</button>
      </div>
    </ApiForm>
  );
}
