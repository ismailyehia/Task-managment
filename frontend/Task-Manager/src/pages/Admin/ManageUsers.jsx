import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { LuFileSpreadsheet } from "react-icons/lu";
import { API_PATHS } from "../../utils/apiPaths";
import axiosInstance from "../../utils/axiosinstance";
import UserCard from "../../components/Cards/UserCard ";

const ManageUsers = () => {

    const [allUsers, setAllUsers] = useState([]);

    const getAllUsers = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);
        if (response.data?.length > 0) {
          setAllUsers(response.data);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
  
    useEffect(() => {
      getAllUsers();
    }, []);

    const handleDownloadReport= async()=> {
        try {
            const response = await axiosInstance.get(API_PATHS.REPORTS.EXPORT_USERS, {
              responseType: "blob",
            });

            //create url for the bolb
        
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "user_details.xlsx");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
          } catch (error) {
            console.error("Error exporting user report:", error);
            toast.error("Failed to download expense details. Please try again.");
          }


    }


    return (
        <DashboardLayout activeMenu="Team members">
            <div className="team-container">
            <div className="team-header">
                <h2 className="team-title">Team Members</h2>
                <button className="download-button" onClick={handleDownloadReport}>
                <LuFileSpreadsheet className="text-lg"/>
                Download Report
                </button>
            </div>
            <div className="team-list">
                {/* Team member list items will go here */}
                {allUsers?.map((user)=> {
                    <UserCard key = {user.id} userInfo={user}/>
                })}
            </div>
            </div>

        </DashboardLayout>
    );
};

export default ManageUsers;