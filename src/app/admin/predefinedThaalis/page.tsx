"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CustomPopup } from "@/components/popup";
import { ThaliCard } from "@/components/thaaliComponent/page";
import { Plus } from "lucide-react";
import { useEffect, useState, useCallback } from "react";

import predefinedThaliService from "@/services/api/predefinedThaliService";
import menuItemService from "@/services/api/menuItemService";
import { withAdminAuth } from "@/utils/withAuth";
import { MenuItem } from "@/types/menu";

// Types
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

interface ThaliFormData {
  name: string;
  description: string;
  price: number;
  image: string;
  menuItems: ThaliMenuItem[];
}

// Initial form state
const INITIAL_FORM_STATE: ThaliFormData = {
  name: '',
  description: '',
  price: 0,
  image: '',
  menuItems: [],
};

function PredefinedThaalis() {
  // State
  const [predefinedThalis, setPredefinedThalis] = useState<PredefinedThali[]>([]);
  const [availableMenuItems, setAvailableMenuItems] = useState<MenuItem[]>([]);
  const [thaliFormData, setThaliFormData] = useState<ThaliFormData>(INITIAL_FORM_STATE);
  const [selectedMenuItems, setSelectedMenuItems] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  // Modal states
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [editingThaliId, setEditingThaliId] = useState<string | null>(null);

  // Loading states
  const [isLoadingMenuItems, setIsLoadingMenuItems] = useState(false);
  const [isCreatingThali, setIsCreatingThali] = useState(false);

  // API Functions
  const fetchPredefinedThalis = useCallback(async () => {
    try {
      const response = await predefinedThaliService.getPredefinedThali();
      setPredefinedThalis(response);
    } catch (error) {
      console.error('Error fetching predefined thalis:', error);
    }
  }, []);

  const fetchMenuItems = useCallback(async () => {
    try {
      setIsLoadingMenuItems(true);
      const items = await menuItemService.getMenuItems();
      setAvailableMenuItems(items);
    } catch (error) {
      console.error('Error fetching menu items:', error);
      alert('Failed to load menu items');
    } finally {
      setIsLoadingMenuItems(false);
    }
  }, []);

  // Form handlers
  const resetForm = useCallback(() => {
    setThaliFormData(INITIAL_FORM_STATE);
    setSelectedMenuItems([]);
    setSelectedImage(null);
    setEditingThaliId(null);
  }, []);

  const handleFormClose = useCallback((isEdit = false) => {
    resetForm();
    if (isEdit) {
      setIsEditFormOpen(false);
    } else {
      setIsAddFormOpen(false);
    }
  }, [resetForm]);

  const validateForm = useCallback(() => {
    if (!thaliFormData.name.trim()) {
      alert('Please enter thali name');
      return false;
    }
    if (!thaliFormData.description.trim()) {
      alert('Please enter thali description');
      return false;
    }
    if (thaliFormData.price <= 0) {
      alert('Please enter a valid price');
      return false;
    }
    if (selectedMenuItems.length === 0) {
      alert('Please select at least one menu item');
      return false;
    }
    return true;
  }, [thaliFormData, selectedMenuItems]);

  // CRUD Operations
  const handleCreateThali = useCallback(async () => {
    if (!validateForm()) return;

    try {
      setIsCreatingThali(true);

      const payload = {
        name: thaliFormData.name.trim(),
        description: thaliFormData.description.trim(),
        price: thaliFormData.price,
        menuItems: selectedMenuItems.map(itemId => {
          const menuItemData = thaliFormData.menuItems.find(mi => mi.item === itemId);
          return {
            item: itemId,
            quantity: menuItemData?.quantity || 1
          };
        })
      };

      await predefinedThaliService.createPredefinedThali(payload);
      handleFormClose(false);
      await fetchPredefinedThalis();
    } catch (error) {
      console.error('Error creating thali:', error);
      alert('Failed to create thali. Please try again.');
    } finally {
      setIsCreatingThali(false);
    }
  }, [validateForm, thaliFormData, selectedMenuItems, handleFormClose, fetchPredefinedThalis]);

  const handleEditThali = useCallback((thaliId: string) => {
    const thaliToEdit = predefinedThalis.find(thali => thali._id === thaliId);
    if (!thaliToEdit) return;

    setThaliFormData({
      name: thaliToEdit.name,
      description: thaliToEdit.description,
      price: thaliToEdit.price,
      image: thaliToEdit.image,
      menuItems: thaliToEdit.menuItems
    });
    setSelectedMenuItems(thaliToEdit.menuItems.map(item => item.item));
    setEditingThaliId(thaliId);
    setIsEditFormOpen(true);
  }, [predefinedThalis]);

  const handleUpdateThali = useCallback(async () => {
    if (!validateForm() || !editingThaliId) return;

    try {
      const formData = new FormData();
      formData.append('name', thaliFormData.name.trim());
      formData.append('description', thaliFormData.description.trim());
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
      handleFormClose(true);
      await fetchPredefinedThalis();
    } catch (error) {
      console.error('Error updating thali:', error);
      alert('Failed to update thali. Please try again.');
    }
  }, [validateForm, editingThaliId, thaliFormData, selectedImage, handleFormClose, fetchPredefinedThalis]);

  const handleDeleteThali = useCallback(async (thaliId: string) => {
    if (!confirm('Are you sure you want to delete this thali?')) return;

    try {
      await predefinedThaliService.deletePredefinedThali(thaliId);
      await fetchPredefinedThalis();
    } catch (error) {
      console.error('Error deleting thali:', error);
      alert('Failed to delete thali. Please try again.');
    }
  }, [fetchPredefinedThalis]);

  // Menu item handlers
  const handleMenuItemToggle = useCallback((item: MenuItem, isChecked: boolean) => {
    if (isChecked) {
      setSelectedMenuItems(prev => [...prev, item._id]);
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
      setSelectedMenuItems(prev => prev.filter(id => id !== item._id));
      setThaliFormData(prev => ({
        ...prev,
        menuItems: prev.menuItems.filter(mi => mi.item !== item._id)
      }));
    }
  }, []);

  const handleQuantityChange = useCallback((itemId: string, delta: number) => {
    setThaliFormData(prev => ({
      ...prev,
      menuItems: prev.menuItems.map(mi => {
        if (mi.item === itemId) {
          const newQuantity = Math.max(1, mi.quantity + delta);
          return { ...mi, quantity: newQuantity };
        }
        return mi;
      })
    }));
  }, []);

  // Helper functions
  const getThaliMenuItems = useCallback((thali: PredefinedThali) => {
    console.log('Thali data:', thali);
    console.log('Available menu items:', availableMenuItems);

    const result = availableMenuItems
      .filter(menuItem => thali.menuItems.some(item => item.item === menuItem._id))
      .map(menuItem => {
        const thaliMenuItem = thali.menuItems.find(item => item.item === menuItem._id);
        console.log('Mapping menu item:', menuItem.name, 'quantity:', thaliMenuItem?.quantity);
        return {
          _id: menuItem._id,
          name: menuItem.name,
          price: menuItem.price,
          quantity: thaliMenuItem?.quantity || 1
        };
      });

    console.log('Final mapped items:', result);
    return result;
  }, [availableMenuItems]);

  const getTotalPrice = useCallback(() => {
    return thaliFormData.menuItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }, [thaliFormData.menuItems]);

  // Effects
  useEffect(() => {
    fetchPredefinedThalis();
    fetchMenuItems();
  }, [fetchPredefinedThalis, fetchMenuItems]);

  // Components
  const MenuItemSelector = ({ isEdit = false }: { isEdit?: boolean }) => (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <Label className="text-black font-medium">Menu Items *</Label>
        {isLoadingMenuItems && <span className="text-sm text-gray-500">Loading...</span>}
      </div>

      <div className="max-h-[300px] overflow-y-auto border border-gray-200 rounded-lg p-4 bg-gray-50">
        {availableMenuItems.length > 0 ? (
          <div className="space-y-3">
            {availableMenuItems.map((item) => {
              const isSelected = selectedMenuItems.includes(item._id);
              const currentQuantity = thaliFormData.menuItems.find(mi => mi.item === item._id)?.quantity || 1;

              return (
                <div key={item._id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id={`${isEdit ? 'edit-' : ''}menu-item-${item._id}`}
                      checked={isSelected}
                      onChange={(e) => handleMenuItemToggle(item, e.target.checked)}
                      className="w-4 h-4 text-black focus:ring-black border-gray-300 rounded"
                    />
                    <label
                      htmlFor={`${isEdit ? 'edit-' : ''}menu-item-${item._id}`}
                      className="text-sm cursor-pointer flex-1 font-medium text-gray-900"
                    >
                      {item.name}
                    </label>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-600">₹{item.price}</span>

                    {isSelected && (
                      <div className="flex items-center border border-gray-200 rounded-md">
                        <button
                          type="button"
                          className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors"
                          onClick={() => handleQuantityChange(item._id, -1)}
                          disabled={currentQuantity <= 1}
                        >
                          -
                        </button>
                        <span className="w-8 h-8 flex items-center justify-center text-sm font-medium border-x border-gray-200">
                          {currentQuantity}
                        </span>
                        <button
                          type="button"
                          className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors"
                          onClick={() => handleQuantityChange(item._id, 1)}
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
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
          <span className="text-blue-600">Total: ₹{getTotalPrice()}</span>
        </div>
      )}
    </div>
  );

  const ThaliForm = () => (
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
            min="0"
            step="1"
            value={thaliFormData.price || ''}
            onChange={(e) => setThaliFormData(prev => ({ ...prev, price: Number(e.target.value) || 0 }))}
            className="bg-gray-50 border-gray-200 focus:border-black"
            placeholder="Enter base price"
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

      <MenuItemSelector isEdit={isEditFormOpen} />
    </div>
  );

  const EmptyState = () => (
    <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Plus className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">No Thalis Found</h3>
      <p className="text-gray-500 mb-6 max-w-md">
        Get started by creating your first predefined thali. Click the "Add Thali" button above.
      </p>
      <Button
        onClick={() => setIsAddFormOpen(true)}
        className="bg-black hover:bg-gray-800 text-white"
      >
        <Plus className="h-4 w-4 mr-2" />
        Create Your First Thali
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#fff5f5] shadow-sm border-b mb-[20px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
              Special Thalis Preview
            </h1>
            <Button
              onClick={() => setIsAddFormOpen(true)}
              className="bg-black hover:bg-gray-800 text-white flex items-center gap-2 px-6 py-2 rounded-lg transition-colors duration-200"
            >
              <Plus className="h-4 w-4" />
              Add Thali
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 pb-[100px] bg-[#fff5f5]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          {availableMenuItems.length === 0 ? (
            <div className="col-span-full flex justify-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
            </div>
          ) : predefinedThalis.length > 0 ? (
            predefinedThalis.map((thali) => (
              <div key={thali._id} className="w-full">
                <ThaliCard
                  _id={thali._id}
                  title={thali.name}
                  description={thali.description}
                  items={getThaliMenuItems(thali)}
                  image={thali.image}
                  price={thali.price}
                  onClick={() => handleEditThali(thali._id)}
                  onDelete={() => handleDeleteThali(thali._id)}
                  showButton={true}
                />
              </div>
            ))
          ) : (
            <EmptyState />
          )}
        </div>
      </div>

      {/* Add Thali Modal */}
      <CustomPopup
        isOpen={isAddFormOpen}
        onClose={() => handleFormClose(false)}
        title="Add New Thali"
        className="sm:max-w-[600px] bg-white text-black"
        footer={
          <div className="flex gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => handleFormClose(false)}
              className="flex-1"
              disabled={isCreatingThali}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateThali}
              className="flex-1 bg-black hover:bg-gray-800"
              disabled={isCreatingThali}
            >
              {isCreatingThali ? 'Creating...' : 'Add Thali'}
            </Button>
          </div>
        }
      >
        <ThaliForm />
      </CustomPopup>

      {/* Edit Thali Modal */}
      <CustomPopup
        isOpen={isEditFormOpen}
        onClose={() => handleFormClose(true)}
        title="Edit Thali"
        className="sm:max-w-[600px] bg-white text-black"
        footer={
          <div className="flex gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => handleFormClose(true)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateThali}
              className="flex-1 bg-black hover:bg-gray-800"
            >
              Update Thali
            </Button>
          </div>
        }
      >
        <ThaliForm />
      </CustomPopup>
    </div>
  );
}

export default withAdminAuth(PredefinedThaalis);