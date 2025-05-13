import React from "react";
import { LuPaperclip } from "react-icons/lu";
import moment from "moment/moment";
import AvatarGroup from "../AvatarGroup";
import Progress from "../Progress";
const TaskCard = ({
    title,
                description,
                priority,
                status,
                progress,
                createdAt,
                dueDate,
                assignedTo,
                attachmentCount,
                completedTodoCount,
                todoChecklist,
                onClick


}) => {

    const getStatusTagColor = () => {
            switch (status) {
            case "In Progress":
            return "text-cyan-500 bg-cyan-50 border border-cyan-500/10";
            case "Completed":
            return "text-lime-500 bg-lime-50 border border-lime-508/20";
            default:
            return "text-violet-500 bg-violet-50 border border-violet-500/10";

            }
    }

    const getPriorityTagColor = () => {
        switch (priority) {
          case "Low":
            return "text-emerald-500 bg-emerald-50 border border-emerald-500/10";
          case "Medium":
            return "text-amber-500 bg-amber-50 border border-amber-500/10";
          default:
            return "text-rose-500 bg-rose-50 border border-rose-500/10";
        }
    };

return (
    <div className="" onClick={onClick}>
      <div className="flex gap-2 mb-2">
        <div
          className={`text-[11px] font-medium ${getStatusTagColor()} px-4 py-0.5 rounded`}
        >
          {status}
        </div>
        <div
          className={`text-[11px] font-medium ${getPriorityTagColor()} px-4 py-0.5 rounded`}
        >
          {priority} Priority
        </div>
      </div>
  
      <div
        className={`px-4 border-l-[3px] ${
          status === "In Progress"
            ? "border-cyan-500"
            : status === "Completed"
            ? "border-indigo-500"
            : "border-violet-500"
        }`}
      >
        <p className="font-semibold text-base">{title}</p>
        <p className="text-sm text-gray-600">{description}</p>
        <p className="text-xs mt-2">
          Task Done:{" "}
          <span className="font-medium">
            {completedTodoCount} / {todoChecklist?.length || 0}
          </span>
        </p>
  
        <Progress progress={progress} status={status} />
      </div>
  
      <div className="mt-4">
        <div className="flex justify-between">
          <div>
            <label className="block text-xs font-semibold">Start Date</label>
            <p className="text-sm text-gray-700">
              {moment(createdAt).format("Do MMM YYYY")}
            </p>
          </div>
          <div>
            <label className="block text-xs font-semibold">Due Date</label>
            <p className="text-sm text-gray-700">
              {moment(dueDate).format("Do MMM YYYY")}
            </p>
          </div>
        </div>
      </div>
  
      <div className="mt-3 flex items-center justify-between">
        <AvatarGroup avatars={assignedTo || []} />
        {attachmentCount > 0 && (
          <div className="flex items-center gap-1 text-sm text-gray-700">
            <LuPaperclip className="text-lg" />
            <span>{attachmentCount}</span>
          </div>
        )}
      </div>
    </div>
  );
}
export default TaskCard;