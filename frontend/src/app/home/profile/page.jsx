"use client";
import { useState, useEffect } from "react";

export default function Page() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch profile data");
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black text-white">
        <div className="w-16 h-16 border-4 border-transparent border-t-white rounded-full animate-spin"></div>
        <span className="ml-4 text-xl">Loading your profile...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-black text-red-500">
        <p className="text-2xl">Error: {error}</p>
      </div>
    );
  }

  const { user } = data;

  return (
    <div className="flex flex-col items-center justify-center bg-black text-white p-8">
      <div className="w-2/3">
        <div className="flex flex-col md:flex-row items-center mb-8">
          <div className="bg-neutral-800 border border-white/10 rounded-xl p-6 w-auto sm:w-[40rem] shadow-lg">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-emerald-500 rounded-full flex justify-center items-center text-white text-2xl font-bold">
                U
              </div>
              <div className="ml-4">
                <h1 className="text-3xl font-bold">{user?.email}</h1>
                <p className="text-emerald-300 flex items-center">
                  <span className="w-4 h-4 mr-2 bg-yellow-500 rounded-full"></span>
                  Rating: {user?.rating}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-neutral-800 p-6 rounded-lg hover:scale-105 transform transition">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <span className="mr-3 w-6 h-6 bg-emerald-500 rounded-full"></span>
              Game Stats
            </h2>
            <div className="space-y-3">
              <p className="flex justify-between">
                <span className="font-semibold flex items-center">
                  <span className="mr-2 w-4 h-4 bg-yellow-500 rounded-full"></span>
                  Total Games
                </span>
                {user?.totalGames}
              </p>
              <p className="flex justify-between">
                <span className="font-semibold flex items-center">
                  <span className="mr-2 w-4 h-4 bg-green-500 rounded-full"></span>
                  Wins
                </span>
                {user?.wins === 0 ? 1 : user?.wins}
              </p>
              <p className="flex justify-between">
                <span className="font-semibold flex items-center">
                  <span className="mr-2 w-4 h-4 bg-red-500 rounded-full"></span>
                  Losses
                </span>
                {user?.losses}
              </p>
            </div>
          </div>

          <div className="bg-neutral-800 p-6 rounded-lg hover:scale-105 transform transition">
            <h2 className="text-2xl font-bold mb-4">Account Details</h2>
            <div className="space-y-3">
              <p className="flex justify-between">
                <span className="font-semibold">Joined</span>
                {new Date(user?.createdAt).toLocaleDateString()}
              </p>
              <p className="flex justify-between">
                <span className="font-semibold">Email</span>
                {user?.email}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-3xl font-bold text-center mb-8">Recent Games</h2>
          {user?.recentGames && user?.recentGames.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {user?.recentGames.map((game, index) => (
                <div
                  key={index}
                  className="rounded-xl p-4 bg-neutral-800 hover:bg-emerald-900/20 transition-colors duration-300"
                >
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">
                      You vs {game.opponent}
                    </h3>
                    <p className="text-neutral-400">Result: {game.result}</p>
                    <p className="text-neutral-500 text-sm">
                      Started: {new Date(game.startedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-neutral-500">
              No recent games available
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
