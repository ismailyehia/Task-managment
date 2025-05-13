import React from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  Navigate
} from "react-router-dom";
import Signup from './pages/Auth/Signup';
import Login from './pages/Auth/Login';
import ManageTasks from './pages/Admin/ManageTasks';
import CreateTask from './pages/Admin/CreateTask';
import ManageUsers from './pages/Admin/ManageUsers';
import DashboardUser from './pages/User/Dashboard';
import MyTasks from './pages/User/MyTasks';
import ViewTaskDetails from './pages/User/ViewTaskDeatils';
import PrivateRoute from './routes/PrivateRoute';
import UserProvider, { UserContext } from './context/userContext';
import { useContext } from 'react';
import Dashboard from './pages/Admin/Dashboard';
import { Toaster } from 'react-hot-toast';
// import './App.css'

const App = () => {


  return (
    <UserProvider>

    <div>
      
      <Router>
        <Routes>


          <Route path ="/login" element={<Login/>}/>
          <Route path ="/signup" element={<Signup/>}/>



          {/*Admin Routes */}
          <Route element={<PrivateRoute allowedRoles={["admin"]} /> }/>
          <Route path ="/admin/tasks" element={<ManageTasks/>}/>
          <Route path ="/admin/dashboard" element={<Dashboard/>}/>
          <Route path ="/admin/create-task" element={<CreateTask/>}/>
          <Route path ="/admin/users" element={<ManageUsers/>}/>


          {/*User Routes */}
          <Route element={<PrivateRoute allowedRoles={["admin"]} /> }/>
          <Route path ="/user/dashboard" element={<DashboardUser/>}/>
          <Route path ="/user/tasks" element={<MyTasks/>}/>
          <Route path ="/user/task-details/:id" element={<ViewTaskDetails/>}/>
          

          {/*defult Route*/}

          <Route path="/" element={<Root/>} />





        </Routes>
      </Router>
    </div>

    <Toaster
    toastOptions={{
      className:"",
      style: {
        fontSize:"13px",

      },
    }}
    />

    </UserProvider>
  )
}

export default App


const Root = ()=> {

  const {user, loading } = useContext(UserContext);

  if(loading) return <Outlet/>

  if(!user){
    return <Navigate to= "/login" />;
  }

  return user.role === "admin" ? <Navigate to = "/admin/dashboard" /> :  <Navigate to = "user/dashboard" /> ;

};
