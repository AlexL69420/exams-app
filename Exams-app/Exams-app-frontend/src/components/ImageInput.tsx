"use client";
import { FileInput, Label } from "flowbite-react";

interface ImageInputProps {
  onImageChange: (url: string) => void; // Callback to send the processed image URL to the parent
}

export function ImageInput({ onImageChange }: ImageInputProps) {
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const url = URL.createObjectURL(file); // Create a temporary URL for the file
      const img = new Image();
      img.src = url;
      img.crossOrigin = "anonymous"; // Allow cross-origin images

      // Wait for the image to load
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      // Create a canvas for cropping
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // Determine the size for cropping
      const size = Math.min(img.width, img.height); // Take the smallest side
      canvas.width = size;
      canvas.height = size;

      // Crop the image to a square
      ctx?.drawImage(
        img,
        (img.width - size) / 2, // X offset
        (img.height - size) / 2, // Y offset
        size,
        size,
        0,
        0,
        size,
        size,
      );

      // Convert the canvas to a Data URL
      const processedImageUrl = canvas.toDataURL("image/png");

      // Send the processed image URL back to the parent
      onImageChange(processedImageUrl);
    } catch (error) {
      console.error("Error processing image:", error);
      alert("Failed to load or process the image.");
    }
  };

  return (
    <div className="flex w-full items-center justify-center">
      <Label
        htmlFor="dropzone-file"
        className="flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
      >
        <div className="flex flex-col items-center justify-center pb-6 pt-5">
          <svg
            className="mb-4 size-8 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 16"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
            />
          </svg>
          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="font-semibold">Click to upload</span> or drag and
            drop
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            SVG, PNG, JPG or GIF
          </p>
        </div>
        <FileInput
          id="dropzone-file"
          className="hidden"
          onChange={handleFileChange} // Handle file input changes
        />
      </Label>
    </div>
  );
}
