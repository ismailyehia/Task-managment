import React, { useState } from "react";
import { HiMiniPlus, HiOutlineTrash } from "react-icons/hi2";
import { LuPaperclip } from "react-icons/lu";
const AddAttachmentsInput = ({setAttachments , attachments}) => {
    const [option , setOption]= useState("");
    //func to handle adding an option
    const handleAddOption = () => {
        if(option.trim()){
            setAttachments([...attachments , option.trim()]);
            setOption("");
        }
    };

    //func to handle delete an option
    const handleDeleteOption = (index)=>{
        const updateArr = todoList.filter((_,idx)=> idx !==index);
        setAttachments(updateArr);
    } 
    return (
        <div>

            {attachments.map((item , index)=> (
                <div
                className="flex justify-between bg-gray-50 border border-gray-100 px-3 py-2 rounded-md mb-3"
                key={item}
                >
                    <div className="flex-1 flex items-center gap-3 border border-gray-100">
                        <LuPaperclip className="text-gray-400"/>
                        <p className="text-xs text-black">{item}</p>
                    </div>

                    <button className="cursor-pointer"
                    onClick={()=> {
                        handleDeleteOption(index);
                    }}
                    >
                        <HiOutlineTrash className="text-lg text-red-500"/>
                    </button>
                </div>
            ))}

            <div className="flex items-center gap-5 mt-4">
                <div className="">
                    <LuPaperclip className="flex-1 flex items-center gap-3 border border-gray-100 rounded-md px-3"/>
                    <input type="text"
                    placeholder="Add file Link"
                    value={option}
                    onChange={(e) => setOption(e.target.value)}
                    className="w-full text-[13px] text-black outline-none bg-white py-3"
                    />
                </div>
                <button className="card-btn text-nowrap"
                onClick={handleAddOption}
                >
                    <HiMiniPlus className="text-lg" /> Add
                </button>
            </div>


        </div>
    );
};

export default AddAttachmentsInput;