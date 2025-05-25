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
    <div className="flex flex-col gap-1 m-16 text-gray-900 md:mx-10">
      <h1 className="text-2xl font-medium">Counsellors to book</h1>
      <hr className="border-t-2 border-blue-400 my-4 w-15" />

      <p className="sm:w-1/3 text-base">Choose a Counsellor to book</p>
      <div className="w-full grid grid-cols-4 gap-4 pt-5 gap-y-6 px-3 sm:px-0">
        {filteredCounsellors.slice(0, 10).map((item, index) => (
          <div
            onClick={() => navigate(`/appointment/${item._id}`)}
            className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500"
          >
            <img className="bg-blue-50" src={item.image} alt="" />
            <div className="p-4">
              <p className="text-gray-900 text-lg font-medium">{item.name}</p>
              <p className="text-gray-600 text-sm">{item.specialty}</p>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={() => {
          navigate("/counsellors");
          scrollTo(0, 0);
        }}
        className="bg-blue-100 text-gray-600 px-12 py-3 rounded-full mt-10 cursor-pointer"
      >
        More
      </button>
    </div>
  );
};

export default CounsellorsSpecialty;
