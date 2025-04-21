"use client";

import { useSession } from "next-auth/react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Image from "next/image";
import { useState, useEffect } from "react";
import { CameraIcon } from "./_components/icons";
import { SocialAccounts } from "./_components/social-accounts";
import { uploadToCloudinary } from '@/lib/uploadToCloudinary';
import { signOut } from "next-auth/react";


export default function Page() {
  const { data: session, status } = useSession();

  const [userData, setUserData] = useState({
    name: "",
    bio: "",
    email: "",
    image: "/images/default-avatar.png",
    matchesSentCount: 0,
    matchesReceivedCount: 0,
  });

  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    email: "",
    image: "",
  });

  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/users/basic");
        const data = await res.json();
        if (!data.error) {
          setUserData({
            name: data.name || "",
            bio: data.bio || "",
            email: data.email || "",
            image: data.image || "/images/default-avatar.png",
            matchesSentCount: data.matchesSentCount || 0,
            matchesReceivedCount: data.matchesReceivedCount || 0,
          });
          setFormData({
            name: data.name || "",
            bio: data.bio || "",
            email: data.email || "",
            image: data.image || "",
          });
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    if (status === "authenticated") {
      fetchData();
    }
  }, [status]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target?.files?.[0];
    if (file) {
      try {
        const uploadedUrl = await uploadToCloudinary(file);
        if (uploadedUrl) {
          setFormData(prev => ({ ...prev, image: uploadedUrl }));
        } else {
          console.error("Failed to upload image to Cloudinary.");
        }
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  const handleSave = async () => {
    try {
      const res = await fetch("/api/users/basic", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const updated = await res.json();
      setUserData(prev => ({
        ...prev,
        name: updated.name,
        bio: updated.bio,
        email: updated.email,
        image: updated.image || "/images/default-avatar.png",
      }));
      setEditMode(false);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  if (status === "loading") return <p>Loading...</p>;
  if (status === "unauthenticated") return <p>You must be signed in.</p>;

  return (
    <div className="mx-auto w-full max-w-[970px]">
      <Breadcrumb pageName="Profile" />

      <div className="overflow-hidden rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
      <div className="relative z-20 h-35 md:h-65">
          <Image
            src="/images/cover/cover-01.png"
            alt="profile cover"
            className="h-full w-full rounded-tl-[10px] rounded-tr-[10px] object-cover object-center"
            width={970}
            height={260}
            style={{ width: "auto", height: "auto" }}
          />
        </div>

        <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
          <div className="relative z-30 mx-auto -mt-22 h-30 w-full max-w-30 rounded-full bg-white/20 p-1 backdrop-blur sm:h-44 sm:max-w-[176px] sm:p-3">
            <div className="relative drop-shadow-2">
              {userData.image && (
                <>
                  <Image
                    src={formData.image || userData.image}
                    width={160}
                    height={160}
                    className="object-cover rounded-full h-39"
                    alt="profile"
                  />
                  {editMode && (
                    <label
                      htmlFor="profilePhoto"
                      className="absolute bottom-0 right-0 flex size-8.5 cursor-pointer items-center justify-center rounded-full bg-primary text-white hover:bg-opacity-90 sm:bottom-2 sm:right-2"
                    >
                      <CameraIcon />
                      <input
                        type="file"
                        name="profilePhoto"
                        id="profilePhoto"
                        className="sr-only"
                        onChange={handleImageChange}
                        accept="image/png, image/jpg, image/jpeg"
                      />
                    </label>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="mt-4">
            {editMode ? (
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="mb-1 text-heading-6 font-bold border-[1.5px] 
                text-dark-2 dark:text-white text-center rounded-lg py-2
                border-stroke bg-transparent outline-none transition
                 focus:border-primary disabled:cursor-default  
                 data-[active=true]:border-primary dark:border-dark-3
                   dark:data-[active=true]:border-primary"
              />
            ) : (
              <h3 className="mb-1 text-heading-6 font-bold text-dark dark:text-white">
                {userData.name}
              </h3>
            )}
            <p className="font-medium">{userData.email}</p>
          </div>

          <div className="mx-auto mb-5.5 mt-5 grid max-w-[370px] grid-cols-2 rounded-[5px] border border-stroke py-[9px] shadow-1 dark:border-dark-3 dark:bg-dark-2 dark:shadow-card">
            <div className="flex flex-col items-center justify-center gap-1 border-r border-stroke px-4 dark:border-dark-3 xsm:flex-row">
              <span className="font-medium text-dark dark:text-white">
                {userData.matchesSentCount}
              </span>
              <span className="text-body-md">matches sent</span>
            </div>
            <div className="flex flex-col items-center justify-center gap-1 border-stroke px-4 dark:border-dark-3 xsm:flex-row">
              <span className="font-medium text-dark dark:text-white">
                {userData.matchesReceivedCount}
              </span>
              <span className="text-body-md">matches received</span>
            </div>
          </div>  

          <div className="mx-auto max-w-[720px] mt-4">
            <h4 className="font-medium text-dark dark:text-white">About Me</h4>
            {editMode ? (
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                className="mb-1 text-heading-10 border-[1.5px] 
                text-dark-2 dark:text-white text-center rounded-lg py-2 w-full
                border-stroke bg-transparent outline-none transition
                 focus:border-primary disabled:cursor-default  
                 data-[active=true]:border-primary dark:border-dark-3
                   dark:data-[active=true]:border-primary"
              />
            ) : (
              <p className="mt-4 text-dark-2 dark:text-white">{userData.bio}</p>
            )}
          </div>

          <div className="flex justify-center gap-4 mt-6">
            {editMode ? (
              <>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-primary text-white rounded hover:bg-opacity-90"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditMode(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-opacity-90"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditMode(true)}
                className="px-4 py-2 bg-primary text-white rounded hover:bg-opacity-90"
              >
                Edit Profile
              </button>
            )}
                  <button
        onClick={async () => {
          if (!confirm("Are you sure you want to delete your profile? This action is irreversible.")) return;
          try {
            const res = await fetch("/api/users/delete", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ userId: session?.user?.id }),
            });

            if (!res.ok) throw new Error("Failed to delete profile.");

            await signOut({ callbackUrl: "/auth/sign-in" });
          } catch (err) {
            alert("Error deleting profile. Try again.");
            console.error(err);
          }
        }}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Delete Profile
      </button>
          </div>

          {/* <SocialAccounts /> */}
        </div>
      </div>
    </div>
  );
}
