"use client";
import defaultImg from "@/assets/images/default.png";
import { useGetUser } from "@/features/profile/hooks/useGetUser";
import axios from "axios";
import Image from "next/image";

// import defaultImg2 from "@/assets/images/default2.jpeg";

const base_url = "http://localhost:4000";

function ProfilePage() {
  const { data: singleUser, error, refetch, isLoading } = useGetUser();

  const profileImageUrl = singleUser?.user
    ? `${base_url}/${singleUser.user.profileImage}`
    : defaultImg;

  const fileHandler = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();

    formData.append("profileImg", file);

    const res = await axios.put(`${base_url}/auth/profile`, formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "multipart/form-data",
      },
    });

    if (res.status === 200) {
      refetch();
    }
  };

  return (
    <section className="bg-gray-100 flex items-center justify-center min-h-screen">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-sm text-center">
        <div className="relative inline-block">
          {singleUser?.user?.profileImage && (
            <Image
              src={profileImageUrl}
              alt="Profile Image"
              width={128}
              height={128}
              className="w-32 h-32 rounded-full object-cover mx-auto"
              unoptimized
            />
          )}
          {/* <img
            src={`${base_url}/${singleUser?.user.profileImage}`}
            alt="Profile Image"
            className="w-32 h-32 rounded-full object-cover mx-auto"
          /> */}

          <button className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full text-xs hover:bg-blue-700 transition">
            <input type="file" onChange={fileHandler} />
            ✏️
          </button>
        </div>

        <div className="mt-6 space-y-2">
          <h2 className="text-xl font-semibold text-gray-800">
            FULL NAME: {singleUser?.user.fullName}
          </h2>
          <p className="text-gray-600 text-sm">
            {" "}
            EMAIL : {singleUser?.user.email}
          </p>
          <p className="text-gray-500 text-xs">Member since: Jan 2023</p>
        </div>
      </div>
    </section>
  );
}

export default ProfilePage;
