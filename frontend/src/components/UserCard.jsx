import React from "react";

export default function UserCard({ email, rating, avatar, timer, who }) {
  return (
    <div className="flex justify-between bg-neutral-800 rounded-md py-3 px-4">
      <div className="flex items-center justify-start gap-6">
        <img src={who === "opp" ? "/opposition.avif" : "/you.avif"} alt="" className="w-16 h-16 rounded-md object-cover" />
        <div>
          <h3 className="text-xl font-medium">{email}</h3>
          <p>{rating}</p>
        </div>
        <p>{timer}</p>
      </div>
    </div>
  );
}
