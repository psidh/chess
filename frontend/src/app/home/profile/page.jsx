"use client";
import { emailAtom } from "@/recoil-persist/emailAtom";
import { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { motion } from "framer-motion";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import { CardContainer, CardBody } from "@/components/ui/3d-card";
import {
  GoalIcon,
  Trophy,
  Clock,
  User,
  Star,
  ArrowUpRight,
} from "lucide-react";

export default function Page() {
  const [email, setEmail] = useRecoilState(emailAtom);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3002/api/profile", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
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
  }, [email]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black text-white">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            repeat: Infinity,
            duration: 1,
            ease: "linear",
          }}
          className="w-16 h-16 border-4 border-transparent border-t-white rounded-full"
        />
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
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-2/3"
      >
        <div className="flex flex-col md:flex-row items-center mb-8">
          <CardContainer className="inter-var mr-6">
            <CardBody className="bg-neutral-800 relative group/card hover:shadow-2xl hover:shadow-emerald-500/[0.1] border-white/[0.1] w-auto sm:w-[40rem] h-auto rounded-xl p-6 border">
              <div className="flex items-center">
                <User className="w-16 h-16 text-emerald-500 mr-4" />
                <div>
                  <h1 className="text-3xl font-bold text-white">
                    {user.email}
                  </h1>
                  <p className="text-emerald-300 flex items-center">
                    <Star className="w-4 h-4 mr-2" /> Rating: {user.rating}
                  </p>
                </div>
              </div>
            </CardBody>
          </CardContainer>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-neutral-800 p-6 rounded-lg"
          >
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <GoalIcon className="mr-3 text-emerald-500" /> Game Stats
            </h2>
            <div className="space-y-3">
              <p className="flex justify-between">
                <span className="font-semibold flex items-center">
                  <Trophy className="mr-2 text-yellow-500" /> Total Games
                </span>
                {user.totalGames}
              </p>
              <p className="flex justify-between">
                <span className="font-semibold flex items-center">
                  <ArrowUpRight className="mr-2 text-green-500" /> Wins
                </span>
                {user.wins === 0 ? 1 : user.wins}
              </p>
              <p className="flex justify-between">
                <span className="font-semibold flex items-center">
                  <Clock className="mr-2 text-red-500" /> Losses
                </span>
                {user.losses}
              </p>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-neutral-800 p-6 rounded-lg"
          >
            <h2 className="text-2xl font-bold mb-4">Account Details</h2>
            <div className="space-y-3">
              <p className="flex justify-between">
                <span className="font-semibold">Joined</span>
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
              <p className="flex justify-between">
                <span className="font-semibold">Email</span>
                {user.email}
              </p>
            </div>
          </motion.div>
        </div>

        <div className="mt-12">
          <h2 className="text-3xl font-bold text-center mb-8">Recent Games</h2>
          {user.recentGames && user.recentGames.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {user.recentGames.map((game, index) => (
                <BackgroundGradient
                  key={index}
                  className="rounded-xl p-4 bg-neutral-800 hover:bg-emerald-900/20 transition-colors duration-300"
                >
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-white">
                      You vs {game.opponent}
                    </h3>
                    <p className="text-neutral-400">Result: {game.result}</p>
                    <p className="text-neutral-500 text-sm">
                      Started: {new Date(game.startedAt).toLocaleString()}
                    </p>
                  </div>
                </BackgroundGradient>
              ))}
            </div>
          ) : (
            <p className="text-center text-neutral-500">
              No recent games available
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
