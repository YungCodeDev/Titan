"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Edit, Trash } from "lucide-react";

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
  const [name, setName] = useState("");
  const [price, setPrice] = useState(Number(1));
  const [desc, setDesc] = useState("");
  const [platform, setPlatform] = useState<string>("");
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [type, setType] = useState<string>("");
  const [types, setTypes] = useState<string[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [image, setImage] = useState<string>("");
  const [images, setImages] = useState<string[]>([]);
  const [games, setGames] = useState<Games[] | null>(null);
  const [edit, setEdit] = useState<number | null>(null);
  const [getDisc, setGetDisc] = useState<number | null>(null);
  const [discount, setDiscount] = useState(Number(1));
  const [discPrice, setDiscPrice] = useState(Number(1));
  const [search, setSearch] = useState("");

  useEffect(() => {
    const getGames = async () => {
      const { data } = await supabase.from("Games").select("*");

      setGames(data);
    };

    getGames();
  });

  const totalPrice = (price: number, discount: number) => {
    return Math.round(price - (price * discount) / 100);
  };

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

  function AddPlatform() {
    if (platform.trim() === "") return;
    setPlatforms([...platforms, platform]);
    setPlatform("");
  }
  function AddTypes() {
    if (type.trim() === "") return;
    setTypes([...types, type]);
    setType("");
  }
  function AddImage() {
    if (image.trim() === "") return;
    setImages([...images, image]);
    setImage("");
  }

  async function AddGames() {
    try {
      const { data, error } = await supabase.from("Games").insert([
        {
          Name: name,
          Price: price,
          Description: desc,
          Platform: platforms,
          Type: types,
          Genres: genres,
          Image_Url: images,
        },
      ]);
      setName("");
      setPrice(Number(1));
      setDesc("");
      setType("");
      setTypes([]);
      setPlatform("");
      setPlatforms([]);
      setGenres([]);
      setImage("");
      setImages([]);
      if (error) console.log(error);
      if (data) console.log(data);
    } catch (err) {
      console.log(err);
    }
  }

  async function AddDisc(game: any) {
    const { data, error } = await supabase
      .from("Games")
      .update({
        discount: discount,
        discountedPrice: Math.round(discPrice),
      })
      .eq("id", game.id);

    if (error) console.log(error);
    if (data) console.log(data);
    setDiscPrice(Number(game.Price));
    setDiscount(Number(1));
    setEdit(null);
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
    setEdit(null);
  }

  return (
    <div>
      <div className="md:hidden">
        <div className="flex flex-col items-center">
          <div>
            <div className="m-10 text-2xl">Admin - Add Games</div>
            <div>
              <div className="m-5">
                <div className="text-2xl mb-5 flex items-center gap-3">
                  Name: <span className="text-lg">{name}</span>
                </div>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="outline-0 border border-neutral-800 w-[350px] h-10 text-sm focus:ring-2 focus:ring-neutral-800 rounded-lg pl-2"
                  placeholder="Enter Game Name"
                />
              </div>
              <div className="m-5">
                <div className="text-2xl mb-5 flex items-center gap-3">
                  Price: <span className="text-lg">{price}rsd</span>
                </div>
                <input
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="outline-0 border border-neutral-800 w-[350px] h-10 text-sm focus:ring-2 focus:ring-neutral-800 rounded-lg pl-2"
                />
              </div>
              <div className="m-5">
                <div className="text-2xl mb-5 flex items-center gap-3">
                  Description
                </div>
                <textarea
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className="outline-0 border border-neutral-800 w-[350px] h-40 text-sm focus:ring-2 focus:ring-neutral-800 rounded-lg pl-2 pt-2"
                  placeholder="Enter Description"
                />
              </div>
              <div className="m-5">
                <div className="text-2xl mb-5 flex items-center gap-3">
                  Platform:{" "}
                  <div className="flex gap-2">
                    {platforms.map((t: any, index: any) => (
                      <span
                        key={index}
                        className="text-lg cursor-pointer bg-neutral-800 text-white px-2 py-1 rounded-lg"
                        onClick={() =>
                          setPlatforms(
                            platforms.filter((_: any, i: any) => i !== index)
                          )
                        }
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <input
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="outline-0 border border-neutral-800 w-[350px] h-10 text-sm focus:ring-2 focus:ring-neutral-800 rounded-lg pl-2"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      AddPlatform();
                    }
                  }}
                  placeholder="Enter Platform"
                />
              </div>
              <div className="m-5">
                <div className="text-2xl mb-5 flex items-center gap-3">
                  Type:{" "}
                  <div className="flex gap-2">
                    {types.map((t: any, index: any) => (
                      <span
                        key={index}
                        className="text-lg cursor-pointer bg-neutral-800 text-white px-2 py-1 rounded-lg"
                        onClick={() =>
                          setTypes(
                            types.filter((_: any, i: any) => i !== index)
                          )
                        }
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <input
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="outline-0 border border-neutral-800 w-[350px] h-10 text-sm focus:ring-2 focus:ring-neutral-800 rounded-lg pl-2"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      AddTypes();
                    }
                  }}
                  placeholder="Enter Types"
                />
              </div>
              <div className="m-5">
                <div className="text-2xl mb-5 flex items-center gap-3">
                  Genres:{" "}
                </div>
                <div>
                  <select
                    value={genres}
                    onChange={(e) => {
                      const selected = Array.from(
                        e.target.selectedOptions,
                        (option) => option.value
                      );
                      setGenres(selected);
                    }}
                    className="outline-0 border border-neutral-800 bg-neutral-800 rounded-lg p-2 w-50 h-80 text-sm text-center"
                    multiple
                  >
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
              <div className="m-5">
                <div className="text-2xl mb-5 flex items-center gap-3">
                  Image
                </div>
                <input
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="outline-0 border border-neutral-800 w-[350px] h-10 text-sm focus:ring-2 focus:ring-neutral-800 rounded-lg pl-2"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      AddImage();
                    }
                  }}
                  placeholder="Enter ImageUrl"
                />
                <div className="flex gap-2">
                  {images.map((t: any, index: any) => {
                    const imgUrl = ImgurConv(t);
                    if (!imgUrl) return null;

                    return (
                      <span
                        key={index}
                        className="cursor-pointer px-2 py-1 m-4"
                        onClick={() =>
                          setImages(
                            images.filter((_: any, i: any) => i !== index)
                          )
                        }
                      >
                        <Image
                          src={imgUrl}
                          alt={`Image ${index}`}
                          width={120}
                          height={120}
                          className="rounded-xl"
                        />
                      </span>
                    );
                  })}
                </div>
              </div>
              <div className="m-5">
                <div
                  onClick={AddGames}
                  className="border border-neutral-800 bg-neutral-800 py-4 px-8 w-50 text-center rounded-xl hover:scale-110 active:scale-100 transition-all"
                >
                  Add Games
                </div>
              </div>
            </div>
          </div>
          <div>
            <div>
              <div>
                <input
                  className="outline-0 border border-neutral-700 m-8 w-90 h-10 text-sm rounded-lg pl-2"
                  placeholder="Search Games..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-col gap-5 m-10">
              {games
                ?.filter((game) =>
                  game.Name?.toLowerCase()?.includes(search.toLowerCase())
                )
                ?.map((game) => (
                  <div
                    key={game.id}
                    className="border border-neutral-700 p-2 rounded-xl h-max"
                  >
                    <div>
                      <div>
                        {Array.isArray(game?.Image_Url) &&
                          game.Image_Url.length > 0 && (
                            <Carousel
                              opts={{ align: "center" }}
                              orientation="horizontal"
                              className="w-full max-w-xs"
                            >
                              <CarouselContent>
                                {game.Image_Url.map((img, index) => (
                                  <CarouselItem key={index}>
                                    <div className="p-1 flex items-center justify-center m-5">
                                      <Image
                                        src={ImgurConv(img)}
                                        alt={`image-${index}`}
                                        width={250}
                                        height={250}
                                        className="object-contain rounded-xl"
                                      />
                                    </div>
                                  </CarouselItem>
                                ))}
                              </CarouselContent>
                              <CarouselPrevious />
                              <CarouselNext />
                            </Carousel>
                          )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 justify-around text-xl">
                          <div>{game.Name}</div>
                          <div className="flex items-center">
                            {game.discountedPrice ? (
                              <div className="flex items-end gap-2 relative">
                                <div className="text-xs line-through">
                                  {game.Price}
                                </div>
                                <div>{game.discountedPrice}rsd</div>
                                <div className="text-xs absolute bottom-5 left-30 border border-purple-400 bg-purple-400 rounded-full w-7 h-7 flex justify-center items-center">
                                  {game.discount}%
                                </div>
                              </div>
                            ) : (
                              <div>{game.Price}rsd</div>
                            )}
                          </div>
                        </div>
                        <div>
                          <div className="text-center text-lg mt-5 border border-neutral-600 bg-neutral-600 p-2 rounded-lg">
                            {game.Platform?.join(", ")}
                          </div>
                          <div className="text-center text-lg mt-5 border border-neutral-600 bg-neutral-600 p-2 rounded-lg">
                            {game.Type?.join(", ")}
                          </div>
                          <div className="flex items-center justify-center">
                            <div className="text-center text-lg mt-5 border border-neutral-600 bg-neutral-600 p-2 rounded-lg w-40">
                              {game.Genres?.join(", ")}
                            </div>
                          </div>
                          <div className="text-center text-lg mt-5 border border-neutral-600 bg-neutral-600 p-2 rounded-lg hover:scale-110 active:scale-100 transition-all">
                            View Games
                          </div>
                          {edit === game.id ? (
                            <div>
                              {getDisc === game.id ? (
                                <div>
                                  <div className="mt-5">
                                    <div className="text-center text-lg">
                                      Setup discount
                                    </div>
                                    <div className="flex items-center justify-center mt-2">
                                      <div className="flex gap-2">
                                        <input
                                          value={discPrice}
                                          onChange={(e) =>
                                            setDiscPrice(Number(e.target.value))
                                          }
                                          className="outline-0 w-20 border border-neutral-600 text-center  rounded-lg h-10"
                                        />
                                        <div className="relative">
                                          <input
                                            value={discount}
                                            onChange={(e) => {
                                              const val = Number(
                                                e.target.value
                                              );
                                              setDiscount(val);
                                              setDiscPrice(
                                                totalPrice(game.Price, val)
                                              );
                                            }}
                                            className="outline-0 w-20 border border-neutral-600 text-center  rounded-lg h-10"
                                          />
                                          <div className="absolute right-2 top-1/2 -translate-y-1/2">
                                            %
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div
                                      className="mt-3 text-center"
                                      onClick={() => AddDisc(game)}
                                    >
                                      Confirm
                                    </div>
                                    {game.discountedPrice ? (
                                      <div
                                        onClick={() => RemoveDisc(game)}
                                        className="text-center mt-2"
                                      >
                                        Remove
                                      </div>
                                    ) : (
                                      <></>
                                    )}
                                    <div className="flex items-center justify-center mt-2">
                                      <div
                                        onClick={() => setGetDisc(null)}
                                        className="text-center text-lg w-max"
                                      >
                                        Back
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div>
                                  <div className="mt-5">
                                    <div
                                      className="text-center text-lg"
                                      onClick={() => setGetDisc(game.id)}
                                    >
                                      Setup discount
                                    </div>
                                    <div className="flex items-center justify-center mt-2">
                                      <div
                                        onClick={() => setEdit(null)}
                                        className="text-center text-lg w-max"
                                      >
                                        Back
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div>
                              <div className="flex items-center gap-5 justify-center mt-5">
                                <div>
                                  <Trash
                                    size={23}
                                    className="hover:scale-105 active:scale-95 hover:text-red-500 transition-all"
                                  />
                                </div>
                                <div>
                                  <Edit
                                    size={23}
                                    className="hover:scale-105 active:scale-95 hover:text-blue-500 transition-all"
                                    onClick={() => setEdit(game.id)}
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
      <div className="md:flex flex-col hidden">
        <div className="flex justify-between">
          <div>
            <div className="m-10 text-2xl">Admin - Add Games</div>
            <div>
              <div className="m-5">
                <div className="text-2xl mb-5 flex items-center gap-3">
                  Name: <span className="text-lg">{name}</span>
                </div>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="outline-0 border border-neutral-800 w-[500px] h-10 text-sm focus:ring-2 focus:ring-neutral-800 rounded-lg pl-2"
                  placeholder="Enter Game Name"
                />
              </div>
              <div className="m-5">
                <div className="text-2xl mb-5 flex items-center gap-3">
                  Price: <span className="text-lg">{price}rsd</span>
                </div>
                <input
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="outline-0 border border-neutral-800 w-[500px] h-10 text-sm focus:ring-2 focus:ring-neutral-800 rounded-lg pl-2"
                />
              </div>
              <div className="m-5">
                <div className="text-2xl mb-5 flex items-center gap-3">
                  Description
                </div>
                <textarea
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className="outline-0 border border-neutral-800 w-[500px] h-40 text-sm focus:ring-2 focus:ring-neutral-800 rounded-lg pl-2 pt-2"
                  placeholder="Enter Description"
                />
              </div>
              <div className="m-5">
                <div className="text-2xl mb-5 flex items-center gap-3">
                  Platform:{" "}
                  <div className="flex gap-2">
                    {platforms.map((t: any, index: any) => (
                      <span
                        key={index}
                        className="text-lg cursor-pointer bg-neutral-800 text-white px-2 py-1 rounded-lg"
                        onClick={() =>
                          setPlatforms(
                            platforms.filter((_: any, i: any) => i !== index)
                          )
                        }
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <input
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="outline-0 border border-neutral-800 w-[500px] h-10 text-sm focus:ring-2 focus:ring-neutral-800 rounded-lg pl-2"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      AddPlatform();
                    }
                  }}
                  placeholder="Enter Platform"
                />
              </div>
              <div className="m-5">
                <div className="text-2xl mb-5 flex items-center gap-3">
                  Type:{" "}
                  <div className="flex gap-2">
                    {types.map((t: any, index: any) => (
                      <span
                        key={index}
                        className="text-lg cursor-pointer bg-neutral-800 text-white px-2 py-1 rounded-lg"
                        onClick={() =>
                          setTypes(
                            types.filter((_: any, i: any) => i !== index)
                          )
                        }
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <input
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="outline-0 border border-neutral-800 w-[500px] h-10 text-sm focus:ring-2 focus:ring-neutral-800 rounded-lg pl-2"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      AddTypes();
                    }
                  }}
                  placeholder="Enter Types"
                />
              </div>
              <div className="m-5">
                <div className="text-2xl mb-5 flex items-center gap-3">
                  Genres:{" "}
                </div>
                <div>
                  <select
                    value={genres}
                    onChange={(e) => {
                      const selected = Array.from(
                        e.target.selectedOptions,
                        (option) => option.value
                      );
                      setGenres(selected);
                    }}
                    className="outline-0 border border-neutral-800 bg-neutral-800 rounded-lg p-2 w-50 h-80 text-sm text-center"
                    multiple
                  >
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
              <div className="m-5">
                <div className="text-2xl mb-5 flex items-center gap-3">
                  Image
                </div>
                <input
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="outline-0 border border-neutral-800 w-[500px] h-10 text-sm focus:ring-2 focus:ring-neutral-800 rounded-lg pl-2"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      AddImage();
                    }
                  }}
                  placeholder="Enter ImageUrl"
                />
                <div className="flex gap-2">
                  {images.map((t: any, index: any) => {
                    const imgUrl = ImgurConv(t);
                    if (!imgUrl) return null;

                    return (
                      <span
                        key={index}
                        className="cursor-pointer px-2 py-1 m-4"
                        onClick={() =>
                          setImages(
                            images.filter((_: any, i: any) => i !== index)
                          )
                        }
                      >
                        <Image
                          src={imgUrl}
                          alt={`Image ${index}`}
                          width={120}
                          height={120}
                          className="rounded-xl"
                        />
                      </span>
                    );
                  })}
                </div>
              </div>
              <div className="m-5">
                <div
                  onClick={AddGames}
                  className="border border-neutral-800 bg-neutral-800 py-4 px-8 w-50 text-center rounded-xl hover:scale-110 active:scale-100 transition-all"
                >
                  Add Games
                </div>
              </div>
            </div>
          </div>
          <div>
            <div>
              <div>
                <input
                  className="outline-0 border border-neutral-700 m-8 w-90 h-10 text-sm rounded-lg pl-2"
                  placeholder="Search Games..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 grid-cols-1 gap-25 m-10 mr-25">
              {games
                ?.filter((game) =>
                  game.Name?.toLowerCase()?.includes(search.toLowerCase())
                )
                ?.map((game) => (
                  <div
                    key={game.id}
                    className="border border-neutral-700 p-2 rounded-xl h-max"
                  >
                    <div>
                      <div>
                        {Array.isArray(game?.Image_Url) &&
                          game.Image_Url.length > 0 && (
                            <Carousel
                              opts={{ align: "center" }}
                              orientation="horizontal"
                              className="w-full max-w-xs"
                            >
                              <CarouselContent>
                                {game.Image_Url.map((img, index) => (
                                  <CarouselItem key={index}>
                                    <div className="p-1 flex items-center justify-center m-5">
                                      <Image
                                        src={ImgurConv(img)}
                                        alt={`image-${index}`}
                                        width={250}
                                        height={250}
                                        className="object-contain rounded-xl"
                                      />
                                    </div>
                                  </CarouselItem>
                                ))}
                              </CarouselContent>
                              <CarouselPrevious />
                              <CarouselNext />
                            </Carousel>
                          )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 justify-around text-xl">
                          <div>{game.Name}</div>
                          <div className="flex items-center">
                            {game.discountedPrice ? (
                              <div className="flex items-end gap-2 relative">
                                <div className="text-xs line-through">
                                  {game.Price}
                                </div>
                                <div>{game.discountedPrice}rsd</div>
                                <div className="text-xs absolute bottom-5 left-30 border border-purple-400 bg-purple-400 rounded-full w-7 h-7 flex justify-center items-center">
                                  {game.discount}%
                                </div>
                              </div>
                            ) : (
                              <div>{game.Price}rsd</div>
                            )}
                          </div>
                        </div>
                        <div>
                          <div className="text-center text-lg mt-5 border border-neutral-600 bg-neutral-600 p-2 rounded-lg">
                            {game.Platform?.join(", ")}
                          </div>
                          <div className="text-center text-lg mt-5 border border-neutral-600 bg-neutral-600 p-2 rounded-lg">
                            {game.Type?.join(", ")}
                          </div>
                          <div className="flex items-center justify-center">
                            <div className="text-center text-lg mt-5 border border-neutral-600 bg-neutral-600 p-2 rounded-lg w-40">
                              {game.Genres?.join(", ")}
                            </div>
                          </div>
                          <div className="text-center text-lg mt-5 border border-neutral-600 bg-neutral-600 p-2 rounded-lg hover:scale-110 active:scale-100 transition-all">
                            View Games
                          </div>
                          {edit === game.id ? (
                            <div>
                              {getDisc === game.id ? (
                                <div>
                                  <div className="mt-5">
                                    <div className="text-center text-lg">
                                      Setup discount
                                    </div>
                                    <div className="flex items-center justify-center mt-2">
                                      <div className="flex gap-2">
                                        <input
                                          value={discPrice}
                                          onChange={(e) =>
                                            setDiscPrice(Number(e.target.value))
                                          }
                                          className="outline-0 w-20 border border-neutral-600 text-center  rounded-lg h-10"
                                        />
                                        <div className="relative">
                                          <input
                                            value={discount}
                                            onChange={(e) => {
                                              const val = Number(
                                                e.target.value
                                              );
                                              setDiscount(val);
                                              setDiscPrice(
                                                totalPrice(game.Price, val)
                                              );
                                            }}
                                            className="outline-0 w-20 border border-neutral-600 text-center  rounded-lg h-10"
                                          />
                                          <div className="absolute right-2 top-1/2 -translate-y-1/2">
                                            %
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div
                                      className="mt-3 text-center"
                                      onClick={() => AddDisc(game)}
                                    >
                                      Confirm
                                    </div>
                                    {game.discountedPrice ? (
                                      <div
                                        onClick={() => RemoveDisc(game)}
                                        className="text-center mt-2"
                                      >
                                        Remove
                                      </div>
                                    ) : (
                                      <></>
                                    )}
                                    <div className="flex items-center justify-center mt-2">
                                      <div
                                        onClick={() => setGetDisc(null)}
                                        className="text-center text-lg w-max"
                                      >
                                        Back
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div>
                                  <div className="mt-5">
                                    <div
                                      className="text-center text-lg"
                                      onClick={() => setGetDisc(game.id)}
                                    >
                                      Setup discount
                                    </div>
                                    <div className="flex items-center justify-center mt-2">
                                      <div
                                        onClick={() => setEdit(null)}
                                        className="text-center text-lg w-max"
                                      >
                                        Back
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div>
                              <div className="flex items-center gap-5 justify-center mt-5">
                                <div>
                                  <Trash
                                    size={23}
                                    className="hover:scale-105 active:scale-95 hover:text-red-500 transition-all"
                                  />
                                </div>
                                <div>
                                  <Edit
                                    size={23}
                                    className="hover:scale-105 active:scale-95 hover:text-blue-500 transition-all"
                                    onClick={() => setEdit(game.id)}
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
