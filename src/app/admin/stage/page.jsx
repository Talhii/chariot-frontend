"use client"
import { useState } from "react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/ui/app-sidebar"

const stages = [
    {
        id: 1,
        name: "Cutting",
        checklist: [
            { taskId: "task1", description: "Cut granite slab", isMandatory: true },
            { taskId: "task2", description: "Measure slab size", isMandatory: false }
        ]
    },
    {
        id: 2,
        name: "Sink Cutout",
        checklist: [
            { taskId: "task3", description: "Cut sink hole", isMandatory: true },
            { taskId: "task4", description: "Check alignment", isMandatory: false }
        ]
    },
    {
        id: 3,
        name: "Polishing Top",
        checklist: [
            { taskId: "task5", description: "Polish surface", isMandatory: true },
            { taskId: "task6", description: "Buff surface", isMandatory: false }
        ]
    }
];

export default function Stages() {
    return (
        <SidebarProvider>
            <div className="bg-gradient-to-br from-gray-950 to-black flex h-screen w-full bg-gray-900 text-white">
                <AppSidebar className="dark hidden md:block" />
                <SidebarInset className="bg-gradient-to-br from-gray-950 to-black flex-1 overflow-auto text-white w-full">
                    <Component />
                </SidebarInset>
            </div>
        </SidebarProvider>
    )
}

const Component = () => {
    const router = useRouter();

    const handleAddStageClick = () => {
        router.push("/admin/stage/add");
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-semibold text-white">Stages</h2>
                <button
                    onClick={handleAddStageClick}
                    className="flex items-center px-4 py-2 bg-white text-black hover:bg-gray-200 rounded-md hover:bg-blue-700 transition duration-200"
                >
                    <Plus className="mr-2" />
                    Add Stage
                </button>
            </div>

            <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-lg">
                <table className="w-full text-left text-lg text-gray-400">
                    <thead className="bg-gray-900">
                        <tr>
                            <th className="px-6 py-3">Stage</th>
                            <th className="px-6 py-3">Checklist</th>
                            <th className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stages.map((stage) => (
                            <tr key={stage.id} className="border-t border-gray-700">
                                <td className="px-6 py-3">{stage.name}</td>
                                <td className="px-6 py-3">
                                    <ul>
                                        {stage.checklist.map((task) => (
                                            <li key={task.taskId} className="text-gray-300">
                                                {task.description}{" "}
                                                {task.isMandatory ? (
                                                    <span className="text-red-500">(Mandatory)</span>
                                                ) : (
                                                    <span className="text-green-500">(Optional)</span>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                </td>
                                <td className="px-8 py-4">
                                    <button className="text-blue-400 hover:text-blue-600">Edit</button>
                                    <button className="ml-4 text-red-400 hover:text-red-600">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
