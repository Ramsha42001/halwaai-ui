"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ModalCard from "@/components/modalCard/page";
import modalService from "@/services/api/modalService";
import { useState, useEffect } from "react";

interface IModal {
  title: string; // Changed 'name' to 'title'
  description: string;
  showOnLoad: boolean;
  delay: number;
  ButtonText: string;
}

export default function Home() {
  const [modalData, setModalData] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newModal, setNewModal] = useState<IModal>({
    title: '', // Changed 'name' to 'title'
    description: '',
    showOnLoad: false,
    delay: 0,
    ButtonText: ''
  });

  useEffect(() => {
    const fetchModalData = async () => {
      try {
        const response = await modalService.getModal();
        setModalData(response);
        console.log(response);
      } catch (error) {
        console.error('Error fetching modal data:', error);
      }
    };
    fetchModalData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target;
    setNewModal(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await modalService.createModal(newModal);
      setNewModal({ title: '', description: '', showOnLoad: false, delay: 0, ButtonText: '' }); // Changed 'name' to 'title'
      const response = await modalService.getModal();
      setModalData(response);
    } catch (error) {
      console.error('Error creating modal:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#fff5f5] text-[black] flex-column mt-[70px] pb-[10%] sm:pb-[10%] lg:pb-[3%]">
      <main className="container mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-6 w-full">Modal Management</h1>
          <div className="flex gap-4">
            <Tabs defaultValue="existing" className="w-full">
              <TabsList className="flex gap-4 justify-between bg-[#FBEDE9]">
                <TabsTrigger className="w-auto h-[30px]" value="existing">Existing Models</TabsTrigger>
                <TabsTrigger className="text-black w-auto h-[30px]" value="new" onClick={() => setIsAddModalOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Model
                </TabsTrigger>
              </TabsList>
              <TabsContent value="existing">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  {modalData.map((modal, index) => (
                    <ModalCard key={index} {...modal} />
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="new">
                <div className="mt-6 w-auto p-6 border rounded-lg shadow-lg bg-white">
                  <h2 className="text-xl font-semibold mb-4">Create New Modal</h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <input 
                      type="text" 
                      name="title" // Changed 'name' to 'title'
                      placeholder="Title" // Changed placeholder to 'Title'
                      value={newModal.title} // Changed 'name' to 'title'
                      onChange={handleInputChange} 
                      required 
                      className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <textarea 
                      name="description" 
                      placeholder="Description" 
                      value={newModal.description} 
                      onChange={handleInputChange} 
                      required 
                      className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        name="showOnLoad" 
                        checked={newModal.showOnLoad} 
                        onChange={handleInputChange} 
                        className="mr-2"
                      />
                      Show on Load
                    </label>
                    <input 
                      type="number" 
                      name="delay" 
                      placeholder="Delay (ms)" 
                      value={newModal.delay} 
                      onChange={handleInputChange} 
                      required 
                      className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input 
                      type="text" 
                      name="ButtonText" 
                      placeholder="Button Text" 
                      value={newModal.ButtonText} 
                      onChange={handleInputChange} 
                      required 
                      className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                    <Button type="submit" className="w-full bg-[#FBEDE9] text-black hover:bg-[#FBEDE9] transition duration-200">Create Modal</Button>
                  </form>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}