'use client'

import { useState, useEffect } from 'react'
import { useStore } from '@/services/store/menuItemsStore'
import withAuth from "@/utils/withAuth"
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { ChevronLeft, Clock, Calendar, CheckCircle, MapPin } from 'lucide-react'
import Link from "next/link"
import { Badge } from '@/components/ui/badge'
import { motion, AnimatePresence } from 'framer-motion'
import { storageService } from '@/utils/storage'

interface TimeClockProps {
    selectedTime: string
    onTimeChange: (time: string) => void
    deliveryType: 'standard' | 'express'
}

// Clock Component
const TimeClock = ({ selectedTime, onTimeChange, deliveryType }: TimeClockProps) => {
    const [isAM, setIsAM] = useState(true)
    const [selectedHour, setSelectedHour] = useState(12)
    const [selectedMinute, setSelectedMinute] = useState(0)

    // Parse selectedTime when it changes
    useEffect(() => {
        if (selectedTime) {
            const [hours, minutes] = selectedTime.split(':').map(Number)
            const hour12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours
            setSelectedHour(hour12)
            setSelectedMinute(minutes)
            setIsAM(hours < 12)
        }
    }, [selectedTime])

    // Convert 12-hour format to 24-hour format
    const convertTo24Hour = (hour: number, minute: number, isAM: boolean): string => {
        let hour24 = hour
        if (isAM && hour === 12) hour24 = 0
        else if (!isAM && hour !== 12) hour24 = hour + 12

        return `${hour24.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
    }

    // Check if time is available based on delivery type
    const isTimeAvailable = (hour: number, minute: number, isAM: boolean): boolean => {
        const time24 = convertTo24Hour(hour, minute, isAM)
        const [hours, mins] = time24.split(':').map(Number)

        if (deliveryType === 'express') {
            const now = new Date()
            const selectedDateTime = new Date()
            selectedDateTime.setHours(hours, mins, 0, 0)

            const maxTime = new Date(now.getTime() + 4 * 60 * 60 * 1000)
            return selectedDateTime > now && selectedDateTime <= maxTime
        } else {
            return hours >= 9 && hours <= 21
        }
    }

    const handleHourChange = (hour: number) => {
        if (isTimeAvailable(hour, selectedMinute, isAM)) {
            setSelectedHour(hour)
            const time24 = convertTo24Hour(hour, selectedMinute, isAM)
            onTimeChange(time24)
        }
    }

    const handleMinuteChange = (minute: number) => {
        if (isTimeAvailable(selectedHour, minute, isAM)) {
            setSelectedMinute(minute)
            const time24 = convertTo24Hour(selectedHour, minute, isAM)
            onTimeChange(time24)
        }
    }

    const handleAMPMChange = (ampm: string) => {
        const newIsAM = ampm === 'AM'
        if (isTimeAvailable(selectedHour, selectedMinute, newIsAM)) {
            setIsAM(newIsAM)
            const time24 = convertTo24Hour(selectedHour, selectedMinute, newIsAM)
            onTimeChange(time24)
        }
    }

    // Generate hour numbers around the clock
    const generateHourPositions = () => {
        const hours = []
        for (let i = 1; i <= 12; i++) {
            const angle = (i * 30 - 90) * (Math.PI / 180)
            const x = 50 + 35 * Math.cos(angle)
            const y = 50 + 35 * Math.sin(angle)
            const isAvailable = isTimeAvailable(i, selectedMinute, isAM)

            hours.push({
                number: i,
                x,
                y,
                isSelected: selectedHour === i,
                isAvailable
            })
        }
        return hours
    }

    // Generate minute marks
    const generateMinutePositions = () => {
        const minutes = []
        for (let i = 0; i < 60; i += 5) {
            const angle = (i * 6 - 90) * (Math.PI / 180)
            const x = 50 + 42 * Math.cos(angle)
            const y = 50 + 42 * Math.sin(angle)
            const isAvailable = isTimeAvailable(selectedHour, i, isAM)

            minutes.push({
                number: i,
                x,
                y,
                isSelected: selectedMinute === i,
                isAvailable
            })
        }
        return minutes
    }

    const hourPositions = generateHourPositions()
    const minutePositions = generateMinutePositions()

    // Calculate hand positions
    const hourAngle = (selectedHour % 12) * 30 + selectedMinute * 0.5 - 90
    const minuteAngle = selectedMinute * 6 - 90

    return (
        <div className="flex flex-col items-center space-y-6">
            {/* Digital Time Display */}
            <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-amber-800 mb-2 font-poorStory">
                    {selectedHour.toString().padStart(2, '0')}:{selectedMinute.toString().padStart(2, '0')} {isAM ? 'AM' : 'PM'}
                </div>
                <div className="text-xs sm:text-sm text-amber-600 font-poppins">
                    {deliveryType === 'express' ? 'Express Delivery (Next 4 hours)' : 'Standard Delivery (9 AM - 9 PM)'}
                </div>
            </div>

            {/* Clock */}
            <div className="relative">
                <svg width="250" height="250" className="sm:w-[300px] sm:h-[300px] drop-shadow-lg">
                    {/* Clock face */}
                    <circle
                        cx="125"
                        cy="125"
                        r="115"
                        fill="white"
                        stroke="#f59e0b"
                        strokeWidth="2"
                        className="sm:cx-[150] sm:cy-[150] sm:r-[140]"
                    />

                    {/* Hour markers */}
                    {hourPositions.map((hour) => (
                        <g key={`hour-${hour.number}`}>
                            <circle
                                cx={hour.x * 2.5}
                                cy={hour.y * 2.5}
                                r="14"
                                fill={hour.isSelected ? '#d97706' : hour.isAvailable ? '#fef3c7' : '#f3f4f6'}
                                stroke={hour.isSelected ? '#d97706' : hour.isAvailable ? '#f59e0b' : '#d1d5db'}
                                strokeWidth="2"
                                className={`${hour.isAvailable ? 'cursor-pointer hover:fill-amber-200' : 'cursor-not-allowed'} sm:cx-[${hour.x * 3}] sm:cy-[${hour.y * 3}] sm:r-[16]`}
                                onClick={() => hour.isAvailable && handleHourChange(hour.number)}
                            />
                            <text
                                x={hour.x * 2.5}
                                y={hour.y * 2.5 + 4}
                                textAnchor="middle"
                                className={`text-xs sm:text-sm font-medium ${hour.isSelected ? 'fill-white' : hour.isAvailable ? 'fill-amber-800' : 'fill-gray-400'} ${hour.isAvailable ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                                onClick={() => hour.isAvailable && handleHourChange(hour.number)}
                            >
                                {hour.number}
                            </text>
                        </g>
                    ))}

                    {/* Minute markers */}
                    {minutePositions.map((minute) => (
                        <circle
                            key={`minute-${minute.number}`}
                            cx={minute.x * 2.5}
                            cy={minute.y * 2.5}
                            r="5"
                            fill={minute.isSelected ? '#d97706' : minute.isAvailable ? '#f59e0b' : '#d1d5db'}
                            className={`${minute.isAvailable ? 'cursor-pointer hover:fill-amber-600' : 'cursor-not-allowed'}`}
                            onClick={() => minute.isAvailable && handleMinuteChange(minute.number)}
                        />
                    ))}

                    {/* Clock hands */}
                    {selectedTime && (
                        <>
                            {/* Hour hand */}
                            <line
                                x1="125"
                                y1="125"
                                x2={125 + 50 * Math.cos(hourAngle * Math.PI / 180)}
                                y2={125 + 50 * Math.sin(hourAngle * Math.PI / 180)}
                                stroke="#d97706"
                                strokeWidth="4"
                                strokeLinecap="round"
                            />
                            {/* Minute hand */}
                            <line
                                x1="125"
                                y1="125"
                                x2={125 + 75 * Math.cos(minuteAngle * Math.PI / 180)}
                                y2={125 + 75 * Math.sin(minuteAngle * Math.PI / 180)}
                                stroke="#d97706"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                            {/* Center dot */}
                            <circle cx="125" cy="125" r="6" fill="#d97706" />
                        </>
                    )}
                </svg>
            </div>

            {/* AM/PM Toggle */}
            <div className="flex bg-amber-100 rounded-lg p-1">
                <button
                    onClick={() => handleAMPMChange('AM')}
                    className={`px-4 sm:px-6 py-2 rounded-md font-medium transition-all duration-200 text-sm sm:text-base ${isAM
                        ? 'bg-amber-600 text-white shadow-md'
                        : 'text-amber-700 hover:text-amber-800'
                        }`}
                >
                    AM
                </button>
                <button
                    onClick={() => handleAMPMChange('PM')}
                    className={`px-4 sm:px-6 py-2 rounded-md font-medium transition-all duration-200 text-sm sm:text-base ${!isAM
                        ? 'bg-amber-600 text-white shadow-md'
                        : 'text-amber-700 hover:text-amber-800'
                        }`}
                >
                    PM
                </button>
            </div>

            {/* Quick time buttons for common delivery times */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
                {deliveryType === 'standard' ? (
                    ['09:00', '12:00', '15:00', '18:00', '21:00'].map((time) => (
                        <button
                            key={time}
                            onClick={() => onTimeChange(time)}
                            className="px-3 py-2 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-lg transition-colors"
                        >
                            {new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
                                hour: 'numeric',
                                minute: '2-digit',
                                hour12: true
                            })}
                        </button>
                    ))
                ) : (
                    Array.from({ length: 4 }, (_, i) => {
                        const time = new Date(Date.now() + (i + 1) * 60 * 60 * 1000)
                        const timeString = `${time.getHours().toString().padStart(2, '0')}:00`
                        return (
                            <button
                                key={timeString}
                                onClick={() => onTimeChange(timeString)}
                                className="px-3 py-2 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-lg transition-colors"
                            >
                                {time.toLocaleTimeString('en-US', {
                                    hour: 'numeric',
                                    hour12: true
                                })}
                            </button>
                        )
                    })
                )}
            </div>
        </div>
    )
}

