import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState("");
    const [editTaskId, setEditTaskId] = useState(null);
    const [editTaskTitle, setEditTaskTitle] = useState("");

    // Fetch tasks from backend
    useEffect(() => {
        axios.get("https://backend-brio.onrender.com/tasks")
        //axios.get("http://localhost:5001/tasks")
            .then(response => setTasks(response.data))
            .catch(error => console.error("Error fetching tasks:", error));
    }, []);

    // Create a new task
    const createTask = () => {
        if (!newTask.trim()) return;
        //axios.post("http://localhost:5001/tasks", { title: newTask })
        axios.post("https://backend-brio.onrender.com/tasks", { title: newTask })
            .then(response => {
                setTasks([...tasks, response.data]);
                setNewTask(""); 
            })
            .catch(error => console.error("Error adding task:", error));
    };

    // Toggle task completion
    const toggleTask = (id, completed) => {
        //axios.put(`http://localhost:5001/tasks/${id}`, { completed: !completed })
        axios.put(`https://backend-brio.onrender.com/tasks/${id}`, { completed: !completed })
            .then(response => {
                setTasks(tasks.map(task => task._id === id ? response.data : task));
            })
            .catch(error => console.error("Error updating task:", error));
    };

    // Enable editing mode
    const startEditing = (id, title) => {
        setEditTaskId(id);
        setEditTaskTitle(title);
    };

    // Save edited task
    const saveTask = (id) => {
        if (!editTaskTitle.trim()) return;
        //axios.put(`http://localhost:5001/tasks/${id}`, { title: editTaskTitle })
        axios.put(`https://backend-brio.onrender.com/tasks/${id}`, { title: editTaskTitle })
            .then(response => {
                setTasks(tasks.map(task => task._id === id ? response.data : task));
                setEditTaskId(null);
            })
            .catch(error => console.error("Error updating task:", error));
    };

    // Handle Enter key press to save task
    const handleKeyPress = (e, id) => {
        if (e.key === "Enter") {
            saveTask(id);
        }
    };

    // Cancel editing
    const cancelEditing = () => {
        setEditTaskId(null);
    };

    // Delete a task
    const deleteTask = (id) => {
        //axios.delete(`http://localhost:5001/tasks/${id}`)
        axios.delete(`https://backend-brio.onrender.com/tasks/${id}`)
            .then(() => {
                setTasks(tasks.filter(task => task._id !== id));
            })
            .catch(error => console.error("Error deleting task:", error));
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-indigo-500 p-4">
            <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-6">
                <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-4">
                    📝 Task Manager
                </h1>

                {/* Input & Add Task Button */}
                <div className="flex space-x-2 mb-6">
                    <input 
                        type="text"
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="Enter a task..."
                    />
                    <button 
                        onClick={createTask}
                        className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md transition-all duration-300 hover:bg-blue-600 hover:scale-105"
                    >
                        ➕
                    </button>
                </div>

                {/* Task List */}
                <ul className="divide-y divide-gray-300">
                    {tasks.map(task => (
                        <li key={task._id} className="flex items-center justify-between p-3 bg-gray-100 rounded-lg shadow-md mb-2 transition-transform transform hover:scale-105">
                            {editTaskId === task._id ? (
                                // Editing mode
                                <div className="flex w-full space-x-2">
                                    <input
                                        type="text"
                                        value={editTaskTitle}
                                        onChange={(e) => setEditTaskTitle(e.target.value)}
                                        onKeyPress={(e) => handleKeyPress(e, task._id)} // Save on Enter key press
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                    <button 
                                        onClick={() => saveTask(task._id)}
                                        className="text-green-500 hover:text-green-700 transition-all duration-300"
                                    >
                                        ✅
                                    </button>
                                    <button 
                                        onClick={cancelEditing}
                                        className="text-gray-500 hover:text-gray-700 transition-all duration-300"
                                    >
                                        ❌
                                    </button>
                                </div>
                            ) : (
                                // Display task
                                <>
                                    <span 
                                        onClick={() => toggleTask(task._id, task.completed)}
                                        className={`cursor-pointer flex-grow ${task.completed ? "line-through text-gray-500" : "text-gray-800 font-medium"}`}
                                    >
                                        {task.title}
                                    </span>
                                    <div className="flex space-x-2">
                                        <button 
                                            onClick={() => startEditing(task._id, task.title)}
                                            className="text-blue-500 hover:text-blue-700 transition-all duration-300"
                                        >
                                            ✏️
                                        </button>
                                        <button 
                                            onClick={() => deleteTask(task._id)}
                                            className="text-red-500 hover:text-red-700 transition-all duration-300"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default App;
