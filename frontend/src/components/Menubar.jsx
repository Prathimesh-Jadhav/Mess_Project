import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { navOptions } from "../data";
import { MessContext } from "../GlobalContext/Context";
import { MdCancel } from "react-icons/md";
import { AiOutlineLogout } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";

/**
 * The Menubar component is a sidebar that slides in from the right when the
 * hamburger menu is clicked. It displays a list of links to the different
 * pages of the app, depending on the user's role. The links are rendered as
 * `Link` components from `react-router-dom`, which will perform client-side
 * routing to the corresponding page. The menubar also includes a logout link
 * that will log the user out and redirect them to the login page.
 * @param {function} setOpenMen ubar - sets the state of the menubar to open or
 * closed
 * @param {boolean} openMenubar - whether the menubar is open or closed
 * @returns {JSX.Element} - the JSX element representing the menubar
 */
const Menubar = ({ setOpenMenubar, openMenubar }) => {
  const { role,setIsLogin } = React.useContext(MessContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.clear();
    setIsLogin(false);
    setOpenMenubar(false);
    navigate("/");
  };

  return (
    <div
      className={`fixed top-0 right-0 bottom-0 min-w-[280px] bg-background rounded-l-lg font-poppins px-[15px] transition-all duration-300 ease-linear ${
        openMenubar ? "translate-x-0" : "translate-x-full"
      } z-10 border-[1px] border-gray-300`}
    >
      <div className="w-full flex justify-between items-center mt-10 ">
        <p className="text-[24px] font-semibold">
          Buddy's <span className="text-primary">Kitchen</span>
        </p>
        <div onClick={() => setOpenMenubar(false)}>
          <MdCancel size={22} />
        </div>
      </div>
      <div className="flex flex-col mt-6 px-2 text-gray-600">
        {navOptions[role]?.map((item) => (
          <Link
            key={item.name}
            onClick={() => {
              setTimeout(() => {
                setOpenMenubar(false);
              }, 200);
            }}
            className="text-text hover:bg-primary flex gap-2 items-center rounded-md py-2 px-2"
            to={item.path}
          >
            <div>{item.logo && <item.logo size={20} />}</div>
            <p className="text-[18px] text-gray-600">{item.name}</p>
          </Link>
        ))}

        <Link
            key={'Profile'}
            onClick={() => {
              setTimeout(() => {
                setOpenMenubar(false);
              }, 200);
            }}
            className="text-text hover:bg-primary flex gap-2 items-center rounded-md py-2 px-2"
            to={`/layout/profilepage/${sessionStorage.getItem('mobileNumber')}`}
          >
            <div>{<CgProfile size={20} />}</div>
            <p className="text-[18px] text-gray-600">My Profile</p>
          </Link>

        {/* Fix: Call handleLogout correctly */}
        <div
          className="text-text hover:bg-primary flex gap-2 items-center  rounded-md py-2 px-2 cursor-pointer"
          onClick={handleLogout} // Fixed the function call
        >
          <div>
            <AiOutlineLogout size={20} />
          </div>
          <p className="text-[18px] text-gray-600">Logout</p>
        </div>
      </div>
    </div>
  );
};

export default Menubar;
