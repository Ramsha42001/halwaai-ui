'use client'

import { useState, useEffect } from 'react'
import { useStore } from '@/services/store/menuItemsStore' // Adjust path as needed
import withAuth from "@/utils/withAuth"
import { useRouter } from 'next/navigation'

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
            // Express: next 4 hours from now
            const now = new Date()
            const selectedDateTime = new Date()
            selectedDateTime.setHours(hours, mins, 0, 0)

            const maxTime = new Date(now.getTime() + 4 * 60 * 60 * 1000)
            return selectedDateTime > now && selectedDateTime <= maxTime
        } else {
            // Standard: 9 AM to 9 PM
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
            const angle = (i * 30 - 90) * (Math.PI / 180) // -90 to start at 12 o'clock
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
        for (let i = 0; i < 60; i += 5) { // Every 5 minutes
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
                <div className="text-3xl font-bold text-gray-800 mb-2">
                    {selectedHour.toString().padStart(2, '0')}:{selectedMinute.toString().padStart(2, '0')} {isAM ? 'AM' : 'PM'}
                </div>
                <div className="text-sm text-gray-600">
                    {deliveryType === 'express' ? 'Express Delivery (Next 4 hours)' : 'Standard Delivery (9 AM - 9 PM)'}
                </div>
            </div>

            {/* Clock */}
            <div className="relative">
                <svg width="300" height="300" className="drop-shadow-lg">
                    {/* Clock face */}
                    <circle
                        cx="150"
                        cy="150"
                        r="140"
                        fill="white"
                        stroke="#e5e7eb"
                        strokeWidth="2"
                    />

                    {/* Hour markers */}
                    {hourPositions.map((hour) => (
                        <g key={`hour-${hour.number}`}>
                            <circle
                                cx={hour.x * 3}
                                cy={hour.y * 3}
                                r="16"
                                fill={hour.isSelected ? '#000000' : hour.isAvailable ? '#f3f4f6' : '#e5e7eb'}
                                stroke={hour.isSelected ? '#000000' : hour.isAvailable ? '#9ca3af' : '#d1d5db'}
                                strokeWidth="2"
                                className={hour.isAvailable ? 'cursor-pointer hover:fill-gray-300' : 'cursor-not-allowed'}
                                onClick={() => hour.isAvailable && handleHourChange(hour.number)}
                            />
                            <text
                                x={hour.x * 3}
                                y={hour.y * 3 + 5}
                                textAnchor="middle"
                                className={`text-sm font-medium ${hour.isSelected ? 'fill-white' : hour.isAvailable ? 'fill-gray-700' : 'fill-gray-400'} ${hour.isAvailable ? 'cursor-pointer' : 'cursor-not-allowed'}`}
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
                            cx={minute.x * 3}
                            cy={minute.y * 3}
                            r="6"
                            fill={minute.isSelected ? '#000000' : minute.isAvailable ? '#9ca3af' : '#d1d5db'}
                            className={minute.isAvailable ? 'cursor-pointer hover:fill-gray-600' : 'cursor-not-allowed'}
                            onClick={() => minute.isAvailable && handleMinuteChange(minute.number)}
                        />
                    ))}

                    {/* Clock hands */}
                    {selectedTime && (
                        <>
                            {/* Hour hand */}
                            <line
                                x1="150"
                                y1="150"
                                x2={150 + 60 * Math.cos(hourAngle * Math.PI / 180)}
                                y2={150 + 60 * Math.sin(hourAngle * Math.PI / 180)}
                                stroke="#000000"
                                strokeWidth="4"
                                strokeLinecap="round"
                            />
                            {/* Minute hand */}
                            <line
                                x1="150"
                                y1="150"
                                x2={150 + 90 * Math.cos(minuteAngle * Math.PI / 180)}
                                y2={150 + 90 * Math.sin(minuteAngle * Math.PI / 180)}
                                stroke="#000000"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                            {/* Center dot */}
                            <circle cx="150" cy="150" r="6" fill="#000000" />
                        </>
                    )}
                </svg>
            </div>

            {/* AM/PM Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                    onClick={() => handleAMPMChange('AM')}
                    className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${isAM
                        ? 'bg-black text-white shadow-md'
                        : 'text-gray-600 hover:text-gray-800'
                        }`}
                >
                    AM
                </button>
                <button
                    onClick={() => handleAMPMChange('PM')}
                    className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${!isAM
                        ? 'bg-black text-white shadow-md'
                        : 'text-gray-600 hover:text-gray-800'
                        }`}
                >
                    PM
                </button>
            </div>

            {/* Quick time buttons for common delivery times */}
            <div className="grid grid-cols-3 gap-2 text-sm">
                {deliveryType === 'standard' ? (
                    ['09:00', '12:00', '15:00', '18:00', '21:00'].map((time) => (
                        <button
                            key={time}
                            onClick={() => onTimeChange(time)}
                            className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors"
                        >
                            {new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
                                hour: 'numeric',
                                minute: '2-digit',
                                hour12: true
                            })}
                        </button>
                    ))
                ) : (
                    // Express delivery quick times (next few hours)
                    Array.from({ length: 4 }, (_, i) => {
                        const time = new Date(Date.now() + (i + 1) * 60 * 60 * 1000)
                        const timeString = `${time.getHours().toString().padStart(2, '0')}:00`
                        return (
                            <button
                                key={timeString}
                                onClick={() => onTimeChange(timeString)}
                                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors"
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

    // Get store state and actions
    const { deliverySchedule, setDeliverySchedule, loading } = useStore()
    const user = localStorage.getItem('authToken')
    const router = useRouter()

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
        // Reset selected time when delivery type changes
        setSelectedTime('')
    }

    const handleTimeChange = (time: string) => {
        setSelectedTime(time)
    }

    const handleConfirm = async () => {
        if (selectedDate && selectedTime && user) {
            const availableDates = getAvailableDates()

            const dateLabel = availableDates.find(d => d.value === selectedDate)?.label || selectedDate

            // Format time label
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

    return (
        <div className="min-h-screen from-blue-50 via-white to-purple-50 pb-[70px]">
            <div className="pt-[100px] pb-8 px-4">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="font-poorStory font-bold text-4xl md:text-5xl text-gray-800 mb-4">
                            Schedule Your Delivery
                        </h1>
                        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                            Choose your preferred delivery date and time. We'll make sure your order arrives exactly when you need it.
                        </p>
                    </div>

                    <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">

                        {/* Delivery Type Selection */}
                        {/* <div className="p-8 border-b border-gray-100">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Delivery Type</h2>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => handleDeliveryTypeChange('standard')}
                                    className={`flex-1 p-4 rounded-xl border-2 transition-all duration-300 ${deliveryType === 'standard'
                                        ? 'border-black bg-black text-white'
                                        : 'border-gray-200 hover:border-black hover:bg-black hover:text-white'
                                        }`}
                                >
                                    <div className="font-semibold">Standard Delivery</div>
                                    <div className="text-sm opacity-75 mt-1">Next day delivery</div>
                                </button>
                                <button
                                    onClick={() => handleDeliveryTypeChange('express')}
                                    className={`flex-1 p-4 rounded-xl border-2 transition-all duration-300 ${deliveryType === 'express'
                                        ? 'border-black bg-black text-white'
                                        : 'border-gray-200 hover:border-black hover:bg-black hover:text-white'
                                        }`}
                                >
                                    <div className="font-semibold">Express Delivery</div>
                                    <div className="text-sm opacity-75 mt-1">Same day delivery</div>
                                </button>
                            </div>
                        </div> */}

                        {/* Date Selection */}
                        <div className="p-8 border-b border-gray-100">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Select Date</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                                {availableDates.map((date) => (
                                    <div
                                        key={date.value}
                                        className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 text-center ${selectedDate === date.value
                                            ? 'border-black bg-black text-white shadow-lg transform scale-105'
                                            : 'border-gray-200 hover:border-black hover:bg-black hover:text-white hover:shadow-md'
                                            }`}
                                        onClick={() => setSelectedDate(date.value)}
                                    >
                                        <div className={`font-medium text-sm mb-1 ${selectedDate === date.value ? 'text-white' : 'text-black'}`}>
                                            {date.label.split(',')[0]}
                                        </div>
                                        <div className={`text-xs opacity-75 ${selectedDate === date.value ? 'text-white' : 'text-black'}`}>
                                            {date.label.split(',')[1]?.trim()}
                                        </div>
                                        {date.isToday && (
                                            <div className="absolute -top-2 -right-2">
                                                <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                                    Tomorrow
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Time Selection with Clock */}
                        <div className="p-8">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Select Time</h2>
                            <div className="flex justify-center">
                                <TimeClock
                                    selectedTime={selectedTime}
                                    onTimeChange={handleTimeChange}
                                    deliveryType={deliveryType}
                                />
                            </div>
                        </div>

                        {/* Confirmation Section */}
                        <div className="p-8 bg-gray-50 border-t border-gray-100">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                <div className="text-center md:text-left">
                                    <h3 className="font-semibold text-lg text-gray-800 mb-2">Delivery Summary</h3>
                                    {selectedDate && selectedTime ? (
                                        <div className="space-y-1">
                                            <p className="text-gray-600">
                                                <span className="font-medium">Type:</span> {deliveryType === 'express' ? 'Express' : 'Standard'} Delivery
                                            </p>
                                            <p className="text-gray-600">
                                                <span className="font-medium">Date:</span> {
                                                    availableDates.find(d => d.value === selectedDate)?.label
                                                }
                                            </p>
                                            <p className="text-gray-600">
                                                <span className="font-medium">Time:</span> {
                                                    (() => {
                                                        const [hours, minutes] = selectedTime.split(':').map(Number)
                                                        const timeObj = new Date()
                                                        timeObj.setHours(hours, minutes, 0, 0)
                                                        return timeObj.toLocaleTimeString('en-US', {
                                                            hour: 'numeric',
                                                            minute: '2-digit',
                                                            hour12: true
                                                        })
                                                    })()
                                                }
                                            </p>
                                        </div>
                                    ) : (
                                        <p className="text-gray-500">Please select date and time</p>
                                    )}
                                </div>

                                <button
                                    onClick={handleConfirm}
                                    disabled={!selectedDate || !selectedTime || loading}
                                    className={`px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 ${selectedDate && selectedTime && !loading
                                        ? 'bg-black text-white hover:text-white hover:bg-gray-800 shadow-lg hover:shadow-xl transform hover:scale-105'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        }`}
                                >
                                    {loading ? 'Saving...' : 'Confirm Delivery Time'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default withAuth(OrderTime)