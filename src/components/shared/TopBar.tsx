import { useUserContext } from "@/context/useUseContext";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useSignOutAccount } from "@/lib/react-query/queries";
import { useEffect } from "react";

const TopBar = () => {
  const { user } = useUserContext();
  const { mutate: signOut, isSuccess } = useSignOutAccount();
  const navigate = useNavigate();
  useEffect(() => {
    if (isSuccess) navigate(0);
  }, [isSuccess]);

  return (
    <section className=" bg-[#080D1B] sticky top-0 z-50 md:hidden  w-full">
      <div className="flex justify-between items-center  py-4 px-5">
        <Link
          to={"/"}
          className="cursor-pointer flex justify-center items-center"
        >
          <img
            src="/public/images/dark-logo.png"
            alt="dark-logo"
            className="h-15 w-15 rounded-full"
          />
        </Link>

        <div className="flex gap-4">
          <Button
            onClick={() => signOut()}
            variant="destructive"
            className="flex gap-4 items-center justify-start hover:bg-transparent hover:text-white cursor-pointer"
          >
            <img
              className="h-5 w-5 rounded-full"
              src="/public/svgs/log-out.svg"
              alt="logo-out"
            />
          </Button>
          <Link to={`/profile/${user.id}`}>
            <img
              className="h-8 w-8 rounded-full"
              src={user.imageUrl || "/public/images/dark-logo.png"}
              alt="user-profile-logo"
            />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TopBar;
