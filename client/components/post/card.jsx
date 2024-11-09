import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export function CardWithForm() {
  const [state, setState] = useState({ title: "", description: "" });
  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", state.title);
    formData.append("description", state.description);
    if (file) {
      formData.append("file", file);
    }

    try {
      const response = await fetch("http://localhost:3002/api/post/create", {
        method: "POST",
        headers: { authtoken: "123456789" },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to create post");
      }

      const result = await response.json();
      console.log("Post created successfully:", result);

      setState({ title: "", description: "" });
      setFile(null);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <Card className="w-[350px] border border-black">
      <CardHeader>
        <CardTitle>Create Post</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={state.title}
                onChange={handleChange}
                className="border border-black"
                placeholder="Name of your project"
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                value={state.description}
                onChange={handleChange}
                className="border border-black"
                placeholder="Brief description of the project"
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="file">Upload File</Label>
              <input
                type="file"
                id="file"
                name="file" // Ensure this matches what the backend expects
                onChange={handleFileChange}
                className="border border-black"
              />
            </div>
          </div>
          <CardFooter className="flex justify-between mt-4">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Create
            </button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}

export default CardWithForm;
