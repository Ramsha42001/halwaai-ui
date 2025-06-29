"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ModalConfig } from "@/app/types/modal";
import modalService from "@/services/api/modalService";
import { useState } from "react";

interface EditModalFormProps {
  data: ModalConfig;
  onClose: () => void;
  onSubmit: (updatedData: Partial<ModalConfig>) => Promise<void>;
}

export function EditModalForm({ data, onClose, onSubmit }: EditModalFormProps) {
  const [editData, setEditData] = useState<ModalConfig>(data);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit(editData);
      onClose();
    } catch (error: any) {
      console.error('Error updating modal:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={editData.title}
          onChange={(e) => setEditData({ ...editData, title: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          value={editData.description}
          onChange={(e) => setEditData({ ...editData, description: e.target.value })}
          className="min-h-[100px]"
        />
      </div>

      <div className="space-y-2 bg-[#fff5f5] text-black">
        <Label htmlFor="buttonText">Button Text</Label>
        <Input
          id="buttonText"
          value={editData.ButtonText}
          onChange={(e) => setEditData({ ...editData, ButtonText: e.target.value })}
        />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="showOnLoad">Show on Page Load</Label>
        <Switch
          id="showOnLoad"
          checked={editData.showOnLoad}
          onCheckedChange={(checked) => setEditData({ ...editData, showOnLoad: checked })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="delay">Delay (milliseconds)</Label>
        <Input
          id="delay"
          type="number"
          value={editData.delay}
          onChange={(e) => setEditData({ ...editData, delay: Number(e.target.value) })}
        />
      </div>

      <Button type="submit" className="w-full bg-[#fff5f5] text-black">
        Save Changes
      </Button>
    </form>
  );
}