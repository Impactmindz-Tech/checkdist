import { useEffect, useRef, useState } from "react";
import Loader from "../Loader";

const AddMoreTime = ({ show, onClose }) => {
  const [loader, setLoader] = useState(false);
  const [requestedTime, setRequestedTime] = useState(null);
  const modalRef = useRef();

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      onClose();
    }
  };

  useEffect(() => {
    if (show) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [show]);

  if (!show) return null;

  return (
    <>
      {loader && <Loader />}
      <div className="fixed flex items-end justify-center inset-0 bg-black bg-opacity-50 z-[99]">
        <div
          ref={modalRef}
          className="bg-white rounded-t-2xl px-7 shadow-lg w-full max-w-4xl xl:max-w-2xl lg:max-w-full p-3"
        >
          <h3 className="text-2xl text-center mt-4 font-semibold mb-6 sm:text-xl">
            Want to add more time?
          </h3>

          <div className="my-2">
            <div className="mb-2">
              <h3 className="text-lg font-semibold mb-2 sm:text-base">
                Duration
              </h3>
              <div className="flex space-x-2">
                <button
                  className={`p-3 sm:px-2 sm:py-1 sm:text-sm ${
                    requestedTime === 15 ? "bg-black text-white" : "bg-gray-200"
                  } rounded-md`}
                  onClick={() => setRequestedTime(15)}
                >
                  15 min
                </button>
                <button
                  className={`p-3 sm:px-2 sm:py-1 sm:text-sm ${
                    requestedTime === 30 ? "bg-black text-white" : "bg-gray-200"
                  } rounded-md`}
                  onClick={() => setRequestedTime(30)}
                >
                  30 min
                </button>
                <button
                  className={`p-3 sm:px-2 sm:py-1 sm:text-sm ${
                    requestedTime === 45 ? "bg-black text-white" : "bg-gray-200"
                  } rounded-md`}
                  onClick={() => setRequestedTime(45)}
                >
                  45 min
                </button>
                <button
                  className={`p-3 sm:px-2 sm:py-1 sm:text-sm ${
                    requestedTime === 60 ? "bg-black text-white" : "bg-gray-200"
                  } rounded-md`}
                  onClick={() => setRequestedTime(60)}
                >
                  1 hour
                </button>
              </div>
            </div>
          </div>

          <div className="flex mt-4 gap-4">
            <button
              onClick={onClose}
              className="bg-white border border-black text-black py-3 rounded md:text-sm w-full"
            >
              No
            </button>
            <button
              onClick={onClose}
              className="bg-black text-white py-3 rounded md:text-sm w-full"
            >
              Yes
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddMoreTime;
