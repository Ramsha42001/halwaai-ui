import { Logs } from "lucide-react";
import { Progress } from "@radix-ui/react-progress";

// Sample data for menu items and descriptions
const menuItems = [
  { name: "Item 1", description: "Description for Item 1" },
  { name: "Item 2", description: "Description for Item 2" },
  { name: "Item 3", description: "Description for Item 3" },
];

export default function Sidebar() {
  return (
    <>
      <div className="w-[300px] bg-background text-white h-[100vh] fixed top-0 left-0 p-4">
        {/* Header */}
        <div className="mt-[100px] flex items-center space-x-4">
          <Logs className="w-6 h-6" />
          <h3 className="text-3xl font-medium font-poorStory">Thali Progress</h3>
        </div>

        {/* Progress Bar Section */}
        <div className="mt-8">
          <Progress className="w-full h-4 bg-[white] rounded-lg mt-2 border-[2px] border-[black]">
            <div
              className="bg-[black] h-full rounded-lg transition-all"
              style={{ width: "30%" }} // Replace with dynamic value if needed
            ></div>
          </Progress>
        </div>

        {/* Menu Items Section */}
        <div className="mt-10">
          <h4 className="text-2xl font-medium">Menu Items</h4>
          <div className="mt-4 space-y-4">
            {menuItems.map((item, index) => (
              <div key={index}>
                <h5 className="text-lg font-medium">{item.name}</h5>
                <p className="text-sm text-gray-300">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
