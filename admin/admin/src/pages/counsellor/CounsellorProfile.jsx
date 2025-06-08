import React, { useContext, useEffect, useState } from "react";
import { CounsellorContext } from "../../context/CounsellorContext";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";

const CounsellorProfile = () => {
  const { profileData, counsellorInfo, cToken, setCounsellorInfo, backendUrl } =
    useContext(CounsellorContext);
  const { currency } = useContext(AppContext);
  const [isEdit, setIsEdit] = useState(false);

  const updateProfile = async () => {
    try {
      const updateData = {
        name: counsellorInfo.name,
        degree: counsellorInfo.degree,
        experience: counsellorInfo.experience,
        about: counsellorInfo.about,
        fees: counsellorInfo.fees,
        location: counsellorInfo.location,
        available: counsellorInfo.available,
      };

      const { data } = await axios.post(
        `${backendUrl}/api/counsellor/update-profile`,
         updateData,
        { headers: { cToken } }
      );

      if (data.success) {
        toast.success(data.message);
        profileData();
        setIsEdit(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    profileData();
  }, [cToken]);

  return (
    counsellorInfo && (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8 px-6">
            <div className="">
              <img
                className="w-full h-48 sm:h-64 md:h-72 lg:h-80 object-cover rounded-2xl shadow-xl border-4 border-white"
                src={counsellorInfo.image}
                alt="Counsellor profile"
              />
              <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg mb-6">
                <input
                  onChange={(e) => {
                    if (isEdit) {
                      setCounsellorInfo((prev) => ({
                        ...prev,
                        available: e.target.checked,
                      }));
                    }
                  }}
                  checked={counsellorInfo.available}
                  type="checkbox"
                  id="availability"
                  disabled={!isEdit}
                  className={`w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 transition-all ${
                    !isEdit
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer hover:border-blue-400"
                  }`}
                />
                <label
                  htmlFor="availability"
                  className={`text-sm font-medium text-gray-800 select-none ${
                    isEdit ? "cursor-pointer" : "cursor-default"
                  }`}
                >
                  {counsellorInfo.available
                    ? " 🔵 Available for appointments"
                    : "🔴 Currently unavailable"}
                </label>
              </div>
            </div>

            <div className="lg:w-2/3 mt-8 lg:mt-0">
              <div className="flex-1 border border-stone-200 rounded-xl p-8 bg-white shadow-lg">
                {/* Counsellor Info */}
                <div className="mb-6">
                  {isEdit ? (
                    <input
                      type="text"
                      value={counsellorInfo.name}
                      onChange={(e) =>
                        setCounsellorInfo((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      className="text-3xl font-semibold text-gray-800 bg-transparent border-b-2 border-blue-300 focus:border-blue-500 outline-none pb-1 w-full"
                      placeholder="Counsellor Name"
                    />
                  ) : (
                    <h1 className="text-3xl font-semibold text-gray-800">
                      {counsellorInfo.name}
                    </h1>
                  )}
                </div>

                <div className="flex items-center gap-3 mb-6">
                  {isEdit ? (
                    <>
                      <input
                        type="text"
                        value={counsellorInfo.degree}
                        onChange={(e) =>
                          setCounsellorInfo((prev) => ({
                            ...prev,
                            degree: e.target.value,
                          }))
                        }
                        className="py-1 px-3 border border-gray-300 text-sm rounded focus:border-blue-500 outline-none bg-blue-50"
                        placeholder="Degree"
                      />
                      <span>-</span>
                      <input
                        type="text"
                        value={counsellorInfo.specialty}
                        onChange={(e) =>
                          setCounsellorInfo((prev) => ({
                            ...prev,
                            specialty: e.target.value,
                          }))
                        }
                        className="py-1 px-3 border border-gray-300 text-sm rounded focus:border-blue-500 outline-none bg-blue-50"
                        placeholder="Specialty"
                      />
                    </>
                  ) : (
                    <p className="text-gray-600 font-medium">
                      {counsellorInfo.degree} - {counsellorInfo.specialty}
                    </p>
                  )}
                  {isEdit ? (
                    <input
                      type="text"
                      value={counsellorInfo.experience}
                      onChange={(e) =>
                        setCounsellorInfo((prev) => ({
                          ...prev,
                          experience: e.target.value,
                        }))
                      }
                      className="py-1 px-3 border border-gray-300 text-sm rounded-full focus:border-blue-500 outline-none bg-blue-50"
                      placeholder="Years of experience"
                    />
                  ) : (
                    <span className="py-1 px-3 bg-blue-100 text-blue-800 text-sm rounded-full font-medium">
                      {counsellorInfo.experience}
                    </span>
                  )}
                </div>

                {/* Counsellor About */}
                <div className="mb-6">
                  <p className="text-sm font-semibold text-gray-800 mb-2">
                    About:
                  </p>
                  {isEdit ? (
                    <textarea
                      value={counsellorInfo.about}
                      onChange={(e) =>
                        setCounsellorInfo((prev) => ({
                          ...prev,
                          about: e.target.value,
                        }))
                      }
                      className="w-full max-w-[700px] p-3 border border-gray-300 rounded-lg focus:border-blue-500 outline-none resize-vertical min-h-[100px] text-sm text-gray-700"
                      placeholder="Tell us about yourself..."
                    />
                  ) : (
                    <p className="text-sm text-gray-700 max-w-[700px] leading-relaxed">
                      {counsellorInfo.about}
                    </p>
                  )}
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <p className="text-sm font-semibold text-gray-800 mb-2">
                    Appointment Fee:
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-blue-600">
                      {currency}
                    </span>
                    {isEdit ? (
                      <input
                        type="number"
                        onChange={(e) =>
                          setCounsellorInfo((prev) => ({
                            ...prev,
                            fees: e.target.value,
                          }))
                        }
                        value={counsellorInfo.fees}
                        className="text-2xl font-bold text-blue-600 bg-white border border-gray-300 rounded-lg px-3 py-2 w-32 focus:border-blue-500 outline-none"
                        min="0"
                      />
                    ) : (
                      <span className="text-2xl font-bold text-blue-600">
                        {counsellorInfo.fees}
                      </span>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <p className="text-sm font-semibold text-gray-800 mb-2">
                    Location:
                  </p>
                  {isEdit ? (
                    <input
                      type="text"
                      placeholder="City, Country"
                      onChange={(e) =>
                        setCounsellorInfo((prev) => ({
                          ...prev,
                          location: e.target.value,
                        }))
                      }
                      value={counsellorInfo.location}
                      className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:border-blue-500 outline-none"
                    />
                  ) : (
                    <p className="text-gray-700 font-medium">
                      {counsellorInfo.location}
                    </p>
                  )}
                </div>

                {isEdit ? (
                  <div className="flex gap-3">
                    <button
                      onClick={updateProfile}
                      className="px-6 py-2 bg-blue-500 text-white text-sm rounded-full hover:bg-blue-600 transition-all"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setIsEdit(false)}
                      className="px-6 py-2 border border-gray-300 text-sm rounded-full hover:bg-gray-100 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsEdit(true)}
                    className="px-6 py-2 border border-blue-300 text-sm rounded-full hover:bg-blue-500 hover:text-white transition-all"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default CounsellorProfile;
