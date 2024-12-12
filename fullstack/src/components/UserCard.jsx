import React from "react";

export default function UserCard({ email, rating, timer, who }) {
  return (
    <div className="flex justify-between bg-neutral-800 rounded-md py-2 px-4">
      <div className="flex items-center justify-start gap-6">
        {who === "opp" ? <p>Opp</p> : <p>You</p>}
        <img
          src={who === "opp" ? "/opposition.avif" : "/you.avif"}
          alt=""
          className="w-10 h-10 md:w-16 md:h-16 rounded-md object-cover"
        />
        <div>
          <h3 className="text-md md:text-xl font-medium">{email}</h3>
          <p>{rating}</p>
        </div>
        <p>{timer}</p>
      </div>
    </div>
  );
}
