import client from "../../util/siteStewardApiClient";

export default function ApiForm({ children, apiMethod, onSuccess, extraArgs }) {
  const submit = async (formData) => {
    const args = { ...Object.fromEntries(formData), ...extraArgs };
    const result = await client[apiMethod](args);
    if (onSuccess) {
      onSuccess({args, result});
    }
  };

  return (
    <form action={submit}>
      {children /* expect one input per arg passed to apiMethod */}
    </form>
  );
}
