import React, { useState } from 'react';

const GenreForm = ({ existingData, onSuccess }) => {
    const [formData, setFormData] = useState(existingData || {});

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`/api/genre${formData._id ? '/' + formData._id : ''}`, {
                method: formData._id ? 'PATCH' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error('Failed to save data');
            const data = await response.json();
            alert(`Successfully ${formData._id ? 'updated' : 'created'} Genre`);
            onSuccess(data);
        } catch (error) {
            console.error(error);
            alert('Error saving data');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>name: </label>
                <input
                    type="text"
                    name="name"
                    value={formData.name || ''}
                    onChange={handleChange}
                />
            </div>

            <button type="submit">{formData._id ? 'Update' : 'Create'}</button>
        </form>
    );
};

export default GenreForm;
