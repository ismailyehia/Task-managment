const Task = require("../models/Task");
const { all } = require("../routes/authRoutes");

        const getTasks = async (req, res)=>{
        try {

                            //This extracts the status query parameter from the URL.
                
                // So if the user sends:

                // GET /tasks?status=completed

                // 👉 status will be "completed".
            const { status } = req.query;


//             ✅ You create a filter object to build a MongoDB query.
//     If the status exists in the query, you filter tasks by that status.
//     If not, you'll fetch all statuses.
// So:
//     If status = completed, the filter becomes { status: "completed" }
                let filter = {};
                if (status) {
                filter.status = status;
                }
                let tasks;
                if (req.user.role == "admin") {
                    //populates means user deatils 
                tasks = await Task.find(filter).populate(
                "assignedTo",
                "name email profileImageUrl"
                );
            } else {
                tasks = await Task.find({ ...filter, assignedTo: req.user._id }).populate(
                "assignedTo",
                "name email profileImageUrl"
                );

                }


                //add completed todochecklist count to each task
                tasks = await Promise.all(
                    tasks.map(async (task)=>{
                        const completedCount = await task.todoChecklist.filter(
                            (item)=> item.completed
                        ).length;
                        return { ...task._doc,completedTodoCount:completedCount};
                    })
                );

                //Status summray counts
                const allTasks = await Task.countDocuments(
                    req.user.role =="admin" ? {} : {assignedTo:req.user._id}
                );

                const pendingTasks = await Task.countDocuments({
                    ...filter,
                    status :"Pending",
                    ...(req.user.role!== "admin" && {assignedTo: req.user._id})
        });

        const inProgressTasks = await Task.countDocuments({
            ...filter,
            status :"Inprogress",
            ...(req.user.role!== "admin" && {assignedTo: req.user._id})
});


const completedTasks = await Task.countDocuments({
    ...filter,
    status :"Pending",
    ...(req.user.role!== "admin" && {assignedTo: req.user._id})
});

res.json({
    tasks,
    statusSummary:{
    all:allTasks,
    pendingTasks,
    inProgressTasks,
    completedTasks,
    },
});



                


        }catch (error) {
        res.status(500). json({ message: "'Server error", error: error.message });


        }
    }


    /////////////////////////////

        const getTaskById = async (req, res) => {
            try {

                const task = await Task.findById(req.params.id).populate(
                    "assignedTo",
                    "name email profileImageUrl"
                );

                if(!task) return res.status(404).json({message :"Task not found" });

                res.json(task);

            
            }
            catch (error) {
            res.status(500). json({ message: "'Server error", error: error.message });
    
    
            }

        }


        ///////////////////


        const createTask = async (req, res)=>{
            try {
                
                const {
                    title,
                    description,
                    priority,
                    duedate,
                    assignedTo,
                    attachments,
                    todoChecklist,

                }=req.body;

                if(!Array.isArray(assignedTo)){
                    return res.status(400).json({message: "assignedTo must be array of user id"});
                }

                const task = await Task.create({
                    title,
                    description,
                    priority,
                    duedate,
                    assignedTo,
                    createdBy: req.user._id,
                    attachments,
                    todoChecklist,
                });

                res.status(201).json({message:"Task created Successfully" ,task})
            
            }
            catch (error) {
            res.status(500). json({ message: "'Server error", error: error.message });
    
    
            }

        }

///////////////////////////////////

        const updateTask = async (req, res) =>{
            try {

                const task = await Task.findById(req.params.id);
                if(!task) return res.status(404).json({message: "task not found"});

                task.title = req.body.title || task.title;
                task.description = req.body.description || task.description;
                task.priority = req.body.priority || task.priority;
                task.duedate = req.body.dueDate || task.duedate;
                task.todoChecklist = req.body.todoChecklist || task.todoChecklist;
                task.attachments = req.body.attachments || task.attachments;


                if(req.body.assignedTo){
                    if(!Array.isArray(req.body.assignedTo)){
                        return res.status(400).json({message:"assignedto must be and array of user id"});
                    }
                    task.assignedTo = req.body.assignedTo;
                }

                const updatedtask = await task.save();
                res.json({message:"task updated successfully" , updatedtask});
            
            }
            catch (error) {
            res.status(500). json({ message: "'Server error", error: error.message });
    
            }
        };

////

const deleteTask = async (req, res) =>{
    try {

        const task = await Task.findById(req.params.id);
        if(!task) return res.status(404).json({message: "task not found"});

        await task.deleteOne();
        res.json({message: "task deleted successfully" ,})
    }
    catch (error) {
    res.status(500). json({ message: "'Server error", error: error.message });


    }
};
////


const updateTaskStatus = async (req, res)=>{
    try {

        const task = await Task.findById(req.params.id);
        if(!task) return res.status(404).json({message: "task not found"});

        const isAssigned = task.assignedTo.some(
            (userId)=> userId.toString()=== req.user._id.toString()
        );

        if(!isAssigned && req.user.role !== "admin"){
            return res.status(403).json({message: "Not authorized"});
        }

        task.status = req.body.status || task.status;

        if(task.status ==="Completed"){
            task.todoChecklist.forEach((item)=> (item.completed = true));
            task.progress = 100;
        }

        await task.save();

        res.json({message: "task status updated successfully" , task});


    }
    catch (error) {
    res.status(500). json({ message: "'Server error", error: error.message });


    }
};



