"use client";

import { User } from "@supabase/supabase-js";
import Image from "next/image";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Edit, Heart, LogOut, Save } from "lucide-react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import titan from "@/public/titans.jpg";

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [newEmail, setNewEmail] = useState("");
  const [name, setName] = useState("");
  const [change, setChange] = useState<string | null>(null);
  const [convert, setConvert] = useState(false);

  useEffect(() => {
    const Getuser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);
    };

    Getuser();
  });

  async function ChangeEmail() {
    const { data, error } = await supabase.auth.updateUser({
      email: newEmail,
    });
    if (data) console.log(data);
    if (error) console.log(error);
    setNewEmail("");
    setChange(null);
  }

  async function ChangeUsername() {
    const { data, error } = await supabase.auth.updateUser({
      data: {
        full_name: name,
      },
    });
    if (data) console.log(data);
    if (error) console.log(error);
    setName("");
    setChange(null);
  }

  async function Logout() {
    const { error } = await supabase.auth.signOut();
    if (error) console.log(error);
  }

  return (
    <div>
      <div className="md:hidden">
        <div className="flex flex-col items-center justify-between w-full">
          <div className="flex flex-col items-center">
            <div className="text-2xl m-10">Profile</div>
            <div className="flex flex-col items-center gap-5">
              <motion.div>
                {user === null ? (
                  <Skeleton className="ml-10 w-[130px] h-[130px] rounded-4xl" />
                ) : (
                  <div>
                    {user?.user_metadata?.avatar_url && (
                      <div className="ml-10 flex items-end gap-2">
                        <Image
                          src={user?.user_metadata?.avatar_url}
                          alt=""
                          width={130}
                          height={130}
                          className="rounded-4xl"
                        />
                        <motion.div></motion.div>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
              <div className="flex flex-col items-center gap-5">
                {change === (user?.email ?? "") ? (
                  <div>
                    <div>
                      <motion.div
                        initial={{ y: -5, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 1 }}
                      >
                        Email: {newEmail || user?.new_email || user?.email}
                      </motion.div>
                      <div className="flex items-center gap-2 mt-5">
                        <motion.input
                          initial={{ y: -5, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ duration: 1, delay: 0.2 }}
                          className="outline-0 border border-neutral-800 p-2 text-sm h-10 w-50 rounded-lg pl-2"
                          placeholder={user?.new_email || user?.email}
                          value={newEmail}
                          onChange={(e) => setNewEmail(e.target.value)}
                        />
                        <motion.div
                          initial={{ y: -5, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ duration: 1, delay: 0.4 }}
                          onClick={() => {
                            setChange(null);
                            setNewEmail("");
                          }}
                          className="border border-neutral-800 p-2 rounded-lg cursor-pointer"
                        >
                          Back
                        </motion.div>
                        <motion.div
                          initial={{ y: -5, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ duration: 1, delay: 0.6 }}
                          onClick={ChangeEmail}
                          className="border border-neutral-800 p-2 rounded-lg cursor-pointer"
                        >
                          Change
                        </motion.div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <motion.div
                      initial={{ y: -10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 1 }}
                      className="flex items-center gap-5"
                    >
                      {user === null ? (
                        <Skeleton className="h-5 w-75 rounded-md" />
                      ) : (
                        <>
                          Email: {user?.new_email || user?.email}
                          <Edit
                            size={20}
                            onClick={() => setChange(user?.email ?? "")}
                          />
                        </>
                      )}
                    </motion.div>
                  </div>
                )}
                <motion.div
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 1 }}
                >
                  {user === null ? (
                    <Skeleton className="h-5 w-40 rounded-md" />
                  ) : (
                    <div>
                      {change === (user?.user_metadata?.full_name ?? "") ? (
                        <div>
                          <div>
                            <motion.div
                              initial={{ y: -5, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ duration: 1 }}
                            >
                              Fullname: {name || user?.user_metadata?.full_name}
                            </motion.div>
                            <div className="flex items-center gap-2 mt-5">
                              <motion.input
                                initial={{ y: -5, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 1, delay: 0.2 }}
                                className="outline-0 border border-neutral-800 p-2 text-sm h-10 w-50 rounded-lg pl-2"
                                placeholder={user?.user_metadata?.full_name}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                              />
                              <motion.div
                                initial={{ y: -5, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 1, delay: 0.4 }}
                                onClick={() => {
                                  setChange(null);
                                  setName("");
                                }}
                                className="border border-neutral-800 p-2 rounded-lg cursor-pointer"
                              >
                                Back
                              </motion.div>
                              <motion.div
                                initial={{ y: -5, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 1, delay: 0.6 }}
                                onClick={ChangeUsername}
                                className="border border-neutral-800 p-2 rounded-lg cursor-pointer"
                              >
                                Change
                              </motion.div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-center gap-5">
                            Fullname: {name || user?.user_metadata?.full_name}
                            <Edit
                              size={20}
                              onClick={() =>
                                setChange(user?.user_metadata?.full_name ?? "")
                              }
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
                <div>
                  <motion.div
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 1 }}
                  >
                    {user === null ? (
                      <div>
                        <Skeleton className="h-5 w-20 rounded-md" />
                        {!user && (
                          <div
                            className="text-center mt-2 cursor-pointer"
                            onClick={() => router.push("/Account")}
                          >
                            Signin
                          </div>
                        )}
                      </div>
                    ) : (
                      <div
                        onClick={Logout}
                        className="flex items-center gap-2 hover:text-red-500"
                      >
                        Logout <LogOut size={20} />
                      </div>
                    )}
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-15">
            <div className="flex flex-col items-center gap-4">
              <div>
                <Image
                  src={titan}
                  alt=""
                  width={100}
                  height={100}
                  className="rounded-4xl"
                />
              </div>
              <div className="text-center text-lg">
                Titan point{" "}
                <div>
                  {convert ? (
                    <div>
                      {" "}
                      <div
                        onClick={() => setConvert(!convert)}
                        className="text-md text-center border border-purple-500 rounded-lg m-2 p-2"
                      >
                        1 P - 1 rsd
                      </div>
                    </div>
                  ) : (
                    <div>
                      {" "}
                      <div
                        onClick={() => setConvert(!convert)}
                        className="text-md text-center border border-purple-500 rounded-lg m-2 p-2"
                      >
                        {"1000 P"}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-15">
            <div className="flex flex-col items-center gap-4">
              <div className="border border-neutral-700 p-2 flex flex-col items-center gap-2 w-40 rounded-xl bg-neutral-700">
                <div className="flex items-center gap-2">
                  Saved <Save size={15} />
                </div>
                <div className="border border-neutral-600 w-10 h-10 rounded-full bg-neutral-600 flex items-center justify-center">
                  0
                </div>
              </div>
              <div className="border border-neutral-700 p-2 flex flex-col items-center gap-2 w-40 rounded-xl bg-neutral-700">
                <div className="flex items-center gap-2">
                  Liked <Heart size={15} />
                </div>
                <div className="border border-neutral-600 w-10 h-10 rounded-full bg-neutral-600 flex items-center justify-center">
                  0
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="md:flex hidden">
        <div className="flex items-center justify-between w-full">
          <div>
            <div className="text-2xl m-10">Profile</div>
            <div className="flex items-start gap-5">
              <motion.div>
                {user === null ? (
                  <Skeleton className="ml-10 w-[130px] h-[130px] rounded-4xl" />
                ) : (
                  <div className="ml-10">
                    <div>
                      {user?.user_metadata?.avatar_url && (
                        <div className="flex items-end gap-2">
                          <Image
                            src={user.user_metadata.avatar_url}
                            alt="Avatar"
                            width={130}
                            height={130}
                            className="rounded-4xl"
                          />
                          <motion.div></motion.div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
              <div className="flex flex-col items-center gap-5">
                {change === (user?.email ?? "") ? (
                  <div>
                    <div>
                      <motion.div
                        initial={{ y: -5, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 1 }}
                      >
                        Email: {newEmail || user?.new_email || user?.email}
                      </motion.div>
                      <div className="flex items-center gap-2 mt-5">
                        <motion.input
                          initial={{ y: -5, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ duration: 1, delay: 0.2 }}
                          className="outline-0 border border-neutral-800 p-2 text-sm h-10 w-90 rounded-lg pl-2"
                          placeholder={user?.new_email || user?.email}
                          value={newEmail}
                          onChange={(e) => setNewEmail(e.target.value)}
                        />
                        <motion.div
                          initial={{ y: -5, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ duration: 1, delay: 0.4 }}
                          onClick={() => {
                            setChange(null);
                            setNewEmail("");
                          }}
                          className="border border-neutral-800 p-2 rounded-lg cursor-pointer"
                        >
                          Back
                        </motion.div>
                        <motion.div
                          initial={{ y: -5, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ duration: 1, delay: 0.6 }}
                          onClick={ChangeEmail}
                          className="border border-neutral-800 p-2 rounded-lg cursor-pointer"
                        >
                          Change
                        </motion.div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <motion.div
                      initial={{ y: -10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 1 }}
                      className="flex items-center gap-5"
                    >
                      {user === null ? (
                        <Skeleton className="h-5 w-75 rounded-md" />
                      ) : (
                        <>
                          Email: {user?.new_email || user?.email}
                          <Edit
                            size={20}
                            onClick={() => setChange(user?.email ?? "")}
                          />
                        </>
                      )}
                    </motion.div>
                  </div>
                )}
                <motion.div
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 1 }}
                >
                  {user === null ? (
                    <Skeleton className="h-5 w-40 rounded-md" />
                  ) : (
                    <div>
                      {change === (user?.user_metadata?.full_name ?? "") ? (
                        <div>
                          <div>
                            <motion.div
                              initial={{ y: -5, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ duration: 1 }}
                            >
                              Fullname: {name || user?.user_metadata?.full_name}
                            </motion.div>
                            <div className="flex items-center gap-2 mt-5">
                              <motion.input
                                initial={{ y: -5, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 1, delay: 0.2 }}
                                className="outline-0 border border-neutral-800 p-2 text-sm h-10 w-90 rounded-lg pl-2"
                                placeholder={user?.user_metadata?.full_name}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                              />
                              <motion.div
                                initial={{ y: -5, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 1, delay: 0.4 }}
                                onClick={() => {
                                  setChange(null);
                                  setName("");
                                }}
                                className="border border-neutral-800 p-2 rounded-lg cursor-pointer"
                              >
                                Back
                              </motion.div>
                              <motion.div
                                initial={{ y: -5, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 1, delay: 0.6 }}
                                onClick={ChangeUsername}
                                className="border border-neutral-800 p-2 rounded-lg cursor-pointer"
                              >
                                Change
                              </motion.div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-center gap-5">
                            Fullname: {name || user?.user_metadata?.full_name}
                            <Edit
                              size={20}
                              onClick={() =>
                                setChange(user?.user_metadata?.full_name ?? "")
                              }
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
                <div>
                  <motion.div
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 1 }}
                  >
                    {user === null ? (
                      <div>
                        <Skeleton className="h-5 w-20 rounded-md" />
                        {!user && (
                          <div
                            className="text-center mt-2 cursor-pointer"
                            onClick={() => router.push("/Account")}
                          >
                            Signin
                          </div>
                        )}
                      </div>
                    ) : (
                      <div
                        onClick={Logout}
                        className="flex items-center gap-2 hover:text-red-500"
                      >
                        Logout <LogOut size={20} />
                      </div>
                    )}
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-15">
            <div className="flex flex-col items-center gap-4">
              <div>
                <Image
                  src={titan}
                  alt=""
                  width={100}
                  height={100}
                  className="rounded-4xl"
                />
              </div>
              <div className="text-center text-lg">
                Titan point{" "}
                <div>
                  {convert ? (
                    <div>
                      {" "}
                      <div
                        onClick={() => setConvert(!convert)}
                        className="text-md text-center border border-purple-500 rounded-lg m-2 p-2"
                      >
                        1 P - 1 rsd
                      </div>
                    </div>
                  ) : (
                    <div>
                      {" "}
                      <div
                        onClick={() => setConvert(!convert)}
                        className="text-md text-center border border-purple-500 rounded-lg m-2 p-2"
                      >
                        {"1000 P"}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-15 mr-10">
            <div className="flex flex-col items-center gap-4">
              <div className="border border-neutral-700 p-2 flex flex-col items-center gap-2 w-40 rounded-xl bg-neutral-700">
                <div className="flex items-center gap-2">
                  Saved <Save size={15} />
                </div>
                <div className="border border-neutral-600 w-10 h-10 rounded-full bg-neutral-600 flex items-center justify-center">
                  0
                </div>
              </div>
              <div className="border border-neutral-700 p-2 flex flex-col items-center gap-2 w-40 rounded-xl bg-neutral-700">
                <div className="flex items-center gap-2">
                  Liked <Heart size={15} />
                </div>
                <div className="border border-neutral-600 w-10 h-10 rounded-full bg-neutral-600 flex items-center justify-center">
                  0
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
