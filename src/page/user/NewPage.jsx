import { Button } from "@/components/ui/button";
import HeaderBack from "@/components/HeaderBack";

function NewPage() {
  return (
    <div className="container pt-4 h-svh flex flex-col">
      <HeaderBack link="/user/dashboard" text={"Title Placeholder"} />
      <div className="m-auto relative mb-5 mt-4 w-full">
        <h1 className="text-primaryColor-900 sm:text-[17px]">
          Anything you will want us to know about this tour?
        </h1>

        <div className="my-3">
          <textarea
            name="Comment"
            placeholder="Write here..."
            rows="9"
            className="bg-boxFill-900 w-full outline-0 p-3 resize-none rounded-md"
          />
        </div>
      </div>
      <Button className="w-full bg-[#2d2d2d] mt-auto mb-4 p-6">Send</Button>
    </div>
  );
}

export default NewPage;