const updateTaskChecklist = async (req, res) =>{
    try {

            const {todoChecklist} = req.body;

            const task = await Task.findById(req.params.id);
        if(!task) return res.status(404).json({message: "task not found"});

        if(!task.assignedTo.includes(req.user._id) && req.user.role !=="admin"){
            return res.status(403).json({message: "Not authorized to update checklist"});
        }

        task.todoChecklist = todoChecklist;

        const completedCount = task.todoChecklist.filter(
            (item)=> item.completed = true
        ).length

        const totalitems = task.todoChecklist.length;
        task.progress = totalitems > 0 ? Math.round((completedCount / totalitems) * 100) : 0;


        if(task.progress ===100){
            task.status = "Completed";
        }else if(task.progress >0){
            task.status = "InProgress";
        }else{
            task.progress = "Pending";
        }

        await task.save();

        const updatedtask = await Task.findById(req.params.id). populate(
            "assignedTo",
            "name email profileImageUrl"
        );

        res.json({message:"Task checklist updated" , updatedtask});
    }
    catch (error) {
    res.status(500). json({ message: "'Server error", error: error.message });


    }
};





const getDashboardData = async (req, res)=>{
    try {

            //fetch statisdtics

            const totalTasks = await Task.countDocuments ();
            const pendingTasks = await Task.countDocuments({ status: "Pending" });
            const completedTasks = await Task.countDocuments({ status: "Completed" });
            const overdueTasks = await Task. countDocuments ({
            status: { $ne: "Completed" },
            dueDate: { $lt: new Date() },
    }) ;



            //ensure all possible statuses included 

            const taskStatuses = ["Pending", "In Progress", "Completed"];
            const taskDistributionRaw = await Task.aggregate( [
                {
            $group: {
            _id: "$status",
            count: { $sum: 1 },
            },
                }
            ]);
        const taskDistribution = taskStatuses. reduce( (acc, status) => {
        const formattedKey = status.replace(/\s+/g, "");
        acc [formattedKey] = taskDistributionRaw. find((item) => item._id == status)?. count || 0;
        return acc;
        }, {});
        taskDistribution ["All"] = totalTasks; // Add total count to taskDistribution
        // Ensure all priority levels are included
        const taskPriorities = ["Low", "Medium", "High"];

        const taskPriorityLevelsRaw = await Task.aggregate([
        {
            $group: {
            _id:
            "$priority",
            count: { $sum: 1 },
            }
        }
    ]);
            const taskPriorityLevels = taskPriorities.reduce((acc, priority) =>{
            acc[priority] = taskPriorityLevelsRaw.find((item) => item._id === priority)?.count || 0;
            return acc;
            },{});
            // Fetch recent 10 tasks
            const recentTasks = await Task. find()
            .sort({ createdAt: -1 })
            .limit( 10)
            .select("title status priority dueDate createdAt");
            res.status(200).json ({
                statistics: {
                totalTasks,
                pendingTasks,
                completedTasks,
                overdueTasks,
                },
                charts:{
                    taskDistribution,
                    taskPriorityLevels,
                },
                recentTasks,
            });
            
    }
    catch (error) {
    res.status(500). json({ message: "'Server error", error: error.message });


    }
};

const getUserDashboardData = async (req, res) =>{
    try {

            const userId = req.user._id; // Only fetch data for the logged-in user
            // Fetch statistics for user-specific tasks
            const totalTasks = await Task.countDocuments({ assignedTo: userId });
            const pendingTasks = await Task.countDocuments({ assignedTo: userId, status: "Pending" });
            const completedTasks = await Task. countDocuments({ assignedTo: userId, status: "Completed" });
            const overdueTasks = await Task. countDocuments({
            assignedTo: userId,
            status: { $ne: "Completed" },
            dueDate: { $lt: new Date() },
    });
            // Task distribution by status

             // Task Distribution by Priority
    const taskPriorities = ["High", "Medium", "Low"];
    const taskPriorityLevelsRaw = await Task.aggregate([
      { $match: { assignedTo: userId } },
      { $group: { _id: "$priority", count: { $sum: 1 } } },
    ]);
    const taskPriorityLevels = taskPriorities.reduce((acc, priority) => {
      acc[priority.toLowerCase()] =
        taskPriorityLevelsRaw.find((item) => item._id === priority)?.count || 0;
      return acc;
    }, {});

            // const taskPriorityLevelsRaw = await Task.aggregate([
            //     {
            //         $group: {
            //         _id:
            //         "$priority",
            //         count: { $sum: 1 },
            //         }
            //     }
            // ]);
            //         const taskPriorityLevels = taskPriorities.reduce((acc, priority) =>{
            //         acc[priority] = taskPriorityLevelsRaw.find((item) => item._id === priority)?.count || 0;
            //         return acc;
            //         },{});
            const taskStatuses = ["Pending","In Progress", "Completed"];
            const taskDistributionRaw = await Task.aggregate([
            { $match: { assignedTo: userId } },
            { $group: {_id: "$status", count: { $sum: 1 } } },
            ]);
            const taskDistribution = taskStatuses.reduce((acc, status) => {
            const formattedkey = status.replace(/\s+/g, "");
            acc [formattedkey] =
            taskDistributionRaw.find((item) => item._id == status)?.count || 0;

                                return acc;

            },{});

                    // Fetch recent 10 tasks for the logged-in user
                    const recentTasks = await Task.find({ assignedTo: userId })
                    .sort({ createdAt: -1 })
                    .limit(10)
                    .select ("title status priority dueDate createdAt");

                    res.status(200).json ({
                    statistics: {
                    totalTasks,
                    pendingTasks,
                    completedTasks,
                    overdueTasks,
                    },
                    charts: {
                    taskDistribution,
                    taskPriorityLevels,
                    },
                    recentTasks,
            });
    }
    catch (error) {
    res.status(500). json({ message: "'Server error", error: error.message });
    }
};



module.exports = {
getTasks,
getTaskById,
createTask,
updateTask,
deleteTask,
updateTaskStatus,
updateTaskChecklist,
getDashboardData,
getUserDashboardData,

};