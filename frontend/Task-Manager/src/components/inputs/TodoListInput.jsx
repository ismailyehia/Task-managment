import React, { useState } from "react";
import { HiMiniPlus, HiOutlineTrash } from "react-icons/hi2";

const TodoListInput = ({ value = [], onChange}) => {

    const [option , setOption]= useState("");
    

    //func to handle adding an option

    const handleAddOption = () => {
        if (option.trim()) {
          onChange([...value, option.trim()]);
          setOption("");
        }
      };
    
      const handleDeleteOption = (index) => {
        const updated = value.filter((_, i) => i !== index);
        onChange(updated);
      };
    // const handleAddOption = () => {
    //     if(option.trim()){
    //         setTodoList([...todoList , option.trim()]);
    //         setOption("");
    //     }
    // };

    // //func to handle delete an option
    // const handleDeleteOption = (index)=>{
    //     const updateArr = todoList.filter((_,idx)=> idx !==index);
    //     setTodoList(updateArr);
    // } 


    return (
        <div>
          {/* List of Todos */}
        {value.map((item, index) => (
            <div key={item} className="flex items-center justify-between mb-2">
            <p className="flex items-center text-sm text-slate-700">
                <span className="mr-2 font-semibold text-slate-500">
                {index < 9 ? `0${index + 1}` : index + 1}.
                </span>
                {item}
            </p>
            <button
                className="text-red-500 hover:text-red-700"
                onClick={() => handleDeleteOption(index)}
            >
                <HiOutlineTrash className="w-5 h-5" />
            </button>
            </div>
        ))}
    
          {/* Input and Add Button */}
        <div className="flex items-center mt-4 gap-2">
            <input
            type="text"
            placeholder="Enter Task"
            value={option}
            onChange={({ target }) => setOption(target.value)}
            className="w-full px-3 py-1.5 border border-slate-300 rounded-md text-sm"
            />
            <button
            className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            onClick={handleAddOption}
            >
            <HiMiniPlus className="w-4 h-4" />
            Add
            </button>
        </div>
        </div>
    );


};

export default TodoListInput;