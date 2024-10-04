import Images from "@/constant/Images";

const DeviceCard = ({ name, isSelected, onSelect }) => {
  return (
    <div
      className={`border-2 text-lg pl-4 py-3 my-2 pr-[50px] rounded-sm cursor-pointer relative ${
        isSelected ? "bg-black text-white" : "hover:bg-black hover:text-white"
      }`}
      onClick={onSelect}
    >
      {name}
      <img
        src={Images.iconCheckGray}
        alt=""
        className={`absolute top-[17px] right-[15px] opacity-0 ${
          isSelected && "opacity-100"
        }`}
      />
    </div>
  );
};

export default DeviceCard;
