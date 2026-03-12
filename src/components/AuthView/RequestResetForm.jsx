import ApiForm from "../ApiForm/ApiForm.jsx";

export default function RequestResetForm({ onCodeSent, onCancel }) {
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
        <div className="button-row">
          <button className="ui" type="submit">
            Request reset code
          </button>
          <button
            className="ui secondary"
            onClick={onCancel}
            type="button"
          >
            Back to login
          </button>
        </div>
      </div>
    </ApiForm>
  );
}
