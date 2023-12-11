import prisma from '@/db/prisma';
import { auth } from "@/auth";
import { BoardSummary, BoardDetails } from '@/types/types';
import { Task } from '@prisma/client';

export async function getBoardsSummary(): Promise<BoardSummary[]> {
    const session = await auth();

    const userId = session?.user?.id;
    if (!userId) {
        return [];
    }

    const boards = await prisma.board.findMany({
        where: {
            userId: session?.user?.id
        },
        select: {
            id: true,
            title: true,
            description: true,
            createdAt: true,
            updatedAt: true,
        },
        orderBy: {
            createdAt: 'asc',
        }
    });

    return boards;
}

export async function getBoard(id: string): Promise<BoardDetails | null> {
    const session = await auth();
    const board = await prisma.board.findUnique({
        where: {
            id: id,
        },
        select: {
            id: true,
            title: true,
            description: true,
            createdAt: true,
            updatedAt: true,
            columns: {
                orderBy: {
                    order: 'asc'
                },
                select: {
                    id: true,
                    title: true,
                    order: true,
                    createdAt: true,
                    updatedAt: true,
                    tasks: {
                        orderBy: {
                            order: 'asc'
                        },
                        select: {
                            id: true,
                            title: true,
                            description: true,
                            dueDate: true,
                            createdAt: true,
                            updatedAt: true,
                            order: true,
                            columnId: true,
                            activities: {
                                orderBy: {
                                    createdAt: 'desc'
                                },
                                select: {
                                    id: true,
                                    type: true,
                                    content: true,
                                    createdAt: true,
                                    user: {
                                        select: {
                                            id: true,
                                            name: true,
                                            image: true,
                                        }
                                    },
                                }
                            }
                        },
                    },
                },
            },
        },
    });

    return board;
}




export async function getTask(id: string): Promise<Task | null> {
    const task = await prisma.task.findUnique({
        where: {
            id: id,
        },
        select: {
            id: true,
            title: true,
            description: true,
            dueDate: true,
            startDate: true,
            columnId: true,
            createdAt: true,
            updatedAt: true,
            order: true,
            
        },
    });

    return task;
}
