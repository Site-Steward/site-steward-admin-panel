import client from "../../util/siteStewardApiClient";
import "./ApiForm.css";

export default function ApiForm({
  children,
  apiMethod,
  onSuccess,
  extraArgs = {},
}) {
  const submit = async (formData) => {
    const args = { ...Object.fromEntries(formData), ...extraArgs };
    const result = await client[apiMethod](args);
    if (onSuccess) {
      onSuccess(result);
    }
  };

  return (
    <form className="api-form" action={submit}>
      {children /* expect one input per arg passed to apiMethod */}
    </form>
  );
}
