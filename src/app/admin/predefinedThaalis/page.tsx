"use client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CustomPopup } from "@/components/popup";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/image-upload";
import { useEffect, useState } from "react";
import { ThaliCard } from "@/components/thaaliComponent/page";
import predefinedThaliService from "@/services/api/predefinedThaliService";
import { MenuItem } from "@/types/menu";
import menuItemService from "@/services/api/menuItemService";

interface ThaliMenuItem {
  name: string;
  image: string;
  price: number;
  description: string;
  quantity: number;
}

interface PredefinedThali {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  menuItems: ThaliMenuItem[];
}

export default function PredefinedThaalis() {
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingThaliId, setEditingThaliId] = useState<string | null>(null);
  const [isThaliFormOpen, setIsThaliFormOpen] = useState(false);
  const [isThaliAddForm, setIsAddThaliForm] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [predefinedThalis, setPredefinedThalis] = useState<PredefinedThali[]>([]);
  const [thaliFormData, setThaliFormData] = useState<Omit<PredefinedThali, '_id'>>({
    name: '',
    description: '',
    price: 0,
    image: '',
    menuItems: [],
  });
  const [availableMenuItems, setAvailableMenuItems] = useState<MenuItem[]>([]);
  const [selectedMenuItems, setSelectedMenuItems] = useState<string[]>([]);
  const [isLoadingMenuItems, setIsLoadingMenuItems] = useState(false);

  useEffect(() => {
    fetchPredefinedThalis();
  }, []);

  const fetchPredefinedThalis = async () => {
    try {
      const response = await predefinedThaliService.getPredefinedThali();
      setPredefinedThalis(response);
      console.log(response);
    } catch (error) {
      console.error('Error fetching predefined thalis:', error);
    }
  };

  const editPredefinedThali = (thaliId: string) => {
    const thaliToEdit = predefinedThalis.find(thali => thali._id === thaliId);
    console.log('thaliToEdit', thaliToEdit)
    if (thaliToEdit) {
      setThaliFormData({
        name: thaliToEdit.name,
        description: thaliToEdit.description,
        price: thaliToEdit.price,
        image: thaliToEdit.image,
        menuItems: thaliToEdit.menuItems
      });
      setSelectedMenuItems(thaliToEdit.menuItems.map(menuItem => menuItem.item));
      setEditingThaliId(thaliId);
      setIsEditMode(true);
      setIsThaliFormOpen(true);
      // setSelectedImage(thaliToEdit.image)
    }
  };

  const createPredefinedThali = async () => {
    const payload = {
      name: thaliFormData.name,
      description: thaliFormData.description,
      price: thaliFormData.price,
      menuItems: selectedMenuItems
    };

    const response = await predefinedThaliService.createPredefinedThali(payload);
    return response;
  }

  const resetForm = () => {
    setThaliFormData({
      name: '',
      description: '',
      price: 0,
      image: '',
      menuItems: []
    });
    setSelectedMenuItems([]);
    setSelectedImage(null);
    setEditingThaliId(null);
    setIsEditMode(false);
  };

  const handleClosePopup = () => {
    resetForm();
    setIsThaliFormOpen(false);
  };

  const handleCloseAddThaliPopup = () => {
    resetForm();
    setIsAddThaliForm(false);
  };

  const fetchMenuItems = async () => {
    try {
      setIsLoadingMenuItems(true);
      const items = await menuItemService.getMenuItems();
      console.log('Fetched menu items:', items); // Debug log
      setAvailableMenuItems(items);
    } catch (error) {
      console.error('Error fetching menu items:', error);
      alert('Failed to load menu items');
    } finally {
      setIsLoadingMenuItems(false);
    }
  };

  const deletePredefinedThali = async (thaliId: string) => {
    try {
      await predefinedThaliService.deletePredefinedThali(thaliId);
      fetchPredefinedThalis();
    } catch (error) {
      console.error('Error deleting thali:', error);
      alert('Failed to delete thali. Please try again.');
    }
  };

  const createThali = async (formData: FormData) => {
    try {
      if (!selectedImage) {
        throw new Error('Image is required to create a Thali');
      }
      const response = await predefinedThaliService.createPredefinedThali(formData);
      return response;
    } catch (error) {
      console.log(`Error creating predefined Thali:`);
    }
  };

  console.log('formData:', thaliFormData)

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const menuItemsJSON = JSON.stringify(
    thaliFormData.menuItems.map(menuItem => ({
      name: menuItem.name,
      image: menuItem.image,
      price: menuItem.price,
      description: menuItem.description,
      quantity: menuItem.quantity
    }))
  );

  return (
    <div className="min-h-screen pb-[5%] ">
      <div className="flex flex-col sm:flex-col lg:flex-row justify-between items-center sm:items-center lg:items-start mb-8 p-4 md:p-8">
        <h1 className="text-2xl md:text-4xl font-bold text-black "> Special Thalis Preview</h1>
        <Button
          onClick={createPredefinedThali}
          className="mt-4 bg-black hover:bg-gray-800 flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Thali
        </Button>
      </div>

      {/* Thalis Grid */}
      <div className="flex flex-row flex-wrap justify-start align-start w-full">
        {predefinedThalis.length > 0 ? (
          predefinedThalis.map((thali) => (
            <ThaliCard
              key={thali._id}
              _id={thali._id}
              title={thali.name}
              description={thali.description}
              items={availableMenuItems
                .filter(menuItem => thali.menuItems.some(item => item.item === menuItem._id))
                .map(menuItem => ({
                  _id: menuItem._id,
                  name: menuItem.name,
                  price: menuItem.price,
                  quantity: thali.menuItems.find(item => item.item === menuItem._id)?.quantity || 1
                }))}
              image={thali.image}
              price={thali.price}
              onClick={() => editPredefinedThali(thali._id)}
              onDelete={() => deletePredefinedThali(thali._id)}
              showButton={true}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-gray-500">
            No predefined thalis found.
          </div>
        )}
      </div>

      <CustomPopup
        isOpen={isThaliAddForm}
        onClose={handleCloseAddThaliPopup}
        title="Add New Thali"
        className="sm:max-w-[500px] bg-[#fff5f5] text-black"
        footer={
          <Button
            onClick={async () => {
              try {
                if (!thaliFormData.name || !thaliFormData.description || thaliFormData.price <= 0) {
                  alert('Please fill all required fields');
                  return;
                }

                if (selectedMenuItems.length === 0) {
                  alert('Please select at least one menu item');
                  return;
                }

                const formData = new FormData();
                formData.append('name', thaliFormData.name);
                formData.append('description', thaliFormData.description);
                formData.append('price', thaliFormData.price.toString());

                const menuItemsJSON = JSON.stringify(
                  thaliFormData.menuItems.filter(item => selectedMenuItems.includes(item.item))
                );
                formData.append('menuItemsData', menuItemsJSON);

                // Send the payload to create a new thali
                await predefinedThaliService.createPredefinedThali(formData);
                handleCloseAddThaliPopup();
                fetchPredefinedThalis();
              } catch (error) {
                console.error('Error adding thali:', error);
                alert('Failed to add thali. Please try again.');
              }
            }}
          >
            Add Thali
          </Button>
        }
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-black">Thali Name</Label>
            <Input
              value={thaliFormData.name}
              onChange={(e) => setThaliFormData(prev => ({ ...prev, name: e.target.value }))}
              className="bg-white"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-black">Description</Label>
            <textarea
              id="thali-description"
              className="w-full min-h-[100px] px-3 py-2 rounded-md border border-input bg-white"
              placeholder="Enter thali description"
              value={thaliFormData.description}
              onChange={(e) => setThaliFormData(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-black">Base Price (₹)</Label>
            <Input
              id="thali-price"
              type="number"
              placeholder="Enter base price"
              className="bg-white"
              value={thaliFormData.price}
              onChange={(e) => setThaliFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
            />
          </div>

          {/* <div className="space-y-2">
            <Label className="text-black">Thali Image</Label>
            <ImageUpload
              value={selectedImage}
              onChange={(file) => setSelectedImage(file)}
            />
          </div> */}

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-black">Menu Items</Label>
              {isLoadingMenuItems && (
                <span className="text-sm text-gray-500">Loading...</span>
              )}
            </div>
            <div className="max-h-[200px] overflow-y-auto border rounded-md p-2 bg-white">
              {availableMenuItems.length > 0 ? (
                availableMenuItems.map((item) => (
                  <div key={item._id} className="flex items-center space-x-2 py-1">
                    <input
                      type="checkbox"
                      id={`menu-item-${item._id}`}
                      checked={selectedMenuItems.includes(item._id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedMenuItems([...selectedMenuItems, item._id]);
                          console.log('Selected items:', [...selectedMenuItems, item._id]); // Debug log

                          // Add the selected item to menuItems
                          setThaliFormData(prev => ({
                            ...prev,
                            menuItems: [
                              ...prev.menuItems,
                              {
                                name: item.name, // Ensure you have access to the item's name
                                image: item.image, // Ensure you have access to the item's image
                                price: item.price, // Ensure you have access to the item's price
                                description: item.description, // Ensure you have access to the item's description
                                quantity: 1 // Default quantity
                              }
                            ]
                          }));
                        } else {
                          setSelectedMenuItems(selectedMenuItems.filter(id => id !== item._id));
                          console.log('Selected items after removal:', selectedMenuItems.filter(id => id !== item._id)); // Debug log

                          // Remove the item from menuItems when unchecked
                          setThaliFormData(prev => ({
                            ...prev,
                            menuItems: prev.menuItems.filter(mi => mi.name !== item.name) // Use a property that exists
                          }));
                        }
                      }}
                    />
                    <label
                      htmlFor={`menu-item-${item._id}`}
                      className="text-sm cursor-pointer flex-1"
                    >
                      {item.name} - ₹{item.price}
                    </label>
                    {selectedMenuItems.includes(item._id) && (
                      <div className="flex items-center">
                        <button
                          type="button"
                          className="w-6 h-6 flex items-center justify-center border rounded-l text-sm bg-gray-100"
                          onClick={() => {
                            const currentQuantity = thaliFormData.menuItems.find(
                              mi => mi.item === item._id
                            )?.quantity || 1;

                            if (currentQuantity > 1) {
                              const updatedMenuItems = thaliFormData.menuItems.map(mi =>
                                mi.item === item._id
                                  ? { ...mi, quantity: currentQuantity - 1 }
                                  : mi
                              );

                              if (!updatedMenuItems.some(mi => mi.item === item._id)) {
                                updatedMenuItems.push({ item: item._id, quantity: currentQuantity - 1 });
                              }

                              setThaliFormData(prev => ({ ...prev, menuItems: updatedMenuItems }));
                            }
                          }}
                        >
                          -
                        </button>
                        <span className="w-8 h-6 flex items-center justify-center border-t border-b text-sm">
                          {thaliFormData.menuItems.find(mi => mi.item === item._id)?.quantity || 1}
                        </span>
                        <button
                          type="button"
                          className="w-6 h-6 flex items-center justify-center border rounded-r text-sm bg-gray-100"
                          onClick={() => {
                            const currentQuantity = thaliFormData.menuItems.find(
                              mi => mi.item === item._id
                            )?.quantity || 1;

                            const updatedMenuItems = thaliFormData.menuItems.map(mi =>
                              mi.item === item._id
                                ? { ...mi, quantity: currentQuantity + 1 }
                                : mi
                            );

                            if (!updatedMenuItems.some(mi => mi.item === item._id)) {
                              updatedMenuItems.push({ item: item._id, quantity: currentQuantity + 1 });
                            }

                            setThaliFormData(prev => ({ ...prev, menuItems: updatedMenuItems }));
                          }}
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  {isLoadingMenuItems ? (
                    <p className="text-gray-500">Loading menu items...</p>
                  ) : (
                    <p className="text-gray-500">No menu items available. Please add menu items first.</p>
                  )}
                </div>
              )}
            </div>
            {selectedMenuItems.length > 0 && (
              <p className="text-sm text-gray-500">
                {selectedMenuItems.length} item(s) selected
              </p>
            )}
          </div>
        </div>
      </CustomPopup>

      <CustomPopup
        isOpen={isThaliFormOpen}
        onClose={handleClosePopup}
        title="Edit Thali"
        className="sm:max-w-[500px] bg-[#fff5f5] text-black"
        footer={
          <Button
            onClick={async () => {
              try {
                if (!thaliFormData.name || !thaliFormData.description || thaliFormData.price <= 0) {
                  alert('Please fill all required fields');
                  return;
                }

                if (selectedMenuItems.length === 0) {
                  alert('Please select at least one menu item');
                  return;
                }

                const formData = new FormData();
                formData.append('name', thaliFormData.name);
                formData.append('description', thaliFormData.description);
                formData.append('price', thaliFormData.price.toString());

                if (selectedImage) {
                  formData.append('image', selectedImage);
                } else {
                  alert('Please select an image');
                  return;
                }

                const menuItemsJSON = JSON.stringify(
                  thaliFormData.menuItems.map(menuItem => ({
                    name: menuItem.name,
                    image: menuItem.image,
                    price: menuItem.price,
                    description: menuItem.description,
                    quantity: menuItem.quantity
                  }))
                );
                formData.append('menuItemsData', menuItemsJSON);

                // Send the payload to update the existing thali
                await predefinedThaliService.updatePredefinedThali(editingThaliId, formData);
                handleClosePopup();
                fetchPredefinedThalis();
              } catch (error) {
                console.error('Error updating thali:', error);
                alert('Failed to update thali. Please try again.');
              }
            }}
          >
            Update Thali
          </Button>
        }
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-black">Thali Name</Label>
            <Input
              value={thaliFormData.name}
              onChange={(e) => setThaliFormData(prev => ({ ...prev, name: e.target.value }))}
              className="bg-white"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-black">Description</Label>
            <textarea
              id="thali-description"
              className="w-full min-h-[100px] px-3 py-2 rounded-md border border-input bg-white"
              placeholder="Enter thali description"
              value={thaliFormData.description}
              onChange={(e) => setThaliFormData(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-black">Base Price (₹)</Label>
            <Input
              id="thali-price"
              type="number"
              placeholder="Enter base price"
              className="bg-white"
              value={thaliFormData.price}
              onChange={(e) => setThaliFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
            />
          </div>

          {/* <div className="space-y-2">
            <Label className="text-black">Thali Image</Label>
            <ImageUpload
              value={selectedImage}
              onChange={(file) => setSelectedImage(file)}
            />
          </div> */}

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-black">Menu Items</Label>
              {isLoadingMenuItems && (
                <span className="text-sm text-gray-500">Loading...</span>
              )}
            </div>
            <div className="max-h-[200px] overflow-y-auto border rounded-md p-2 bg-white">
              {availableMenuItems.length > 0 ? (
                availableMenuItems.map((item) => (
                  <div key={item._id} className="flex items-center space-x-2 py-1">
                    <input
                      type="checkbox"
                      id={`menu-item-${item._id}`}
                      checked={selectedMenuItems.includes(item._id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedMenuItems([...selectedMenuItems, item._id]);
                          console.log('Selected items:', [...selectedMenuItems, item._id]); // Debug log

                          // Add the selected item to menuItems
                          setThaliFormData(prev => ({
                            ...prev,
                            menuItems: [
                              ...prev.menuItems,
                              {
                                name: item.name, // Ensure you have access to the item's name
                                image: item.image, // Ensure you have access to the item's image
                                price: item.price, // Ensure you have access to the item's price
                                description: item.description, // Ensure you have access to the item's description
                                quantity: 1 // Default quantity
                              }
                            ]
                          }));
                        } else {
                          setSelectedMenuItems(selectedMenuItems.filter(id => id !== item._id));
                          console.log('Selected items after removal:', selectedMenuItems.filter(id => id !== item._id)); // Debug log

                          // Remove the item from menuItems when unchecked
                          setThaliFormData(prev => ({
                            ...prev,
                            menuItems: prev.menuItems.filter(mi => mi.name !== item.name) // Use a property that exists
                          }));
                        }
                      }}
                    />
                    <label
                      htmlFor={`menu-item-${item._id}`}
                      className="text-sm cursor-pointer flex-1"
                    >
                      {item.name} - ₹{item.price}
                    </label>
                    {selectedMenuItems.includes(item._id) && (
                      <div className="flex items-center">
                        <button
                          type="button"
                          className="w-6 h-6 flex items-center justify-center border rounded-l text-sm bg-gray-100"
                          onClick={() => {
                            const currentQuantity = thaliFormData.menuItems.find(
                              mi => mi.item === item._id
                            )?.quantity || 1;

                            if (currentQuantity > 1) {
                              const updatedMenuItems = thaliFormData.menuItems.map(mi =>
                                mi.item === item._id
                                  ? { ...mi, quantity: currentQuantity - 1 }
                                  : mi
                              );

                              if (!updatedMenuItems.some(mi => mi.item === item._id)) {
                                updatedMenuItems.push({ item: item._id, quantity: currentQuantity - 1 });
                              }

                              setThaliFormData(prev => ({ ...prev, menuItems: updatedMenuItems }));
                            }
                          }}
                        >
                          -
                        </button>
                        <span className="w-8 h-6 flex items-center justify-center border-t border-b text-sm">
                          {thaliFormData.menuItems.find(mi => mi.item === item._id)?.quantity || 1}
                        </span>
                        <button
                          type="button"
                          className="w-6 h-6 flex items-center justify-center border rounded-r text-sm bg-gray-100"
                          onClick={() => {
                            const currentQuantity = thaliFormData.menuItems.find(
                              mi => mi.item === item._id
                            )?.quantity || 1;

                            const updatedMenuItems = thaliFormData.menuItems.map(mi =>
                              mi.item === item._id
                                ? { ...mi, quantity: currentQuantity + 1 }
                                : mi
                            );

                            if (!updatedMenuItems.some(mi => mi.item === item._id)) {
                              updatedMenuItems.push({ item: item._id, quantity: currentQuantity + 1 });
                            }

                            setThaliFormData(prev => ({ ...prev, menuItems: updatedMenuItems }));
                          }}
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  {isLoadingMenuItems ? (
                    <p className="text-gray-500">Loading menu items...</p>
                  ) : (
                    <p className="text-gray-500">No menu items available. Please add menu items first.</p>
                  )}
                </div>
              )}
            </div>
            {selectedMenuItems.length > 0 && (
              <p className="text-sm text-gray-500">
                {selectedMenuItems.length} item(s) selected
              </p>
            )}
          </div>
        </div>
      </CustomPopup>

    </div>
  );
}
