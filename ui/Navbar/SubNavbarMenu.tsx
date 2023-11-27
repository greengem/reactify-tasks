'use client'
import { usePathname } from 'next/navigation'
import Link from "next/link";

interface Board {
    id: string;
    title: string;
}

export default function SubNavbarMenu({ boards }: { boards: Board[] }) {
    const pathname = usePathname();

    return (
        <ul className="flex items-center text-xs space-x-3 text-white overflow-x-scroll no-scrollbar">
            <li 
                className={`px-3 py-1 rounded-xl ${pathname === '/board' ? 'bg-blue-500' : ''}`}
            >
                <Link href='/board'>
                    All Boards
                </Link>
            </li>
            {boards.map((board) => (
                <li 
                    key={board.id} 
                    className={`px-3 py-1 rounded-xl ${pathname === `/board/${board.id}` ? 'bg-blue-500' : ''}`}
                >
                    <Link href={`/board/${board.id}`}>
                        {board.title}
                    </Link>
                </li>
            ))}
        </ul>
    )
}
