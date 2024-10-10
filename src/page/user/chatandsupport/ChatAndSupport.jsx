import ChatAndSupportCard from "@/components/Cards/ChatAndSupport/ChatAndSupportCard";
import HeaderBack from "@/components/HeaderBack";

function ChatAndSupport() {
  const chatSupport = () => {

   const email = import.meta.env.VITE_APP_EMAIL ;
    window.location.href = `mailto:${email}`;
  };
  const handleCancel = () => {
    // Go back to the previous page in the history
    window.history.back();
  };

  return (
    <div className="container mx-auto px-4 py-8 relative">
      <HeaderBack link="/user/profile" text={"Chat with Support"} />

      <div className="main mt-6 space-y-8">
        <ChatAndSupportCard
          title={"How do I set the availability for my tours in Avatars Walk?"}
          desc={
            <div>
              <h3 className="font-semibold">1. Log in to your Avatar account:</h3>
              <p>Ensure that you're logged in as an avatar with the appropriate permissions.</p>
              <h3 className="font-semibold">2. Navigate to the Availability Section:</h3>
              <p>
                Go to the Availability or Schedule tab in your avatar dashboard. This section allows you to manage the
                dates and times when you're available for tours.
              </p>
              <h3 className="font-semibold">3. Set or Adjust Your Schedule:</h3>
              <p>
                You should see a calendar or time slot option here. Select the days and times when you're available.
              </p>
              <h3 className="font-semibold">4. Save Changes:</h3>
              <p>
                After making adjustments, click on the Save or Update button to finalize your availability settings.
              </p>
            </div>
          }
        />

        <ChatAndSupportCard
          title={"How can I get paid as an Avatar?"}
          desc={
            <div>
              <h3 className="font-semibold">1. Ensure Account Verification:</h3>
              <p>
                Make sure your account is fully verified, including providing any necessary identification documents, and
                that you are approved as an avatar.
              </p>
              <h3 className="font-semibold">2. Set Up Payment Information:</h3>
              <p>
                Navigate to your profile or settings page. Add your preferred payment method, such as a bank account or
                PayPal.
              </p>
              <h3 className="font-semibold">3. Complete Tours:</h3>
              <p>
                Payments will be processed after completing a tour based on the agreed terms with users.
              </p>
              <h3 className="font-semibold">4. Payment Schedule:</h3>
              <p>
                Payments are made at regular intervals (weekly, bi-weekly, or monthly), depending on the platform’s
                policy.
              </p>
            </div>
          }
        />

        <ChatAndSupportCard
          title={"I'm having issues with time zone and Avatar availability"}
          desc={
            <div>
              <h3 className="font-semibold">1. Ensure Time Zone Accuracy:</h3>
              <p>
                Verify that your avatar's time zone is correctly set in profile settings.
              </p>
              <h3 className="font-semibold">2. Sync with Availability:</h3>
              <p>
                Confirm that your availability times are displayed in your local time zone.
              </p>
              <h3 className="font-semibold">3. Avoid Overlapping Slots:</h3>
              <p>
                Ensure your availability does not overlap with existing bookings.
              </p>
              <h3 className="font-semibold">4. Update System Time Settings:</h3>
              <p>
                Verify that your device's time zone matches your actual location.
              </p>
            </div>
          }
        />
      </div>

      <div className="mt-10">
        <button onClick={handleCancel} className="border border-gray-900 text-gray-900 py-4 font-bold rounded-md w-full">
          Cancel
        </button>

        <div className="w-full block my-4">
          <button onClick={chatSupport} className="bg-gray-900 text-white py-4 font-bold rounded-md w-full">
            Still Need Help?
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatAndSupport;
