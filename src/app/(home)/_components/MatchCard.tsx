
"use client";

import Image from "next/image";
import { useState } from "react";
import ConfirmModal from "./ConfirmModal";
import PremiumLimitModal from "./PremiumLimitModal";
import PricingModal from "./PricingModal"; 
import MatchDetailsModal from "./MatchDetailsModal";

type MatchCardProps = {
  match: any;
  onSubmit: (id: string, message: string) => Promise<void>;
  userId: string;
};

export default function MatchCard({ match, onSubmit, userId }: MatchCardProps) {
  const [showInput, setShowInput] = useState(false);
  const [message, setMessage] = useState("");
  const [requestSent, setRequestSent] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false); 
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const handleSend = async () => {
    try {
      const response = await fetch("/api/match/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          matchId: match.id,
          message,
        }),
      });

      if (response.status === 403) {
        setShowPremiumModal(true);
        return;
      }

      if (!response.ok) {
        console.error("❌ Failed to send match request");
        return;
      }

      setRequestSent(true);
      setShowInput(false);

      setTimeout(() => {
        setIsRemoving(true);
        setTimeout(() => {
          setIsVisible(false);
        }, 500);
      }, 1000);
    } catch (err) {
      console.error("Failed to send match request:", err);
    }
  };

  const handleRemove = async () => {
    try {
      const response = await fetch("/api/match/remove", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, matchId: match.id }),
      });

      if (response.ok) {
        setShowConfirm(false);
        setIsRemoving(true);

        setTimeout(() => {
          setIsVisible(false);
        }, 500);
      } else {
        console.error("Failed to remove match");
      }
    } catch (error) {
      console.error("Error removing match:", error);
    }
  };

  if (!isVisible) return null;

  return (
    <div
      className={`w-full bg-white dark:bg-dark-2 dark:shadow-card text-white rounded-2xl shadow-lg flex gap-4 mb-5 hover:shadow-lg transition-opacity duration-500 relative ${
        isRemoving ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleRemove}
      />

       {/* Match Details Modal */}
       <MatchDetailsModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        match={match}
      />

      {/* ✅ Premium popup */}
      <PremiumLimitModal
        open={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
        onUpgradeClick={() => {
          setShowPremiumModal(false);
          setShowPricingModal(true); // ✅ Open pricing modal
        }}
      />

      {/* ✅ Pricing modal */}
      <PricingModal
        open={showPricingModal}
        onClose={() => setShowPricingModal(false)}
      />

      {/* Match Details */}
      <div className="flex">
        {/* Profile Image */}
        <div className="flex-shrink-0">
          <Image
            src={match.image || match.imageUrl || "/images/user/default.png"}
            alt={match.name}
            width={170}
            height={150}
            className="rounded-s-xl object-cover bg-gray-2 h-full border-r-4 border-primary"
          />
        </div>

        {/* Roommate Details */}
        <div className="flex-1 p-6">
          <h2 onClick={() => setShowDetailsModal(true)} className="cursor-pointer text-[22px] font-semibold pb-1 text-black dark:text-white hover:text-primary dark:hover:text-primary">
            {match.name}
          </h2>
          <p className="text-gray-400 text-sm flex flex-wrap gap-2">
            {match.preferences?.country && <span>From {match.preferences.country} •</span>}
            {match.preferences?.age && <span>{match.preferences.age} years •</span>}
            {match.preferences?.genderPreference && <span>{match.preferences.genderPreference} •</span>}
            {match.preferences?.occupation && <span>{match.preferences.occupation} •</span>}
            {match.preferences?.maxBudget && <span>Max Budget: ${match.preferences.maxBudget}</span>}
          </p>

          {/* Bio */}
          {match.bio && (
            <p className="mt-2 text-gray-300 text-base leading-relaxed">
              {match.bio} <span
              className="text-blue-400 cursor-pointer hover:text-blue-500"
              onClick={() => setShowDetailsModal(true)}
            >
              more
            </span>

            </p>
          )}

          {/* Location */}
          {match.preferences?.preferredLocation && (
            <p className="mt-2 text-gray-400 text-sm pb-3">
              <span className="font-semibold">Roommate Looking:</span>{" "}
              {match.preferences.preferredLocation}
            </p>
          )}
          {/* Match Request / Remove Buttons */}
          {requestSent ? (
            <button disabled className="bg-gray-400 text-white px-4 py-2 rounded cursor-not-allowed">
              Request Sent
            </button>
          ) : showInput ? (
            <div className="space-y-2">
              <textarea
                rows={2}
                placeholder="Write a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full border p-2 rounded"
              />
              <div className="flex gap-3">
                <button onClick={handleSend} className="bg-primary text-white px-4 py-2 rounded hover:bg-primary">
                  Send Match Request
                </button>
                <button onClick={() => setShowInput(false)} className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400">
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex gap-3">
              <button onClick={() => setShowInput(true)} className="bg-primary hover:bg-primaryhover text-white px-4 py-2 rounded hover:bg-grey">
                Send Match Request
              </button>
              <button
                onClick={() => setShowConfirm(true)}
                className="bg-[#D25C5C] text-white px-4 py-2 rounded hover:bg-[#b04d4d]"
              >
                Remove
              </button>
            </div>
          )}
        </div>
        </div>
      </div>

  );
}
