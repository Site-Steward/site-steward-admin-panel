import ApiForm from "../../ApiForm/ApiForm.jsx";

export default function RequestResetForm({ onCodeSent }) {
  return (
    <ApiForm
      apiMethod="requestPasswordReset"
      onSuccess={(apiCall) => onCodeSent(apiCall.args.email)}>
      <label>
        Email:
        <input type="email" name="email" required />
      </label>
      <button type="submit">Request reset code</button>
    </ApiForm>
  );
}
