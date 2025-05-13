import React, { useContext, useState } from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import { validateEmail } from "../../utils/helper";
import ProfilePhotoSelector from "../../components/inputs/ProfilePhotoSelector";
import Input from "../../components/inputs/input";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosinstance";
import { API_PATHS } from "../../utils/apiPaths";
import uploadImage from "../../utils/uploadimage";
import { UserContext } from "../../context/userContext";

const Signup = () => {

   

    const[profilePic, setProfilePic] = useState(null);
    const [fullName, setFulName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [adminInviteToken, setAdminInviteToken] = useState('');
    const [error, setError] = useState(null);


const {updateUser} = useContext(UserContext);
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();

        let profileImageUrl = "";
    

        if(!fullName){
            setError("please enter full name");
            return;
        }

        if(!validateEmail(email)){
            setError("please enter a valid email address");
            return;
        }

        if(!password){
            setError("please enter the password");
            return;
        }

        setError("")

        //Sign up API Call

        //upload image if present
        if(profilePic){
            const imageUploads = await uploadImage(profilePic);
            profileImageUrl = imageUploads.imageUrl || "";
        }


        try{
            const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER , {
                name : fullName,
                email,
                password,
                profileImageUrl,
                adminInviteToken
            });

            //here i am saying to him that i will give him response to create to him token and also specify the role

            const {token , role} = response.data;

            if(token){
                localStorage.setItem("token" ,token);
                updateUser(response.data);

                if(role=== "admin"){
                    navigate("/admin/dashboard");
                }else{
                    navigate("/user/dashboard");
                }
            }

            

        }catch(error){
            if(error.response && error.response.data.message){
                setError(error.response.data.message);
            }else{
                setError("Something went wrong please try again");
            }

        }
    };

    return (
        <AuthLayout>
            
            <div className="lg:w-[100%] h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center">

                <h3 className="text-xl font-semibold text-black">Create an Account</h3>
                <p className="text-xs text-slate-700 mt-[5px] mb-6">
                    Join us tody by enteriung your deatils below
                </p>

                <form onSubmit={handleSignup}>
                    <ProfilePhotoSelector image= {profilePic} setImage={setProfilePic}/>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    <Input type="text"
                    label="Full Name"
                    placeholder= "John"
                    onChange={({target})=> setFulName(target.value)}
                    />

                <Input value ={email}
                onChange={({target})=> setEmail(target.value)}
                label="Email Address"
                placeholder = "johan@example.com"
                type = "email"
                />


                <Input value ={password}
                onChange={({target})=> setPassword(target.value)}
                label="Password"
                placeholder = "Min 8 Charcters"
                type = "password"
                />

                <Input value ={adminInviteToken}
                onChange={({target})=> setAdminInviteToken(target.value)}
                label=" Admin Invite Token"
                placeholder = "6 Digit Code"
                type = "text"
                />
                </div>

                {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

                <button type="submit" className="btn-primary">
                    SIGN UP
                </button>

                <p className="text-[13px] text-slate-800 mt-3">
                    Already have an account ?{" "}
                    <Link className="font-medium text-primary underline" to="/login" >
                    LOGIN
                    </Link>

                    </p>
                    
                </form>
            </div>


        </AuthLayout>
    );
};

export default Signup;