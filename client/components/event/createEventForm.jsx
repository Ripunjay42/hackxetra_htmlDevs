"use client"

import axios from 'axios';
import { useState } from 'react';

const CreateEventForm = () => {
    const [formData, setFormData] = useState({
        eventname: '',
        location: '',
        eventdate: '',
        startingtime: '',
        endingtime: '',
        description: '',
        poster: null,
    });

    const [isSuccess, setIsSuccess] = useState(false); // To show success message

    // Handle change for input fields
    const handleChange = (e) => {
        const { name, value, type, files } = e.target;

        if (type === 'file') {
            setFormData({
                ...formData,
                [name]: files[0], // Store the selected file
            });
        } else {
            setFormData({
                ...formData,
                [name]: value, // Store the input value
            });
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent the default form submission

        const userId = localStorage.getItem('userId');
        if (!userId) {
            console.error('User not authenticated');
            return;
        }

        // Create a new FormData object to handle file uploads
        const formDataToSend = new FormData();
        for (const key in formData) {
            formDataToSend.append(key, formData[key]);
        }

        try {
            // Send form data to the server using axios POST request
            const response = await axios.post("http://localhost:3001/api/event/", formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Set content type for file uploads
                    'userid': userId, // Ensure the correct header key
                },
            });

            // Handle the response (e.g., show success message)
            console.log(response.data);
            setIsSuccess(true); // Set success state to show success message
        } catch (error) {
            console.error('Error submitting event:', error);
        }
    };

    return (
        <div className="container flex items-center justify-center w-[500px] my-10 shadow-[0_4px_20px_rgba(0,0,0,0.4)] rounded-lg p-6">
            <form onSubmit={handleSubmit}>
                <div className="form-element flex flex-col space-y-1.5">
                    <div><label>Event Name</label></div>
                    <div className="form-control">
                        <input
                            type="text"
                            className="border border-black w-[300px] p-2 box-border"
                            name="eventname"
                            value={formData.eventname}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div className="form-element flex flex-col space-y-1.5">
                    <div><label>Location</label></div>
                    <div className="form-control">
                        <input
                            type="text"
                            className="border border-black w-[300px] p-2 box-border"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div className="form-element flex flex-col space-y-1.5">
                    <div><label>Date of Event</label></div>
                    <div className="form-control">
                        <input
                            type="date"
                            className="border border-black w-[300px] p-2 box-border"
                            name="eventdate"
                            value={formData.eventdate}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div className="form-element flex flex-col space-y-1.5">
                    <div><label>Time-from</label></div>
                    <div className="form-control">
                        <input
                            type="time"
                            className="border border-black w-[300px] p-2 box-border"
                            name="startingtime"
                            value={formData.startingtime}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div className="form-element flex flex-col space-y-1.5">
                    <div><label>Time-to</label></div>
                    <div className="form-control">
                        <input
                            type="time"
                            className="border border-black w-[300px] p-2 box-border"
                            name="endingtime"
                            value={formData.endingtime}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div className="form-element flex flex-col space-y-1.5">
                    <div><label>Description of Event</label></div>
                    <div className="form-control">
                        <input
                            type="text"
                            className="border border-black w-[300px] p-2 box-border"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div className="form-element flex flex-col space-y-1.5">
                    <div><label>Upload Image</label></div>
                    <div className="form-control">
                        <input
                            type="file"
                            className="border border-black w-[300px] p-2 box-border"
                            name="poster"
                            onChange={handleChange}
                        />
                    </div>
                </div>
                {/* Success message */}
                {isSuccess && <div className="mt-4 text-green-500">Event created successfully!</div>}
                {/* Add a submit button */}
                <div className="form-element mt-4">
                    <button type="submit" className="px-6 py-3 bg-blue-500 text-white rounded">
                        Create Event
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateEventForm;
