'use client'
import { useState, useEffect } from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, MapPin, Plus, User, Phone, Mail, Home, CheckCircle } from 'lucide-react';
import { addressService } from '@/services/api/addressService';
import withAuth from '@/utils/withAuth';
import { useStore } from '@/services/store/menuItemsStore';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { storageService } from '@/utils/storage';

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

function Address() {
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
  const [addressSelect, setAddressSelect] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);

  // Get setSelectedAddress from store
  const { setSelectedAddress, selectedAddress } = useStore();

  useEffect(() => {
    setAuthToken(storageService.getAuthToken());
  }, []);

  const userId = authToken;

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      await addressService.createAddress(formData);
      console.log('Address created successfully:', formData);
      // Refresh addresses after creating new one
      await getAddress();
      // Reset form and close
      setFormData({
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
      setOpenForm(false);
    } catch (error) {
      console.error('Error creating address:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const getAddress = async () => {
    try {
      setLoading(true);
      const response = await addressService.getAddress();
      const fetchedAddresses = response.map((address: Address) => ({
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
      }));
      setAddresses(fetchedAddresses);

      // Check if we have a selected address in store and set the index
      if (selectedAddress) {
        const index = fetchedAddresses.findIndex((addr: Address) =>
          addr.addressLine1 === selectedAddress.addressLine1 &&
          addr.city === selectedAddress.city &&
          addr.zipCode === selectedAddress.zipCode
        );
        if (index !== -1) {
          setSelectedAddressIndex(index);
          setAddressSelect(true);
        }
      }
    } catch (error) {
      console.error('Error fetching addresses', error);
      setAddresses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddressSelection = (index: number) => {
    setSelectedAddressIndex(index);
    setAddressSelect(true);
    // Save selected address to store and Firebase
    if (addresses[index] && userId) {
      setSelectedAddress(userId, addresses[index]);
    }
  };

  useEffect(() => {
    if (userId) {
      getAddress();
    }
  }, [userId]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 pb-[120px] sm:pb-[100px] lg:pb-[80px]">
      <div className="pt-[90px] px-3 sm:px-4 lg:px-8">
        {/* Header */}
        <motion.div
          className="flex items-center justify-between mb-6 sm:mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Link href="/user/cart">
            <Button
              variant="outline"
              size="sm"
              className="bg-black hover:bg-gray-800 border-amber-200 text-white hover:text-white shadow-md px-3 sm:px-4"
            >
              <ChevronLeft className="mr-1 sm:mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Back to Cart</span>
              <span className="sm:hidden">Back</span>
            </Button>
          </Link>

          <div className="text-center flex-1 mx-2 sm:mx-4">
            <h1 className="font-poorStory font-bold text-xl sm:text-2xl md:text-3xl bg-background bg-clip-text text-transparent">
              Delivery Address
            </h1>
            <p className="text-background font-poppins text-xs sm:text-sm mt-1">
              Choose or add your delivery location
            </p>
          </div>

          <div className="w-16 sm:w-20" />
        </motion.div>

        <div className="container mx-auto">
          <motion.div
            className="flex flex-col lg:flex-row gap-6 lg:gap-8 justify-between items-start"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Thali Image - Desktop Only */}
            <motion.div
              className="hidden lg:flex w-full lg:w-[35%] justify-center items-start"
              variants={itemVariants}
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-amber-200/50">
                <div className="aspect-square relative rounded-xl overflow-hidden mb-4">
                  <img
                    src="/images/thali1.png"
                    alt="Traditional Thali"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-amber-800 font-poorStory">Your Order</h3>
                  <p className="text-amber-600 text-sm font-poppins">Ready for delivery</p>
                </div>
              </div>
            </motion.div>

            {/* Address Section */}
            <motion.div
              className="w-full lg:w-[60%]"
              variants={itemVariants}
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-xl border border-amber-200/50">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <div className="animate-spin h-8 w-8 border-2 border-amber-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                      <p className="text-amber-700 font-poppins">Loading your saved addresses...</p>
                    </div>
                  </div>
                ) : (
                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-5 h-5 text-amber-500" />
                        <h2 className="font-semibold text-black text-lg">Saved Addresses</h2>
                      </div>
                      <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                        {addresses.length} saved
                      </Badge>
                    </div>

                    {/* Address List */}
                    <div className="space-y-3 max-h-[400px] overflow-y-auto mb-6">
                      <AnimatePresence>
                        {addresses.map((address, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ delay: index * 0.1 }}
                            className={`relative cursor-pointer transition-all duration-300 rounded-xl border-2 p-4 ${selectedAddressIndex === index
                              ? 'border-amber-400 bg-gradient-to-r from-amber-50 to-orange-50 shadow-md'
                              : 'border-amber-200/50 bg-white/70 hover:border-amber-300 hover:shadow-sm'
                              }`}
                            onClick={() => handleAddressSelection(index)}
                          >
                            {/* Selection Indicator */}
                            <div className="absolute top-3 right-3">
                              {selectedAddressIndex === index ? (
                                <CheckCircle className="w-5 h-5 text-amber-600" />
                              ) : (
                                <div className="w-5 h-5 border-2 border-amber-300 rounded-full"></div>
                              )}
                            </div>

                            {/* Address Content */}
                            <div className="pr-8">
                              <div className="flex items-center space-x-2 mb-2">
                                <User className="w-4 h-4 text-amber-600" />
                                <p className="font-semibold text-black">{address.firstName} {address.lastName}</p>
                              </div>

                              <div className="flex items-start space-x-2 mb-2">
                                <Home className="w-4 h-4 text-amber-600 mt-0.5" />
                                <div className="text-sm text-black">
                                  <p>{address.addressLine1}</p>
                                  {address.addressLine2 && <p>{address.addressLine2}</p>}
                                  <p>{address.city}, {address.state} {address.zipCode}</p>
                                  <p>{address.country}</p>
                                </div>
                              </div>

                              <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-1 sm:space-y-0">
                                <div className="flex items-center space-x-2">
                                  <Phone className="w-3 h-3 text-amber-600" />
                                  <p className="text-xs text-black">{address.phone}</p>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Mail className="w-3 h-3 text-amber-600" />
                                  <p className="text-xs text-black">{address.email}</p>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>

                      {addresses.length === 0 && !loading && (
                        <div className="text-center py-8">
                          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <MapPin className="w-8 h-8 text-amber-500" />
                          </div>
                          <h3 className="font-semibold text-amber-800 mb-2">No addresses saved</h3>
                          <p className="text-amber-600 text-sm">Add your first delivery address to continue</p>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                      {!openForm ? (
                        <>
                          <Button
                            onClick={() => setOpenForm(true)}
                            className="bg-black hover:bg-gray-800 text-white shadow-lg flex-1"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add New Address
                          </Button>
                          <Link href="/user/orderTime" className="flex-1">
                            <Button
                              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-lg"
                              disabled={!addressSelect}
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Continue to Payment
                            </Button>
                          </Link>
                        </>
                      ) : (
                        <div className="w-full">
                          <AnimatePresence>
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4 sm:p-6"
                            >
                              <h3 className="text-lg font-semibold text-amber-800 mb-4 font-poorStory">Add New Address</h3>
                              <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <div>
                                    <Label className="text-amber-800 font-medium text-sm">First Name</Label>
                                    <Input
                                      type="text"
                                      value={formData.firstName}
                                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                      className="border-amber-200 focus:ring-amber-500 focus:border-amber-500 mt-1"
                                      required
                                    />
                                  </div>
                                  <div>
                                    <Label className="text-amber-800 font-medium text-sm">Last Name</Label>
                                    <Input
                                      type="text"
                                      value={formData.lastName}
                                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                      className="border-amber-200 focus:ring-amber-500 focus:border-amber-500 mt-1"
                                      required
                                    />
                                  </div>
                                </div>

                                <div>
                                  <Label className="text-amber-800 font-medium text-sm">Address Line 1</Label>
                                  <Input
                                    type="text"
                                    value={formData.addressLine1}
                                    onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                                    className="border-amber-200 focus:ring-amber-500 focus:border-amber-500 mt-1"
                                    required
                                  />
                                </div>

                                <div>
                                  <Label className="text-amber-800 font-medium text-sm">Address Line 2 (Optional)</Label>
                                  <Input
                                    type="text"
                                    value={formData.addressLine2}
                                    onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
                                    className="border-amber-200 focus:ring-amber-500 focus:border-amber-500 mt-1"
                                  />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <div>
                                    <Label className="text-amber-800 font-medium text-sm">City</Label>
                                    <Input
                                      type="text"
                                      value={formData.city}
                                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                      className="border-amber-200 focus:ring-amber-500 focus:border-amber-500 mt-1"
                                      required
                                    />
                                  </div>
                                  <div>
                                    <Label className="text-amber-800 font-medium text-sm">State</Label>
                                    <Input
                                      type="text"
                                      value={formData.state}
                                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                      className="border-amber-200 focus:ring-amber-500 focus:border-amber-500 mt-1"
                                      required
                                    />
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <div>
                                    <Label className="text-amber-800 font-medium text-sm">ZIP Code</Label>
                                    <Input
                                      type="text"
                                      value={formData.zipCode}
                                      onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                                      className="border-amber-200 focus:ring-amber-500 focus:border-amber-500 mt-1"
                                      required
                                    />
                                  </div>
                                  <div>
                                    <Label className="text-amber-800 font-medium text-sm">Country</Label>
                                    <Input
                                      type="text"
                                      value={formData.country}
                                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                      className="border-amber-200 focus:ring-amber-500 focus:border-amber-500 mt-1"
                                      required
                                    />
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <div>
                                    <Label className="text-amber-800 font-medium text-sm">Phone Number</Label>
                                    <Input
                                      type="tel"
                                      value={formData.phone}
                                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                      className="border-amber-200 focus:ring-amber-500 focus:border-amber-500 mt-1"
                                      required
                                    />
                                  </div>
                                  <div>
                                    <Label className="text-amber-800 font-medium text-sm">Email</Label>
                                    <Input
                                      type="email"
                                      value={formData.email}
                                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                      className="border-amber-200 focus:ring-amber-500 focus:border-amber-500 mt-1"
                                      required
                                    />
                                  </div>
                                </div>

                                <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 mt-6">
                                  <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setOpenForm(false)}
                                    className="border-amber-300 text-amber-700 hover:bg-amber-50"
                                    disabled={submitting}
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    type="submit"
                                    className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-orange-600 hover:to-amber-700 text-white shadow-lg"
                                    disabled={submitting}
                                  >
                                    {submitting ? (
                                      <span className="flex items-center">
                                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                                        Saving...
                                      </span>
                                    ) : (
                                      'Save Address'
                                    )}
                                  </Button>
                                </div>
                              </form>
                            </motion.div>
                          </AnimatePresence>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default withAuth(Address)