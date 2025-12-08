"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Trash } from "lucide-react";
import { User } from "next-auth";
import { useGuestID } from "../GuestProvider";

interface Cart {
  id: number;
  created_at: Date;
  Name: string;
  Price: number;
  quantity: number;
  discountedPrice: number;
  Image_Url: string;
}
export default function Home() {
  const [carts, setCarts] = useState<Cart[] | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [change1, setChange1] = useState(false);
  const [change, setChange] = useState<number | null>(null);
  const guestID = useGuestID();

  useEffect(() => {
    const getGames = async () => {
      const cartUserID = user?.id || guestID;
      if (!cartUserID) return;

      const { data } = await supabase
        .from("Cart")
        .select("*")
        .eq("user_id", cartUserID);

      setCarts(data);
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

  async function DeleteCart(id: number) {
    const { error } = await supabase
      .from("Cart")
      .delete()
      .select("*")
      .eq("id", id)
      .single();

    if (error) console.log(error);
  }
  return (
    <div>
      <div className="md:hidden">
        <div className="flex flex-col ml-5 mb-10">
          <div className="text-2xl m-10">Cart</div>
          <div className="flex items-end gap-2">
            <div className="text-xl flex items-center gap-2 w-40">
              Price:{" "}
              {change1 ? (
                <div className="flex items-end gap-2 w-40 border border-neutral-700 px-5 bg-neutral-700 rounded-lg py-2">
                  {carts?.reduce(
                    (sum, cart) =>
                      sum + Math.floor((cart.Price * cart.quantity) / 117),
                    0
                  ) || 0}
                  €
                  <div className="text-xs" onClick={() => setChange1(!change1)}>
                    RSD
                  </div>
                </div>
              ) : (
                <div className="flex items-end gap-2 w-40 border border-neutral-700 px-5 bg-neutral-700 rounded-lg py-2">
                  {carts
                    ?.reduce((sum, cart) => sum + cart.Price * cart.quantity, 0)
                    .toLocaleString("de-DE") || 0}
                  rsd
                  <div className="text-xs" onClick={() => setChange1(!change1)}>
                    EUR
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center mr-10">
          <div className="border border-neutral-600 p-2 rounded-xl w-80 h-100 overflow-y-scroll flex flex-col gap-2">
            {carts?.map((cart) => (
              <div key={cart.id}>
                <div className="relative border border-neutral-800 p-2 py-5 rounded-lg bg-neutral-800 flex flex-col gap-3">
                  <div className="flex items-center justify-center">
                    {cart.Image_Url && (
                      <div>
                        <Image
                          src={ImgurConv(cart.Image_Url)}
                          alt=""
                          width={150}
                          height={100}
                          className="rounded-xl"
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 mb-5">
                    <div className="text-xl text-center">{cart.Name}</div>
                    <div>
                      {cart.discountedPrice ? (
                        <div className="flex items-center gap-2 text-xl">
                          <div className="flex items-center gap-2">
                            {cart.quantity}x
                            {change === cart.id ? (
                              <div>
                                {Math.floor(cart.discountedPrice / 117)}€
                              </div>
                            ) : (
                              <div> {Math.floor(cart.discountedPrice)}rsd</div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="text-xl flex items-center gap-2">
                          {cart.quantity}x
                          {change === cart.id ? (
                            <div>{Math.floor(cart.Price / 117)}€</div>
                          ) : (
                            <div>{cart.Price}rsd</div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-5 justify-center">
                    <div className="flex items-center gap-2 w-40">
                      Total:{" "}
                      {change === cart.id ? (
                        <div className="flex items-end gap-2">
                          {cart.discountedPrice
                            ? Math.floor(
                                (cart.discountedPrice * cart.quantity) / 117
                              )
                            : Math.floor((cart.Price * cart.quantity) / 117)}
                          €
                          <div
                            className="text-xs"
                            onClick={() => setChange(null)}
                          >
                            RSD
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-end gap-2">
                          {(cart.discountedPrice
                            ? cart.discountedPrice * cart.quantity
                            : cart.Price * cart.quantity
                          ).toLocaleString("de-DE")}
                          rsd
                          <div
                            className="text-xs"
                            onClick={() => setChange(cart.id)}
                          >
                            EUR
                          </div>
                        </div>
                      )}
                    </div>
                    <div
                      onClick={() => DeleteCart(cart.id)}
                      className="hover:text-red-500 transition-colors cursor-pointer"
                    >
                      <Trash size={20} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="md:flex hidden flex-col">
        <div className="flex items-center justify-around w-full">
          <div className="text-2xl m-10">Cart</div>
          <div className="flex items-end gap-2">
            <div className="text-xl flex items-center gap-2 w-40">
              Price:{" "}
              {change1 ? (
                <div className="flex items-end gap-2 w-40 border border-neutral-700 px-5 bg-neutral-700 rounded-lg py-2">
                  {carts?.reduce(
                    (sum, cart) =>
                      sum + Math.floor((cart.Price * cart.quantity) / 117),
                    0
                  ) || 0}
                  €
                  <div className="text-xs" onClick={() => setChange1(!change1)}>
                    RSD
                  </div>
                </div>
              ) : (
                <div className="flex items-end gap-2 w-40 border border-neutral-700 px-5 bg-neutral-700 rounded-lg py-2">
                  {carts
                    ?.reduce((sum, cart) => sum + cart.Price * cart.quantity, 0)
                    .toLocaleString("de-DE") || 0}
                  rsd
                  <div className="text-xs" onClick={() => setChange1(!change1)}>
                    EUR
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <div className="border border-neutral-600 p-2 rounded-xl w-220 h-100 overflow-y-scroll flex flex-col gap-2">
            {carts?.map((cart) => (
              <div key={cart.id}>
                <div className="relative mt-5 ml-5 border border-neutral-800 p-2 py-5 rounded-lg bg-neutral-800 flex items-center gap-3">
                  <div>
                    {cart.Image_Url && (
                      <div>
                        <Image
                          src={ImgurConv(cart.Image_Url)}
                          alt=""
                          width={150}
                          height={100}
                          className="rounded-xl"
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="text-xl">{cart.Name}</div>
                    <div>
                      {cart.discountedPrice ? (
                        <div className="flex items-center gap-2 text-xl">
                          <div className="flex items-center gap-2">
                            {cart.quantity}x
                            {change === cart.id ? (
                              <div>
                                {Math.floor(cart.discountedPrice / 117)}€
                              </div>
                            ) : (
                              <div> {Math.floor(cart.discountedPrice)}rsd</div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="text-xl flex items-center gap-2">
                          {cart.quantity}x
                          {change === cart.id ? (
                            <div>{Math.floor(cart.Price / 117)}€</div>
                          ) : (
                            <div>{cart.Price}rsd</div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-5 absolute right-5 bottom-2">
                    <div className="flex items-center gap-2 w-40">
                      Total:{" "}
                      {change === cart.id ? (
                        <div className="flex items-end gap-2">
                          {cart.discountedPrice
                            ? Math.floor(
                                (cart.discountedPrice * cart.quantity) / 117
                              )
                            : Math.floor((cart.Price * cart.quantity) / 117)}
                          €
                          <div
                            className="text-xs"
                            onClick={() => setChange(null)}
                          >
                            RSD
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-end gap-2">
                          {(cart.discountedPrice
                            ? cart.discountedPrice * cart.quantity
                            : cart.Price * cart.quantity
                          ).toLocaleString("de-DE")}
                          rsd
                          <div
                            className="text-xs"
                            onClick={() => setChange(cart.id)}
                          >
                            EUR
                          </div>
                        </div>
                      )}
                    </div>
                    <div
                      onClick={() => DeleteCart(cart.id)}
                      className="hover:text-red-500 transition-colors cursor-pointer"
                    >
                      <Trash size={20} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
