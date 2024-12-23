"use client"

import { ChangeEvent, useState } from "react"
import { Button } from "@/components/ui/button"


interface ImageUploadProps {
  onChange: (file: File | null) => void
  value?: File | null
}

export function ImageUpload({ onChange, value }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null)

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onChange(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      // Handle the case where the user cancels file selection
      onChange(null);
      setPreview(null);
    }
  }

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 w-full">
        <input
          type="file"
          id="file-upload"
          className="hidden" // Hide the default file input visually
          onChange={handleFileChange}
          accept="image/*" // Optionally restrict to image files
        />
        <Button
          type="button"
          variant="outline"
          className="bg-white"
          onClick={() => document.getElementById('file-upload')?.click()} // Trigger the hidden file input
        >
          Choose File
        </Button>
        <span className="text-sm text-gray-500">
          {value?.name || preview ? "File chosen" : "No File Chosen"}
        </span>
      </div>

      {preview && (
        <div className="mt-4">
          <img src={preview} alt="Preview" className="max-h-40" />
        </div>
      )}

    </div>
  )
}

