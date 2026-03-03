import client from "../../util/siteStewardApiClient";

export default function ApiForm({
  children,
  apiMethod,
  onSuccess }) {
  
  const submit = async (event) => {
    const formData = new FormData(event.target);
    const args = Object.fromEntries(formData);
    const result = await client[apiMethod](args);
    if (onSuccess) {
      onSuccess(result);
    }
  };

  return (
    <form action={submit}>
      {children /* expect one input per arg passed to apiMethod */}
      <button type="submit">Submit</button>
    </form>
  );
}
