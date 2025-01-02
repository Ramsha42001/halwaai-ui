'use client'

import { Button } from "@/components/ui/button"
import { ChevronLeft } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Toast } from "@/components/ui/toast"

// Form validation schema
const formSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^\+?[1-9]\d{9,13}$/, "Invalid phone number"),
  pincode: z.string().regex(/^\d{6}$/, "Pin code must be 6 digits"),
  address1: z.string().min(5, "Address must be at least 5 characters"),
  address2: z.string().optional(),
  saveAddress: z.boolean().default(false),
})

export default function Address() {
  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      pincode: "",
      address1: "",
      address2: "",
      saveAddress: false,
    },
  })

  // Form submission handler
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    // Handle form submission here
    form.reset()
  }

  return (
    <div className="min-h-[100vh] h-auto bg-[#FFF5F5] text-[black] px-4 pb-20 md:px-6 lg:px-8">
      <div className="py-[90px] md:pt-[70px]">
        <Button variant="default" className="bg-black hover:text-[black] mb-4 md:m-[30px]">
          <ChevronLeft /> Back
        </Button>

        <div className="w-full mx-auto">
          <h2 className="font-poorStory font-semibold text-2xl md:text-3xl text-[black] py-3 md:py-[20px] text-center">
            Set up your billing address
          </h2>

          <div className="w-full min-h-[80vh] flex flex-col md:flex-row gap-4 md:gap-8 justify-between items-start">
            {/* Left side - Image */}
            <div className="w-full md:w-[40%] flex justify-center items-start mb-6 md:mb-0 hidden md:flex">
  <img 
    src="/images/thali1.png" 
    alt="Thali" 
    className="rounded-lg w-full max-w-[300px] md:max-w-[400px] object-cover"
  />
</div>

            {/* Right side - Form */}
            <div className="w-full md:w-[50%] md:mr-[5%]">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
                  {/* Name Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John" className="bg-gray-50/50 h-11 md:h-12 px-4" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Doe" className="bg-gray-50/50 h-11 md:h-12 px-4" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Email */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Id</FormLabel>
                        <FormControl>
                          <Input 
                            type="email" 
                            placeholder="john@example.com" 
                            className="bg-gray-50/50 h-11 md:h-12 px-4" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Phone and Pin */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="+91-1234567890" 
                              className="bg-gray-50/50 h-11 md:h-12 px-4" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="pincode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Area Pin-code</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="123456" 
                              className="bg-gray-50/50 h-11 md:h-12 px-4" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Address Lines */}
                  <FormField
                    control={form.control}
                    name="address1"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address line 1</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="123 main street" 
                            className="bg-gray-50/50 h-11 md:h-12 px-4" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address2"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address line 2 (optional)</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="123 park" 
                            className="bg-gray-50/50 h-11 md:h-12 px-4" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Save Address Checkbox */}
                  <FormField
                    control={form.control}
                    name="saveAddress"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={(checked) => field.onChange(checked)}
                            className="border-[1px] bg-[black]"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            Save your address for using in future
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  {/* Submit Button */}
                  <Button 
                    type="submit"
                    className="w-full bg-black hover:bg-gray-800 text-white h-12 md:h-14 mt-6"
                  >
                    Proceed to add billing details
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
      <Toast />
    </div>
  )
}

