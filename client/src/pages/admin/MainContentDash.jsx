import { useState } from "react";
import graf1 from "../../assets/graf1.jpg";
import graf2 from "../../assets/graf2.jpg";
import grafleft from "../../assets/grafleft.jpg";
import grafright from "../../assets/grafright.jpg";
import React from "react";

import { useNavigate } from "react-router-dom";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import DashHeader from "./DashHeader";

const data = [
  { name: "", value: 500 },
  { name: "", value: 150 },
  { name: "", value: 600 },
  { name: "", value: 90 },
  { name: "", value: 300 },
  { name: "", value: 110 },
  { name: "", value: 800 },
  { name: "", value: 120 },
  { name: "", value: 95 },
  { name: "", value: 400 },
  { name: "", value: 110 },
  { name: "", value: 1100 },
];

const Card = ({ frontContent, backContent, bgImage }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="relative w-full h-[150px] perspective"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <div
        className={`w-full h-full transition-transform duration-500 transform ${
          isFlipped ? "rotate-y-180" : ""
        }`}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front Side */}
        <div
          className="absolute w-full h-full bg-gradient-to-r from-purple-500 to-blue-500 text-white p-6 rounded-lg shadow-md flex items-center justify-between"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(128,0,128,0.7), rgba(0,0,255,0.7)), url(${bgImage})`,
            backgroundPosition: "right center",
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backfaceVisibility: "hidden",
          }}
        >
          {frontContent}
        </div>

        {/* Back Side */}
        <div
          className="absolute w-full h-full bg-white p-6 rounded-lg shadow-md flex items-center justify-center transform rotate-y-180"
          style={{ backfaceVisibility: "hidden" }}
        >
          {backContent}
        </div>
      </div>
    </div>
  );
};

const MainContentDash = () => {
  let storedUser = localStorage.getItem("user");
  const nevigate = useNavigate();

  let user = storedUser ? JSON.parse(storedUser) : null;

  return (
    <>
      <DashHeader className="mb-16" />
      <div className="flex-1 p-6 overflow-auto bg-green-50 mt-16">
        <div className="flex flex-col lg:flex-row justify-between items-center">
          <h2 className="text-3xl font-extrabold font-serif text-red-500 hover:text-red-200">
            <span className="text-sm">
              Hi
              {user?.data?.firstName && user?.data?.lastName
                ? `${user?.data?.firstName} ${user?.data?.lastName}`
                : " Guest"}
            </span>
            <br /> Welcome to LMS!
          </h2>
          <div className="">
            <input
              className="bg-white rounded py-2 px-12 pl-10 font-serif font-bold"
              placeholder="Search"
              type="text"
            />
            <i className="fas fa-search absolute left-3 top-3 text-gray-500"></i>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6 font-serif">
          {[
            {
              title: "Total Courses",
              value: "$540.50",
              image: grafleft,
              gradient: true,
            },
            {
              title: "Spent this month",
              value: "$682.5",
              image: graf1,
              gradient: false,
            },
            {
              title: "Earnings",
              value: "$350.40",
              image: graf2,
              gradient: false,
            },
            {
              title: "Users",
              value: "$540.50",
              image: grafright,
              gradient: true,
            },
          ].map((item, index) => (
            <div
              key={index}
              className="group relative w-full h-[150px] perspective-1000"
            >
              {/* Front Side */}
              <div
                className={`absolute inset-0 ${
                  item.gradient
                    ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                    : "bg-white text-gray-900"
                } p-6 rounded-lg shadow-md flex flex-col justify-center items-start transition-transform duration-500 group-hover:rotate-y-180`}
                style={{
                  backgroundImage: item.gradient
                    ? `linear-gradient(to right, rgba(128,0,128,0.7), rgba(0,0,255,0.7)), url(${item.image})`
                    : `url(${item.image})`,
                  backgroundPosition: "right center",
                  backgroundSize: "contain",
                  backgroundRepeat: "no-repeat",
                  backfaceVisibility: "hidden",
                }}
              >
                <h3 className="text-2xl font-bold">{item.title}</h3>
                <p className="text-lg">{item.value}</p>
              </div>

              {/* Back Side */}
              <div
                className="absolute inset-0 bg-gray-200 text-gray-800 p-6 rounded-lg shadow-md flex flex-col justify-center items-center transform rotate-y-180 transition-transform duration-500 group-hover:rotate-y-0"
                style={{
                  backfaceVisibility: "hidden",
                }}
              >
                <h3 className="text-xl font-bold font-serif">More Info</h3>
                <p className="text-sm font-serif">
                  Detailed insights will be available soon!
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-6 mt-6">
          {/* graf section start */}
          <div className="bg-white p-6 rounded-xl lg:w-3/4 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold font-serif">
                Balance{" "}
                <span className="text-green-500 font-serif">● On track</span>
              </h2>
              <span className="text-gray-500 font-serif">Monthly ▼</span>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-100 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-500 font-serif">Saves</p>
                <p className="text-2xl font-bold">
                  43.50% <span className="text-green-500 text-sm">+2.45%</span>
                </p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-500 font-serif">Balance</p>
                <p className="text-2xl font-bold">
                  $52,422 <span className="text-red-500 text-sm">-4.75%</span>
                </p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart
                data={data}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="name" tick={false} axisLine={false} />
                <YAxis hide />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#8884d8"
                  fillOpacity={1}
                  fill="url(#colorValue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* graf section end */}

          <div className="bg-white p-6 rounded-lg shadow-md lg:w-1/4 overflow-y-auto h-98 ">
            <h3 className="text-lg font-bold fixed relative  top-0 font-serif">
              User Transfers
            </h3>
            <div className="mt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <img
                    alt="Profile picture of Alex Manda"
                    className="rounded-full w-10 h-10"
                    height="100"
                    src="https://storage.googleapis.com/a1aa/image/i_NTVKpdNl_HqoGmBr8umfaPfBSDuqj6DXondtl2eDQ.jpg"
                    width="100"
                  />
                  <div className="ml-3">
                    <p>From Alex Manda</p>
                    <span className="text-gray-500 text-sm font-serif">
                      Today, 16:36
                    </span>
                  </div>
                </div>
                <span className="text-green-500 font-serif">+$50</span>
              </div>
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center">
                  <img
                    alt="Profile picture of Laura Santos"
                    className="rounded-full w-10 h-10"
                    height="100"
                    src="https://storage.googleapis.com/a1aa/image/AnnQ7YANRz1mACzCLf3D5cFZRtyVwfGsJFvdJrDSSOQ.jpg"
                    width="100"
                  />
                  <div className="ml-3">
                    <p>To Laura Santos</p>
                    <span className="text-gray-500 text-sm font-serif">
                      Today, 08:49
                    </span>
                  </div>
                </div>
                <span className="text-red-500">-$27</span>
              </div>
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center">
                  <img
                    alt="Profile picture of Laura Santos"
                    className="rounded-full w-10 h-10"
                    height="100"
                    src="https://storage.googleapis.com/a1aa/image/AnnQ7YANRz1mACzCLf3D5cFZRtyVwfGsJFvdJrDSSOQ.jpg"
                    width="100"
                  />
                  <div className="ml-3">
                    <p>To Laura Santos</p>
                    <span className="text-gray-500 text-sm font-serif">
                      Today, 08:49
                    </span>
                  </div>
                </div>
                <span className="text-red-500 font-serif">-$27</span>
              </div>
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center">
                  <img
                    alt="Profile picture of Laura Santos"
                    className="rounded-full w-10 h-10"
                    height="100"
                    src="https://storage.googleapis.com/a1aa/image/AnnQ7YANRz1mACzCLf3D5cFZRtyVwfGsJFvdJrDSSOQ.jpg"
                    width="100"
                  />
                  <div className="ml-3">
                    <p>To Laura Santos</p>
                    <span className="text-gray-500 text-sm font-serif">
                      Today, 08:49
                    </span>
                  </div>
                </div>
                <span className="text-red-500 font-serif">-$27</span>
              </div>
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center">
                  <img
                    alt="Profile picture of Laura Santos"
                    className="rounded-full w-10 h-10"
                    height="100"
                    src="https://storage.googleapis.com/a1aa/image/AnnQ7YANRz1mACzCLf3D5cFZRtyVwfGsJFvdJrDSSOQ.jpg"
                    width="100"
                  />
                  <div className="ml-3">
                    <p>To Laura Santos</p>
                    <span className="text-gray-500 text-sm font-serif">
                      Today, 08:49
                    </span>
                  </div>
                </div>
                <span className="text-red-500 font-serif">-$27</span>
              </div>
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center">
                  <img
                    alt="Profile picture of Laura Santos"
                    className="rounded-full w-10 h-10"
                    height="100"
                    src="https://storage.googleapis.com/a1aa/image/AnnQ7YANRz1mACzCLf3D5cFZRtyVwfGsJFvdJrDSSOQ.jpg"
                    width="100"
                  />
                  <div className="ml-3">
                    <p>To Laura Santos</p>
                    <span className="text-gray-500 text-sm font-serif">
                      Today, 08:49
                    </span>
                  </div>
                </div>
                <span className="text-red-500 font-serif">-$27</span>
              </div>
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center">
                  <img
                    alt="Profile picture of Laura Santos"
                    className="rounded-full w-10 h-10"
                    height="100"
                    src="https://storage.googleapis.com/a1aa/image/AnnQ7YANRz1mACzCLf3D5cFZRtyVwfGsJFvdJrDSSOQ.jpg"
                    width="100"
                  />
                  <div className="ml-3">
                    <p>To Laura Santos</p>
                    <span className="text-gray-500 text-sm font-serif">
                      Today, 08:49
                    </span>
                  </div>
                </div>
                <span className="text-red-500 font-serif">-$27</span>
              </div>
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center">
                  <img
                    alt="Profile picture of Laura Santos"
                    className="rounded-full w-10 h-10"
                    height="100"
                    src="https://storage.googleapis.com/a1aa/image/AnnQ7YANRz1mACzCLf3D5cFZRtyVwfGsJFvdJrDSSOQ.jpg"
                    width="100"
                  />
                  <div className="ml-3">
                    <p>To Laura Santos</p>
                    <span className="text-gray-500 text-sm font-serif">
                      Today, 08:49
                    </span>
                  </div>
                </div>
                <span className="text-red-500 font-serif">-$27</span>
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center">
                  <img
                    alt="Profile picture of Laura Santos"
                    className="rounded-full w-10 h-10"
                    height="100"
                    src="https://storage.googleapis.com/a1aa/image/AnnQ7YANRz1mACzCLf3D5cFZRtyVwfGsJFvdJrDSSOQ.jpg"
                    width="100"
                  />
                  <div className="ml-3">
                    <p>To Laura Santos</p>
                    <span className="text-gray-500 text-sm font-srif">
                      Today, 08:49
                    </span>
                  </div>
                </div>
                <span className="text-red-500 font-serif">-$27</span>
              </div>
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center">
                  <img
                    alt="Profile picture of Laura Santos"
                    className="rounded-full w-10 h-10"
                    height="100"
                    src="https://storage.googleapis.com/a1aa/image/AnnQ7YANRz1mACzCLf3D5cFZRtyVwfGsJFvdJrDSSOQ.jpg"
                    width="100"
                  />
                  <div className="ml-3 font-serif">
                    <p>To Laura Santos</p>
                    <span className="text-gray-500 text-sm font-serif">
                      Today, 08:49
                    </span>
                  </div>
                </div>
                <span className="text-red-500 font-serif">-$27</span>
              </div>
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center">
                  <img
                    alt="Profile picture of Laura Santos"
                    className="rounded-full w-10 h-10"
                    height="100"
                    src="https://storage.googleapis.com/a1aa/image/AnnQ7YANRz1mACzCLf3D5cFZRtyVwfGsJFvdJrDSSOQ.jpg"
                    width="100"
                  />
                  <div className="ml-3">
                    <p>To Laura Santos</p>
                    <span className="text-gray-500 text-sm font-serif">
                      Today, 08:49
                    </span>
                  </div>
                </div>
                <span className="text-red-500 font-serif">-$27</span>
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center">
                  <img
                    alt="Profile picture of Laura Santos"
                    className="rounded-full w-10 h-10"
                    height="100"
                    src="https://storage.googleapis.com/a1aa/image/AnnQ7YANRz1mACzCLf3D5cFZRtyVwfGsJFvdJrDSSOQ.jpg"
                    width="100"
                  />
                  <div className="ml-3">
                    <p>To Laura Santos</p>
                    <span className="text-gray-500 text-sm font-serif">
                      Today, 08:49
                    </span>
                  </div>
                </div>
                <span className="text-red-500">-$27</span>
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center">
                  <img
                    alt="Profile picture of Laura Santos"
                    className="rounded-full w-10 h-10"
                    height="100"
                    src="https://storage.googleapis.com/a1aa/image/AnnQ7YANRz1mACzCLf3D5cFZRtyVwfGsJFvdJrDSSOQ.jpg"
                    width="100"
                  />
                  <div className="ml-3">
                    <p>To Laura Santos</p>
                    <span className="text-gray-500 text-sm font-serif">
                      Today, 08:49
                    </span>
                  </div>
                </div>
                <span className="text-red-500 font-serif">-$27</span>
              </div>
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center">
                  <img
                    alt="Profile picture of Laura Santos"
                    className="rounded-full w-10 h-10"
                    height="100"
                    src="https://storage.googleapis.com/a1aa/image/AnnQ7YANRz1mACzCLf3D5cFZRtyVwfGsJFvdJrDSSOQ.jpg"
                    width="100"
                  />
                  <div className="ml-3">
                    <p>To Laura Santos</p>
                    <span className="text-gray-500 text-sm font-serif">
                      Today, 08:49
                    </span>
                  </div>
                </div>
                <span className="text-red-500 font-serif">-$27</span>
              </div>
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center">
                  <img
                    alt="Profile picture of Jadon S."
                    className="rounded-full w-10 h-10"
                    height="100"
                    src="https://storage.googleapis.com/a1aa/image/6u0IS57KQItJC50-azCw1-dvsSxoR7mk9_UxvfSF7fM.jpg"
                    width="100"
                  />
                  <div className="ml-3">
                    <p>From Jadon S.</p>
                    <span className="text-gray-500 text-sm font-serif">
                      Yesterday, 14:36
                    </span>
                  </div>
                </div>
                <span className="text-green-500 font-serif">+$157</span>
              </div>
              <a className="text-blue-500 mt-4 block text-right" href="#">
                View all
              </a>
            </div>
          </div>
        </div>

        <div class="flex flex-col lg:flex-row gap-4 mt-5">
          {/* <!-- Left Section --> */}
          <div class="bg-white rounded-lg shadow-lg p-6 lg:w-1/3 mb-4 lg:mb-0">
            <div class="bg-purple-500 text-white rounded-lg p-4 mb-6">
              <div class="flex justify-between items-center">
                <div>
                  <p class="text-sm font-serif font-serif">Credit Balance</p>
                  <p class="text-3xl font-bold font-serif">$25,215</p>
                </div>
                <i class="fas fa-exchange-alt text-2xl"></i>
              </div>
            </div>
            <div>
              <h2 class="text-lg font-semibold mb-4 font-serif">Recent</h2>
              <div class="flex items-center mb-4">
                <img
                  alt="Icon of a building"
                  class="w-10 h-10 rounded-full mr-4"
                  height="100"
                  src="https://storage.googleapis.com/a1aa/image/kGPJU_NwVDanWaBTj_EF3YuuhsUtMKYqBwRiRRyv8eE.jpg"
                  width="100"
                />
                <div class="flex-1">
                  <p class="text-sm font-semibold font-serif">
                    Bill &amp; Taxes
                  </p>
                  <p class="text-xs text-gray-500 font-serif">Today, 16:36</p>
                </div>
                <p class="text-red-500 font-semibold font-serif">-$154.50</p>
              </div>
              <div class="flex items-center mb-4">
                <img
                  alt="Icon of a car"
                  class="w-10 h-10 rounded-full mr-4"
                  height="100"
                  src="https://storage.googleapis.com/a1aa/image/O31pXsf8ns32vKEK5QjmMuoynSEBXIS_kwSlFmlDfXQ.jpg"
                  width="100"
                />
                <div class="flex-1">
                  <p class="text-sm font-semibold font-serif">Car Energy</p>
                  <p class="text-xs text-gray-500 font-serif">23 Jun, 13:06</p>
                </div>
                <p class="text-red-500 font-semibold font-serif">-$40.50</p>
              </div>
              <div class="flex items-center">
                <img
                  alt="Icon of a book"
                  class="w-10 h-10 rounded-full mr-4"
                  height="100"
                  src="https://storage.googleapis.com/a1aa/image/1REDMg0QAjBoBJVRbf6Rl-l13kghDxC_MzQYIwV7Adg.jpg"
                  width="100"
                />
                <div class="flex-1">
                  <p class="text-sm font-semibold font-serif">Design Course</p>
                  <p class="text-xs text-gray-500 font-serif">21 Jun, 19:04</p>
                </div>
                <p class="text-red-500 font-semibold font-serif">-$70.00</p>
              </div>
            </div>
          </div>
          {/* <!-- Right Section --> */}
          <div class="bg-white rounded-lg shadow-lg p-6 lg:w-2/3 flex flex-col lg:flex-row items-center">
            <div class="lg:w-1/2 mb-4 lg:mb-0 lg:mr-4">
              <h2 class="text-2xl font-bold mb-2 font-serif">
                Try Venus for free now!
              </h2>
              <p class="text-gray-600 mb-4 font-serif">
                Enter in this creative world. Venus is the best product for your
                business.
              </p>
              <div class="flex items-center font-serif">
                <button class="bg-purple-600 text-white px-4 py-2 rounded-lg mr-4">
                  Try for free
                </button>
                <button class="text-gray-600 font-serif">Skip</button>
              </div>
            </div>
            <div class="lg:w-1/2">
              <img
                alt="Various mobile screens showcasing the Venus app"
                class="rounded-lg"
                height="400"
                src="https://storage.googleapis.com/a1aa/image/0Gg-TnBnQMKRVrUF4wqliIUMBcgnosRScgOFhcCRBqc.jpg"
                width="400"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MainContentDash;
