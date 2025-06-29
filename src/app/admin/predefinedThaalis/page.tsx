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
import withAuth, { withAdminAuth } from "@/utils/withAuth";

interface ThaliMenuItem {
  name: string;
  image: string;
  price: number;
  description: string;
  quantity: number;
  item: string;
}

interface PredefinedThali {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  menuItems: ThaliMenuItem[];
}

function PredefinedThaalis() {
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
    }
  };

  const createPredefinedThali = async () => {
    setIsAddThaliForm(true);

    const payload = {
      name: thaliFormData.name,
      description: thaliFormData.description,
      price: thaliFormData.price,
      menuItems: selectedMenuItems
    };

    const response = await predefinedThaliService.createPredefinedThali(payload);
    setIsAddThaliForm(false);
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
      console.log('Fetched menu items:', items);
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
    <div className="min-h-screen">
      {/* Header Section - Fixed styling */}
      <h1 className="text-3xl md:text-3xl lg:text-4xl font-bold text-gray-900 py-[90px] text-center">
        Special Thalis Preview
      </h1>

      {/* Main Content */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 pb-[100px] bg-[#fff5f5]">
        {/* Thalis Grid - Improved responsive layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          {predefinedThalis.length > 0 ? (
            predefinedThalis.map((thali) => (
              <div key={thali._id} className="w-full">
                <ThaliCard
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
              </div>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Plus className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Thalis Found</h3>
              <p className="text-gray-500 mb-6 max-w-md">
                Get started by creating your first predefined thali. Click the "Add Thali" button above.
              </p>
              <Button
                onClick={createPredefinedThali}
                className="bg-black hover:bg-gray-800 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Thali
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Add Thali Popup */}
      <CustomPopup
        isOpen={isThaliAddForm}
        onClose={handleCloseAddThaliPopup}
        title="Add New Thali"
        className="sm:max-w-[600px] bg-white text-black"
        footer={
          <div className="flex gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={handleCloseAddThaliPopup}
              className="flex-1"
            >
              Cancel
            </Button>
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

                  await predefinedThaliService.createPredefinedThali(formData);
                  handleCloseAddThaliPopup();
                  fetchPredefinedThalis();
                } catch (error) {
                  console.error('Error adding thali:', error);
                  alert('Failed to add thali. Please try again.');
                }
              }}
              className="flex-1 bg-black hover:bg-gray-800"
            >
              Add Thali
            </Button>
          </div>
        }
      >
        <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-black font-medium">Thali Name *</Label>
              <Input
                value={thaliFormData.name}
                onChange={(e) => setThaliFormData(prev => ({ ...prev, name: e.target.value }))}
                className="bg-gray-50 border-gray-200 focus:border-black"
                placeholder="Enter thali name"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-black font-medium">Base Price (₹) *</Label>
              <Input
                type="number"
                placeholder="Enter base price"
                className="bg-gray-50 border-gray-200 focus:border-black"
                value={thaliFormData.price}
                onChange={(e) => setThaliFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-black font-medium">Description *</Label>
            <textarea
              className="w-full min-h-[100px] px-3 py-2 rounded-md border border-gray-200 bg-gray-50 focus:border-black focus:outline-none resize-none"
              placeholder="Enter thali description"
              value={thaliFormData.description}
              onChange={(e) => setThaliFormData(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label className="text-black font-medium">Menu Items *</Label>
              {isLoadingMenuItems && (
                <span className="text-sm text-gray-500">Loading...</span>
              )}
            </div>
            <div className="max-h-[300px] overflow-y-auto border border-gray-200 rounded-lg p-4 bg-gray-50">
              {availableMenuItems.length > 0 ? (
                <div className="space-y-3">
                  {availableMenuItems.map((item) => (
                    <div key={item._id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id={`menu-item-${item._id}`}
                          checked={selectedMenuItems.includes(item._id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedMenuItems([...selectedMenuItems, item._id]);
                              setThaliFormData(prev => ({
                                ...prev,
                                menuItems: [
                                  ...prev.menuItems,
                                  {
                                    name: item.name,
                                    image: item.image,
                                    price: item.price,
                                    description: item.description,
                                    quantity: 1,
                                    item: item._id
                                  }
                                ]
                              }));
                            } else {
                              setSelectedMenuItems(selectedMenuItems.filter(id => id !== item._id));
                              setThaliFormData(prev => ({
                                ...prev,
                                menuItems: prev.menuItems.filter(mi => mi.item !== item._id)
                              }));
                            }
                          }}
                          className="w-4 h-4 text-black focus:ring-black border-gray-300 rounded"
                        />
                        <label
                          htmlFor={`menu-item-${item._id}`}
                          className="text-sm cursor-pointer flex-1 font-medium text-gray-900"
                        >
                          {item.name}
                        </label>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-600">₹{item.price}</span>

                        {selectedMenuItems.includes(item._id) && (
                          <div className="flex items-center border border-gray-200 rounded-md">
                            <button
                              type="button"
                              className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors"
                              onClick={() => {
                                const currentQuantity = thaliFormData.menuItems.find(
                                  mi => mi.item === item._id
                                )?.quantity || 1;

                                if (currentQuantity > 1) {
                                  setThaliFormData(prev => ({
                                    ...prev,
                                    menuItems: prev.menuItems.map(mi =>
                                      mi.item === item._id
                                        ? { ...mi, quantity: currentQuantity - 1 }
                                        : mi
                                    )
                                  }));
                                }
                              }}
                            >
                              -
                            </button>
                            <span className="w-8 h-8 flex items-center justify-center text-sm font-medium border-x border-gray-200">
                              {thaliFormData.menuItems.find(mi => mi.item === item._id)?.quantity || 1}
                            </span>
                            <button
                              type="button"
                              className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors"
                              onClick={() => {
                                const currentQuantity = thaliFormData.menuItems.find(
                                  mi => mi.item === item._id
                                )?.quantity || 1;

                                setThaliFormData(prev => ({
                                  ...prev,
                                  menuItems: prev.menuItems.map(mi =>
                                    mi.item === item._id
                                      ? { ...mi, quantity: currentQuantity + 1 }
                                      : mi
                                  )
                                }));
                              }}
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  {isLoadingMenuItems ? (
                    <div className="flex flex-col items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mb-4"></div>
                      <p className="text-gray-500">Loading menu items...</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <Plus className="h-6 w-6 text-gray-400" />
                      </div>
                      <p className="text-gray-500">No menu items available</p>
                      <p className="text-gray-400 text-sm mt-1">Please add menu items first</p>
                    </div>
                  )}
                </div>
              )}
            </div>
            {selectedMenuItems.length > 0 && (
              <div className="flex items-center justify-between text-sm bg-blue-50 p-3 rounded-lg">
                <span className="text-blue-700 font-medium">
                  {selectedMenuItems.length} item(s) selected
                </span>
                <span className="text-blue-600">
                  Total: ₹{thaliFormData.menuItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)}
                </span>
              </div>
            )}
          </div>
        </div>
      </CustomPopup>

      {/* Edit Thali Popup - Similar structure but with Update button */}
      <CustomPopup
        isOpen={isThaliFormOpen}
        onClose={handleClosePopup}
        title="Edit Thali"
        className="sm:max-w-[600px] bg-white text-black"
        footer={
          <div className="flex gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={handleClosePopup}
              className="flex-1"
            >
              Cancel
            </Button>
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

                  await predefinedThaliService.updatePredefinedThali(editingThaliId, formData);
                  handleClosePopup();
                  fetchPredefinedThalis();
                } catch (error) {
                  console.error('Error updating thali:', error);
                  alert('Failed to update thali. Please try again.');
                }
              }}
              className="flex-1 bg-black hover:bg-gray-800"
            >
              Update Thali
            </Button>
          </div>
        }
      >
        {/* Same form content as Add popup but for editing */}
        <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-black font-medium">Thali Name *</Label>
              <Input
                value={thaliFormData.name}
                onChange={(e) => setThaliFormData(prev => ({ ...prev, name: e.target.value }))}
                className="bg-gray-50 border-gray-200 focus:border-black"
                placeholder="Enter thali name"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-black font-medium">Base Price (₹) *</Label>
              <Input
                type="number"
                placeholder="Enter base price"
                className="bg-gray-50 border-gray-200 focus:border-black"
                value={thaliFormData.price}
                onChange={(e) => setThaliFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-black font-medium">Description *</Label>
            <textarea
              className="w-full min-h-[100px] px-3 py-2 rounded-md border border-gray-200 bg-gray-50 focus:border-black focus:outline-none resize-none"
              placeholder="Enter thali description"
              value={thaliFormData.description}
              onChange={(e) => setThaliFormData(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>

          {/* Menu Items section - same as Add form */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label className="text-black font-medium">Menu Items *</Label>
              {isLoadingMenuItems && (
                <span className="text-sm text-gray-500">Loading...</span>
              )}
            </div>
            <div className="max-h-[300px] overflow-y-auto border border-gray-200 rounded-lg p-4 bg-gray-50">
              {availableMenuItems.length > 0 ? (
                <div className="space-y-3">
                  {availableMenuItems.map((item) => (
                    <div key={item._id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id={`edit-menu-item-${item._id}`}
                          checked={selectedMenuItems.includes(item._id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedMenuItems([...selectedMenuItems, item._id]);
                              setThaliFormData(prev => ({
                                ...prev,
                                menuItems: [
                                  ...prev.menuItems,
                                  {
                                    name: item.name,
                                    image: item.image,
                                    price: item.price,
                                    description: item.description,
                                    quantity: 1,
                                    item: item._id
                                  }
                                ]
                              }));
                            } else {
                              setSelectedMenuItems(selectedMenuItems.filter(id => id !== item._id));
                              setThaliFormData(prev => ({
                                ...prev,
                                menuItems: prev.menuItems.filter(mi => mi.item !== item._id)
                              }));
                            }
                          }}
                          className="w-4 h-4 text-black focus:ring-black border-gray-300 rounded"
                        />
                        <label
                          htmlFor={`edit-menu-item-${item._id}`}
                          className="text-sm cursor-pointer flex-1 font-medium text-gray-900"
                        >
                          {item.name}
                        </label>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-600">₹{item.price}</span>

                        {selectedMenuItems.includes(item._id) && (
                          <div className="flex items-center border border-gray-200 rounded-md">
                            <button
                              type="button"
                              className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors"
                              onClick={() => {
                                const currentQuantity = thaliFormData.menuItems.find(
                                  mi => mi.item === item._id
                                )?.quantity || 1;

                                if (currentQuantity > 1) {
                                  setThaliFormData(prev => ({
                                    ...prev,
                                    menuItems: prev.menuItems.map(mi =>
                                      mi.item === item._id
                                        ? { ...mi, quantity: currentQuantity - 1 }
                                        : mi
                                    )
                                  }));
                                }
                              }}
                            >
                              -
                            </button>
                            <span className="w-8 h-8 flex items-center justify-center text-sm font-medium border-x border-gray-200">
                              {thaliFormData.menuItems.find(mi => mi.item === item._id)?.quantity || 1}
                            </span>
                            <button
                              type="button"
                              className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors"
                              onClick={() => {
                                const currentQuantity = thaliFormData.menuItems.find(
                                  mi => mi.item === item._id
                                )?.quantity || 1;

                                setThaliFormData(prev => ({
                                  ...prev,
                                  menuItems: prev.menuItems.map(mi =>
                                    mi.item === item._id
                                      ? { ...mi, quantity: currentQuantity + 1 }
                                      : mi
                                  )
                                }));
                              }}
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No menu items available</p>
                </div>
              )}
            </div>
            {selectedMenuItems.length > 0 && (
              <div className="flex items-center justify-between text-sm bg-blue-50 p-3 rounded-lg">
                <span className="text-blue-700 font-medium">
                  {selectedMenuItems.length} item(s) selected
                </span>
                <span className="text-blue-600">
                  Total: ₹{thaliFormData.menuItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)}
                </span>
              </div>
            )}
          </div>
        </div>
      </CustomPopup>
    </div>
  );
}

export default withAdminAuth(PredefinedThaalis)