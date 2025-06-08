import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { useContext } from "react";

const CounsellorsPage = () => {
  const { specialty } = useParams();

  const { counsellors } = useContext(AppContext);
  const [filterCoun, SetFilterCoun] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const navigate = useNavigate();

  const applyFilter = () => {
    if (specialty) {
      SetFilterCoun(counsellors.filter((coun) => coun.specialty === specialty));
    } else {
      SetFilterCoun(counsellors);
    }
  };

  useEffect(() => {
    applyFilter();
  }, [counsellors, specialty]);
  return (
    <div className="mx-5">
      <p className="text-gray-600 mt-25">
        Browse through the counsellors speacialist
      </p>
      <div className="flex flex-col sm:flex-row items-start gap-5 mt-5">
        <button
          className={`py-1 px-3 border rounded text-sm transition-all sm:hidden ${
            showFilter ? "bg-blue-500 text-white" : ""
          } cursor-pointer border border-blue-300`}
          onClick={() => setShowFilter((prev) => !prev)}
        >
          Filters
        </button>
        <div
          className={`flex-col gap-3 text-sm text-gray-600 ${
            showFilter ? "flex" : "hidden sm:flex"
          }`}
        >
          <p
            onClick={() =>
              specialty === "Marriage and Family Counsellor"
                ? navigate("/counsellors")
                : navigate("/counsellors/Marriage and Family Counsellor")
            }
            className={`w-[94vw] sm:w-75 pl-3 py-1.5 pr-16 border border-blue-300 rounded  hover:translate-y-[-5px] transition-all duration-500 cursor-pointer`}
          >
            Marriage and Family Counsellor
          </p>
          <p
            onClick={() =>
              specialty === "School Counsellor"
                ? navigate("/counsellors")
                : navigate("/counsellors/School Counsellor")
            }
            className={`w-[94vw] sm:w-75 pl-3 py-1.5 pr-16 border border-blue-300 rounded  hover:translate-y-[-5px] transition-all duration-500 cursor-pointer`}
          >
            School Counsellor
          </p>
          <p
            onClick={() =>
              specialty === "Rehabilitation Counsellor"
                ? navigate("/counsellors")
                : navigate("/counsellors/Rehabilitation Counsellor")
            }
            className={`w-[94vw] sm:w-75 pl-3 py-1.5 pr-16 border border-blue-300 rounded  hover:translate-y-[-5px] transition-all duration-500 cursor-pointer`}
          >
            Rehabilitation Counsellor
          </p>
          <p
            onClick={() =>
              specialty === "Substance Abuse Counsellor"
                ? navigate("/counsellors")
                : navigate("/counsellors/Substance Abuse Counsellor")
            }
            className={`w-[94vw] sm:w-75 pl-3 py-1.5 pr-16 border border-blue-300 rounded  hover:translate-y-[-5px] transition-all duration-500 cursor-pointer`}
          >
            Substance Abuse Counsellor
          </p>
          <p
            onClick={() =>
              specialty === "Mental Health Counsellor"
                ? navigate("/counsellors")
                : navigate("/counsellors/Mental Health Counsellor")
            }
            className={`w-[94vw] sm:w-75 pl-3 py-1.5 pr-16 border border-blue-300 rounded  hover:translate-y-[-5px] transition-all duration-500 cursor-pointer`}
          >
            Mental Health Counsellor
          </p>
          <p
            onClick={() =>
              specialty === "Career Counsellor"
                ? navigate("/counsellors")
                : navigate("/counsellors/Career Counsellor")
            }
            className={`w-[94vw] sm:w-75 pl-3 py-1.5 pr-16 border border-blue-300 rounded  hover:translate-y-[-5px] transition-all duration-500 cursor-pointer`}
          >
            Career Counsellor
          </p>
        </div>
        <div className="w-full grid grid-cols-5 gap-4 gap-y-6">
          {filterCoun.map((item, index) => (
            <div
              onClick={() => navigate(`/appointment/${item._id}`)}
              className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500 hover:bg-blue-200 "
            >
              <img className="bg-blue-50" src={item.image} alt="" />
              <div className="p-4">
                <p className="text-gray-900 text-lg font-medium">{item.name}</p>
                <p className="text-gray-600 text-sm">{item.specialty}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CounsellorsPage;
