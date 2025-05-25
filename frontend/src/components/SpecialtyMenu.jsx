import React from "react";
import { SpecialtyData } from "../assets/assets";
import { Link, useNavigate } from "react-router-dom";

const SpecialtyMenu = () => {
  const navigate = useNavigate();

  return (
    <div
      id="specialty"
      className="flex flex-col items-center gap-4 p-10 pt-0 text-gray-800 mt-10"
    >
      <h1 className="text-2xl font-medium">Find By Specialty</h1>
      <hr className="border-t-2 border-blue-400 my- w-15 " />

      <p className="sm:w-1/3 text-center text-base">
        Browse through our extensive list of licensed professional counsellors
        and schedule your appoinment hassle-free
      </p>

      <div className="flex sm:justify-center gap-4 pt-5 w-full overflow-scroll">
        {SpecialtyData.map((item, index) => (
          <Link
            onClick={() => scrollTo(0, 0)}
            className="flex flex-col items-center text-xs cursor-pointer flex-shrink-0 hover:translate-y-[-10px] transition-all duration-500"
            key={index}
            to={`/counsellors/${item.specialty}`}
          >
            <img className="w-16 sm:w-24 mb-2" src={item.image} alt="" />
            <p className="text-sm">{item.specialty}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SpecialtyMenu;
