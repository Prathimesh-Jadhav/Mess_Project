import { GoHome } from "react-icons/go";
import { IoPeople } from "react-icons/io5";
import { MdOutlineFoodBank } from "react-icons/md";
import { CiForkAndKnife } from "react-icons/ci";
import { FaBowlFood } from "react-icons/fa6";
import { MdOutlineCurrencyRupee } from "react-icons/md";
import { IoIosPerson } from "react-icons/io";
import { MdCurrencyRupee } from "react-icons/md";

export const navOptions = {
    admin:[
       {
          name:'Dashboard',
          path:'/layout/admin/dashboard',
          logo:GoHome
       },
       {
          name:'Members',
          path:'/layout/admin/members',
          logo:IoPeople
       },
       {
          name:'Mess Details',
          path:'/layout/admin/messDetails',
          logo:MdOutlineFoodBank
       }
    ],
    user:[
       {
          name:'Dashboard',
          path:'/layout/user/dashboard',
          logo:GoHome
       },
       {
          name:'Your Meals',
          path:'/layout/user/mealDetails',
          logo:MdOutlineFoodBank
       }
    ]
}

export const keyStats = {
   admin:[
      {
         heading:'Total Active Members',
         value:'0',
         logo:CiForkAndKnife,
         tag:'this Month'
      },
      {
         heading:'Meal Sold Today',
         value:'20 ',
         logo:FaBowlFood,
         tag:'sold Today'
      },
      {
         heading:"Today's Revenue",
         value:'0',
         logo:MdCurrencyRupee,
         tag:'revenue Today' 
      }
   ],
   user:[
      {
         heading:'Total Meals',
         value:'0',
         logo:FaBowlFood,
         tag:'this Month'
      },
      {
         heading:"Total Cost",
         value:'$0',
         logo:MdOutlineCurrencyRupee,
         tag:'@ 60Rs per meal'
      },
      {
         heading:"Subscription Status",
         value:'Active',
         logo:IoIosPerson,
         tag:'this Month'
      }
   ]
}