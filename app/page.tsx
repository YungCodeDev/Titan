"use client";

import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Menu,
  ShoppingBag,
  X,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import { AnimatePresence, motion } from "framer-motion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { User } from "@supabase/supabase-js";

interface Games {
  id: number;
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
  const [show, setShow] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [games, setGames] = useState<Games[] | null>(null);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    const getGames = async () => {
      const { data } = await supabase.from("Games").select("*");

      setGames(data);
    };

    getGames();
  });
  useEffect(() => {
    const Getuser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);
    };

    Getuser();
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

  async function RemoveDisc(game: any) {
    const { data, error } = await supabase
      .from("Games")
      .update({
        discount: null,
        discountedPrice: null,
      })
      .eq("id", game.id);

    if (error) console.log(error);
    if (data) console.log(data);
  }

  return (
    <div>
      <div className="md:hidden">
        <div>
          <div className="m-5">
            {menu ? (
              <div className="m-5 fixed top-2 left-2 z-100">
                <X size={25} className="z-50" onClick={() => setMenu(!menu)} />
              </div>
            ) : (
              <div>
                <Menu size={25} onClick={() => setMenu(!menu)} />
              </div>
            )}
          </div>
          <div>
            {menu && (
              <div className="flex flex-col gap-4 fixed z-50 top-0 left-0 w-full h-full bg-neutral-900 p-4 overflow-auto">
                <motion.div
                  className="mt-15 relative flex items-center justify-center h-14 bg-neutral-800 rounded-xl shadow-md cursor-pointer overflow-hidden"
                  whileTap={{ scale: 0.97 }}
                >
                  <motion.div
                    className="absolute left-0 top-0 h-full bg-red-500"
                    initial={{ width: "100%" }}
                    whileTap={{ width: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  />
                  <div className="relative z-10 text-lg font-semibold text-white">
                    All Games
                  </div>
                </motion.div>
                <div className="relative">
                  <div
                    className="flex items-center justify-between h-14 bg-neutral-800 rounded-xl shadow-md px-4 cursor-pointer"
                    onClick={() => setShow(!show)}
                  >
                    <div className="text-lg font-semibold text-white">
                      Games
                    </div>
                    {show ? (
                      <ChevronUp size={22} className="text-white" />
                    ) : (
                      <ChevronDown size={22} className="text-white" />
                    )}
                  </div>

                  {show && (
                    <div className="mt-2 bg-neutral-800 rounded-xl shadow-lg p-4 max-h-72 overflow-y-scroll">
                      <div className="text-sm text-neutral-400 border-b border-neutral-700 pb-2 mb-3">
                        Quick Filters
                      </div>
                      <div className="mb-4">
                        <div className="font-semibold text-neutral-200 mb-2">
                          Platform
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {[
                            "Steam",
                            "Epic",
                            "Rockstar",
                            "Microsoft",
                            "EA Play",
                            "Playstation",
                            "Xbox",
                          ].map((p) => (
                            <div
                              key={p}
                              className="px-3 py-1 rounded-lg bg-neutral-700 hover:bg-red-500 hover:text-white text-sm text-neutral-200 transition-all duration-200 cursor-pointer"
                            >
                              {p}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div className="font-semibold text-neutral-200 mb-2">
                          Genres
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {[
                            "Action",
                            "Adventure",
                            "RPG",
                            "Shooter",
                            "Survival",
                            "Horror",
                            "Sports",
                            "Fighting",
                            "Strategy",
                            "Simulation",
                            "Open World",
                            "Racing",
                            "Platformer",
                            "Multiplayer",
                          ].map((g) => (
                            <div
                              key={g}
                              className="px-3 py-1 rounded-lg bg-neutral-700 hover:bg-red-500 hover:text-white text-sm text-neutral-200 transition-all duration-200 cursor-pointer"
                            >
                              {g}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                {["Discount", "Free Gift", "Steam Games", "Game Pass"].map(
                  (item) => (
                    <motion.div
                      key={item}
                      className="relative flex items-center justify-center h-14 bg-neutral-800 rounded-xl shadow-md cursor-pointer overflow-hidden"
                      whileTap={{ scale: 0.97 }}
                    >
                      <motion.div
                        className="absolute left-0 top-0 h-full bg-red-500"
                        initial={{ width: "100%" }}
                        whileTap={{ width: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      />
                      <div className="relative z-10 text-lg font-semibold text-white">
                        {item}
                      </div>
                    </motion.div>
                  )
                )}
              </div>
            )}
          </div>
        </div>
        <div>
          <div>
            <div className="flex flex-col m-10 gap-3">
              <div className="text-2xl flex items-center gap-2">
                Best Discount Off <ChevronRight size={20} />
              </div>
              <div>Best Price for you!</div>
            </div>
            {games === null ? (
              <div className="flex flex-col gap-4 items-center">
                <Skeleton className="w-[95%] h-64 rounded-xl bg-neutral-700" />
              </div>
            ) : (
              <Carousel
                opts={{
                  align: "start",
                  loop: false,
                  skipSnaps: false,
                }}
                className="w-full overflow-x-auto"
              >
                <CarouselContent className="flex gap-4 ml-5 mr-5">
                  {games
                    ?.filter((g) => g.discount)
                    .sort((a, b) => b.discount - a.discount)
                    ?.map((game, index) => (
                      <CarouselItem
                        key={index}
                        className="shrink-0 bg-neutral-800 rounded-2xl p-3 shadow-md"
                      >
                        <div className="flex flex-col">
                          {game.Image_Url && (
                            <div className="flex items-center justify-center">
                              <Image
                                src={ImgurConv(game.Image_Url[0])}
                                alt={game.Name}
                                width={300}
                                height={300}
                                className="rounded-2xl object-cover"
                              />
                            </div>
                          )}
                          <div className="text-md mt-2 font-semibold text-white">
                            {game.Name}
                          </div>
                          <div className="flex justify-between items-center mt-1">
                            <div className="text-red-400 font-bold text-sm">
                              -{game.discount}%
                            </div>
                            <div className="flex items-end gap-2 text-sm text-green-400 font-semibold">
                              <span className="line-through text-xs text-neutral-400">
                                {game.Price}rsd
                              </span>
                              {game.discountedPrice}rsd
                            </div>
                          </div>

                          <div className="mt-3">
                            <button className="w-full flex items-center justify-center gap-2 p-2 rounded-xl bg-neutral-600 text-white font-medium">
                              Add Cart <ShoppingBag size={18} />
                            </button>
                          </div>
                          {user?.email === "akidimke136@gmail.com" &&
                            "dimicmateja685@gmail.com" && (
                              <div
                                className="flex items-center justify-end mt-2 gap-2 cursor-pointer text-sm text-neutral-300 hover:text-red-500"
                                onClick={() => RemoveDisc(game)}
                              >
                                <div>Ukloni</div>
                                <X size={18} />
                              </div>
                            )}
                        </div>
                      </CarouselItem>
                    ))}
                </CarouselContent>
              </Carousel>
            )}
          </div>
        </div>
      </div>
      <div className="md:flex hidden flex-col">
        <div className="border-b-3 border-b-neutral-600 w-full h-15 flex items-center">
          <motion.div
            className="relative overflow-hidden border-r-3 border-r-neutral-600 h-15 flex-1 flex items-center justify-center"
            whileHover="rest"
            initial="hover"
            animate="hover"
          >
            <motion.div
              variants={{
                rest: { width: "100%" },
                hover: { width: 0 },
              }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="absolute left-0 top-0 h-full border-b-3 border-red-500"
            />
            <div className="relative z-10 text-lg flex items-center gap-4">
              All Games
            </div>
          </motion.div>
          <div
            className="relative flex-1 flex items-center"
            onMouseEnter={() => setShow(true)}
            onMouseLeave={() => setShow(false)}
          >
            <div className="w-full h-15 border-r-3 border-r-neutral-600 flex items-center justify-center cursor-pointer">
              <div className="text-lg flex items-center gap-4">
                Games
                <span className={`${show ? "text-neutral-500" : ""}`}>
                  {show ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </span>
              </div>
            </div>
            {show && (
              <div className="absolute left-0 top-15 z-50 border border-neutral-600 bg-neutral-800 rounded-lg p-4 shadow-xl w-120">
                <div className="text-sm text-neutral-400 border-b border-neutral-700 pb-2 mb-3">
                  Quick Filters
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm text-neutral-300">
                  <div className="flex flex-col gap-2">
                    <div className="font-semibold text-neutral-200">
                      Platform
                    </div>
                    {[
                      "Steam",
                      "Epic",
                      "Rockstar",
                      "Microsoft",
                      "EA Play",
                      "Playstation",
                      "Xbox",
                    ].map((p) => (
                      <div key={p} className="hover:text-white cursor-pointer">
                        {p}
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="font-semibold text-neutral-200">Genres</div>
                    <div className="grid grid-cols-2 gap-x-10 gap-y-2">
                      {[
                        [
                          "Action",
                          "Adventure",
                          "RPG",
                          "Shooter",
                          "Survival",
                          "Horror",
                          "Sports",
                        ],
                        [
                          "Fighting",
                          "Strategy",
                          "Simulation",
                          "Open World",
                          "Racing",
                          "Platformer",
                          "Multiplayer",
                        ],
                      ].map((col, ci) => (
                        <div key={ci} className="flex flex-col gap-2">
                          {col.map((g) => (
                            <div
                              key={g}
                              className="hover:text-white cursor-pointer"
                            >
                              {g}
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <motion.div
            className="relative overflow-hidden border-r-3 border-r-neutral-600 h-15 flex-1 flex items-center justify-center"
            whileHover="rest"
            initial="hover"
            animate="hover"
          >
            <motion.div
              variants={{
                rest: { width: "100%" },
                hover: { width: 0 },
              }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="absolute left-0 top-0 h-full border-b-3 border-red-500"
            />
            <div className="relative z-10 text-lg flex items-center gap-4">
              Discount
            </div>
          </motion.div>
          <motion.div
            className="relative overflow-hidden border-r-3 border-r-neutral-600 h-15 flex-1 flex items-center justify-center"
            whileHover="rest"
            initial="hover"
            animate="hover"
          >
            <motion.div
              variants={{
                rest: { width: "100%" },
                hover: { width: 0 },
              }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="absolute left-0 top-0 h-full border-b-3 border-red-500"
            />
            <div className="relative z-10 text-lg flex items-center gap-4">
              Free Gift
            </div>
          </motion.div>
          <motion.div
            className="relative overflow-hidden border-r-3 border-r-neutral-600 h-15 flex-1 flex items-center justify-center"
            whileHover="rest"
            initial="hover"
            animate="hover"
          >
            <motion.div
              variants={{
                rest: { width: "100%" },
                hover: { width: 0 },
              }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="absolute left-0 top-0 h-full border-b-3 border-red-500"
            />
            <div className="relative z-10 text-lg flex items-center gap-4">
              Steam Games
            </div>
          </motion.div>
          <motion.div
            className="relative overflow-hidden border-r-3 border-r-neutral-600 h-15 flex-1 flex items-center justify-center"
            whileHover="rest"
            initial="hover"
            animate="hover"
          >
            <motion.div
              variants={{
                rest: { width: "100%" },
                hover: { width: 0 },
              }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="absolute left-0 top-0 h-full border-b-3 border-red-500"
            />
            <div className="relative z-10 text-lg flex items-center gap-4">
              Game Pass
            </div>
          </motion.div>
        </div>
        <div>
          <div>
            <div className="flex flex-col m-10 gap-3">
              <div className="text-2xl flex items-center gap-2">
                Best Discount Off <ChevronRight size={20} />
              </div>
              <div>Best Price for you!</div>
            </div>
            {games === null ? (
              <div className="flex items-center">
                {[...Array(4)].map((_: any, i: any) => (
                  <div key={i}>
                    <Skeleton className="w-[270px] h-[250px] ml-10"></Skeleton>
                  </div>
                ))}
              </div>
            ) : (
              <Carousel
                opts={{
                  align: "start",
                }}
                className="w-[70%] ml-25"
              >
                <CarouselContent className="flex items-center">
                  {games
                    ?.filter((g) => g.discount)
                    .sort((a, b) => b.discount - a.discount)
                    ?.map((game, index) => (
                      <CarouselItem
                        key={index}
                        className="basis-1/4 border border-neutral-500 p-2 rounded-xl ml-10"
                      >
                        <div className="p-1">
                          {game.Image_Url && (
                            <Image
                              src={ImgurConv(game.Image_Url[0])}
                              alt={game.Name}
                              width={550}
                              height={550}
                              className="rounded-2xl"
                            />
                          )}
                          <div className="text-md mt-2">{game.Name}</div>
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="text-green-400 text-md font-semibold">
                                -{game.discount}%
                              </div>
                            </div>
                            <div>
                              <div className="text-green-400 text-md font-semibold flex items-end gap-2">
                                <span className="text-xs line-through">
                                  {game.Price}
                                </span>
                                {game.discountedPrice}rsd
                              </div>
                            </div>
                          </div>
                          <div className="w-full mt-4 flex items-center justify-center">
                            <div className="border border-neutral-700 w-full p-2 flex items-center justify-center gap-3 rounded-xl bg-neutral-700 hover:bg-neutral-800 transition-all">
                              Add Cart
                              <ShoppingBag size={20} />
                            </div>
                          </div>
                          <div className="flex items-center justify-end mt-3">
                            {user?.email === "akidimke136@gmail.com" &&
                              "dimicmateja685@gmail.com" && (
                                <div
                                  className="flex gap-2 items-center"
                                  onClick={() => RemoveDisc(game)}
                                >
                                  <div>Ukloni</div>
                                  <X size={20} />
                                </div>
                              )}
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="bg-neutral-600 border border-neutral-600 hover:bg-neutral-700 hover:text-white" />
                <CarouselNext className="bg-neutral-600 border border-neutral-600 hover:bg-neutral-700 hover:text-white" />
              </Carousel>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
