"use client";

import Image from "next/image";
import Titan from "@/public/titans.jpg";
import { AnimatePresence, motion } from "framer-motion";
import {
  BrushCleaning,
  Delete,
  Search,
  ShoppingBag,
  User2,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/app/supabaseClient";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavBar() {
  const [show, setShow] = useState(false);
  const [search, setSearch] = useState("");
  const [showI, setShowI] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const path = usePathname();

  useEffect(() => {
    const Getuser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);
    };

    Getuser();
  });

  if (path === "/Account") return <></>;

  return (
    <div>
      <div className="md:hidden">
        <motion.div
          initial={{ x: -25, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="md:hidden flex items-center justify-center gap-5 m-5 text-sm"
        >
          <div className="text-neutral-400">Contact</div>
          <div className="text-neutral-400">Support</div>
          {user?.email === "akidimke136@gmail.com" &&
          "dimicmateja685@gmail.com" ? (
            <div>
              <Link href="/Admin">
                <motion.div className="text-neutral-400">Admin</motion.div>
              </Link>
            </div>
          ) : (
            <></>
          )}
        </motion.div>
        {showI ? (
          <div className="flex items-center justify-center border-b-3 border-b-neutral-600">
            <div className="relative w-full m-5">
              <motion.input
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full outline-0 border-2 border-neutral-600 h-10 rounded-lg text-sm pl-2"
                placeholder="Search Any..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Delete size={20} onClick={() => setSearch("")} />
                  </div>
                </>
              )}
            </div>
            <X size={25} onClick={() => setShowI(!showI)} className="mr-5" />
          </div>
        ) : (
          <div>
            {" "}
            <div className="flex justify-between items-center border-b-3 border-b-neutral-600">
              <Link href="/">
                <motion.div
                  style={{ transformStyle: "preserve-3d" }}
                  whileHover={{
                    rotateX: -20,
                    rotateY: 20,
                    scale: 1.2,
                    y: -10,
                  }}
                  whileTap={{
                    rotateX: -15,
                    rotateY: 15,
                    scale: 1.15,
                    y: -8,
                  }}
                  initial={{ y: -25, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 150,
                    damping: 10,
                  }}
                  className="flex items-center gap-2 ml-5 cursor-pointer"
                >
                  <Image
                    src={Titan}
                    alt=""
                    width={40}
                    className="rounded-full"
                  />
                  <div>Titan</div>
                </motion.div>
              </Link>
              <div className="flex items-center m-5 gap-5">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1.5, delay: 0.3 }}
                  onClick={() => setShowI(!showI)}
                  className="cursor-pointer border border-neutral-600 bg-neutral-600 shadow-md shadow-neutral-600 transition-all w-10 h-10 rounded-xl flex items-center justify-center"
                >
                  <Search size={20} />
                </motion.div>
                {user?.email ? (
                  <div>
                    <Link href="/Profile">
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1.5, delay: 0.5 }}
                        className="cursor-pointer border border-neutral-600 hover:bg-neutral-600 hover:shadow-lg hover:shadow-neutral-600 w-10 h-10 rounded-xl flex items-center justify-center"
                      >
                        <User2 size={20} />
                      </motion.div>
                    </Link>
                  </div>
                ) : (
                  <div>
                    <Link href="/Account">
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1.5, delay: 0.5 }}
                        className="cursor-pointer border border-neutral-600 hover:bg-neutral-600 hover:shadow-lg hover:shadow-neutral-600 w-10 h-10 rounded-xl flex items-center justify-center"
                      >
                        <User2 size={20} />
                      </motion.div>
                    </Link>
                  </div>
                )}
                <div className="relative transition-all">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.5, delay: 0.7 }}
                    onClick={() => setShow(!show)}
                    className={`cursor-pointer border border-neutral-600 ${
                      show
                        ? "bg-neutral-600 shadow-md shadow-neutral-600"
                        : " bg-transparent"
                    }  transition-all w-10 h-10 rounded-xl flex items-center justify-center`}
                  >
                    <ShoppingBag size={20} />
                    {show ? (
                      <></>
                    ) : (
                      <div>
                        <div className="absolute bottom-6 left-6 bg-purple-400 w-5 h-5 text-sm rounded-full text-center flex items-center justify-center">
                          1
                        </div>
                      </div>
                    )}
                  </motion.div>
                  <AnimatePresence>
                    {show ? (
                      <motion.div
                        key="cart"
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 20, opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex items-center justify-center h-50 w-80 rounded-xl z-50 absolute top-18 right-0 border border-neutral-600 bg-neutral-600"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            Cart is Empty <BrushCleaning size={20} />
                          </div>
                          <div className="absolute bottom-4 right-4 text-sm">
                            Show Cart
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <></>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <motion.div
        initial={{ x: -25, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="md:flex hidden items-center justify-center gap-5 m-5"
      >
        <motion.div
          whileHover={{ rotateX: 30, rotateY: 15, y: -2 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 150, damping: 10 }}
          className="hover:scale-110 hover:text-neutral-300 cursor-pointer"
        >
          Contact
        </motion.div>
        <motion.div
          whileHover={{ rotateX: 30, rotateY: 15, y: -2 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 150, damping: 10 }}
          className="hover:scale-110 hover:text-neutral-300 cursor-pointer"
        >
          Support
        </motion.div>
        {user?.email === "akidimke136@gmail.com" &&
        "dimicmateja685@gmail.com" ? (
          <div>
            <Link href="/Admin">
              <motion.div
                whileHover={{ rotateX: 30, rotateY: 15, y: -2 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 150, damping: 10 }}
                className="hover:scale-110 hover:text-neutral-300 cursor-pointer"
              >
                Admin
              </motion.div>
            </Link>
          </div>
        ) : (
          <></>
        )}
      </motion.div>
      <div className="md:flex hidden justify-between items-center border-b-3 border-b-neutral-600">
        <Link href="/">
          <motion.div
            style={{ transformStyle: "preserve-3d" }}
            whileHover={{
              rotateX: -20,
              rotateY: 20,
              scale: 1.2,
              y: -10,
            }}
            whileTap={{
              rotateX: -15,
              rotateY: 15,
              scale: 1.15,
              y: -8,
            }}
            initial={{ x: -25, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 150,
              damping: 10,
            }}
            className="flex items-center gap-2 ml-5 cursor-pointer"
          >
            <Image src={Titan} alt="" width={40} className="rounded-full" />
            <div>Titan</div>
          </motion.div>
        </Link>
        <div className="flex items-center">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.2 }}
            className="border border-neutral-600 hover:bg-neutral-600 hover:shadow-lg hover:shadow-neutral-600 hover:scale-110 active:scale-100 w-10 h-10 rounded-l-xl flex items-center justify-center"
          >
            <Search size={20} />
          </motion.div>
          <div className="relative">
            <motion.input
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 1.5, delay: 0.5 }}
              className={`select-none outline-0 pl-2 h-10 text-sm rounded-r-xl lg:w-[700px] w-[450px]  border border-neutral-600`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Any..."
            />
            {search && (
              <>
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Delete size={20} onClick={() => setSearch("")} />
                </div>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center m-5 gap-5">
          {user?.email ? (
            <div>
              <Link href="/Profile">
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 1.5, delay: 0.8 }}
                  className="cursor-pointer border border-neutral-600 hover:bg-neutral-600 hover:shadow-lg hover:shadow-neutral-600 w-10 h-10 rounded-xl flex items-center justify-center"
                >
                  <User2 size={20} />
                </motion.div>
              </Link>
            </div>
          ) : (
            <div>
              <Link href="/Account">
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 1.5, delay: 0.8 }}
                  className="cursor-pointer border border-neutral-600 hover:bg-neutral-600 hover:shadow-lg hover:shadow-neutral-600 w-10 h-10 rounded-xl flex items-center justify-center"
                >
                  <User2 size={20} />
                </motion.div>
              </Link>
            </div>
          )}
          <div className="relative transition-all">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 1.5, delay: 1.1 }}
              onClick={() => setShow(!show)}
              className={`cursor-pointer border border-neutral-600 ${
                show ? "bg-neutral-600 shadow-lg shadow-neutral-600" : ""
              } hover:shadow-lg hover:shadow-neutral-600 w-10 h-10 rounded-xl flex items-center justify-center`}
            >
              <ShoppingBag size={20} />
              {show ? (
                <></>
              ) : (
                <div>
                  <div className="absolute bottom-6 left-6 bg-purple-400 w-5 h-5 text-sm rounded-full text-center flex items-center justify-center">
                    1
                  </div>
                </div>
              )}
            </motion.div>
            <AnimatePresence>
              {show ? (
                <motion.div
                  key="cart"
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex items-center justify-center h-50 w-80 rounded-xl z-50 absolute top-18 right-0 border border-neutral-600 bg-neutral-600"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      Cart is Empty <BrushCleaning size={20} />
                    </div>
                    <div className="absolute bottom-4 right-4 text-sm">
                      Show Cart
                    </div>
                  </div>
                </motion.div>
              ) : (
                <></>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
