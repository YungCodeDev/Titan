"use client";

import {
  AlertCircle,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Menu,
  ShoppingBag,
  X,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import { motion } from "framer-motion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { User } from "@supabase/supabase-js";
import Link from "next/link";
import { useGuestID } from "./GuestProvider";
import { FaMicrosoft, FaPlaystation, FaSteam, FaXbox } from "react-icons/fa";
import { SiEa, SiEpicgames, SiRockstargames } from "react-icons/si";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [games, setGames] = useState<Games[] | null>(null);
  const [menu, setMenu] = useState(false);
  const [genres, setGenres] = useState<string[]>([]);
  const [refresh, setRefresh] = useState(false);
  const guestID = useGuestID();

  useEffect(() => {
    const getGames = async () => {
      const { data, error } = await supabase.from("Games").select("*");

      if (!error) setGames(data);
    };

    getGames();
  }, [refresh, user]);
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

    if (!error) {
      setRefresh((prev) => !prev);
    }
    if (data) console.log(data);
  }

  const AddCart = async (game: Games) => {
    try {
      const cartUserID = user?.id || guestID;
      const { data: existingCart } = await supabase
        .from("Cart")
        .select("*")
        .eq("user_id", cartUserID)
        .eq("Name", game.Name)
        .single();

      if (existingCart) {
        const { error: updateError } = await supabase
          .from("Cart")
          .update({ quantity: existingCart.quantity + 1 })
          .eq("id", existingCart.id);

        if (updateError) console.log(updateError);
      } else {
        const { error: insertError } = await supabase
          .from("Cart")
          .insert({
            user_id: cartUserID,
            Name: game.Name,
            Price: game.Price,
            discountedPrice: game.discountedPrice,
            Image_Url: game.Image_Url[0],
            quantity: 1,
          })
          .single();
        if (!insertError) setRefresh((prev) => !prev);
      }
    } catch (err) {
      console.log(err);
    }
  };

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
                  onClick={() => router.push("/Games")}
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
                            <Link key={g} href={`/Games?Genres=${g}`}>
                              <div className="px-3 py-1 rounded-lg bg-neutral-700 hover:bg-red-500 hover:text-white text-sm text-neutral-200 transition-all duration-200 cursor-pointer">
                                {g}
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <motion.div
                  className="relative flex items-center justify-center h-14 bg-neutral-800 rounded-xl shadow-md cursor-pointer overflow-hidden"
                  whileTap={{ scale: 0.97 }}
                  onClick={() => router.push("/Games?discount=true")}
                >
                  <motion.div
                    className="absolute left-0 top-0 h-full bg-red-500"
                    initial={{ width: "100%" }}
                    whileTap={{ width: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  />
                  <div className="relative z-10 text-lg font-semibold text-white">
                    Discount
                  </div>
                </motion.div>
                <motion.div
                  className="relative flex items-center justify-center h-14 bg-neutral-800 rounded-xl shadow-md cursor-pointer overflow-hidden"
                  whileTap={{ scale: 0.97 }}
                  onClick={() => router.push("/Games?discount=90")}
                >
                  <motion.div
                    className="absolute left-0 top-0 h-full bg-red-500"
                    initial={{ width: "100%" }}
                    whileTap={{ width: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  />
                  <div className="relative z-10 text-lg font-semibold text-white">
                    Free Gifts
                  </div>
                </motion.div>
                <motion.div
                  className="relative flex items-center justify-center h-14 bg-neutral-800 rounded-xl shadow-md cursor-pointer overflow-hidden"
                  whileTap={{ scale: 0.97 }}
                  onClick={() => router.push("/Games?Platform=steam")}
                >
                  <motion.div
                    className="absolute left-0 top-0 h-full bg-red-500"
                    initial={{ width: "100%" }}
                    whileTap={{ width: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  />
                  <div className="relative z-10 text-lg font-semibold text-white">
                    Steam Games
                  </div>
                </motion.div>
                <motion.div
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
                    Game Pass
                  </div>
                </motion.div>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div className="flex flex-col items-center my-10">
            <div className="flex flex-col gap-2 mb-6 w-full px-4 md:px-10">
              <div className="text-3xl font-bold text-white flex items-center gap-3 hover:text-red-500 cursor-pointer">
                Best Discounts <ChevronRight size={24} />
              </div>
              <div className="text-sm text-neutral-400">
                Grab the best deals for you!
              </div>
            </div>
            <div className="w-full overflow-x-auto">
              <Carousel
                opts={{ align: "start" }}
                className="w-full flex items-center justify-center"
              >
                <CarouselContent className="flex gap-6 px-4 md:px-10">
                  {games
                    ?.filter((g) => g.discount)
                    .sort((a, b) => b.discount - a.discount)
                    ?.map((game) => (
                      <div
                        key={game.id}
                        className="shrink-0 w-[300px] bg-neutral-900 border border-neutral-700 rounded-xl shadow-lg overflow-hidden relative hover:scale-105 transform transition-transform duration-300 cursor-pointer"
                      >
                        {(user?.email === "akidimke136@gmail.com" ||
                          user?.email === "dimicmateja685@gmail.com") && (
                          <div
                            className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-500 flex items-center justify-center z-10"
                            onClick={() => RemoveDisc(game)}
                          >
                            <X size={16} />
                          </div>
                        )}
                        {game.Image_Url && (
                          <div className="relative w-full h-60">
                            <Image
                              src={ImgurConv(game.Image_Url[0])}
                              alt={game.Name}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                              -{game.discount}%
                            </div>
                          </div>
                        )}
                        <div className="flex flex-col p-3 gap-2">
                          <div className="text-white font-semibold text-lg truncate">
                            {game.Name}
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-neutral-400 line-through text-sm">
                              {game.Price}rsd
                            </span>
                            <span className="text-green-400 font-semibold text-sm">
                              {game.discountedPrice}rsd
                            </span>
                          </div>
                          <button
                            onClick={() => AddCart(game)}
                            className="w-full mt-2 bg-red-500 hover:bg-red-600 text-white font-medium py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                          >
                            Add to Cart <ShoppingBag size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                </CarouselContent>
              </Carousel>
            </div>
          </div>
          <div className="mt-10 mb-10 px-5">
            <div className="text-lg font-semibold text-white mb-4">
              Platforms Available:
            </div>
            <div className="flex flex-wrap gap-4">
              <FaSteam className="w-8 h-8 text-white" />
              <SiEpicgames className="w-8 h-8 text-white" />
              <SiRockstargames className="w-8 h-8 text-white" />
              <FaMicrosoft className="w-8 h-8 text-white" />
              <SiEa className="w-8 h-8 text-white" />
              <FaPlaystation className="w-8 h-8 text-white" />
              <FaXbox className="w-8 h-8 text-white" />
            </div>
          </div>
          <div className="flex flex-col px-5 mb-10">
            <div className="flex flex-col gap-2 mb-4">
              <div className="text-2xl font-bold flex items-center gap-2 text-white">
                New Game Alert <AlertCircle size={20} />
              </div>
              <div className="text-sm text-neutral-400">
                New Games are available for you!
              </div>
            </div>
            <div className="w-full overflow-x-auto">
              <div className="flex gap-4 w-max">
                {games
                  ?.filter((g) => g.created_at)
                  .sort(
                    (a, b) =>
                      new Date(b.created_at).getTime() -
                      new Date(a.created_at).getTime()
                  )
                  .slice(0, 5)
                  ?.map((game) => (
                    <Link
                      href={`/Game/${game.id}`}
                      key={game.id}
                      className="shrink-0 w-full sm:w-80 md:w-64 border border-neutral-700 rounded-xl overflow-hidden cursor-pointer"
                    >
                      <div className="flex flex-col p-2 gap-2">
                        {game.Image_Url && (
                          <div className="w-full h-64 relative rounded-lg overflow-hidden">
                            <Image
                              src={ImgurConv(game.Image_Url[0])}
                              alt={game.Name}
                              fill
                              className="object-cover"
                            />
                            {game.discount && (
                              <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                                -{game.discount}%
                              </div>
                            )}
                          </div>
                        )}
                        <div className="text-white font-semibold text-center truncate">
                          {game.Name.slice(0, 20)}
                        </div>
                        <div className="flex justify-between items-center text-sm text-green-400 font-semibold">
                          {game.discountedPrice ? (
                            <>
                              <span className="line-through text-neutral-400 text-xs">
                                {game.Price}rsd
                              </span>
                              <span>{game.discountedPrice}rsd</span>
                            </>
                          ) : (
                            <span>{game.Price}rsd</span>
                          )}
                        </div>
                        <button
                          onClick={() => AddCart(game)}
                          className="w-full mt-2 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                        >
                          Add Cart <ShoppingBag size={18} />
                        </button>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="md:flex hidden flex-col">
        <div className="border-b-3 border-b-neutral-600 w-full h-15 flex items-center">
          <motion.div
            className="relative overflow-hidden border-r-3 border-r-neutral-600 h-15 flex-1 flex items-center justify-center cursor-pointer"
            whileHover="rest"
            initial="hover"
            animate="hover"
            onClick={() => router.push("/Games")}
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
                      "steam",
                      "epic",
                      "rockstar",
                      "microsoft",
                      "eaplay",
                      "playstation",
                      "xbox",
                    ].map((p) => (
                      <Link key={p} href={`/Games?Platform=${p}`}>
                        <div className="hover:text-white cursor-pointer">
                          {p}
                        </div>
                      </Link>
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
                            <Link key={g} href={`/Games?Genres=${g}`}>
                              <div
                                className="hover:text-white cursor-pointer"
                                onClick={() => setGenres([g])}
                              >
                                {g}
                              </div>
                            </Link>
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
            className="relative overflow-hidden border-r-3 border-r-neutral-600 h-15 flex-1 flex items-center justify-center cursor-pointer"
            whileHover="rest"
            initial="hover"
            animate="hover"
            onClick={() => router.push("/Games?discount=true")}
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
            className="relative overflow-hidden border-r-3 border-r-neutral-600 h-15 flex-1 flex items-center justify-center cursor-pointer"
            whileHover="rest"
            initial="hover"
            animate="hover"
            onClick={() => router.push("/Games?discount=90")}
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
            className="relative overflow-hidden border-r-3 border-r-neutral-600 h-15 flex-1 flex items-center justify-center cursor-pointer"
            whileHover="rest"
            initial="hover"
            animate="hover"
            onClick={() => router.push("/Games?Platform=steam")}
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
        <div className="flex flex-col items-center">
          <div className="flex flex-col m-10 w-full ml-50">
            <div className="flex flex-col gap-3 mb-6">
              <div
                onClick={() => router.push("/Games?discount=true")}
                className="text-2xl flex items-center gap-2 cursor-pointer w-max"
              >
                Best Discount Off <ChevronRight size={20} />
              </div>
              <div>Best Price for you!</div>
            </div>
            <Carousel opts={{ align: "start" }} className="w-[70%]">
              <CarouselContent className="flex gap-6 px-4 ml-5 mr-5">
                {games
                  ?.filter((g) => g.discount)
                  .sort((a, b) => b.discount - a.discount)
                  .slice(0, 7)
                  ?.map((game) => (
                    <div
                      key={game.id}
                      className="shrink-0 w-[250px] border border-neutral-500 p-2 rounded-xl cursor-pointer relative"
                    >
                      {(user?.email === "akidimke136@gmail.com" ||
                        user?.email === "dimicmateja685@gmail.com") && (
                        <div
                          className="absolute -right-7 top-2 flex gap-2 items-center text-red-400 cursor-pointer"
                          onClick={() => RemoveDisc(game)}
                        >
                          <X size={20} />
                        </div>
                      )}
                      <Link href={`/Game/${game.id}`}>
                        <CarouselItem>
                          <div className="flex flex-col h-full">
                            <div className="flex justify-center">
                              {game.Image_Url && (
                                <Image
                                  src={ImgurConv(game.Image_Url[0])}
                                  alt={game.Name}
                                  width={250}
                                  height={250}
                                  className="rounded-2xl mr-4"
                                />
                              )}
                            </div>
                            <div className="text-md mt-2 text-center min-h-7 font-semibold text-white">
                              {game.Name.slice(0, 15)}
                            </div>
                            <div className="flex justify-between items-center min-h-8 mt-1">
                              <div className="text-red-400 text-md font-semibold">
                                -{game.discount}%
                              </div>
                              <div className="text-green-400 text-sm font-semibold flex items-end gap-2">
                                <span className="line-through text-xs text-neutral-400">
                                  {game.Price}rsd
                                </span>
                                {game.discountedPrice}rsd
                              </div>
                            </div>
                            <div className="w-full mt-4 flex items-center justify-center min-h-[50px]">
                              <div
                                onClick={() => AddCart(game)}
                                className="mr-5 border border-neutral-700 w-full p-2 flex items-center justify-center gap-3 rounded-xl bg-neutral-700 hover:bg-neutral-800 transition-all"
                              >
                                Add Cart
                                <ShoppingBag size={20} />
                              </div>
                            </div>
                          </div>
                        </CarouselItem>
                      </Link>
                    </div>
                  ))}
              </CarouselContent>
              <CarouselPrevious className="bg-neutral-600 border border-neutral-600 hover:bg-neutral-700 hover:text-white" />
              <CarouselNext className="bg-neutral-600 border border-neutral-600 hover:bg-neutral-700 hover:text-white" />
            </Carousel>
          </div>
          <div className="mt-20 mb-20">
            <div className="flex items-center gap-10">
              <div className="text-xl">Platforms Available: </div>
              <FaSteam className="w-8 h-8" />{" "}
              <SiEpicgames className="w-8 h-8" />{" "}
              <SiRockstargames className="w-8 h-8" />{" "}
              <FaMicrosoft className="w-8 h-8" /> <SiEa className="w-8 h-8" />{" "}
              <FaPlaystation className="w-8 h-8" />{" "}
              <FaXbox className="w-8 h-8" />
            </div>
          </div>
          <div className="flex flex-col w-full mr-8">
            <div className="flex flex-col m-10 gap-3 ml-24">
              <div className="text-2xl flex items-center gap-2">
                New Game Alert <AlertCircle size={20} />
              </div>
              <div>New Games are available for you!</div>
            </div>
            <Carousel
              opts={{
                align: "start",
              }}
              className="w-[70%] ml-25"
            >
              <CarouselContent className="flex items-center ml-5 gap-6">
                {games
                  ?.filter((g) => g.created_at)
                  .sort(
                    (a, b) =>
                      new Date(b.created_at).getTime() -
                      new Date(a.created_at).getTime()
                  )
                  .slice(0, 5)
                  ?.map((game) => (
                    <Link
                      href={`/Game/${game.id}`}
                      key={game.id}
                      className="shrink-0 w-[250px] border border-neutral-500 p-2 rounded-xl cursor-pointer relative"
                    >
                      <CarouselItem>
                        <div className="p-1">
                          <div className="flex justify-center">
                            {game.Image_Url && (
                              <Image
                                src={ImgurConv(game.Image_Url[0])}
                                alt={game.Name}
                                width={550}
                                height={550}
                                className="rounded-2xl mr-3"
                              />
                            )}
                          </div>
                          <div className="text-md mt-2 text-center min-h-7">
                            {game.Name.slice(0, 15)}
                          </div>
                          <div className="flex justify-end items-center min-h-8">
                            {game.discountedPrice ? (
                              <div className="flex items-center gap-2 justify-between w-full">
                                <div className="text-red-400">
                                  -{game.discount}%
                                </div>
                                <div className="flex items-end gap-2 text-sm font-semibold">
                                  <div className="line-through text-xs text-neutral-400">
                                    {game.Price}
                                  </div>
                                  <div className="text-green-400">
                                    {game.discountedPrice}rsd
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div>{game.Price}rsd</div>
                            )}
                          </div>
                          <div className="w-full mt-4 flex items-center justify-center">
                            <div
                              onClick={() => AddCart(game)}
                              className="mr-5 border border-neutral-700 w-full p-2 flex items-center justify-center gap-3 rounded-xl bg-neutral-700 hover:bg-neutral-800 transition-all"
                            >
                              Add Cart
                              <ShoppingBag size={20} />
                            </div>
                          </div>
                        </div>
                      </CarouselItem>
                    </Link>
                  ))}
              </CarouselContent>
              <CarouselPrevious className="bg-neutral-600 border border-neutral-600 hover:bg-neutral-700 hover:text-white" />
              <CarouselNext className="bg-neutral-600 border border-neutral-600 hover:bg-neutral-700 hover:text-white" />
            </Carousel>
          </div>
        </div>
      </div>
    </div>
  );
}
