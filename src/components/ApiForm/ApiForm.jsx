import client from "../../util/siteStewardApiClient";
import "./ApiForm.css";

export default function ApiForm({
  children,
  apiMethod,
  onSuccess,
  onError,
  extraArgs = {},
}) {
  const submit = async (formData) => {
    const args = { ...Object.fromEntries(formData), ...extraArgs };
    const callData = { apiMethod, args };
    try {
      callData.result = await client[apiMethod](args);
      if (onSuccess) {
        onSuccess(callData);
      }
    } catch (error) {
      onError?.(error);
      console.warn(`API call ${apiMethod} failed`, error);
    }
  };

  return (
    <form className="api-form" action={submit}>
      {children /* expect one input per arg passed to apiMethod */}
    </form>
  );
}
