'use client'

import { Star, Clock, Users, ChefHat } from 'lucide-react'
import { ThaliCard } from "@/components/thaaliComponent/page"
import withAuth from '@/utils/withAuth';
import predefinedThaliService from '@/services/api/predefinedThaliService';

function SpecialThali() {
    // Mock data structured to match ThaliCard interface
    const thalis = [
        {
            _id: "1",
            title: "Royal Maharaja Thali",
            description: "A grand feast fit for royalty featuring premium basmati rice, dal makhani, paneer butter masala, chicken curry, mutton biryani, assorted naans, raita, pickles, and traditional sweets.",
            price: 899,
            image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop",
            items: [
                { _id: "item1", name: "Basmati Rice", price: 120, quantity: 1 },
                { _id: "item2", name: "Dal Makhani", price: 180, quantity: 1 },
                { _id: "item3", name: "Paneer Butter Masala", price: 220, quantity: 1 },
                { _id: "item4", name: "Chicken Curry", price: 280, quantity: 1 },
                { _id: "item5", name: "Mutton Biryani", price: 320, quantity: 1 },
                { _id: "item6", name: "Assorted Naans", price: 80, quantity: 2 },
                { _id: "item7", name: "Raita", price: 60, quantity: 1 },
                { _id: "item8", name: "Pickles", price: 40, quantity: 1 },
                { _id: "item9", name: "Gulab Jamun", price: 100, quantity: 2 }
            ],
            isPopular: true
        },
        {
            _id: "2",
            title: "South Indian Special Thali",
            description: "Authentic South Indian delicacies including sambar rice, rasam, curd rice, vegetable curry, coconut chutney, appalam, and traditional payasam dessert.",
            price: 649,
            image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=300&fit=crop",
            items: [
                { _id: "item10", name: "Sambar Rice", price: 100, quantity: 1 },
                { _id: "item11", name: "Rasam", price: 80, quantity: 1 },
                { _id: "item12", name: "Curd Rice", price: 90, quantity: 1 },
                { _id: "item13", name: "Vegetable Curry", price: 120, quantity: 1 },
                { _id: "item14", name: "Coconut Chutney", price: 50, quantity: 1 },
                { _id: "item15", name: "Appalam", price: 30, quantity: 2 },
                { _id: "item16", name: "Pickle", price: 40, quantity: 1 },
                { _id: "item17", name: "Payasam", price: 80, quantity: 1 }
            ],
            isPopular: false
        },
        {
            _id: "3",
            title: "Punjabi Dhaba Thali",
            description: "Hearty Punjabi cuisine with butter chicken, dal tadka, mixed vegetables, jeera rice, butter naan, lassi, and traditional jalebi for dessert.",
            price: 749,
            image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&h=300&fit=crop",
            items: [
                { _id: "item18", name: "Butter Chicken", price: 280, quantity: 1 },
                { _id: "item19", name: "Dal Tadka", price: 150, quantity: 1 },
                { _id: "item20", name: "Mixed Vegetables", price: 140, quantity: 1 },
                { _id: "item21", name: "Jeera Rice", price: 110, quantity: 1 },
                { _id: "item22", name: "Butter Naan", price: 60, quantity: 2 },
                { _id: "item23", name: "Lassi", price: 80, quantity: 1 },
                { _id: "item24", name: "Pickle", price: 40, quantity: 1 },
                { _id: "item25", name: "Jalebi", price: 70, quantity: 2 }
            ],
            isPopular: true
        },
        {
            _id: "4",
            title: "Gujarati Traditional Thali",
            description: "Complete vegetarian Gujarati experience with dal, kadhi, mixed vegetable sabzi, rotli, rice, farsan, pickle, and sweet to end the meal perfectly.",
            price: 549,
            image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=300&fit=crop",
            items: [
                { _id: "item26", name: "Dal", price: 100, quantity: 1 },
                { _id: "item27", name: "Kadhi", price: 120, quantity: 1 },
                { _id: "item28", name: "Mixed Sabzi", price: 130, quantity: 1 },
                { _id: "item29", name: "Rotli", price: 20, quantity: 3 },
                { _id: "item30", name: "Rice", price: 80, quantity: 1 },
                { _id: "item31", name: "Farsan", price: 60, quantity: 1 },
                { _id: "item32", name: "Pickle", price: 40, quantity: 1 },
                { _id: "item33", name: "Sweet", price: 70, quantity: 1 }
            ],
            isPopular: false
        },
        {
            _id: "5",
            title: "Bengali Fish Curry Thali",
            description: "Authentic Bengali flavors with fish curry, rice, dal, aloo posto, bhaja, shukto, chutney, and mishti doi to complete the traditional experience.",
            price: 799,
            image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&h=300&fit=crop",
            items: [
                { _id: "item34", name: "Fish Curry", price: 250, quantity: 1 },
                { _id: "item35", name: "Steamed Rice", price: 80, quantity: 1 },
                { _id: "item36", name: "Dal", price: 100, quantity: 1 },
                { _id: "item37", name: "Aloo Posto", price: 120, quantity: 1 },
                { _id: "item38", name: "Bhaja", price: 90, quantity: 1 },
                { _id: "item39", name: "Shukto", price: 110, quantity: 1 },
                { _id: "item40", name: "Chutney", price: 50, quantity: 1 },
                { _id: "item41", name: "Mishti Doi", price: 80, quantity: 1 }
            ],
            isPopular: false
        },
        {
            _id: "6",
            title: "Rajasthani Royal Thali",
            description: "Experience royal Rajasthani hospitality with dal baati churma, gatte ki sabzi, ker sangri, bajra roti, buttermilk, and traditional ghevar dessert.",
            price: 849,
            image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop",
            items: [
                { _id: "item42", name: "Dal Baati Churma", price: 200, quantity: 1 },
                { _id: "item43", name: "Gatte Ki Sabzi", price: 150, quantity: 1 },
                { _id: "item44", name: "Ker Sangri", price: 140, quantity: 1 },
                { _id: "item45", name: "Bajra Roti", price: 40, quantity: 2 },
                { _id: "item46", name: "Buttermilk", price: 60, quantity: 1 },
                { _id: "item47", name: "Pickle", price: 40, quantity: 1 },
                { _id: "item48", name: "Papad", price: 30, quantity: 2 },
                { _id: "item49", name: "Ghevar", price: 120, quantity: 1 }
            ],
            isPopular: true
        }
    ]

    return (
        <div className="min-h-screen bg-gray-50 mt-[70px]">
            {/* Header Section - Matching admin component style */}
            <div className="bg-[#fff5f5] shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
                            Special Thali Collection
                        </h1>
                        <div className="flex items-center gap-6 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                                <ChefHat className="w-4 h-4" />
                                <span>Chef's Special</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span>Premium Quality</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                <span>Fresh & Hot</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content - Using ThaliCard components */}
            <div className="mx-auto px-4 pt-[20px] sm:px-6 lg:px-8 pb-[100px] bg-[#fff5f5]">
                {/* Thalis Grid - Adjusted for ThaliCard sizing */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
                    {thalis.map((thali) => (
                        <div key={thali._id} className="relative">
                            {/* Popular Badge - positioned over ThaliCard */}
                            {thali.isPopular && (
                                <div className="absolute top-2 left-2 z-20 bg-black text-white px-3 py-1 rounded-md text-xs font-medium">
                                    Most Popular
                                </div>
                            )}

                            <ThaliCard
                                _id={thali._id}
                                title={thali.title}
                                description={thali.description}
                                items={thali.items}
                                image={thali.image}
                                price={thali.price}
                                onClick={() => {
                                    // Handle click - could navigate to details page
                                    console.log('Thali clicked:', thali.title);
                                }}
                                onDelete={() => {
                                    // Handle delete if needed for customer view
                                    console.log('Delete clicked for:', thali.title);
                                }}
                                showButton={false} // Set to false for customer view, true for admin view
                            />
                        </div>
                    ))}
                </div>

                {/* Empty State - if no thalis */}
                {thalis.length === 0 && (
                    <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <ChefHat className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Special Thalis Available</h3>
                        <p className="text-gray-500 mb-6 max-w-md">
                            Our chefs are preparing some amazing thali combinations. Please check back soon!
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default withAuth(SpecialThali)