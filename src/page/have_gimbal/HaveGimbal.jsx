import Images from "@/constant/Images";

const HaveGimbal = () => {
  return (
    <div className="have-gimbal h-[calc(100svh-65px)] md:h-[calc(100svh-170px)] pt-[40px] pb-[20px] sm:h-[calc(100svh-120px)] flex flex-col px-[15px] md:pb-0">
      <h2 className="text-center font-bold text-xl">Do you have a Gimbal?</h2>
      <img
        src={Images.haveGimbal}
        alt=""
        className="my-[20px] max-w-[400px] mx-auto w-full"
      />
      <div className="flex gap-4 mt-auto max-w-[400px] w-full mx-auto">
        <button
          type="button"
          className="btn flex-1 border border-black bg-white py-3 text-black text-center rounded-sm cursor-pointer mt-3"
        >
          Yes
        </button>
        <button
          type="button"
          className="btn flex-1 bg-black py-3 text-white text-center rounded-sm cursor-pointer mt-3"
        >
          No
        </button>
      </div>
    </div>
  );
};

export default HaveGimbal;
