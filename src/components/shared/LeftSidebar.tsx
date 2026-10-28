import { useUserContext } from "@/context/useUseContext";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import Loader from "./Loader";
import { sidebarLinks } from "../components";
import type { INavLink } from "@/types/index";
import { INITIAL_USER } from "@/context/AuthContext";
import { useSignOutAccount } from "@/lib/react-query/queries";
import { Button } from "../ui/button";
const LeftSidebar = () => {
  const { user, setUser, setIsAuthenticated, isLoading } = useUserContext();
  const { mutate: signOut } = useSignOutAccount();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const handleSignOut = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    signOut();
    setIsAuthenticated(false);
    setUser(INITIAL_USER);
    navigate("/sign-in");
  };
  return (
    <nav className=" hidden md:flex px-6 py-10 flex-col justify-between min-w-[270px] bg-[#080D1B]">
      <div className="flex flex-col gap-8">
        <Link to={"/"} className="flex gap-3 items-center">
          <img
            className="h-10 w-auto object-contain bg-transparent"
            width={300}
            height={100}
            src="/public/images/InstaUserChoice Gradient Logo.png"
            alt="logo"
          />
        </Link>

        {isLoading || !user.email ? (
          <div className="h-10">
            <Loader />
          </div>
        ) : (
          <Link className="flex items-center gap-1" to={`/profile/${user.id}`}>
            <img
              className="h-8 w-8 rounded-full"
              src={user.imageUrl || "/public/images/dark-logo.png"}
              alt="user-profile-logo"
            />
            <div className="flex flex-col">
              <p className="text-[18px] font-bold leading-[140%]">
                {user.name}
              </p>
              <p className="text-[14px] font-normal leading-[140%]">
                @{user.username}
              </p>
            </div>
          </Link>
        )}

        {sidebarLinks.map((link: INavLink) => {
          const isActive = pathname === link.route;
          return (
            <li
              key={link.label}
              className={`list-none rounded-lg base-medium hover:bg-primary-500 transition group ${isActive && "bg-primary-500"}`}
            >
              <NavLink to={link.route} className="flex gap-4 items-center p-4">
                <img
                  src={link.imgURL}
                  alt={link.label}
                  className={`group-hover:invert-white ${
                    isActive && "invert-white"
                  }`}
                />
                {link.label}
              </NavLink>
            </li>
          );
        })}
      </div>

      <Button
        variant="destructive"
        className="shad-button_ghost"
        onClick={(e) => handleSignOut(e)}
      >
        <img src="/public/svgs/log-out.svg" alt="logout" />
        <p className="small-medium lg:base-medium">Logout</p>
      </Button>
    </nav>
  );
};

export default LeftSidebar;
