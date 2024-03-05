import { Button } from "@/components/ui/button"
import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from "@/components/ui/table"
import { PopoverTrigger, PopoverContent, Popover } from "@/components/ui/popover"
import { useState, useEffect } from "react";
import { getCall } from "@/lib/api";

export default function UsersD() {
    const [data, setData] = useState([]);

    useEffect(() => {
        getCall('/api/test/admin').then((res) => {
            setData(res.data.users);
        });
      }, []);

    return (
        <main className="flex-grow p-6">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-lg font-medium">Lista de usuarios</h1>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Registro</TableHead>
                        <TableHead>Usuario</TableHead>
                        <TableHead>Nombre completo</TableHead>
                        <TableHead>Roles</TableHead>
                        <TableHead className="text-right">Correo</TableHead>
                        <TableHead />
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map(table => (
                        <TableRow key={table.username}>
                            <TableCell>{table.createdAt}</TableCell>
                            <TableCell>{table.username}</TableCell>
                            <TableCell>{table.fullname}</TableCell>
                            <TableCell>
                                <span className={`px-2 py-1 bg-red-200 text-red-800 rounded-md`}>
                                    <TagIcon className="w-4 h-4 inline-block mr-1" />
                                    {table.roles[0]}
                                </span>
                            </TableCell>
                            <TableCell className="text-right">{table.email}</TableCell>
                            <TableCell>
                                <Popover>
                                    <PopoverTrigger>
                                        <Button
                                            className="px-2 py-1 bg-transparent text-black hover:bg-gray-200 active:bg-gray-300 rounded"
                                            type="button"
                                        >
                                            <MoreVerticalIcon className="w-4 h-4" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-40">
                                        <button className="w-full flex items-center space-x-2 hover:bg-gray-200 active:bg-gray-300 py-2 px-2 rounded-lg text-gray-500">
                                            <FileEditIcon className="w-4 h-4" />
                                            <span className="text-sm font-medium">Edit</span>
                                        </button>
                                        <button className="w-full flex items-center space-x-2 hover:bg-gray-200 active:bg-gray-300 py-2 px-2 rounded-lg text-gray-500">
                                            <DeleteIcon className="w-4 h-4" />
                                            <span className="text-sm font-medium">Delete</span>
                                        </button>
                                    </PopoverContent>
                                </Popover>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </main>
    )
}

function MoreVerticalIcon(props) {
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
        <circle cx="12" cy="12" r="1" />
        <circle cx="12" cy="5" r="1" />
        <circle cx="12" cy="19" r="1" />
      </svg>
    )
  }
  
  
  function TagIcon(props) {
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
        <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" />
        <path d="M7 7h.01" />
      </svg>
    )
  }

  function DeleteIcon(props) {
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
        <path d="M20 5H9l-7 7 7 7h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Z" />
        <line x1="18" x2="12" y1="9" y2="15" />
        <line x1="12" x2="18" y1="9" y2="15" />
      </svg>
    )
  }
  
  function FileEditIcon(props) {
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
        <path d="M4 13.5V4a2 2 0 0 1 2-2h8.5L20 7.5V20a2 2 0 0 1-2 2h-5.5" />
        <polyline points="14 2 14 8 20 8" />
        <path d="M10.42 12.61a2.1 2.1 0 1 1 2.97 2.97L7.95 21 4 22l.99-3.95 5.43-5.44Z" />
      </svg>
    )
  }