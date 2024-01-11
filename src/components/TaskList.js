import React, { useState, useEffect } from 'react';

const TaskList = ({ list,onDragOver, onDrop }) => {
  const [tasks, setTasks] = useState([]);
  const [newTaskName, setNewTaskName] = useState('');
  const [showInput, setShowInput] = useState(false);

  const fetchdata=()=>{
    fetch(`http://localhost:3000/tasks/${list.id}/tasks`)
      .then((response) => response.json())
      .then((data) => setTasks(data))
      .catch((error) => console.error('Error fetching tasks:', error));
  }
  // fetchdata();
  useEffect(() => {
    // Fetch tasks based on the list ID from the backend API
    // fetch(`http://localhost:3000/tasks/${list.id}/tasks`)
    //   .then((response) => response.json())
    //   .then((data) => setTasks(data))
    //   .catch((error) => console.error('Error fetching tasks:', error));
    fetchdata();
  }, [list.id]);
 
  useEffect(() => {
    // Fetch tasks based on the list ID from the backend API
    console.log("useEffect called inside tsalist");
    fetch(`http://localhost:3000/tasks/${list.id}/tasks`)
      .then((response) => response.json())
      .then((data) => setTasks(data))
      .catch((error) => console.error('Error fetching tasks:', error));
  }, []);

  const addNewTask = () => {
    setShowInput(true);
  };
  console.log("tasklist rendered");
  const handleSubmit = () => {
    // Implement logic to add a new task to the backend using newTaskName
    if(newTaskName === ''){
      setShowInput(false);
      return;
    }
    fetch(`http://localhost:3000/tasks/${list.id}/tasks`, {
      method: 'POST',
      body: JSON.stringify({ taskName: newTaskName }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to add task');
        }
        return response.json();
      })
      .then((data) => {
        setTasks([...tasks, data]); // Add the new task to the existing tasks state
        setNewTaskName('');
        setShowInput(false);
      })
      .catch((error) => {
        console.error('Error adding task:', error);
      });

    setShowInput(false);
  };

  const handleDragStart = (e, taskId) => {
    console.log("drag start");
    e.dataTransfer.setData('text/plain', taskId);
  };

  const handleCheckboxChange = (taskId) => {
    // Implement logic to complete the task on the backend
    fetch(`http://localhost:3000/tasks/tasks/${taskId}/complete`, {
      method: 'PUT',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to complete task');
        }
        return response.json();
      })
      .then((completedTask) => {
        // Update the UI to reflect the completed task
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === completedTask.id ? completedTask : task
          )
        );
      })
      .catch((error) => {
        console.error('Error completing task:', error);
      });
  };

  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white" onDragOver={onDragOver} onDrop={(e) => onDrop(e, list.id)}>
    <div className="px-6 py-4">
      <div className="font-bold text-xl mb-2">{list.list_name}</div>
      <ul>
        {/* Render each task */}
        {tasks.map((task) => (
          <li key={task.id} className="mb-2" onDragStart={(e)=>handleDragStart(e,task.id)} draggable='true'>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => handleCheckboxChange(task.id)}
            />
            {task.task_name}
          </li>
        ))}
      </ul>
      {showInput && (
        <div className="mt-4">
          <input
            type="text"
            value={newTaskName}
            onChange={(e) => setNewTaskName(e.target.value)}
            placeholder="Enter task name"
            className="border border-gray-300 rounded p-2"
          />
          <button
            onClick={handleSubmit}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full mt-2"
          >
            Add Task
          </button>
        </div>
      )}
      {!showInput && (
        <button
          onClick={addNewTask}
          className="bg-gray-400 hover:bg-blue-700 text-white py-2 px-4 rounded-full mt-2"
        >
          + 
        </button>
      )}
    </div>
  </div>
);
};

export default TaskList;
