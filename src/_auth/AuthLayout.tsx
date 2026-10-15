import { Outlet, Navigate } from "react-router-dom";
const AuthLayout = () => {
  const isAuthenticated = false;

  return (
    <>
      {isAuthenticated ? (
        <Navigate to={"/"} />
      ) : (
        <>
          <section className="flex flex-1 justify-center items-center flex-col">
            <Outlet />
          </section>

          <img
            src="/public/images/Auth-side-logo.jpeg"
            className="hidden xl:block h-screen w-1/2 object-cover  bg-no-repeat "
            alt="side-logo"
          />
        </>
      )}
    </>
  );
};

export default AuthLayout;
