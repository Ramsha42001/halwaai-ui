'use client'
import { useState, useEffect } from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from 'lucide-react';
import { addressService } from '@/services/api/addressService';

interface Address {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

export default function Address() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [formData, setFormData] = useState<Address>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',
  });
  const [loading, setLoading] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState<number | null>(null);
const [addressSelect,setAddressSelect] = useState(false);
  const handleSubmit = async () => {
    try {
      await addressService.createAddress(formData);
      console.log('Address created successfully:', formData);
    } catch (error) {
      console.error('Error creating address:', error);
    }
  };

  const getAddress = async () => {
    try {
      setLoading(true);
      const response = await addressService.getAddress();
      setAddresses(response.map((address: Address) => ({
        firstName: address.firstName,
        lastName: address.lastName,
        email: address.email,
        phone: address.phone,
        addressLine1: address.addressLine1,
        addressLine2: address.addressLine2,
        city: address.city,
        state: address.state,
        country: address.country,
        zipCode: address.zipCode,
      })));
    } catch (error) {
      console.error('Error fetching addresses', error);
      setAddresses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAddress();
  }, []);

  return (
    <>
      <div className="min-h-[100vh] h-auto bg-[#FFF5F5] text-[black] px-4 pb-20 md:px-6 lg:px-8">
        <div className="py-[90px] md:pt-[70px]">
          <Link href="/user/thali">
            <Button variant="default" className="bg-black hover:text-[black] mb-4 md:m-[30px]">
              <ChevronLeft /> Back
            </Button>
          </Link>

          <div className="w-full mx-auto">
            <h2 className="font-poorStory font-semibold text-2xl md:text-3xl text-[black] py-3 md:py-[20px] text-center">
              Address
            </h2>

            <div className="w-full min-h-[80vh] flex flex-col md:flex-row gap-4 md:gap-8 justify-between items-start">
              <div className="w-full md:w-[40%] flex justify-center items-start mb-6 md:mb-0 hidden md:flex">
                <img
                  src="/images/thali1.png"
                  alt="Thali"
                  className="rounded-lg w-full max-w-[300px] md:max-w-[400px] object-cover"
                />
              </div>

              <div className="w-full md:w-[50%] md:mr-[5%]" >
                {loading ? (
                  <div className="mb-8 p-4 bg-gray-50 rounded-lg shadow-sm">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin h-5 w-5 mr-3 border-2 border-black border-t-transparent rounded-full"></div>
                      <p>Loading your saved addresses...</p>
                    </div>
                  </div>
                ) : (
                  <div className="mb-8">
                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                      {addresses.map((address, index) => (
                        <div
                          key={index}
                          className="flex items-start p-4 border rounded-lg cursor-pointer transition-duration-300 hover:bg-gray-50 border-gray-200 shadow-sm"
                          onClick={() => setSelectedAddressIndex(index)}
                        >
                          <input
                            type="radio"
                            name="address"
                            className="mt-1 h-4 w-4 accent-black cursor-pointer"
                            checked={selectedAddressIndex === index}
                            onChange={() => {setSelectedAddressIndex(index);
                              setAddressSelect(true);
                            }}
                          />
                          <div className="ml-4">
                            <p className="font-medium">{address.firstName} {address.lastName}</p>
                            <p className="text-sm text-gray-600">{address.addressLine1}</p>
                            {address.addressLine2 && <p className="text-sm text-gray-600">{address.addressLine2}</p>}
                            <p className="text-sm text-gray-600">{address.city}, {address.state} {address.zipCode}</p>
                            <p className="text-sm text-gray-600">{address.country}</p>
                            <p className="text-sm text-gray-600 mt-1">Phone: {address.phone}</p>
                            <p className="text-sm text-gray-600">Email: {address.email}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 flex flex-row justify-between">
                      {!openForm ? (
                        <>
                        <button
                          onClick={() => setOpenForm(true)}
                          className="w-[250px] py-2 px-4 bg-[black] text-white rounded-lg hover:bg-gray-800 transition-colors duration-300 flex items-center justify-center gap-2"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                          </svg>
                          Add a New Address
                        </button>
                        <Link href="/user/payment">
                    <button 
                          className="w-[250px] py-2 px-4 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors duration-300 flex items-center justify-center gap-2"
                        >
                         Proceed for payment details
                        </button>
                        </Link>
                        </>
                      ) : (
                        <div className="bg-white p-6 rounded-lg shadow-md">
                          <h3 className="text-xl font-semibold mb-4">Add New Address</h3>
                          <form className="space-y-4" >
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                <input
                                  type="text"
                                  value={formData.firstName}
                                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                <input
                                  type="text"
                                  value={formData.lastName}
                                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1</label>
                              <input
                                type="text"
                                value={formData.addressLine1}
                                onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2 (Optional)</label>
                              <input
                                type="text"
                                value={formData.addressLine2}
                                onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                <input
                                  type="text"
                                  value={formData.city}
                                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                                <input
                                  type="text"
                                  value={formData.state}
                                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                                <input
                                  type="text"
                                  value={formData.zipCode}
                                  onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                                <input
                                  type="text"
                                  value={formData.country}
                                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                <input
                                  type="tel"
                                  value={formData.phone}
                                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                  type="email"
                                  value={formData.email}
                                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                                />
                              </div>
                            </div>

                            <div className="flex justify-end space-x-4 mt-6">
                              <button
                                type="button"
                                onClick={() => setOpenForm(false)}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-300"
                              >
                                Cancel
                              </button>
                              <button
                                type="submit"
                                className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors duration-300"
                                onClick={handleSubmit}
                              >
                                Save Address
                              </button>
                            </div>
                          </form>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
       
      </div>
    </>
  );
}