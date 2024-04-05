// Assuming 'use client' is part of your framework's requirement
'use client';
// Import necessary hooks and components
import React, { useState } from 'react';
import { SnackbarProvider, useSnackbar } from 'notistack';

interface FormData {
  name: string;
  address: string;
}

// Wrap your form component to inject the snackbar context
const WrappedFormComponent: React.FC = () => (
  <SnackbarProvider maxSnack={3}>
    <FormComponent />
  </SnackbarProvider>
);

// Form component that uses the useSnackbar hook
const FormComponent: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar(); // useSnackbar hook to show notifications
  const [formData, setFormData] = useState<FormData>({ name: '', address: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('https://mapbackend.vercel.app/api/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      console.log(data);
      enqueueSnackbar('Form submitted successfully!', { variant: 'success' });
      // Reset form data upon successful submission
      setFormData({ name: '', address: '' });
    } catch (error) {
      console.error('Error posting form data:', error);
      enqueueSnackbar('Error submitting form. Please try again.', { variant: 'error' });
    }
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4 bg-white p-8 shadow-lg rounded-lg">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 p-4 ">Name</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full p-4 rounded-md border-gray-900 text-black shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
        </div>
        
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
          <input type="text" id="address" name="address" value={formData.address} onChange={handleChange} className="mt-1 block w-full p-4 text-black rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
        </div>
        
        <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Submit
        </button>
      </form>
    </div>
  );
};

export default WrappedFormComponent; // Export the wrapped component instead
