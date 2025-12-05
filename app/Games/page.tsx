"use client";

import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Filter, ShoppingBag } from "lucide-react";
import {
  FaKey,
  FaUser,
  FaXbox,
  FaPlaystation,
  FaMicrosoft,
} from "react-icons/fa";
import { SiEpicgames, SiOnstar, SiSteam, SiEa } from "react-icons/si";
import { Skeleton } from "@/components/ui/skeleton";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";

interface Games {
  id: number;
  created_at: Date;
  Name: string;
  Price: number;
  Platform: string[];
  Type: string[];
  Genres: string[];
  discount: number;
  discountedPrice: number;
  Image_Url: string[];
}

export default function Home() {
  const [games, setGames] = useState<Games[] | null>(null);
  const [minprice, setMinPrice] = useState("");
  const [maxprice, setMaxPrice] = useState("");
  const [hovered, setHovered] = useState<number | null>(null);
  const [showP, setShowP] = useState<{ id: number; platform: string } | null>(
    null
  );
  const [showT, setShowT] = useState<{ id: number; type: string } | null>(null);
  const [yes, setYes] = useState(false);
  const [no, setNo] = useState(false);
  const [genres, setGenres] = useState("");
  const searchParams = useSearchParams();
  const discount = searchParams.get("discount") === "true";
  const genresParam = searchParams.get("Genres");
  const genresArray = genresParam ? genresParam.split(",") : [];
  const PlatformParam = searchParams.get("Platform");
  const PlatformArray = PlatformParam ? PlatformParam.split(",") : [];

  const filteredGames = games
    ?.filter((g) => {
      const realPrice = g.discountedPrice
        ? Number(String(g.discountedPrice).replace(/[^0-9]/g, ""))
        : Number(String(g.Price).replace(/[^0-9]/g, ""));

      const min = Number(minprice);
      const max = Number(maxprice);
      if (minprice !== "" && realPrice < min) return false;
      if (maxprice !== "" && realPrice > max) return false;
      if (yes && !g.discount) return false;
      if (no && g.discount) return false;
      if (discount && !g.discount) return false;
      if (
        genres.length > 0 &&
        !g.Genres.some((genre) => genres.includes(genre))
      ) {
        return false;
      }
      if (
        genresArray.length > 0 &&
        !g.Genres.some((genre) => genresArray.includes(genre))
      ) {
        return false;
      }
      if (
        PlatformArray.length > 0 &&
        !g.Platform.some((plat) => PlatformArray.includes(plat))
      ) {
        return false;
      }

      return true;
    })
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

  useEffect(() => {
    const getGames = async () => {
      const { data } = await supabase.from("Games").select("*");

      setGames(data);
    };

    getGames();
  });

  function ImgurConv(url: string) {
    if (!url || !url.trim()) return "";
    if (url.includes("i.imgur.com")) return url;

    const parts = url.split("/");
    let id = parts.pop() || "";
    id = id.split("?")[0];
    if (id.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
      return `https://i.imgur.com/${id}`;
    }
    return `https://i.imgur.com/${id}.png`;
  }

  return (
    <div>
      <div className="md:hidden">
        <div></div>
      </div>
      <div className="md:flex gap-5 hidden">
        <div>
          <div className="flex md:flex-col flex-row gap-5 m-10">
            <div>
              <div className="flex items-center gap-2 text-xl ">
                Filter <Filter size={20} />
              </div>
            </div>
            <div className="border border-neutral-700 p-5 w-70 h-max rounded-xl">
              <div>
                <div className="flex flex-col gap-2">
                  <div className="text-xl">Price</div>
                  <div className="flex items-center gap-5 w-full">
                    <div className="flex flex-col gap-2">
                      <div>Min: </div>
                      <input
                        className="outline-0 w-full border border-neutral-500 text-sm rounded-xl h-10 text-center"
                        placeholder="Min"
                        value={minprice}
                        onChange={(e) => setMinPrice(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <div>Max: </div>
                      <input
                        className="outline-0 w-full border border-neutral-500 text-sm rounded-xl h-10 text-center"
                        placeholder="Max"
                        value={maxprice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-5">
                <div className="flex flex-col gap-2">
                  <div className="text-xl">Discount</div>
                  <div className="flex items-center gap-5 w-full">
                    <div className="flex flex-col gap-2">
                      <div>Yes</div>
                      <input
                        className="outline-0 w-full border border-neutral-500 text-sm rounded-xl text-center"
                        type="checkbox"
                        checked={yes}
                        onChange={(e) => {
                          setYes(e.target.checked);
                          setNo(false);
                        }}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <div>No</div>
                      <input
                        className="outline-0 w-full border border-neutral-500 text-sm rounded-xl text-center"
                        type="checkbox"
                        checked={no}
                        onChange={(e) => {
                          setNo(e.target.checked);
                          setYes(false);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-5">
                <div className="flex flex-col gap-2">
                  <div className="text-xl">Genres</div>
                  <select
                    value={genres}
                    onChange={(e) => {
                      const selected = e.target.value;

                      if (selected.includes("all")) {
                        setGenres("");
                      } else {
                        setGenres(selected);
                      }
                    }}
                    className="outline-0 border border-neutral-800 bg-neutral-800 rounded-lg p-2 w-50 h-max text-sm text-center"
                  >
                    <option value="all" defaultChecked>
                      All
                    </option>
                    <option
                      value="Action"
                      className="ml-2 mr-2 rounded-lg py-2 mb-2"
                    >
                      Action
                    </option>
                    <option
                      value="Adventure"
                      className="ml-2 mr-2 rounded-lg py-2 mb-2"
                    >
                      Adventure
                    </option>
                    <option
                      value="RPG"
                      className="ml-2 mr-2 rounded-lg py-2 mb-2"
                    >
                      RPG
                    </option>
                    <option
                      value="Shooter"
                      className="ml-2 mr-2 rounded-lg py-2 mb-2"
                    >
                      Shooter
                    </option>
                    <option
                      value="Survival"
                      className="ml-2 mr-2 rounded-lg py-2 mb-2"
                    >
                      Survival
                    </option>
                    <option
                      value="Horror"
                      className="ml-2 mr-2 rounded-lg py-2 mb-2"
                    >
                      Horror
                    </option>
                    <option
                      value="Sports"
                      className="ml-2 mr-2 rounded-lg py-2 mb-2"
                    >
                      Sports
                    </option>
                    <option
                      value="Racing"
                      className="ml-2 mr-2 rounded-lg py-2 mb-2"
                    >
                      Racing
                    </option>
                    <option
                      value="Fighting"
                      className="ml-2 mr-2 rounded-lg py-2 mb-2"
                    >
                      Fighting
                    </option>
                    <option
                      value="Strategy"
                      className="ml-2 mr-2 rounded-lg py-2 mb-2"
                    >
                      Strategy
                    </option>
                    <option
                      value="Simulation"
                      className="ml-2 mr-2 rounded-lg py-2 mb-2"
                    >
                      Simulation
                    </option>
                    <option
                      value="Open World"
                      className="ml-2 mr-2 rounded-lg py-2 mb-2"
                    >
                      Open World
                    </option>
                    <option
                      value="Puzzle"
                      className="ml-2 mr-2 rounded-lg py-2 mb-2"
                    >
                      Puzzle
                    </option>
                    <option
                      value="Platformer"
                      className="ml-2 mr-2 rounded-lg py-2 mb-2"
                    >
                      Platformer
                    </option>
                    <option
                      value="Multiplayer / Co-op"
                      className="ml-2 mr-2 rounded-lg py-2 mb-2"
                    >
                      Multiplayer / Co-op
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div>
            {games === null ? (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-25">
                  {[...Array(5)].map((_: any, i: any) => (
                    <div key={i}>
                      <Skeleton className="w-[200px] h-[380px]" />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-25">
                {filteredGames?.map((game) => (
                  <div key={game.id}>
                    <div>
                      <div className="border-3 border-neutral-700 p-5 rounded-2xl">
                        <div className="relative">
                          {hovered === game.id ? (
                            <div>
                              <AnimatePresence>
                                {game.Image_Url && (
                                  <div onMouseLeave={() => setHovered(null)}>
                                    <Image
                                      src={ImgurConv(game.Image_Url[0])}
                                      alt=""
                                      width={200}
                                      height={200}
                                      className="rounded-2xl blur transition-all duration-500"
                                    />

                                    {game.discount && (
                                      <div className="absolute -top-2 -right-2 text-xs border border-purple-500 bg-purple-500 rounded-full w-8 h-8 flex items-center justify-center">
                                        {game.discount}%
                                      </div>
                                    )}
                                    <Link href={`/Game/${game.Name}`}>
                                      <motion.div
                                        initial={{ y: -10, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: -10, opacity: 0 }}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 1 }}
                                        transition={{ duration: 1 }}
                                        className="absolute left-15 top-7 border border-neutral-600 p-2 rounded-xl bg-neutral-600"
                                      >
                                        View
                                      </motion.div>
                                    </Link>
                                  </div>
                                )}
                              </AnimatePresence>
                            </div>
                          ) : (
                            <div>
                              {game.Image_Url && (
                                <div
                                  onMouseEnter={() => setHovered(game.id)}
                                  onMouseLeave={() => setHovered(null)}
                                >
                                  <Image
                                    src={ImgurConv(game.Image_Url[0])}
                                    alt=""
                                    width={200}
                                    height={200}
                                    className="rounded-2xl transition-all duration-500"
                                  />
                                  {game.discount && (
                                    <div className="absolute -top-2 -right-2 text-xs border border-purple-500 bg-purple-500 rounded-full w-8 h-8 flex items-center justify-center">
                                      {game.discount}%
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col justify-center ml-5 mt-5 gap-5">
                          <div>{game.Name}</div>
                          <div>
                            {game.discount ? (
                              <div className="flex items-end gap-2">
                                <div className="text-xs text-neutral-400 line-through">
                                  {game.Price}
                                </div>
                                <div className="text-emerald-400">
                                  {game.discountedPrice}rsd
                                </div>
                              </div>
                            ) : (
                              <div className="text-emerald-400">
                                {game.Price}rsd
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col gap-1">
                            Platform:
                            <div className="flex gap-4">
                              {game.Platform.map((plat, i) => {
                                switch (plat) {
                                  case "steam":
                                    return (
                                      <div key={i} className="relative">
                                        <SiSteam
                                          onMouseEnter={() =>
                                            setShowP({
                                              id: game.id,
                                              platform: "steam",
                                            })
                                          }
                                          onMouseLeave={() => setShowP(null)}
                                        />
                                        <AnimatePresence>
                                          {showP?.id === game.id &&
                                            showP?.platform === "steam" && (
                                              <motion.div
                                                initial={{ y: 2, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                exit={{ y: 2, opacity: 0 }}
                                                transition={{ duration: 0.8 }}
                                                className="absolute text-xs -left-4 -top-8 rounded-full z-50 border border-neutral-700 p-1 bg-neutral-700"
                                              >
                                                Steam
                                              </motion.div>
                                            )}
                                        </AnimatePresence>
                                      </div>
                                    );
                                  case "epic":
                                    return (
                                      <div key={i} className="relative">
                                        <SiEpicgames
                                          onMouseEnter={() =>
                                            setShowP({
                                              id: game.id,
                                              platform: "epic",
                                            })
                                          }
                                          onMouseLeave={() => setShowP(null)}
                                        />
                                        <AnimatePresence>
                                          {showP?.id === game.id &&
                                            showP?.platform === "epic" && (
                                              <motion.div
                                                initial={{ y: 2, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                exit={{ y: 2, opacity: 0 }}
                                                transition={{ duration: 0.8 }}
                                                className="absolute text-xs -left-8 -top-8 rounded-full z-50 border border-neutral-700 p-1 w-21 bg-neutral-700 text-center"
                                              >
                                                Epic Games
                                              </motion.div>
                                            )}
                                        </AnimatePresence>
                                      </div>
                                    );
                                  case "rockstar":
                                    return (
                                      <div key={i} className="relative">
                                        <SiOnstar
                                          onMouseEnter={() =>
                                            setShowP({
                                              id: game.id,
                                              platform: "rockstar",
                                            })
                                          }
                                          onMouseLeave={() => setShowP(null)}
                                        />
                                        <AnimatePresence>
                                          {showP?.id === game.id &&
                                            showP?.platform === "rockstar" && (
                                              <motion.div
                                                initial={{ y: 2, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                exit={{ y: 2, opacity: 0 }}
                                                transition={{ duration: 0.8 }}
                                                className="absolute text-xs -left-6 -top-8 rounded-full z-50 border border-neutral-700 p-1 bg-neutral-700 text-center"
                                              >
                                                Rockstar
                                              </motion.div>
                                            )}
                                        </AnimatePresence>
                                      </div>
                                    );
                                  case "microsoft":
                                    return (
                                      <div key={i} className="relative">
                                        <FaMicrosoft
                                          onMouseEnter={() =>
                                            setShowP({
                                              id: game.id,
                                              platform: "microsoft",
                                            })
                                          }
                                          onMouseLeave={() => setShowP(null)}
                                        />
                                        <AnimatePresence>
                                          {showP?.id === game.id &&
                                            showP?.platform === "microsoft" && (
                                              <motion.div
                                                initial={{ y: 2, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                exit={{ y: 2, opacity: 0 }}
                                                transition={{ duration: 0.8 }}
                                                className="absolute text-xs -left-6 -top-8 rounded-full z-50 border border-neutral-700 p-1 bg-neutral-700 text-center"
                                              >
                                                Microsoft
                                              </motion.div>
                                            )}
                                        </AnimatePresence>
                                      </div>
                                    );
                                  case "eaplay":
                                    return (
                                      <div key={i} className="relative">
                                        <SiEa
                                          onMouseEnter={() =>
                                            setShowP({
                                              id: game.id,
                                              platform: "microsoft",
                                            })
                                          }
                                          onMouseLeave={() => setShowP(null)}
                                        />
                                        <AnimatePresence>
                                          {showP?.id === game.id &&
                                            showP?.platform === "microsoft" && (
                                              <motion.div
                                                initial={{ y: 2, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                exit={{ y: 2, opacity: 0 }}
                                                transition={{ duration: 0.8 }}
                                                className="absolute text-xs -left-6 -top-8 rounded-full z-50 border border-neutral-700 p-1 w-15 bg-neutral-700 text-center"
                                              >
                                                EA Play
                                              </motion.div>
                                            )}
                                        </AnimatePresence>
                                      </div>
                                    );
                                  case "playstation":
                                    return (
                                      <div key={i} className="relative">
                                        <FaPlaystation
                                          onMouseEnter={() =>
                                            setShowP({
                                              id: game.id,
                                              platform: "playstation",
                                            })
                                          }
                                          onMouseLeave={() => setShowP(null)}
                                        />
                                        <AnimatePresence>
                                          {showP?.id === game.id &&
                                            showP?.platform ===
                                              "playstation" && (
                                              <motion.div
                                                initial={{ y: 2, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                exit={{ y: 2, opacity: 0 }}
                                                transition={{ duration: 0.8 }}
                                                className="absolute text-xs -left-6 -top-8 rounded-full z-50 border border-neutral-700 p-1 bg-neutral-700 text-center"
                                              >
                                                Playstation
                                              </motion.div>
                                            )}
                                        </AnimatePresence>
                                      </div>
                                    );
                                  case "xbox":
                                    return (
                                      <div key={i} className="relative">
                                        <FaXbox
                                          onMouseEnter={() =>
                                            setShowP({
                                              id: game.id,
                                              platform: "xbox",
                                            })
                                          }
                                          onMouseLeave={() => setShowP(null)}
                                        />
                                        <AnimatePresence>
                                          {showP?.id === game.id &&
                                            showP?.platform === "xbox" && (
                                              <motion.div
                                                initial={{ y: 2, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                exit={{ y: 2, opacity: 0 }}
                                                transition={{ duration: 0.8 }}
                                                className="absolute text-xs -left-3 -top-8 rounded-full z-50 border border-neutral-700 p-1 bg-neutral-700 text-center"
                                              >
                                                Xbox
                                              </motion.div>
                                            )}
                                        </AnimatePresence>
                                      </div>
                                    );
                                }
                              }).slice(0, 3)}
                              ...
                            </div>
                          </div>
                          <div className="flex flex-col gap-1">
                            Type:
                            <div className="flex items-center gap-4">
                              {game.Type?.map((type, i) => {
                                switch (type) {
                                  case "key":
                                    return (
                                      <div key={i} className="relative">
                                        <FaKey
                                          onMouseEnter={() =>
                                            setShowT({
                                              id: game.id,
                                              type: "key",
                                            })
                                          }
                                          onMouseLeave={() => setShowT(null)}
                                        />
                                        <AnimatePresence>
                                          {showT?.id === game.id &&
                                            showT?.type === "key" && (
                                              <motion.div
                                                initial={{ y: 2, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                exit={{ y: 2, opacity: 0 }}
                                                transition={{ duration: 0.8 }}
                                                className="absolute text-xs -left-1 -top-8 rounded-full z-50 border border-neutral-700 p-1 bg-neutral-700"
                                              >
                                                Key
                                              </motion.div>
                                            )}
                                        </AnimatePresence>
                                      </div>
                                    );

                                  case "account":
                                    return (
                                      <div key={i} className="relative">
                                        <FaUser
                                          onMouseEnter={() =>
                                            setShowT({
                                              id: game.id,
                                              type: "account",
                                            })
                                          }
                                          onMouseLeave={() => setShowT(null)}
                                        />
                                        <AnimatePresence>
                                          {showT?.id === game.id &&
                                            showT?.type === "account" && (
                                              <motion.div
                                                initial={{ y: 2, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                exit={{ y: 2, opacity: 0 }}
                                                transition={{ duration: 0.8 }}
                                                className="absolute text-xs -left-5 -top-8 rounded-full z-50 border border-neutral-700 p-1 bg-neutral-700"
                                              >
                                                Account
                                              </motion.div>
                                            )}
                                        </AnimatePresence>
                                      </div>
                                    );

                                  default:
                                    return <span key={i}>{type}</span>;
                                }
                              })}
                            </div>
                          </div>
                          <div className="flex items-center justify-end ">
                            <div className="border border-neutral-600 w-20 h-10 rounded-xl bg-neutral-600 hover:scale-110 active:scale-100 transition-all flex items-center justify-center">
                              <ShoppingBag size={20} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
