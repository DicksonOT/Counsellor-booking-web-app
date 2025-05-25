import React from "react";

const Info = () => {
  return (
    <div>
      <div className="relaive lg:h-90 w-full rounded-lg px-5 grid grid-cols-2 gap-2 bg-cover bg-center ">
        <div>
          <p className="text-xl md:text-2xl lg:text-3xl font-bold leading-tight md:leading-tight lg:leading-tight pt-10">
            Our vision
            <hr class="border-t-2 border-blue-400 my-4 w-15" />
          </p>
          <p>
            Our vision is to revolutionize mental health support by providing
            accessible, affordable, and compassionate care to individuals
            worldwide. We aim to bridge the gap to timely and effective support
            through our innovative web-based AI chatbot, offering empathetic
            listening, personalized coping strategies, and connections to local
            therapists. <br />
            <br />
            By harnessing the power of technology and human-centered design, we
            envision a future where mental wellness is within reach for all,
            empowering individuals to thrive and live healthier and happier
            lives.
          </p>
        </div>

        <div>
          <p className="text-xl md:text-2xl lg:text-3xl font-bold leading-tight md:leading-tight lg:leading-tight pt-10">
            What We Do
            <hr class="border-t-2 border-blue-400 my-4 w-15" />
          </p>
          <p>
            We provide a safe, supportive and non-judgmental space for
            individuals to access mental health support, whenever and wherever
            they need it.
          </p>
          <oll>
            <li>
              AI-Powered Chatbot: Our innovative chatbot uses natural language
              processsing to offer empathetic listening, personalized coping
              strategies and emotional support.
            </li>
            <li>
              Personalized Resources: We connect users wich relevant resources,
              including local therapists and mental health professionals.
            </li>

            <li>
              Mental Health Tools: Our platform provides access to a range of
              mental health tools, including mood-tracking, mindfulness
              exercises and stress-management techniques.
            </li>
          </oll>
        </div>
      </div>
    </div>
  );
};

export default Info;
