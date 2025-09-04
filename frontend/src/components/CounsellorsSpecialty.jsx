import React, { useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const CounsellorsSpecialty = () => {
  const { counsellors } = useContext(AppContext);
  const navigate = useNavigate();
  const { specialty } = useParams();
  const filteredCounsellors = counsellors.filter(
    (counsellor) => counsellor.specialty === specialty
  );

  return (
    <div className="flex flex-col gap-1 m-2 sm:m-8 md:m-16 text-gray-900 px-2 sm:px-4 md:px-10">
      <h1 className="text-xl sm:text-2xl text-blue-600 font-medium mt-4 sm:mt-8 md:mt-15">
        Counsellors to book
      </h1>
      <hr className="border-t-2 border-blue-400 my-4 w-15" />

      <p className="w-full sm:w-1/2 md:w-1/3 text-sm sm:text-base">
        Choose a Counsellor to book
      </p>
      
      <div className="w-full grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 pt-5 gap-y-4">
        {filteredCounsellors.slice(0, 10).map((item) => (
          <div
            key={item._id}
            onClick={() => navigate(`/appointment/${item._id}`)}
            className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500 w-full"
          >
            <img className="bg-blue-50" src={item.image} alt={item.name} />
            <div className="p-3 sm:p-4">
              <p className="text-gray-900 text-base sm:text-lg font-medium truncate">
                {item.name}
              </p>
              <p className="text-gray-600 text-xs sm:text-sm truncate">
                {item.specialty}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      <button
        onClick={() => {
          navigate("/counsellors");
          scrollTo(0, 0);
        }}
        className="bg-blue-100 text-gray-600 px-8 sm:px-12 py-2 sm:py-3 rounded-full mt-6 sm:mt-10 cursor-pointer text-sm sm:text-base self-center sm:self-start hover:bg-blue-200 transition-colors duration-300"
      >
        More
      </button>
    </div>
  );
};

export default CounsellorsSpecialty;