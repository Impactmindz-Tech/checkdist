import Images from "@/constant/Images";
import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { offernoti } from "@/utills/service/avtarService/HomeService";

export default function InstantLiveCard() {
  const [switchState, setSwitchState] = useState(() => {
    // Retrieve the initial state from localStorage
    const savedState = localStorage.getItem("publicLiveOffers");
    return savedState === "true"; // Convert string back to boolean
  });
  const [loading, setLoading] = useState(false);

  const handleSwitchChange = async () => {
    const newState = !switchState;
    setSwitchState(newState);
    setLoading(true); // Set loading state to true

    // Send the updated state to the backend via the offernoti API
    try {
      await offernoti({ offer: newState });
  

      // Save the new state to localStorage
      localStorage.setItem("publicLiveOffers", newState);
    } catch (error) {
      console.error("Error updating switch state:", error);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  useEffect(() => {
    // Update localStorage when the switchState changes
    localStorage.setItem("publicLiveOffers", switchState);
  }, [switchState]);

  return (
    <div className="flex justify-between items-center squareShadow p-4">
      <div className="flex gap-2 items-center">
        <h1 className="text-danger font-medium sm:text-base">
          Public Live Offers
        </h1>
        <div className="images">
          <img src={Images.info} alt="info" />
        </div>
      </div>
      <div className="flex">
        <Switch
          id="airplane-mode"
          checked={switchState}
          onCheckedChange={handleSwitchChange}
          disabled={loading} // Disable switch while loading
        />
      </div>
    </div>
  );
}
