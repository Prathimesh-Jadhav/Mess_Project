import { useState } from "react";
import { MdEdit } from "react-icons/md";

const MessDetails = () => {
   const [messDetails, setMessDetails] = useState({
      name: "Buddy's Kitchen",
      owner: "Vishwajeet Kale",
      afternoonTime: "12:00 PM - 2:30 PM",
      eveningTime: "7:00 PM - 9:30 PM",
      totalMembers: 80,
      address: "Ashta, Sangli",
      contact: "9890353653",
      Meal_Price: 60,
   });
   const [isEditable, setIsEditable] = useState(false);

   const handleChange = (e) => {
      setMessDetails({ ...messDetails, [e.target.name]: e.target.value });
   };

   const handleEdit = () => {
      setIsEditable(true);
   };

   const handleSubmit = () => {
      console.log("Updated Mess Details:", messDetails);
      alert("Mess details updated successfully!");
      setIsEditable(false);
   };

   return (
      <div className="w-full min-h-[85vh] font-poppins px-[30px] mt-[100px]">
         {/* page Details 
         <div className="mt-6">
            <p className="text-[28px] font-semibold">Mess Details</p>
         </div> */}

         {/* form  */}
         <div className="border-[1px] rounded-md mt-4 p-4">
            <div className="w-full flex justify-between items-center">
               <div>
                  <p className="text-subheading font-semibold">Mess Details</p>
                  <p className="text-[14px] text-gray-500">Update Mess Details</p>
               </div>
               <div>
                  <button
                     className="bg-primary text-text hover:bg-primaryhover py-1 px-4 rounded-md flex gap-1 items-center max-h-12"
                     onClick={handleEdit}
                  >
                     <MdEdit />
                     <p>Edit</p>
                  </button>
               </div>
            </div>
            <div className="w-full py-2 px-4 flex flex-col gap-4 mt-6 max-h-[450px] overflow-auto relative">
               {/* Form fields */}
               {Object.keys(messDetails).map((key) => (
                  <div key={key}>
                     <p className="text-bodyText">{(key.charAt(0).toUpperCase()+key.slice(1)).replace(/_/g, " ")}</p>
                     <input
                        type={key === "totalMembers" || key === "Meal_Price" ? "number" : "text"}
                        name={key.charAt(0).toUpperCase() + key.slice(1)}
                        value={messDetails[key]}
                        onChange={handleChange}
                        disabled={!isEditable}
                        className={`w-full border-[1px] rounded-md py-1 px-2 mt-1 ${isEditable ? "bg-white" : "bg-gray-100 cursor-not-allowed"}`}
                     />
                  </div>
               ))}
               
               {/* Sticky Submit Button */}
               {isEditable && (
                  <div className="w-full flex justify-end items-center sticky -bottom-2 right-6 bg-background py-2">
                     <button
                        className="bg-success text-white hover:bg-success py-1 px-4 rounded-md flex gap-1 items-center max-h-9"
                        onClick={handleSubmit}
                     >
                        Submit
                     </button>
                  </div>
               )}
            </div>
         </div>
      </div>
   );
}

export default MessDetails;
