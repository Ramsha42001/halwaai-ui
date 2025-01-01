"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ModalConfig } from "@/app/types/modal";

interface EditModalFormProps {
  data: ModalConfig;
  onClose: () => void;
}

export function EditModalForm({ data, onClose }: EditModalFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" defaultValue={data.title} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Content</Label>
        <Textarea 
          id="content" 
          defaultValue={data.description}
          className="min-h-[100px]"
        />
      </div>

      <div className="space-y-2 bg-[#fff5f5] text-black">
        <Label htmlFor="buttonText">Button Text</Label>
        <Input id="buttonText" defaultValue={data.buttonText} />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="showOnLoad">Show on Page Load</Label>
        <Switch 
          id="showOnLoad" 
          defaultChecked={data.showOnLoad}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="delay">Delay (milliseconds)</Label>
        <Input 
          id="delay" 
          type="number" 
          defaultValue={data.delay}
        />
      </div>

      <Button type="submit" className="w-full bg-[#fff5f5] text-black">
        Save Changes
      </Button>
    </form>
  );
}