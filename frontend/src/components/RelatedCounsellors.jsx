import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const RelatedCounsellors = ({ specialty, counId }) => {
  const { counsellors } = useContext(AppContext);
  const navigate = useNavigate();
  const [relCoun, setRelCoun] = useState([]);

  useEffect(() => {
    if (counsellors.length > 0 && specialty) {
      const counsellorsData = counsellors.filter(
        (coun) => coun.specialty === specialty && coun._id !== counId
      );
      setRelCoun(counsellorsData);
    }
  }, [counsellors, specialty, counId]);

  return (
    <div className="flex flex-col gap-4 m-16 text-gray-900 md:mx-10">
      <h1 className="text-2xl font-medium">Related Counsellors</h1>
      <hr className="border-t-2 border-blue-400 my-4 w-16" />

      <p className="sm:w-1/3 text-base">Choose a Counsellor to book</p>

      {relCoun.length === 0 ? (
        <p className="text-gray-500 py-4">No related counsellors found.</p>
      ) : (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-5 gap-y-6 px-3 sm:px-0">
          {relCoun.slice(0, 5).map((item) => (
            <div
              onClick={() => {navigate(`/appointment/${item._id}`); window.scrollTo(0,0) }}
              className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500 bg-blue-50"
            >
              <img className="h-40 " src={item.image} alt="" />
              <div className="p-4 bg-white">
                <p className="text-gray-900 text-lg font-medium">{item.name}</p>
                <p className="text-gray-600 text-sm">{item.specialty}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={() => {
          navigate("/counsellors");
          scrollTo(0, 0);
        }}
        className="bg-blue-100 hover:bg-blue-200 text-gray-600 px-12 py-3 rounded-full mt-10 cursor-pointer transition-colors duration-200"
      >
        View All Counsellors
      </button>
    </div>
  );
};

export default RelatedCounsellors;
