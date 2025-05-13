import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { PRIORITY_DATA } from "../../utils/data";
import axiosInstance from "../../utils/axiosinstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";
import { useLocation,useNavigate } from "react-router-dom";
import moment from "moment/moment";
import { LuTrash2 } from "react-icons/lu";
import SelectDropdown from "../../components/inputs/SelectDropdown";
import SelectUsers from "../../components/inputs/SelectUsers";
import TodoListInput from "../../components/inputs/TodoListInput";
import AddAttachmentsInput from "../../components/inputs/AddAttachmentsInput";
import Modal from "../../components/Modal";
import DeleteAlert from "../../components/DeleteAlert";


const CreateTask = () => {

    const location = useLocation();
    const {taskId} = location.state || {};
    const navigate = useNavigate();

    const [taskData , setTaskData] = useState(
        {
            title : "",
            description: "",
            priority: "Low",
            duedate : null,
            assignedTo: [],
            todoChecklist : [],
            attachments: [],
        }
    );

    const [currentTask , setCurrentTask] = useState(null);
    const [error , setError] = useState("");
    const [loading , setLoading] = useState(false);
    const [openDeleteAlert , setOpenDeleteAlert] = useState(false);


    const handleValueChange = (key , value) => {
        setTaskData((prevData)=> (
            {
                ...prevData , [key]: value
            }
        ))
    };

    


    const clearData = ()=> {
        setTaskData(
            {
                title : "",
                description: "",
                priority: "Low",
                duedate : null,
                assignedTo: [],
                todoChecklist : [],
                attachments: [],
            }
        )
    };


    //create task 

    

    const createTask = async () => {
        setLoading(true);
    
        try {
            const todolist = taskData.todoChecklist?.map((item) => ({
                text: item,
                completed: false,
            }));
    
            const { duedate, ...rest } = taskData;
    
            const requestBody = {
                ...taskData,
                dueDate: new Date(duedate).toISOString(),
                todoChecklist: todolist,
            };
    
            console.log('Request Body:', requestBody);
    
            const response = await axiosInstance.post(API_PATHS.TASKS.CREATE_TASK, requestBody);
            toast.success("Task Created Successfully");
            clearData();
        } catch (error) {
            console.error("Failed to create task", error);
            toast.error("Failed to create task");
            console.log(error.response?.data);
        } finally {
            setLoading(false);
        }
    };
    
    



    const updateTask = async()=> {
        setLoading(true);

        try {

            const todolist = taskData.todoChecklist?.map((item)=> {
                const prevTodoChecklist = currentTask?.todoChecklist || [];
                const matchedTask = prevTodoChecklist.find((task)=> task.text == item);
                return{
                    text : item,
                    completed : matchedTask ? matchedTask.completed : false,
                };
            })


            const response = await axiosInstance.put(API_PATHS.TASKS.UPDATE_TASK(taskId),
                {
                    ...taskData,
                    duedate : new Date(taskData.duedate).toISOString(),
                    todoChecklist : todolist
                }
            );

            toast.success("task updated successfully");
        } catch (error) {
            console.error("Error updating task" , error);
            setLoading(false);
        }finally{
            setLoading(false);
        }


    };

    ///////

    const deleteTask = async()=> {
        try {
            const response = await axiosInstance.delete(API_PATHS.TASKS.DELETE_TASK(taskId));
            setOpenDeleteAlert(false);
            toast.success("task deleted sucssesfully");
            navigate("/admin/tasks");
        } catch (error) {
            console.error("failed to delete task", error.response?.data?.message || error.message);
        }
    };

    const handleSubmit = async()=> {
        console.log("Submit triggered"); 

        setError (null);
        // Input validation
        if (!taskData.title.trim()) {
        setError("Title is required.");
        return;
        }

        
        if (!taskData.description.trim()) {
        setError("Description is required.");
        return;
        }

        if (!taskData.duedate) {
        setError ("Due date is required.");
        return;
        }


        if (taskData.assignedTo?.length === 0) {
        setError("Task not assigned to any member");
        return;
        }

        if (taskData. todoChecklist?.length === 0) {
            setError("Add atleast one todo task");
            return;
        }
            if (taskId) {
            updateTask();
            return;
            }
            createTask();


    };

    const getTaskDeatilsByID = async()=> {
        try {
            const response = await axiosInstance.get(API_PATHS.TASKS.GET_TASK_BY_ID(taskId));

            if(response.data){
                const taskInfo = response.data;
                setTaskData(taskInfo);
            
            setTaskData((prevState)=> (
                {
                    title : taskInfo.title,
                    description: taskInfo.description,
                    priority : taskInfo.priority,
                    duedate : taskInfo.duedate ? moment(taskInfo.duedate).format("YYYY-MM-DD") : null ,
                    assignedTo : taskInfo?.assignedTo?.map((item)=> item._id) || [],
                    todoChecklist: taskInfo?.todoChecklist?.map((item)=> item?.text) || [],
                    attachments : taskInfo?.attachments || [],
                
                }
            ));

        }

        } catch (error) {
            console.error("Error failed to fetch task deatils" , error);
        }
    };

    useEffect(()=> {
        if(taskId){
            getTaskDeatilsByID(taskId);
        }

        return ()=> {

        }
    },[taskId])
    
    
    



    return (
        <DashboardLayout activeMenu="Create Task">
            <div className="mt-5">
                <div className="grid grid-cols-1 md:grid-cols-4 mt-4">
                    <div className="form-card col-span-3">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl md:text-xl font-medium">
                                {taskId ? "Update Task" : "Create Task" }
                            </h2>

                            {taskId && (
                                <button className="flex items-center gap-1.5 text-[13px] font-medium text-rose-500 bg-rose-50 rounded px-2 py-1 border border-rose-100 hover:border-rose-300 cursor-pointer"
                                onClick={()=> setOpenDeleteAlert(true)}
                                >
                                    <LuTrash2 className="text-base"/> Delete
                                </button>
                            )
                            }

                        </div>
                        <div className="mt-4 flex flex-col">
                            <label className="text-xs font-meduim text-slate-600 mb-3">Task Title</label>

                            <input
                            type="text"
                            placeholder="Task Name"
                            className="form-input"
                            value={taskData.title}
                            onChange={({target})=> 
                            handleValueChange("title" , target.value)
                            }

                            />
                        </div>

                        <div className="mt-5 flex flex-col">
                        <label className="text-xs font-medium text-slate-600 mb-3">Description</label>

                            <textarea
                            placeholder="Descripe Task"
                            className="form-input"
                            rows={4}
                            value={taskData.description}
                            onChange={({target})=> (
                                handleValueChange("description", target.value)
                            )}
                            />
                        </div>

                        <div className="grid grid-cols-12 gap-4 mt-2">
                            <div className="col-span-6 md:col-span-4">
                                <label className="text-xs font-medium text-slate-600">
                                    Priority
                                </label>

                                <SelectDropdown
                                options={PRIORITY_DATA}
                                value={taskData.priority}
                                onChange = {(value)=> handleValueChange("priority" , value)}
                                placeholder= "Select Priority"
                                />
                            </div>

                        <div className="mt-4 flex flex-col">
                        <label className="text-xs font-medium text-slate-600 mb-1">
                        Due Date
                    </label>
                    <input
                        type="date"
                        placeholder="Create App UI"
                        className="form-input"
                        value={taskData.duedate}
                        onChange={({ target }) =>
                        handleValueChange("duedate", target.value)
                        }
                    />
                    </div>


                    <div className="mt-4 flex flex-col">
                    <label className="text-xs font-medium text-slate-600 mb-1">
                        Assign To
                    </label>
                    <SelectUsers
                        selectedUsers={taskData.assignedTo}
                        setSelectedUsers={(value) => handleValueChange("assignedTo", value)}
                    />
                    </div>



                        </div>

                        <div className="mt-3">
                        <label className="text-xs font-medium text-slate-600">
                            TODO Checklist
                        </label>



                        <TodoListInput
                            label="Todo list Input"
                            value={taskData.todoChecklist}
                            onChange={(value) => handleValueChange("todoChecklist", value)}
                        />
                        </div>




                        <div className="mt-3">
                        < label className= "text-xs font-medium text-slate-600">
                        Add Attachments
                        </label>
                        <AddAttachmentsInput
                        attachments={taskData?.attachments}
                        setAttachments={(value) =>handleValueChange("attachments", value)
                        }
                        />
                        </div>

                        {error && (
                        <p className="text-sm text-red-500 mb-2">
                            {error}
                        </p>
                        )}

                        <div className="mt-4">
                        <button
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                            onClick={handleSubmit}
                            disabled={loading}
                        >
                            {taskId ? "UPDATE TASK" : "CREATE TASK"}
                        </button>
                        </div>








                    </div>
                </div>
            </div>

            <Modal
            isOpen={openDeleteAlert}
            onClose={()=> setOpenDeleteAlert(false)}
            title = "Delete Task"
            
            >

                <DeleteAlert
                content = "Are you sure you want to delete this task?"
                onDelete = {()=> deleteTask()}

                />

                </Modal>


        </DashboardLayout>
    );
};

export default CreateTask;