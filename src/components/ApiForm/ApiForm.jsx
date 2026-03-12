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

    try {
      const result = await client[apiMethod](args);
      if (onSuccess) {
        onSuccess(result);
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
