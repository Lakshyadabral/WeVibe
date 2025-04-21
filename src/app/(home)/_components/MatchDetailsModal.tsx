// components/MatchDetailsModal.tsx
"use client";

import { useEffect } from "react";
import Image from "next/image";
import { Dialog } from "@headlessui/react";
import { CloseIcon } from "@/assets/icons";


type MatchDetailsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  match: any;
};

export default function MatchDetailsModal({ isOpen, onClose, match }: MatchDetailsModalProps) {
  if (!match) return null;

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="fixed inset-0 flex justify-center items-center p-4">
        <Dialog.Panel className="bg-white dark:bg-dark-2 rounded-lg shadow-lg max-w-3xl w-full p-6">
          <div className="text-right">
            <button onClick={onClose} className="text-gray-500 dark:text-gray-400">
              <CloseIcon className="w-6 h-6" />
            </button>
          </div>

          <div className="text-center my-6">
            <Image
              src={match.image || "/images/user/default.png"}
              alt={match.name}
              width={140}
              height={140}
              className="object-cover z-30 mx-auto -mt-28 h-30 w-full max-w-30 rounded-full bg-white/20 p-1 backdrop-blur sm:h-44 sm:max-w-[176px] sm:p-3"
            />
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mt-5">{match.name}</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Looking for {match.preferences?.genderPreference || "Not specified"} Roommate · {match.preferences?.age || "N/A"} years old ·{" "}
              {match.preferences?.occupation || "Occupation unknown"}
            </p>
          </div>

          <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
            <div>
              <strong>Looking in:</strong>{" "}
              <span className="text-base font-medium text-gray-800 dark:text-white">
                {match.preferences?.preferredLocation || "N/A"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <div>
                <strong>Budget</strong>
                <p>${match.preferences?.maxBudget || "N/A"} per month</p>
              </div>
              <div>
                <strong>Accommodation Type</strong>
                <p>{match.preferences?.accommodationType || "N/A"}</p>
              </div>
              <div>
                <strong>Pets</strong>
                <p>{match.preferences?.petType || "N/A"}</p>
              </div>
              <div>
                <strong>Sleep Pattern</strong>
                <p>{match.preferences?.sleepPattern || "N/A"}</p>
              </div>
              <div>
                <strong>Cooking</strong>
                <p>{match.preferences?.cooking || "N/A"}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <div>
              <strong>Communication Style</strong>
              <p>{match.preferences?.communicationStyle || "N/A"}</p>
          </div>
           <div>
             <strong>Social Energy Level</strong>
             <p>{match.preferences?.socialEnergyLevel || "N/A"}</p>
          </div>
              {match.preferences?.drinking && (
                <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">🌲 Cannabis friendly</span>
              )}
              {match.preferences?.smoking === false && (
                <span className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded">🚭 Non-smoker</span>
              )}
              {match.preferences?.teamingUp && (
                <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">🙌 Interested in teaming-up</span>
              )}
            </div>

            <div className="pt-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">📝 Bio</h3>
              <p className="text-gray-600 dark:text-gray-300">
                {match.bio || "No description provided yet."}
              </p>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
