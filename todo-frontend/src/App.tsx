import { Toaster, toast } from "react-hot-toast";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import MiniCalendar from "./components/MiniCalendar";
import { useTasks } from "./hooks/useTasks";

export default function App() {
  const { tasks, loading, addTask, completeTask } = useTasks();

  const handleAdd = async (title: string, description: string) => {
    await addTask(title, description);
    toast.success("Task added");
  };

  const handleDone = async (id: number) => {
    await completeTask(id);
    toast("Completed ✔️");
  };

  return (
    <div className="relative mx-auto max-w-6xl px-6 py-10">
      {/* soft background decoration */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(50%_50%_at_50%_-10%,rgba(59,130,246,0.08),transparent_60%)]" />

      <header className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight">
          To-Do <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Tasks</span>
        </h1>
        {/* <p className="mt-1 text-sm text-gray-500">
          Shows only the most recent 5 incomplete tasks. Click “Done” to complete &amp; hide.
        </p> */}
      </header>

      <main className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="space-y-6">
          <TaskForm onAdd={handleAdd} />
          {/* NEW: calendar card under the add section */}
          <MiniCalendar />
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Tasks to be done</h2>
          <TaskList tasks={tasks} loading={loading} onDone={handleDone} />
        </div>
      </main>

      <footer className="mt-10 text-center text-xs text-gray-400">
        Tip: Press <kbd className="rounded-md border border-gray-300 bg-white px-1.5 py-0.5">Enter</kbd> to add quickly.
      </footer>

      <Toaster position="bottom-center" />
    </div>
  );
}
