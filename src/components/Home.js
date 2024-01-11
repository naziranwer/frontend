import React, { useState, useEffect } from 'react';
import TaskList from './TaskList';
import Navbar from './Navbar';
import Footer from './Footer';

function Home() {
  const [lists, setLists] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [targetId,setTargetList]=useState(null);
  

  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?.id;
  console.log("current list",lists);

  function fetchdata(){
    console.log("fetch called");
    fetch(`http://localhost:3000/lists/lists/${userId}`)
      .then((response) => response.json())
      .then((data) => setLists(data))
      .catch((error) => console.error('Error fetching lists:', error));
  }

  useEffect(() => {
    fetchdata();
  }, [userId]);

  const addList = () => {
    setShowModal(true);
  };

  const handleSubmit = () => {
    fetch('http://localhost:3000/lists/lists', {
      method: 'POST',
      body: JSON.stringify({ userId: userId, listName: newListName }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to add list');
        }
        return response.json();
      })
      .then((data) => {
        // setLists([...lists, data]);
        setShowModal(false);
        setNewListName('');
        fetchdata();
      })
      .catch((error) => {
        console.error('Error adding list:', error);
      });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    console.log("drag over");
  };

  const handleDrop = (e, targetListId) => {
    e.preventDefault();
    setTargetList(targetListId);
    console.log("drop event occured");
    console.log("target list id",targetListId);


    const taskId = e.dataTransfer.getData('text/plain');

    // Implement logic to update the task with taskId to the targetListId
    fetch(`http://localhost:3000/tasks/tasks/${taskId}/move`, {
      method: 'PUT',
      body: JSON.stringify({ newListId: targetListId }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to update task list');
        }
        // fetchdata();
        return response.json();
      })
      .then(() => {
        // fetchdata();
      //   // Implement logic to fetch updated lists from the backend and update the state
      //   fetch(`http://localhost:3000/tasks/${listId}/tasks`)
      //     .then((response) => response.json())
      //     .then((data) => {
      //       setLists(data);
      //       console.log("re render in home done");
            
      //     })
      //     .catch((error) => console.error('Error fetching lists:', error));
      })
      .catch((error) => {
        console.error('Error updating task list:', error);
      });
  };

  return (
    <div style={{ display: 'flex', flexDirection:"column",minHeight:"100vh"}}>
    <Navbar/>
    <div className="container mx-auto p-4 flex flex-col items-center">
      <h1 className="text-3xl font-semibold mb-4">Task Board</h1>
      <div className="flex justify-center">
        <div className="lists-container overflow-x-auto" >
          <div className="flex space-x-4 pb-4">
            {lists?.map((list) => (
              <TaskList key={list.id} list={list}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, list.id)}
              targetId={targetId}/>
            ))}
          </div>
        </div>
      </div>
      <div className="flex justify-center mt-4">
        <button
          className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 focus:outline-none border-r-50"
          onClick={addList}
        >
          + Create New List
        </button>
        {showModal && (
          <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-4 rounded">
              <input
                type="text"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                placeholder="Enter list name"
                className="border border-gray-300 rounded p-2 mb-2"
              />
              <button
                onClick={handleSubmit}
                className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 focus:outline-none"
              >
                Submit
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 focus:outline-none ml-2"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
    <Footer/>
    </div>
  );
}

export default Home;
