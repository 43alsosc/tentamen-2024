"use client";
import { PlusCircle } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ToDoDataTable } from "./todo-table";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Check, Pen, Trash } from "lucide-react";
import { Close, X } from "@mui/icons-material";

type DataType = {
  id: string;
  task: string;
  completed: boolean;
}[];

export type ToDo = {
  id: string;
  task: string;
  completed: boolean;
};

const supabase = createClient();

export function ClientToDoTable({ data }: { data: DataType }) {
  const [task, setTask] = useState("");
  const [editingTodo, setEditingTodo] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const supabase = createClient();

  const columns: ColumnDef<ToDo>[] = [
    {
      accessorKey: "id",
      header: ({ column }) => {
        return (
          <Button
            variant={"ghost"}
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="justify-center w-full"
          >
            <div className="text-center">Id</div>
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }: { row: any }) => {
        const id = row.getValue("id");
        const formatted = typeof id === "number" ? id.valueOf() : id;

        return <div className="text-center font-medium">{formatted}</div>;
      },
    },
    {
      accessorKey: "mark_done",
      header: ({ column }) => {
        return <div className="text-center">Mark Done</div>;
      },
      cell: ({ row }: { row: any }) => {
        const is_completed = row.getValue("mark_done");
        const id = row.original.id;

        const updateTask = async (id: number, completed: boolean) => {
          await supabase.from("todos").update({ completed }).eq("id", id);
          console.log(completed);
          const { data, error } = await supabase
            .from("todos")
            .select("")
            .eq("id", id);

          if (error) {
            console.error("Error fetching updated data:");
          } else {
            console.log("Updated data: ", data);
          }
        };

        const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
          event.preventDefault();
          updateTask(id, !is_completed);
        };

        return (
          <div className="text-center font-medium">
            <Button
              variant="outline"
              className="text-green-500 bg-transparent"
              onClick={handleClick}
            >
              <Check className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
    {
      accessorKey: "task",
      header: ({ column }) => {
        return (
          <Button
            variant={"ghost"}
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="justify-center w-full"
          >
            <div className="text-center">Task</div>
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }: { row: any }) => {
        const task = row.getValue("task");
        const formatted = typeof task === "string" ? task.toUpperCase() : task;

        return <div className="text-center font-medium">{formatted}</div>;
      },
    },
    {
      accessorKey: "actions",
      header: ({ column }) => {
        return <div className="text-center">Actions</div>;
      },
      cell: ({ row }: { row: any }) => {
        const id = row.getValue("id");

        const deleteTask = async (id: number) => {
          await supabase.from("todos").delete().eq("id", id);
          console.log("Deleted task");
        };

        return (
          <div className="text-center font-medium">
            <Button
              variant="outline"
              onClick={() => deleteTask(id)}
              className="text-red-500"
            >
              <Trash className="h-4 w-4" />
            </Button>
            {!isEditing && (
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditing(true);
                  setEditingId(id);
                }}
                className="text-green-500"
              >
                <Pen className="h-4 w-4" />
              </Button>
            )}
            {isEditing && (
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  setEditingId(id);
                }}
                className="text-green-500"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  // Insert new ToDo
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTask(event.target.value);
  };
  const handleFormSubmit = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    console.log("task: ", task);

    if (user) {
      const { data, error } = await supabase
        .from("todos")
        .insert([
          {
            user_id: user.id,
            task: task,
            completed: false,
          },
        ])
        .select();

      if (error) {
        console.error("Error inserting todo:");
      } else {
        console.log("Inserted todo");
      }
      console.log("Form submitted");
    }
    setTask("");
  };

  // Edit ToDo
  const handleEditChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTask(event.target.value);
  };
  const handleEditFormSubmit = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: number,
    task: string
  ) => {
    event.preventDefault();
    const { data, error } = await supabase
      .from("todos")
      .update({ task })
      .eq("id", id);

    if (error) {
      console.error("Error fetching data to edit:");
    } else {
      console.log("Edit data:");
      setIsEditing(false); // Hide the input field after successful update
    }
  };

  console.log(columns[3]);

  return (
    <div className="w-full">
      <form className="flex-1">
        {!isEditing && (
          <div className="flex items-center">
            <Input
              className="min-w-0 w-full"
              placeholder="Add todo..."
              type="text"
              value={task}
              onChange={handleInputChange}
            />
            <Button
              variant="outline"
              className="h-10 gap-1 sm:w-4 border-none"
              onClick={handleFormSubmit}
            >
              <span>
                <PlusCircle className="h-3.5 w-3.5 dark:text-white light:text-black" />
              </span>
            </Button>
          </div>
        )}
        {/* If isEditing is True, show edit input field */}
        {isEditing && (
          <div className="flex items-center">
            <Input
              className="min-w-0 w-full"
              placeholder="Edit todo..."
              type="text"
              value={task}
              onChange={handleEditChange}
            />
            <Button
              variant="outline"
              className="h-10 gap-1 sm:w-4 border-none"
              onClick={(event) => {
                if (editingId !== null) {
                  handleEditFormSubmit(event, editingId, task);
                }
              }}
            >
              <span>
                <PlusCircle className="h-3.5 w-3.5 dark:text-white light:text-black" />
              </span>
            </Button>
          </div>
        )}
      </form>
      <ToDoDataTable columns={columns} data={data} height="500px" />
    </div>
  );
}
