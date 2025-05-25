import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const Reviews = () => {
  const navigate = useNavigate();
  const { reviews } = useContext(AppContext);

  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
        <span
          key={i}
          className={i < rating ? "text-yellow-400" : "text-gray-300"}
        >
          {i < rating ? "★" : "☆"}
        </span>
      ));
  };

  return (
    <>
      <div className="flex flex-col mt-10">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold">
          Our Community
        </h1>
        <hr className="border-t-2 border-blue-400 my-4 w-15 ml-0" />
      </div>
      <div className="relative w-[96vw] min-h-screen overflow-hidden mt-5">
        <div
          className="absolute inset-0 bg-cover bg-center z-0 rounded-lg"
          style={{
            backgroundImage: `url(${assets.people})`,
            filter: "brightness(0.7)",
          }}
        />

        <div className="relative z-10 w-full max-w-7xl py-5 sm:px-6 lg:px-5">
          <h1 className="text-center text-3xl font-semibold text-white mb-12 drop-shadow-lg">
            What People Say About Our AI Mental Health System
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-white/15 backdrop-blur-md rounded-xl p-6 shadow-xl transition-transform duration-300 hover:-translate-y-2"
              >
                <div className="flex items-center mb-4">
                  <img
                    src={review.avatar}
                    alt={review.name}
                    className="w-12 h-12 rounded-full border-2 border-white mr-4"
                  />
                  <div>
                    <h3 className="font-semibold text-white">{review.name}</h3>
                    <p className="text-sm text-blue-300">{review.role}</p>
                  </div>
                </div>

                <p className="text-white/90 italic mb-4">"{review.text}"</p>

                <div className="flex justify-between items-center">
                  <div className="text-xl">{renderStars(review.rating)}</div>
                  <p className="text-sm text-white/70">
                    {new Date(review.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="text-center mt-12">
        <a
          onClick={() => navigate("/login")}
          href=""
          className="inline-flex items-center justify-center px-8 py-4 bg-blue-400 hover:bg-blue-500 text-white font-semibold rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <span>Join Our Support Community</span>
        </a>
        <p className="text-white/80 mt-4 text-lg">
          Connect with others on WhatsApp for daily mental health support
        </p>
      </div>
      </div>

    </>
  );
};

export default Reviews;
