import Link from "next/link";
import { useRouter } from "next/navigation";
import { Grid, User, Calendar, Briefcase } from "lucide-react";
import { signOut } from "next-auth/react";

const Sidebar = ({ activeItem }) => {
  const menuItems = [
    {
      name: "Dashboard",
      href: "/",
      icon: <Grid size={20} className="flex-shrink-0" />,
    },
    {
      name: "Patients",
      href: "/patients",
      icon: <User size={20} className="flex-shrink-0" />,
    },
    {
      name: "Appointments",
      href: "/appointments",
      icon: <Calendar size={20} className="flex-shrink-0" />,
    },
    {
      name: "Doctors",
      href: "/doctors",
      icon: <Briefcase size={20} className="flex-shrink-0" />,
    },
  ];

  const router = useRouter();

  return (
    <aside className="w-64" aria-label="Sidebar">
      <button
        className="p-4 text-gray-600 focus:outline-none bg-red-500 text-white rounded-lg h-12"
        onClick={() => signOut()}
      >
        {" "}
        Sign Out{" "}
      </button>
      <div className="overflow-y-auto py-4 px-3 bg-white rounded shadow-lg dark:bg-gray-800">
        <ul className="space-y-2" style={{ marginTop: 80 }}>
          {menuItems.map((item, index) => (
            <li key={index}>
              <Link href={item.href} legacyBehavior>
                <a
                  className={`flex items-center p-2 text-base font-normal rounded-lg dark:text-white transition-colors duration-300 ease-in-out ${
                    router.pathname === item.href || item.name === activeItem
                      ? "bg-blue-500 text-white"
                      : "text-gray-900 hover:bg-blue-500 dark:hover:bg-gray-700"
                  }`}
                >
                  {item.icon}
                  <span className="ml-3">{item.name}</span>
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
