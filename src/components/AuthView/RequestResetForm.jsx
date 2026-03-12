import ApiForm from "../ApiForm/ApiForm.jsx";

export default function RequestResetForm({ onCodeSent }) {
  return (
    <ApiForm
      apiMethod="requestPasswordReset"
      onSuccess={(apiCall) => onCodeSent(apiCall.args.email)}
    >
      <div>
        <div>
          <label htmlFor="reset-email">Email</label>
          <input
            id="reset-email"
            type="email"
            name="email"
            placeholder="Enter your email"
            required
          />
        </div>
        <button className="ui" type="submit">Request reset code</button>
      </div>
    </ApiForm>
  );
}
