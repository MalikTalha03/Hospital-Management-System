import Link from "next/link";
import { Grid, User, Calendar, Briefcase } from 'lucide-react';

const Sidebar = () => {
    const menuItems = [
        { name: 'Dashboard', href: '/', icon: <Grid size={20} className="flex-shrink-0" /> },
        { name: 'Patients', href: '/patients', icon: <User size={20} className="flex-shrink-0" /> },
        { name: 'Appointments', href: '/appointments', icon: <Calendar size={20} className="flex-shrink-0" /> },
        { name: 'Doctors', href: '/doctors', icon: <Briefcase size={20} className="flex-shrink-0" /> },
    ];

    return (
        <aside className="w-64" aria-label="Sidebar">
            <div className="overflow-y-auto py-4 px-3 bg-gray-50 rounded dark:bg-gray-800">
                <ul className="space-y-2">
                    {menuItems.map((item, index) => (
                        <li key={index}>
                            <Link href={item.href} legacyBehavior>
                                <a className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-blue-500 dark:hover:bg-gray-700">
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
