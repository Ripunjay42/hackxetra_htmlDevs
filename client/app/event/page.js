"use client";
import React, { useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Calendar,
  Clock,
  MapPin,
  Upload,
  Type,
  List,
  PlusCircle,
} from "lucide-react";

const CreateEventForm = () => {
  const [showEvents, setShowEvents] = useState(false);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    eventname: "",
    location: "",
    eventdate: "",
    startingtime: "",
    endingtime: "",
    description: "",
    poster: null,
  });
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const [isRsbped, setRbped] = useState(true);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const userId = localStorage.getItem("userID");
      if (!userId) {
        throw new Error("User not authenticated");
      }

      const response = await axios.get("http://localhost:3001/api/event/", {
        headers: { userid: userId },
      });
      setEvents(response.data.events);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleView = () => {
    if (!showEvents) {
      fetchEvents();
    }
    setShowEvents(!showEvents);
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      const file = files[0];
      setFormData((prev) => ({
        ...prev,
        [name]: file,
      }));

      // Create preview URL for the selected image
      if (file) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Clean up preview URL when component unmounts
  React.useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSuccess(false);

    const userId = localStorage.getItem("userID");
    if (!userId) {
      setError("User not authenticated");
      return;
    }

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });

    try {
      await axios.post("http://localhost:3001/api/event/", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
          userid: userId,
        },
      });
      setIsSuccess(true);
      setFormData({
        eventname: "",
        location: "",
        eventdate: "",
        startingtime: "",
        endingtime: "",
        description: "",
        poster: null,
      });
      setPreviewUrl(null);
      if (showEvents) {
        fetchEvents();
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRsvp = async (eventId) => {
    const userId = localStorage.getItem('userID');
    if (!userId) {
        setError('User not authenticated');
        return;
    }

    try {
        const response = await axios.post("http://localhost:3001/api/rsbp",
            { eventId: eventId },  // Request body
            {
                headers: {
                    'Content-Type': 'application/json',
                    'userid': userId,
                },
            }
        );

        console.log(response.data);
        if (response.data.message === "RSVP created successfully") {
            setRbped(false);
        }
        // You might want to show a success message to the user
        setIsSuccess(true);
    } catch (error) {
        console.error('Error submitting RSVP:', error);
        setError(error.message);
    }
};

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Event Management</h1>
          <Button
            onClick={handleToggleView}
            className="flex items-center gap-2"
            variant="outline"
          >
            {showEvents ? (
              <>
                <PlusCircle className="w-4 h-4" />
                Create New Event
              </>
            ) : (
              <>
                <List className="w-4 h-4" />
                View All Events
              </>
            )}
          </Button>
        </div>

        {showEvents ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full text-center py-12">
                Loading events...
              </div>
            ) : events.length > 0 ? (
              events.map((event) => (
                <Card
                  key={event.id}
                  className="hover:shadow-lg transition-shadow duration-300"
                >
                  <CardHeader>
                    <CardTitle className="text-xl font-bold">
                      {event.eventName}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {new Date(event.date).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {event.eventImageURL ? (
                        <img
                          src={"http://localhost:3001" + event.eventImageURL}
                          alt={"http://localhost:3001" + event.eventImageURL}
                          className="w-full h-48 object-cover rounded-md"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gray-200 rounded-md flex items-center justify-center">
                          No image available
                        </div>
                      )}
                      <p className="text-gray-600">{event.description}</p>
                      <div className="flex items-center gap-2 text-gray-500">
                        <MapPin className="w-4 h-4" />
                        {event.location}
                      </div>
                      <div className="flex items-center gap-2 text-gray-500">
                        <Clock className="w-4 h-4" />
                        {event.fromTime?.slice(0, 5)} -{" "}
                        {event.toTime?.slice(0, 5)}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="text-sm text-gray-500">
                    Created: {new Date(event.createdAt).toLocaleDateString()}
                  </CardFooter>
                  {isRsbped && (
                    <Button onClick={() => handleRsvp(event.id)}>RSVP</Button>
                  )}
                   {!isRsbped && (
                    <Button className="opacity-50 cursor-not-allowed" disabled>
                    RSVPED
                  </Button>
                  
                  )}
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                No events found
              </div>
            )}
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Create New Event</CardTitle>
              <CardDescription>
                Fill in the details to create your event
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Type className="w-4 h-4" />
                    <Label htmlFor="eventname">Event Name</Label>
                  </div>
                  <Input
                    id="eventname"
                    name="eventname"
                    value={formData.eventname}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <Label htmlFor="location">Location</Label>
                  </div>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <Label htmlFor="eventdate">Date</Label>
                    </div>
                    <Input
                      type="date"
                      id="eventdate"
                      name="eventdate"
                      value={formData.eventdate}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <Label htmlFor="startingtime">Start Time</Label>
                    </div>
                    <Input
                      type="time"
                      id="startingtime"
                      name="startingtime"
                      value={formData.startingtime}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <Label htmlFor="endingtime">End Time</Label>
                    </div>
                    <Input
                      type="time"
                      id="endingtime"
                      name="endingtime"
                      value={formData.endingtime}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="h-32"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    <Label htmlFor="poster">Event Poster</Label>
                  </div>
                  <Input
                    type="file"
                    id="poster"
                    name="poster"
                    onChange={handleChange}
                    accept="image/*"
                    required
                  />
                  {previewUrl && (
                    <div className="mt-2">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full max-h-48 object-cover rounded-md"
                      />
                    </div>
                  )}
                </div>

                {isSuccess && (
                  <Alert className="bg-green-50 border-green-200">
                    <AlertDescription className="text-green-600">
                      Event created successfully!
                    </AlertDescription>
                  </Alert>
                )}

                {error && (
                  <Alert className="bg-red-50 border-red-200">
                    <AlertDescription className="text-red-600">
                      Error: {error}
                    </AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full">
                  Create Event
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CreateEventForm;