function OrderTime() {
    const [selectedDate, setSelectedDate] = useState('')
    const [selectedTime, setSelectedTime] = useState('')
    const [deliveryType, setDeliveryType] = useState<'standard' | 'express'>('standard')
    const [authToken, setAuthToken] = useState<string | null>(null)

    // Get store state and actions
    const { deliverySchedule, setDeliverySchedule, loading } = useStore()
    const router = useRouter()

    useEffect(() => {
        setAuthToken(storageService.getAuthToken())
    }, [])

    const user = authToken

    // Load existing delivery schedule on component mount
    useEffect(() => {
        if (deliverySchedule) {
            setSelectedDate(deliverySchedule.selectedDate)
            setSelectedTime(deliverySchedule.selectedTime)
            setDeliveryType(deliverySchedule.deliveryType)
        }
    }, [deliverySchedule])

    // Generate next 7 days for delivery options
    const getAvailableDates = () => {
        const dates = []
        const today = new Date()

        for (let i = 1; i <= 7; i++) {
            const date = new Date(today)
            date.setDate(today.getDate() + i)
            dates.push({
                value: date.toISOString().split('T')[0],
                label: date.toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'short',
                    day: 'numeric'
                }),
                isToday: i === 1
            })
        }
        return dates
    }

    const handleDeliveryTypeChange = (type: 'standard' | 'express') => {
        setDeliveryType(type)
        setSelectedTime('')
    }

    const handleTimeChange = (time: string) => {
        setSelectedTime(time)
    }

    const handleConfirm = async () => {
        if (selectedDate && selectedTime && user) {
            const availableDates = getAvailableDates()
            const dateLabel = availableDates.find(d => d.value === selectedDate)?.label || selectedDate

            const [hours, minutes] = selectedTime.split(':').map(Number)
            const timeObj = new Date()
            timeObj.setHours(hours, minutes, 0, 0)
            const timeLabel = timeObj.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            })

            const scheduleData = {
                selectedDate,
                selectedTime,
                deliveryType,
                dateLabel,
                timeLabel
            }

            try {
                await setDeliverySchedule(user, scheduleData)
                alert(`Delivery scheduled for ${dateLabel} at ${timeLabel}`)
                router.push('/user/payment')
            } catch (error) {
                alert('Failed to save delivery schedule. Please try again.')
            }
        } else {
            alert('Please select both date and time')
        }
    }

    const availableDates = getAvailableDates()

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    }

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.5, ease: "easeOut" }
        }
    }

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
                    <Link href="/user/address">
                        <Button
                            variant="outline"
                            size="sm"
                            className="bg-black hover:bg-gray-800  text-white hover:text-white shadow-md px-3 sm:px-4"
                        >
                            <ChevronLeft className="mr-1 sm:mr-2 h-4 w-4" />
                            <span className="hidden sm:inline">Back to Address</span>
                            <span className="sm:hidden">Back</span>
                        </Button>
                    </Link>

                    <div className="text-center flex-1 mx-2 sm:mx-4">
                        <h1 className="font-poorStory font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl bg-black bg-clip-text text-transparent">
                            Schedule Delivery
                        </h1>
                        <p className="text-black font-poppins text-xs sm:text-sm mt-1">
                            Choose your preferred delivery date and time
                        </p>
                    </div>

                    <div className="w-16 sm:w-20" />
                </motion.div>

                <div className="container mx-auto max-w-4xl">
                    <motion.div
                        className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-amber-200/50 overflow-hidden"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {/* Date Selection */}
                        <motion.div
                            className="p-4 sm:p-6 lg:p-8 border-b border-amber-100"
                            variants={itemVariants}
                        >
                            <div className="flex items-center space-x-2 mb-4 sm:mb-6">
                                <Calendar className="w-5 h-5 text-amber-500" />
                                <h2 className="text-lg sm:text-xl font-semibold text-black font-poorStory">Select Date</h2>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-3">
                                {availableDates.map((date) => (
                                    <motion.div
                                        key={date.value}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className={`relative p-3 sm:p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 text-center ${selectedDate === date.value
                                            ? 'border-amber-500 bg-amber-500 text-white shadow-lg'
                                            : 'border-amber-200 hover:border-amber-400 hover:bg-amber-50 hover:shadow-md'
                                            }`}
                                        onClick={() => setSelectedDate(date.value)}
                                    >
                                        <div className={`font-medium text-xs sm:text-sm mb-1 ${selectedDate === date.value ? 'text-white' : 'text-amber-800'
                                            }`}>
                                            {date.label.split(',')[0]}
                                        </div>
                                        <div className={`text-xs opacity-75 ${selectedDate === date.value ? 'text-white' : 'text-amber-600'
                                            }`}>
                                            {date.label.split(',')[1]?.trim()}
                                        </div>
                                        {date.isToday && (
                                            <div className="absolute -top-2 -right-2">
                                                <Badge className="bg-red-500 text-white text-xs">
                                                    Tomorrow
                                                </Badge>
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Time Selection with Clock */}
                        <motion.div
                            className="p-4 sm:p-6 lg:p-8"
                            variants={itemVariants}
                        >
                            <div className="flex items-center justify-center space-x-2 mb-4 sm:mb-6">
                                <Clock className="w-5 h-5 text-amber-500" />
                                <h2 className="text-lg sm:text-xl font-semibold text-amber-800 font-poorStory">Select Time</h2>
                            </div>
                            <div className="flex justify-center">
                                <TimeClock
                                    selectedTime={selectedTime}
                                    onTimeChange={handleTimeChange}
                                    deliveryType={deliveryType}
                                />
                            </div>
                        </motion.div>

                        {/* Confirmation Section */}
                        <motion.div
                            className="p-4 sm:p-6 lg:p-8 bg-gradient-to-r from-amber-50 to-orange-50 border-t border-amber-100"
                            variants={itemVariants}
                        >
                            <div className="flex flex-col lg:flex-row items-center justify-between gap-4 sm:gap-6">
                                <div className="text-center lg:text-left flex-1">
                                    {/* <div className="flex items-center justify-center lg:justify-start space-x-2 mb-3">
                                        <MapPin className="w-5 h-5 text-amber-500" />
                                        <h3 className="font-semibold text-lg text-amber-800 font-poorStory">Delivery Summary</h3>
                                    </div> */}
                                    {selectedDate && selectedTime ? (
                                        <div className="space-y-2">
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
                                                <div className="bg-white/70 rounded-lg p-3 text-center">
                                                    <p className="text-black text-xs font-medium">Date</p>
                                                    <p className="text-black font-semibold text-sm">
                                                        {availableDates.find(d => d.value === selectedDate)?.label}
                                                    </p>
                                                </div>
                                                <div className="bg-white/70 rounded-lg p-3 text-center">
                                                    <p className="text-black text-xs font-medium">Time</p>
                                                    <p className="text-black font-semibold">
                                                        {(() => {
                                                            const [hours, minutes] = selectedTime.split(':').map(Number)
                                                            const timeObj = new Date()
                                                            timeObj.setHours(hours, minutes, 0, 0)
                                                            return timeObj.toLocaleTimeString('en-US', {
                                                                hour: 'numeric',
                                                                minute: '2-digit',
                                                                hour12: true
                                                            })
                                                        })()}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ) : <></>}
                                </div>

                                <Button
                                    onClick={handleConfirm}
                                    disabled={!selectedDate || !selectedTime || loading}
                                    className={`px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-sm sm:text-lg transition-all duration-300 w-full sm:w-auto ${selectedDate && selectedTime && !loading
                                        ? 'bg-black text-white hover:bg-black shadow-lg hover:shadow-xl'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        }`}
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center">
                                            <div className="animate-spin h-4 w-4 sm:h-5 sm:w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                                            Saving...
                                        </span>
                                    ) : (
                                        <>
                                            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                                            Confirm Delivery Time
                                        </>
                                    )}
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}

export default withAuth(OrderTime)