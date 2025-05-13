import React, { use, useRef, useState } from "react";
import {LuUser , LuUpload , LuTrash} from "react-icons/lu";
const ProfilePhotoSelector = ({image , setImage}) => {

    const inputRef = useRef(null);

    const [perviewUrl  , setPreviewUrl] = useState(null);
    const handleImageChange = (event)=> {
        const file = event.target.files[0];

        if(file){

            //update the inage state
            setImage(file);

            //Genearte preview URL from the file 
            const preview = URL.createObjectURL(file);
            setPreviewUrl(preview);

        }
    }

        const onChooseFile = () => inputRef.current.click();

        const handleRemoveImage = () => {
            setImage(null);
            setPreviewUrl(null);
        };


    return  <div className="flex justify-center mb-6">
            <input 
            type="file"
            accept="image/*"
            ref={inputRef}
            onChange={handleImageChange}
            className="hidden"
            />

            {!image ? (
                <div className="w-20 h-20 flex items-center justify-center bg-blue-100/50 rounded-full relative cursor-pointer">
                    <LuUser className="text-4xl text-primary" />
                    <button 
                    type="button"
                    className="w-8 h-8 flex items-center justify-center bg-primary text-white rounded-full absolute -bottom-1 -right-1 cursor-pointer"
                    onClick={onChooseFile}
                    >
                        <LuUpload/>
                    </button>
                </div>
            ) : (
                <div className="relative">
                    <img 
                    src={perviewUrl} 
                    alt="profile photo"
                    className="w-20 h-20 rounded-full object-cover"
                    />
                    <button 
                    type="button"
                    className="w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full absolute -bottom-1 -right-1"
                    onClick={handleRemoveImage}
                    >

                        <LuTrash />

                    </button>
                </div>
            )}




        </div>
    
};

export default ProfilePhotoSelector;