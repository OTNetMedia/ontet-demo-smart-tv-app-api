import React, { useState } from 'react';

const PersonnelForm = ({ existingData, onSuccess }) => {
    const [formData, setFormData] = useState(existingData || {});

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(
                `/api/personnel${formData._id ? '/' + formData._id : ''}`,
                {
                    method: formData._id ? 'PATCH' : 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                }
            );

            if (!response.ok) throw new Error('Failed to save data');
            const data = await response.json();
            alert(`Successfully ${formData._id ? 'updated' : 'created'} Personnel`);
            onSuccess(data);
        } catch (error) {
            console.error(error);
            alert('Error saving data');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>first_name: </label>
                <input
                    type="text"
                    name="first_name"
                    value={formData.first_name || ''}
                    onChange={handleChange}
                />
            </div>

            <div>
                <label>last_name: </label>
                <input
                    type="text"
                    name="last_name"
                    value={formData.last_name || ''}
                    onChange={handleChange}
                />
            </div>

            <div>
                <label>role: </label>
                <input
                    type="text"
                    name="role"
                    value={formData.role || ''}
                    onChange={handleChange}
                />
            </div>

            <div>
                <label>team: </label>
                <input
                    type="text"
                    name="team"
                    value={formData.team || ''}
                    onChange={handleChange}
                />
            </div>

            <button type="submit">{formData._id ? 'Update' : 'Create'}</button>
        </form>
    );
};

export default PersonnelForm;
