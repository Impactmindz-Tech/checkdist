
import Images from "@/constant/Images";

export default function AvatarProfileCard({ avatardetail }) {
  const calculateAverageRating = (reviews) => {
    if (reviews?.length > 0) {
      const totalRating = reviews.reduce(
        (acc, review) => acc + review.rating,
        0
      );
      return (totalRating / reviews.length).toFixed(1);
    }
    return 0;
  };

  const averageRating = calculateAverageRating(avatardetail?.Reviews);
  const userAtThisPlatformFrom = avatardetail?.year?.split(" ");
  return (
    <div className="my-8 ">
      <div className="flex items-center">
        <div className="w-[150px] sm:w-[60px]">
          <img
            src={avatardetail?.avatarImage || Images.user}
            alt="avatarProfile"
            className="w-full rounded-full aspect-square"
          />
        </div>
        <div className="flex w-[calc(100%-150px)] sm:w-[calc(100%-60px)]">
          <div className="text-center ml-[50px] sm:ml-[20px]">
            <h1 className="text-grey-900 text-2xl sm:text-sm">
              {avatardetail?.Reviews?.length}
            </h1>
            <p className="text-xl sm:text-sm text-slate-500">Reviews</p>
          </div>

          <div className="text-center ml-[50px] sm:ml-[20px]">
            <h1 className="text-grey-900 text-2xl flex justify-center gap-2 sm:text-sm">
              {averageRating}
              <img src={Images.star2} alt="star" className="sm:w-[12px]" />
            </h1>
            <p className="text-xl sm:text-sm text-slate-500">Ratings</p>
          </div>

          <div className="text-center ml-[50px] sm:ml-[20px]">
            <h1 className="text-grey-900 text-2xl flex justify-center gap-2 sm:text-sm">
              {userAtThisPlatformFrom && userAtThisPlatformFrom[0] > 0
                ? userAtThisPlatformFrom[0]
                : "1"}
            </h1>
            <p className="text-xl sm:text-sm text-slate-500 capitalize">
              {userAtThisPlatformFrom && userAtThisPlatformFrom[1]}
            </p>
          </div>
        </div>
      </div>
      <h1 className="text-grey-900 mt-3 sm:text-lg">
        {avatardetail?.userName}
      </h1>
      <p className="text-grey-800">Avatar</p>
      <p className="text-grey-900">
        <span className="text-grey-800">{avatardetail?.about}</span>
      </p>
      {/* <div className="flex items-center gap-4 m-auto">
        <div className="left max-w-[30%] w-auto">
          <div>
            <img
              src={avatardetail?.avatarImage || Images.user}
              alt="avatarProfile"
              className="w-[150px] sm:w-[100px] rounded-full aspect-square"
            />
          </div>
          <h1 className="text-grey-900 mt-2">{avatardetail?.userName}</h1>
          <p className="text-grey-800">Avatar</p>
          <p className="text-grey-900">
            <span className="text-grey-800">{avatardetail?.about}</span>
          </p>
        </div>

        <div className="">
          <div className="pl-6">
            <div className="border-b p-3">
              <h1 className="text-grey-900 text-2xl sm:text-sm">
                {avatardetail?.Reviews?.length}
              </h1>
              <p className="text-xl sm:text-sm">Reviews</p>
            </div>

            <div className="border-b p-3">
              <h1 className="text-grey-900 text-2xl flex gap-2 sm:text-sm">
                {averageRating}{" "}
                <img src={Images.star2} alt="star" className="sm:w-[14px]" />
              </h1>
              <p className="text-xl sm:text-sm">Ratings</p>
            </div>
            <div className="p-3 w-full">
              <h1 className="text-grey-900 text-2xl sm:text-sm">2</h1>
              <p className="text-xl sm:text-sm">As Avatar</p>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
}
