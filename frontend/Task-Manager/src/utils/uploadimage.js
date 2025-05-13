import { API_PATHS } from "./apiPaths";
import axiosInstance from "./axiosinstance";


const uploadImage = async (imagefile) => {

    const formData = new FormData();
    //append image file to form data
    formData.append('image' , imagefile);

    try {
        const response  = await axiosInstance.post(API_PATHS.IMAGE.UPLOAD_IMAGE , formData , {
            headers : {
                'Content-Type' : 'multipart/form/data',
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error uploading the image" , error);
    throw error;
    }
};

export default uploadImage;