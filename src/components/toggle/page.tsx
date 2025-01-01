"use client"

import * as React from "react"
import { Toggle } from "@/components/ui/toggle"

interface YesNoToggleProps {
  onToggle: (pressed: boolean) => void
  defaultPressed?: boolean
}

export function YesNoToggle({ onToggle, defaultPressed = false }: YesNoToggleProps) {
  const [pressed, setPressed] = React.useState(defaultPressed)

  const handleToggle = (pressed: boolean) => {
    setPressed(pressed)
    onToggle(pressed)
  }

  return (
    <Toggle
      defaultPressed={defaultPressed}
      onPressedChange={handleToggle}
      className="w-[50px] h-[25px] rounded-full relative transition-all duration-300 ease-in-out data-[state=on]:bg-green-600 data-[state=off]:bg-gray-400"
    >
      <div className="absolute inset-0 flex items-center justify-between px-1">
        <span
          className={`text-xs font-medium text-white transition-opacity duration-300 ${
            pressed ? "opacity-100" : "opacity-0"
          }`}
        >
          Yes
        </span>
        <span
          className={`text-xs font-medium text-white transition-opacity duration-300 ${
            pressed ? "opacity-0" : "opacity-100"
          }`}
        >
          No
        </span>
      </div>
      <div
        className={`w-[18px] h-[18px] bg-white rounded-full shadow-lg transition-transform duration-300 ease-in-out ${
          pressed ? "translate-x-[14px]" : "translate-x-[-13px]"
        }`}
      />
    </Toggle>
  )
}
