import React, { useState } from 'react';

const GameForm = ({ existingData, onSuccess }) => {
    const [formData, setFormData] = useState(existingData || {});

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`/api/game${formData._id ? '/' + formData._id : ''}`, {
                method: formData._id ? 'PATCH' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error('Failed to save data');
            const data = await response.json();
            alert(`Successfully ${formData._id ? 'updated' : 'created'} Game`);
            onSuccess(data);
        } catch (error) {
            console.error(error);
            alert('Error saving data');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>title: </label>
                <input
                    type="text"
                    name="title"
                    value={formData.title || ''}
                    onChange={handleChange}
                />
            </div>

            <div>
                <label>video: </label>
                <input
                    type="text"
                    name="video"
                    value={formData.video || ''}
                    onChange={handleChange}
                />
            </div>

            <div>
                <label>media_type: </label>
                <input
                    type="text"
                    name="media_type"
                    value={formData.media_type || ''}
                    onChange={handleChange}
                />
            </div>

            <div>
                <label>original_language: </label>
                <input
                    type="text"
                    name="original_language"
                    value={formData.original_language || ''}
                    onChange={handleChange}
                />
            </div>

            <div>
                <label>original_title: </label>
                <input
                    type="text"
                    name="original_title"
                    value={formData.original_title || ''}
                    onChange={handleChange}
                />
            </div>

            <div>
                <label>overview: </label>
                <input
                    type="text"
                    name="overview"
                    value={formData.overview || ''}
                    onChange={handleChange}
                />
            </div>

            <div>
                <label>popularity: </label>
                <input
                    type="number"
                    name="popularity"
                    value={formData.popularity || ''}
                    onChange={handleChange}
                />
            </div>

            <div>
                <label>poster_path: </label>
                <input
                    type="text"
                    name="poster_path"
                    value={formData.poster_path || ''}
                    onChange={handleChange}
                />
            </div>

            <div>
                <label>backdrop_path: </label>
                <input
                    type="text"
                    name="backdrop_path"
                    value={formData.backdrop_path || ''}
                    onChange={handleChange}
                />
            </div>

            <div>
                <label>vote_average: </label>
                <input
                    type="number"
                    name="vote_average"
                    value={formData.vote_average || ''}
                    onChange={handleChange}
                />
            </div>

            <div>
                <label>vote_count: </label>
                <input
                    type="number"
                    name="vote_count"
                    value={formData.vote_count || ''}
                    onChange={handleChange}
                />
            </div>

            <div>
                <label>date_played: </label>
                <input
                    type="text"
                    name="date_played"
                    value={formData.date_played || ''}
                    onChange={handleChange}
                />
            </div>

            <div>
                <label>home_score: </label>
                <input
                    type="number"
                    name="home_score"
                    value={formData.home_score || ''}
                    onChange={handleChange}
                />
            </div>

            <div>
                <label>away_score: </label>
                <input
                    type="number"
                    name="away_score"
                    value={formData.away_score || ''}
                    onChange={handleChange}
                />
            </div>

            <div>
                <label>played: </label>
                <input
                    type="text"
                    name="played"
                    value={formData.played || ''}
                    onChange={handleChange}
                />
            </div>

            <div>
                <label>home_team: </label>
                <input
                    type="text"
                    name="home_team"
                    value={formData.home_team || ''}
                    onChange={handleChange}
                />
            </div>

            <div>
                <label>away_team: </label>
                <input
                    type="text"
                    name="away_team"
                    value={formData.away_team || ''}
                    onChange={handleChange}
                />
            </div>

            <div>
                <label>genres: </label>
                <input
                    type="text"
                    name="genres"
                    value={formData.genres || ''}
                    onChange={handleChange}
                />
            </div>

            <div>
                <label>personnel: </label>
                <input
                    type="text"
                    name="personnel"
                    value={formData.personnel || ''}
                    onChange={handleChange}
                />
            </div>

            <button type="submit">{formData._id ? 'Update' : 'Create'}</button>
        </form>
    );
};

export default GameForm;
