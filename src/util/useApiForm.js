import { useState } from 'react';

export default function useApiForm(initialValues = {}) {
  const [values, setValues] = useState(initialValues);
  const [pending, setPending] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prevValues) => ({ ...prevValues, [name]: value }));
  };

  const handleSubmit = async (event, onSubmit) => {
    event.preventDefault();
    setPending(true);
    try {
      await onSubmit(values);
    } finally {
      setPending(false);
    }
  };

  return { values, handleChange, handleSubmit, pending };
}