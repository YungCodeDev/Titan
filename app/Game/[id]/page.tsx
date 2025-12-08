"use client";

import { supabase } from "@/app/supabaseClient";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronUp, ShoppingBag } from "lucide-react";
import { User } from "next-auth";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  FaKey,
  FaUser,
  FaXbox,
  FaPlaystation,
  FaMicrosoft,
} from "react-icons/fa";
import { SiEpicgames, SiOnstar, SiSteam, SiEa } from "react-icons/si";

interface Games {
  id: number;
  created_at: Date;
  Name: string;
  Price: number;
  Description: string;
  Platform: string[];
  Type: string[];
  Genres: string[];
  discount: number;
  discountedPrice: number;
  Image_Url: string[];
}

export default function Home({ params }: { params: { id: number } }) {
  const [games, setGames] = useState<Games[] | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [change, setChange] = useState(false);
  const [showP, setShowP] = useState<{ id: number; platform: string } | null>(
    null
  );
  const [showT, setShowT] = useState<{ id: number; type: string } | null>(null);
  const [show, setShow] = useState(false);
  const [quantity, setQuantity] = useState(Number(1));

  useEffect(() => {
    const getGames = async () => {
      const { id } = await params;
      const { data } = await supabase.from("Games").select("*").eq("id", id);

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

  const AddCart = async (game: Games, userID: string | undefined) => {
    try {
      const { data: existingCart } = await supabase
        .from("Cart")
        .select("*")
        .eq("Name", game.Name)
        .single();

      if (existingCart) {
        const { error: updateError } = await supabase
          .from("Cart")
          .update({ quantity: existingCart.quantity + quantity })
          .eq("id", existingCart.id);

        if (updateError) console.log(updateError);
      } else {
        const { error: insertError } = await supabase
          .from("Cart")
          .insert({
            user_id: userID,
            Name: game.Name,
            Price: game.Price,
            discountedPrice: game.discountedPrice,
            Image_Url: game.Image_Url[0],
            quantity: quantity,
          })
          .single();

        if (insertError) console.log(insertError);
      }
      setQuantity(Number(1));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <div>
        <div className="md:hidden p-4">
          {games === null ? (
            <div className="flex justify-center mt-10">
              <Skeleton className="w-[300px] h-[500px]" />
            </div>
          ) : (
            <div className="flex flex-col gap-8">
              {games.map((game) => {
                const eurPrice = game.Price;
                const rsdPrice = Math.round(eurPrice / 117);
                const eurDiscount = game.discountedPrice;
                const eurdiscP = Math.round(eurDiscount / 117);

                return (
                  <div
                    key={game.id}
                    className="border border-neutral-600 rounded-xl overflow-hidden bg-neutral-900"
                  >
                    {Array.isArray(game.Image_Url) &&
                      game.Image_Url.length > 0 && (
                        <Carousel
                          opts={{ align: "center" }}
                          orientation="horizontal"
                          className="w-full relative"
                        >
                          <CarouselContent>
                            {game.Image_Url.map((img, index) => (
                              <CarouselItem key={index}>
                                <div className="relative flex justify-center p-2">
                                  <Image
                                    src={ImgurConv(img)}
                                    alt={`image-${index}`}
                                    width={300}
                                    height={300}
                                    className="rounded-xl w-full h-auto"
                                  />
                                  {game.discount && (
                                    <div className="absolute top-2 right-2 w-8 h-8 bg-purple-500 text-white flex items-center justify-center rounded-full text-xs">
                                      {game.discount}%
                                    </div>
                                  )}
                                </div>
                              </CarouselItem>
                            ))}
                          </CarouselContent>
                        </Carousel>
                      )}
                    <div className="p-4 flex flex-col gap-2">
                      <div className="text-lg font-semibold">{game.Name}</div>
                      <div className="flex items-center gap-2">
                        {game.discount ? (
                          <>
                            <div className="line-through text-sm text-neutral-400">
                              {change ? `${rsdPrice}€` : `${eurPrice}rsd`}
                            </div>
                            <div className="text-lg font-bold">
                              {change ? `${eurdiscP}€` : `${eurDiscount}rsd`}
                            </div>
                          </>
                        ) : (
                          <div className="text-lg font-bold">
                            {change ? `${rsdPrice}€` : `${eurPrice}rsd`}
                          </div>
                        )}
                        <div
                          className="text-xs cursor-pointer ml-2"
                          onClick={() => setChange(!change)}
                        >
                          {change ? "RSD" : "EUR"}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-2 p-4">
                      <div className="flex items-center gap-4 text-lg">
                        <div
                          onClick={() => setQuantity((prev) => prev + 1)}
                          className="cursor-pointer p-2 bg-neutral-700 rounded"
                        >
                          +
                        </div>
                        <div>{quantity}</div>
                        <div
                          onClick={() =>
                            quantity > 1 && setQuantity((prev) => prev - 1)
                          }
                          className="cursor-pointer p-2 bg-neutral-700 rounded"
                        >
                          -
                        </div>
                      </div>
                      <div
                        onClick={() => AddCart(game, user?.id)}
                        className="flex items-center justify-center gap-2 bg-neutral-700 hover:bg-neutral-600 transition-all cursor-pointer p-2 rounded-xl w-full mt-2"
                      >
                        <ShoppingBag size={20} />
                        <span>Add Cart</span>
                      </div>
                    </div>
                    <div className="p-4">
                      <div
                        onClick={() => setShow(!show)}
                        className="cursor-pointer flex justify-between items-center border border-neutral-700 rounded-xl p-2"
                      >
                        <span>Game Description</span>
                        {show ? (
                          <ChevronUp size={18} />
                        ) : (
                          <ChevronDown size={18} />
                        )}
                      </div>
                      {show && (
                        <div className="mt-2 text-sm text-neutral-300">
                          {game.Description}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <div className="md:flex hidden items-center justify-center">
          {games === null ? (
            <div>
              <Skeleton className="w-[800px] h-[700px] mt-10" />
            </div>
          ) : (
            <div>
              {games?.map((game) => {
                const eurPrice = game.Price;
                const rsdPrice = Math.round(eurPrice / 117);
                const eurDiscount = game.discountedPrice;
                const eurdiscP = Math.round(eurDiscount / 117);
                return (
                  <div key={game.id}>
                    <div className="border border-neutral-600 p-2 rounded-xl mt-10 flex flex-col">
                      <div>
                        {Array.isArray(game?.Image_Url) &&
                          game.Image_Url.length > 0 && (
                            <Carousel
                              opts={{ align: "center" }}
                              orientation="horizontal"
                              className="w-full max-w-2xl relative"
                            >
                              <CarouselContent>
                                {game.Image_Url.map((img, index) => (
                                  <CarouselItem
                                    key={index}
                                    className="relative"
                                  >
                                    <div className="flex items-center justify-center p-2">
                                      <Image
                                        src={ImgurConv(img)}
                                        alt={`image-${index}`}
                                        width={2000}
                                        height={1000}
                                        className="rounded-xl w-full h-auto"
                                      />
                                      {game.discount && (
                                        <div className="absolute top-0 right-0 border w-10 h-10 border-purple-500 bg-purple-500 flex items-center justify-center rounded-full">
                                          {game.discount}%
                                        </div>
                                      )}
                                    </div>
                                  </CarouselItem>
                                ))}
                              </CarouselContent>
                              <CarouselPrevious className="absolute -left-15 bg-neutral-800 border border-neutral-800 hover:bg-neutral-800 hover:text-white" />
                              <CarouselNext className="absolute -right-15 bg-neutral-800 border border-neutral-800 hover:bg-neutral-800 hover:text-white" />
                            </Carousel>
                          )}
                      </div>
                      <div className="flex items-center justify-around mt-5">
                        <div className="text-xl">{game.Name}</div>
                        <div>
                          {game.discount ? (
                            <div className="flex items-end gap-2">
                              <div className="text-xs line-through">
                                {change ? (
                                  <div className="flex items-end gap-2">
                                    <div className="text-xs">{rsdPrice}€</div>
                                  </div>
                                ) : (
                                  <div className="flex items-end gap-2">
                                    <div className="text-xs">{eurPrice}rsd</div>
                                  </div>
                                )}
                              </div>
                              <div>
                                {change ? (
                                  <div className="flex items-end gap-2 w-20">
                                    <div className="text-xl">{eurdiscP}€</div>
                                    <div
                                      className="text-xs"
                                      onClick={() => setChange(!change)}
                                    >
                                      RSD
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex items-end gap-2 w-20">
                                    <div className="text-xl">
                                      {eurDiscount}rsd
                                    </div>
                                    <div
                                      className="text-xs"
                                      onClick={() => setChange(!change)}
                                    >
                                      EUR
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          ) : (
                            <div>
                              {change ? (
                                <div className="flex items-end gap-2 w-20">
                                  <div className="text-xl">{rsdPrice}€</div>
                                  <div
                                    className="text-xs"
                                    onClick={() => setChange(!change)}
                                  >
                                    RSD
                                  </div>
                                </div>
                              ) : (
                                <div className="flex items-end gap-2 w-20">
                                  <div className="text-xl">{eurPrice}rsd</div>
                                  <div
                                    className="text-xs"
                                    onClick={() => setChange(!change)}
                                  >
                                    EUR
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between mr-10">
                        <div className="flex gap-5 items-center m-5 text-xl">
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
                                          showP?.platform === "playstation" && (
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
                            })}
                          </div>
                        </div>
                        <div className="flex gap-5 items-center text-xl">
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
                      </div>
                      <div className="flex items-center justify-around w-full">
                        <div className="border border-neutral-600 p-2 rounded-xl w-50 m-10 flex flex-col gap-2 items-center">
                          <div>Quantity</div>
                          <div className="flex items-center justify-around gap-2 text-xl w-full">
                            <div
                              onClick={() => setQuantity((prev) => prev + 1)}
                              className="cursor-pointer"
                            >
                              +
                            </div>
                            <div>{quantity}</div>
                            <div
                              onClick={() => {
                                if (quantity > 1) {
                                  setQuantity((prev) => prev - 1);
                                }
                              }}
                              className="cursor-pointer"
                            >
                              -
                            </div>
                          </div>
                          <div>
                            {quantity > 5 && (
                              <div
                                onClick={() => setQuantity(Number(1))}
                                className="cursor-pointer"
                              >
                                Clear
                              </div>
                            )}
                          </div>
                        </div>
                        <div
                          onClick={() => AddCart(game, user?.id)}
                          className="flex items-center gap-5 text-xl border border-neutral-600 hover:bg-neutral-600 transition-all cursor-pointer p-2 rounded-xl w-50 m-10 justify-center"
                        >
                          <div>Add Cart</div>
                          <ShoppingBag size={20} />
                        </div>
                      </div>
                      <div className="flex flex-col items-center w-full">
                        <div
                          onClick={() => setShow(!show)}
                          className={`w-full max-w-2xl cursor-pointer select-none border border-neutral-700 rounded-xl px-4 py-3 flex items-center justify-between transition-all duration-300 ${
                            show
                              ? "bg-neutral-700"
                              : "bg-neutral-800 hover:bg-neutral-700"
                          }`}
                        >
                          <span className="text-lg font-medium">
                            Game Description
                          </span>
                          {show ? (
                            <ChevronUp size={18} />
                          ) : (
                            <ChevronDown size={18} />
                          )}
                        </div>
                        {show && (
                          <div className="w-full max-w-2xl border border-neutral-700 bg-neutral-800 rounded-xl p-4 mt-2 text-sm leading-relaxed animate-in fade-in slide-in-from-top-2 duration-300">
                            {game.Description}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
