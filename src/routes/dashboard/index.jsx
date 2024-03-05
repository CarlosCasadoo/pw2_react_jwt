
import { IoSettingsOutline } from "react-icons/io5";
import { Outlet, Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { getCall, authCall } from "@/lib/api";

export default function Dashboard() {
    const [isAdmin, setIsAdmin] = useState(false);
    const [username, setUsername] = useState("");
    const [selected, setSelected] = useState("home");
    const location = useLocation();

    useEffect(() => {

        const storedSelected = localStorage.getItem("selected");
        if (storedSelected) {
            setSelected(storedSelected);
        }

        getCall('/api/test/user').then((res) => {

            setUsername(res.data.user);
            setIsAdmin(res.data.roles.includes("ADMIN" || "MODERATOR"));
            
        });
      }, []);

      const handleSelection = (value) => {
        setSelected(value);
        localStorage.setItem("selected", value);
    };

    const handleLogout = () => {
        document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        localStorage.removeItem("selected");
        setUsername("");
        setIsAdmin(false);
    };

    return (
        <>
            <div className="flex">
                <aside className="sticky top-0 h-screen w-56 bg-gray-100 text-gray-800 p-4">
                    <div className="flex items-center mb-4 space-x-1">
                        <h1 className="text-lg font-medium">¡Hola! {username}</h1>
                    </div>
                    <nav className="space-y-2">
                    <Link to={""} className="block"><button className={`w-full flex items-center space-x-2 ${selected === "home" ? "bg-gray-200 active:bg-gray-300 text-gray-800" : "hover:bg-gray-200 active:bg-gray-300 text-gray-500"} py-2 px-2 rounded-lg`}
                            onClick={() => handleSelection("home")}>
                            <HomeIcon className="w-4 h-4" />
                            <span className="text-sm font-medium">Home</span>
                        </button></Link>
                        {
                            isAdmin &&
                            <Link to={`admin-panel`} className="block"><button className={`w-full flex items-center space-x-2 ${selected === "admin" ? "bg-gray-200 active:bg-gray-300 text-gray-800" : "hover:bg-gray-200 active:bg-gray-300 text-gray-500"} py-2 px-2 rounded-lg`}
                            onClick={() => handleSelection("admin")}>
                            <UsersIcon className="w-4 h-4" />
                            <span className="text-sm font-medium">Admin</span>
                            </button></Link>
                            
                        }
                        <button className={`w-full flex items-center space-x-2 ${selected === "settings" ? "bg-gray-200 active:bg-gray-300 text-gray-800" : "hover:bg-gray-200 active:bg-gray-300 text-gray-500"} py-2 px-2 rounded-lg`}
                        onClick={handleLogout}> {/* Call handleLogout function on button click */}
                            <IoSettingsOutline className="w-4 h-4" />
                            <span className="text-sm font-medium">Log out</span>
                        </button>
                    </nav>
                </aside>
                <Outlet />
            </div>
        </>
    )
}




function HomeIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}





function UsersIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}