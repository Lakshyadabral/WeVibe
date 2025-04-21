'use client';

import { useState } from 'react';
import WelcomeUpload from './WelcomeUpload';
import AboutYou from './AboutYou';
import PreferencesForm from './PreferencesForm';

export default function OnboardingPage() {
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    profileImageUrl: '',
    name: '',
    bio: '',
    age: 0,
    sex: '',
    occupation: '',
    preferredLocation: '',
    communicationStyle: '',
    socialEnergyLevel: '',    
    ageRange: { min: 18, max: 35 },
    genderPreference: '',
    accommodationType: '',
    budget: { min: 500, max: 1500 },
    pets: { hasPets: false, type: '' },
    habits: {
      sleepPattern: '',
      drinking: false,
      smoking: false,
    },
    cooking: '',
  });

  const handleImageUpload = (url: string) => {
    setFormData((prev) => ({ ...prev, profileImageUrl: url }));
    setStep(2);
  };

  const handleAboutYouSubmit = (data: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setStep(3);
  };

  const handlePreferencesSubmit = (data: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setStep(4);
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-dark shadow rounded-xl flex-1">
      {step === 1 && <WelcomeUpload onImageUpload={handleImageUpload} />}

      {step === 2 && (
        <AboutYou
          initialData={{
            name: formData.name,
            bio: formData.bio,
            age: formData.age,
            sex: formData.sex,
            occupation: formData.occupation,
          }}
          onNext={handleAboutYouSubmit}
        />
      )}

      {step === 3 && (
        <PreferencesForm
          initialData={{
            preferredLocation: formData.preferredLocation,
            communicationStyle: formData.communicationStyle,
            socialEnergyLevel: formData.socialEnergyLevel,
            ageRange: formData.ageRange,
            genderPreference: formData.genderPreference,
            accommodationType: formData.accommodationType,
            budget: formData.budget,
            pets: formData.pets,
            habits: formData.habits,
            cooking: formData.cooking,
          }}
          onNext={handlePreferencesSubmit}
        />
      )}

{step === 4 && (
  <div className="text-center space-y-4">
    <h2 className="mb-1 text-2xl font-bold text-black dark:text-white text-center">🎉 All Set!</h2>
    <p className="mb-5 text-center text-gray-500 dark:text-gray-300">Here's a summary of your profile before we find your matches.</p>

    {/* Profile Summary Card */}
    <div className="text-left border-primary border-[1px] w-full max-w-xl rounded-lg bg-dark p-6 shadow-md dark:bg-boxdark space-y-5">
      <div className="flex items-center gap-5">
        <img
          src={formData.profileImageUrl || "/images/user/default.png"}
          alt="Profile"
          className="h-24 w-24 rounded-full object-cover border-2 border-primary"
        />
        <div>
          <h3 className="text-xl font-semibold text-white">{formData.name}</h3>
          <p className="text-gray-400">{formData.occupation}</p>
          <p className="text-sm text-gray-500 italic">{formData.bio}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
        <p><strong>Age:</strong> {formData.age}</p>
        <p><strong>Sex:</strong> {formData.sex}</p>
        <p><strong>Preferred Location:</strong> {formData.preferredLocation}</p>
        <p><strong>Communication Style:</strong> {formData.communicationStyle}</p>
        <p><strong>Social Energy Level:</strong> {formData.socialEnergyLevel}</p>
        <p><strong>Gender Preference:</strong> {formData.genderPreference}</p>
        <p><strong>Accommodation Type:</strong> {formData.accommodationType}</p>
        <p><strong>Cooking:</strong> {formData.cooking}</p>
        <p><strong>Budget:</strong> ${formData.budget.min} - ${formData.budget.max}</p>
        <p><strong>Age Range:</strong> {formData.ageRange.min} - {formData.ageRange.max}</p>
        <p><strong>Sleep Pattern:</strong> {formData.habits.sleepPattern}</p>
        <p><strong>Drinking:</strong> {formData.habits.drinking ? "Yes" : "No"}</p>
        <p><strong>Smoking:</strong> {formData.habits.smoking ? "Yes" : "No"}</p>
        <p><strong>Pets:</strong> {formData.pets.hasPets ? `Yes (${formData.pets.type || "N/A"})` : "No"}</p>
      </div>
    </div>

    <button
      onClick={async () => {
        try {
          const res = await fetch("/api/users/me", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...formData,
              profileComplete: true,
            }),
          });

          if (!res.ok) throw new Error("Failed to update user");

          window.location.href = "/home";
        } catch (err) {
          console.error("Error submitting form:", err);
        }
      }}
      className="w-full rounded bg-primary px-4 py-2 text-white transition hover:bg-opacity-90"
    >
      🔍 Find My Matches
    </button>
  </div>
)}

    </div>
  );
}
