"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Pencil } from "lucide-react";
import { ModalConfig } from "@/app/types/modal";
import { useState } from "react";
import { CustomPopup } from "@/components/popup";
import modalService from "@/services/api/modalService"; 
import { EditModalForm } from "./editModal";

export default function ModalCard({
  _id, // Assuming there's an id for the modal to update
  title,
  description,
  showOnLoad,
  delay,
  buttonText,
}: ModalConfig) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editData, setEditData] = useState<ModalConfig>({ 
    _id, 
    title, 
    description, 
    showOnLoad, 
    delay, 
    buttonText 
  });

  const handleEditSubmit = async (updatedData: Partial<ModalConfig>) => {
    try {
      await modalService.updateModal(editData._id, updatedData);
      setIsEditOpen(false);
    } catch (error: unknown) {
      console.error('Error updating modal:', error);
      if (error && typeof error === 'object' && 'response' in error) {
        console.error('Response data:', (error as any).response.data);
      }
    }
  };

  return (
    <Card className={"border-2 border-gray-200"}>
      <CardContent className="pt-6">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Show on Load:</span>
            <span className="font-medium">{showOnLoad ? "Yes" : "No"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Delay:</span>
            <span className="font-medium">{delay}ms</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Button Text:</span>
            <span className="font-medium">{buttonText}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="justify-end space-x-2">
        <Button onClick={() => setIsPreviewOpen(true)} variant="outline" size="sm">
          <Eye className="w-4 h-4 mr-2" />
          Preview
        </Button>

        <Button onClick={() => {
          setEditData({ 
            _id, 
            title, 
            description, 
            showOnLoad, 
            delay, 
            buttonText 
          }); 
          setIsEditOpen(true);
        }} variant="outline" size="sm">
          <Pencil className="w-4 h-4 mr-2" />
          Edit
        </Button>
        <CustomPopup
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          title="Edit Modal"
          showCloseButton={false}
          className="bg-[#fff5f5] text-black"
        >
          <EditModalForm 
            data={editData}
            onClose={() => setIsEditOpen(false)}
            onSubmit={handleEditSubmit} 
          />
        </CustomPopup>
        <CustomPopup
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          title="Preview Modal"
          showCloseButton={true}
          className="bg-[#f0f0f0] text-black"
        >
          <h3 className="text-xl font-semibold mb-2">{title}</h3>
          <p className="text-gray-600 mb-4">{description}</p>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Show on Load:</span>
              <span className="font-medium">{showOnLoad ? "Yes" : "No"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Delay:</span>
              <span className="font-medium">{delay}ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Button Text:</span>
              <span className="font-medium">{buttonText}</span>
            </div>
          </div>
        </CustomPopup>
      </CardFooter>
    </Card>
  );
}