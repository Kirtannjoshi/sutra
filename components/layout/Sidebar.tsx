'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookMarked } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Sidebar() {
    const pathname = usePathname();

    const navItems = [
        { icon: Home, label: 'Home', href: '/' },
        { icon: BookMarked, label: 'Library', href: '/lists' },
    ];

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-20 bg-black border-r border-white/10 flex-col items-center py-8 z-50">
                {/* Navigation */}
                <nav className="flex-1 flex flex-col items-center gap-6 w-full mt-20">
                    {navItems.map(({ icon: Icon, label, href }) => {
                        const isActive = pathname === href;
                        return (
                            <Link
                                key={href}
                                href={href}
                                className="group relative flex items-center justify-center w-full"
                            >
                                <div
                                    className={cn(
                                        'w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-300 group-hover:bg-white/10',
                                        isActive ? 'bg-white/10 text-white' : 'text-gray-500 group-hover:text-white'
                                    )}
                                >
                                    <Icon
                                        className={cn(
                                            "w-6 h-6 transition-all duration-300",
                                            isActive && "fill-current"
                                        )}
                                        strokeWidth={isActive ? 2.5 : 2}
                                    />
                                </div>

                                {/* Tooltip */}
                                <div className="absolute left-full ml-4 px-3 py-1.5 bg-gray-800 text-white text-xs font-medium rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 border border-white/10 shadow-xl translate-x-[-10px] group-hover:translate-x-0 duration-200">
                                    {label}
                                </div>

                                {/* Active Indicator */}
                                {isActive && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[var(--color-primary)] rounded-r-full" />
                                )}
                            </Link>
                        );
                    })}
                </nav>
            </aside>

            {/* Mobile Bottom Nav */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-black/90 backdrop-blur-lg border-t border-white/10 flex items-center justify-around px-4 z-50 safe-area-bottom">
                {navItems.map(({ icon: Icon, label, href }) => {
                    const isActive = pathname === href;
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={cn(
                                "flex flex-col items-center justify-center gap-1 w-16 h-full transition-colors",
                                isActive ? "text-white" : "text-gray-500"
                            )}
                        >
                            <Icon
                                className={cn(
                                    "w-6 h-6 transition-all",
                                    isActive && "fill-current scale-110"
                                )}
                                strokeWidth={isActive ? 2.5 : 2}
                            />
                            <span className="text-[10px] font-medium">{label}</span>
                        </Link>
                    );
                })}
            </nav>
        </>
    );
}
