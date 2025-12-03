"use client";

import { Delete, HomeIcon, Lock, LockOpen, Mail, User2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import google from "@/public/google.png";
import github from "@/public/github.png";
import { supabase } from "@/app/supabaseClient";
import { useRouter } from "next/navigation";

export default function Home() {
  const [change, setChange] = useState(false);
  const [email, setEmail] = useState("");
  const [emailerr, setEmailErr] = useState("");
  const [email1, setEmail1] = useState("");
  const [emailerr1, setEmailErr1] = useState("");
  const [password, setPassword] = useState("");
  const [passerr, setPassErr] = useState("");
  const [password1, setPassword1] = useState("");
  const [passerr1, setPassErr1] = useState("");
  const [first, setFirst] = useState("");
  const [firsterr, setFirstErr] = useState("");
  const [show, setShow] = useState(false);
  const router = useRouter();

  useEffect(() => {
    getError();
  });

  useEffect(() => {
    getError1();
  });

  const getError = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email === "") {
      setEmailErr("Enter Email!");
    } else if (!emailRegex.test(email)) {
      setEmailErr("Enter Valid Email!");
    } else {
      setEmailErr("");
    }

    if (password === "") {
      setPassErr("Enter Password!");
    } else if (password.length <= 8) {
      setPassErr("Enter Stronger Password!");
    } else {
      setPassErr("");
    }
  };

  const getError1 = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (first === "") {
      setFirstErr("Enter Username!");
    } else {
      setFirstErr("");
    }

    if (email1 === "") {
      setEmailErr1("Enter Email!");
    } else if (!emailRegex.test(email1)) {
      setEmailErr1("Enter Valid Email!");
    } else {
      setEmailErr1("");
    }

    if (password1 === "") {
      setPassErr1("Enter Password!");
    } else if (password1.length <= 8) {
      setPassErr1("Enter Stronger Password!");
    } else {
      setPassErr1("");
    }
  };

  async function GoogleLogin() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `/`,
      },
    });
    router.push("/");
    console.log(data);
    console.log(error);
  }
  async function GithubLogin() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `/`,
      },
    });
    router.push("/");
    console.log(data);
    console.log(error);
  }
  async function Signin() {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      setEmail("");
      setPassword("");
      if (error) {
        console.error("Signup failed:", error.message);
      } else {
        console.log("Signup success:", data);
      }
      router.push("/");
    } catch (err) {
      console.log(err);
    }
  }
  async function Signup() {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email1,
        password: password1,
        options: {
          data: {
            full_name: first,
          },
        },
      });
      setEmail1("");
      setFirst("");
      setPassword1("");
      if (error) {
        console.error("Signup failed:", error.message);
      } else {
        console.log("Signup success:", data);
      }
      router.push("/");
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <div>
      <div className="flex justify-center mt-20">
        <div className="w-[260px] h-[55px] rounded-full border-2 border-neutral-600 flex items-center p-1 relative overflow-hidden">
          <div
            className={`absolute top-1/2 -translate-y-1/2 w-1/2 h-[90%] rounded-full bg-neutral-600 transition-all duration-300 ${
              change ? "translate-x-full right-33" : "translate-x-0 left-1"
            }`}
          ></div>
          <button
            onClick={() => setChange(false)}
            className={`w-1/2 h-full z-10 text-lg transition-all ${
              !change ? "text-white font-semibold" : "text-neutral-300"
            }`}
          >
            Signin
          </button>
          <button
            onClick={() => setChange(true)}
            className={`w-1/2 h-full z-10 text-lg transition-all ${
              change ? "text-white font-semibold" : "text-neutral-300"
            }`}
          >
            Signup
          </button>
        </div>
      </div>
      <div className="md:hidden">
        <div>
          {change ? (
            <div key="signup">
              <div className="border border-neutral-600 p-2 m-10 rounded-lg w-[350px]">
                <div className="ml-5 mt-2">
                  <Link href="/">
                    <motion.div
                      initial={{ x: -5, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      whileHover={{ rotate: -2, rotateY: -5, y: 2 }}
                      transition={{ duration: 1 }}
                      className="flex items-center gap-2"
                    >
                      Back Home
                      <HomeIcon size={15} />
                    </motion.div>
                  </Link>
                </div>
                <motion.div
                  initial={{ x: -5, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{
                    duration: 1,
                    delay: 0.2,
                  }}
                  className="m-10 text-2xl text-center"
                >
                  Signup
                </motion.div>
                <motion.div
                  initial={{ x: -5, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 1, delay: 0.4 }}
                  className="text-center"
                >
                  Welcome, What's up!
                </motion.div>
                <div>
                  <div className="mt-10 m-5">
                    <motion.div
                      initial={{ rotate: 10, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      transition={{ duration: 1, delay: 0.6 }}
                      className="text-xl"
                    >
                      Fullname
                    </motion.div>
                    <div className="flex items-center relative">
                      <motion.div
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 1, delay: 0.8 }}
                        className="absolute left-2 top-6.5"
                      >
                        <User2 size={20} />
                      </motion.div>
                      <motion.input
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 1, delay: 1 }}
                        className="pl-8 outline-0 border border-neutral-600 w-full h-10 text-sm rounded-lg p-2 mt-4 focus:border-neutral-700 focus:ring-2 focus:ring-neutral-700"
                        value={first}
                        onChange={(e) => setFirst(e.target.value)}
                      />
                      {firsterr && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1 }}
                          className="absolute left-0 top-15 text-sm text-red-500"
                        >
                          {firsterr}
                        </motion.div>
                      )}
                      <AnimatePresence>
                        {first && (
                          <>
                            <motion.div
                              initial={{ x: 10, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              exit={{ x: 5, opacity: 0 }}
                              transition={{ duration: 0.5 }}
                              className="absolute right-2 top-6.5"
                            >
                              <Delete size={20} onClick={() => setFirst("")} />
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                  <div className="mt-10 m-5">
                    <motion.div
                      initial={{ rotate: 10, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      transition={{ duration: 1, delay: 1.2 }}
                      className="text-xl"
                    >
                      Email
                    </motion.div>
                    <div className="flex items-center relative">
                      <motion.div
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 1, delay: 1.4 }}
                        className="absolute left-2 top-6.5"
                      >
                        <Mail size={20} />
                      </motion.div>
                      <motion.input
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 1, delay: 1.6 }}
                        className="pl-8 outline-0 border border-neutral-600 w-full h-10 text-sm rounded-lg p-2 mt-4 focus:border-neutral-700 focus:ring-2 focus:ring-neutral-700"
                        value={email1}
                        onChange={(e) => setEmail1(e.target.value)}
                      />
                      {emailerr1 && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 2.2 }}
                          className="absolute left-0 top-15 text-sm text-red-500"
                        >
                          {emailerr1}
                        </motion.div>
                      )}
                      <AnimatePresence>
                        {email1 && (
                          <>
                            <motion.div
                              initial={{ x: 10, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              exit={{ x: 5, opacity: 0 }}
                              transition={{ duration: 0.5 }}
                              className="absolute right-2 top-6.5"
                            >
                              <Delete size={20} onClick={() => setEmail1("")} />
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                  <div className="mt-10 m-5 mb-10">
                    <motion.div
                      initial={{ rotate: 10, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      transition={{ duration: 1, delay: 1.8 }}
                      className="text-xl"
                    >
                      Password
                    </motion.div>
                    <div className="flex items-center relative">
                      <motion.div
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 1, delay: 2 }}
                        className="absolute left-2 top-6.5"
                      >
                        {show ? (
                          <>
                            <LockOpen
                              size={20}
                              onClick={() => setShow(!show)}
                            />
                          </>
                        ) : (
                          <>
                            <Lock size={20} onClick={() => setShow(!show)} />
                          </>
                        )}
                      </motion.div>
                      <motion.input
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 1, delay: 2.2 }}
                        className="pl-8 outline-0 border border-neutral-600 w-full h-10 text-sm rounded-lg p-2 mt-4 focus:border-neutral-700 focus:ring-2 focus:ring-neutral-700"
                        type={show ? "text" : "password"}
                        value={password1}
                        onChange={(e) => setPassword1(e.target.value)}
                      />
                      {passerr1 && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 2.8 }}
                          className="absolute left-0 top-15 text-sm text-red-500"
                        >
                          {passerr1}
                        </motion.div>
                      )}
                      <AnimatePresence>
                        {password1 && (
                          <>
                            <motion.div
                              initial={{ x: 10, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              exit={{ x: 5, opacity: 0 }}
                              transition={{ duration: 0.5 }}
                              className="absolute right-2 top-6.5"
                            >
                              <Delete
                                size={20}
                                onClick={() => setPassword1("")}
                              />
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                  <div className="flex items-center justify-center text-center mb-5">
                    <motion.div
                      onClick={Signup}
                      initial={{ y: -10, rotate: 10, opacity: 0 }}
                      animate={{ y: 0, rotate: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 2.4 }}
                      className="w-[80%] text-lg h-10 rounded-2xl flex items-center justify-center bg-neutral-600"
                    >
                      <div>Signup</div>
                    </motion.div>
                  </div>
                  <motion.div
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 2.6 }}
                    className="flex items-center w-full gap-5 mt-10 mb-10"
                  >
                    <div className="border-t border-neutral-600 w-full"></div>
                    <div>OR</div>
                    <div className="border-t border-neutral-600 w-full"></div>
                  </motion.div>
                  <div className="flex items-center justify-center gap-5 mb-5">
                    <motion.div
                      onClick={GoogleLogin}
                      initial={{ y: -10, rotate: 10, opacity: 0 }}
                      animate={{ y: 0, rotate: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 2.8 }}
                      className="flex items-center justify-center gap-2 border border-neutral-600 p-2 bg-neutral-600 rounded-lg hover:bg-neutral-700 hover:scale-110"
                    >
                      <Image src={google} alt="" width={20} />
                      <div>Google</div>
                    </motion.div>
                    <motion.div
                      onClick={GithubLogin}
                      initial={{ y: -10, rotate: 10, opacity: 0 }}
                      animate={{ y: 0, rotate: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 3 }}
                      className="flex items-center justify-center gap-2 border border-neutral-600 p-2 bg-neutral-600 rounded-lg hover:bg-neutral-700 hover:scale-110"
                    >
                      <Image src={github} alt="" width={20} />
                      <div>Github</div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div key="signin">
              <div className="border border-neutral-600 p-2 m-10 rounded-lg w-[350px]">
                <div className="ml-5 mt-2">
                  <Link href="/">
                    <motion.div
                      initial={{ x: -5, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      whileHover={{ rotate: -2, rotateY: -5, y: 2 }}
                      transition={{ duration: 1 }}
                      className="flex items-center gap-2"
                    >
                      Back Home
                      <HomeIcon size={15} />
                    </motion.div>
                  </Link>
                </div>
                <motion.div
                  initial={{ x: -5, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{
                    duration: 1,
                    delay: 0.2,
                  }}
                  className="m-10 text-2xl text-center"
                >
                  Signin
                </motion.div>
                <motion.div
                  initial={{ x: -5, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 1, delay: 0.4 }}
                  className="text-center"
                >
                  Welcome, back!
                </motion.div>
                <div>
                  <div className="mt-10 m-5">
                    <motion.div
                      initial={{ rotate: 10, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      transition={{ duration: 1, delay: 0.6 }}
                      className="text-xl"
                    >
                      Email
                    </motion.div>
                    <div className="flex items-center relative">
                      <motion.div
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 1, delay: 0.8 }}
                        className="absolute left-2 top-6.5"
                      >
                        <Mail size={20} />
                      </motion.div>
                      <motion.input
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 1, delay: 1 }}
                        className="pl-8 outline-0 border border-neutral-600 w-full h-10 text-sm rounded-lg p-2 mt-4 focus:border-neutral-700 focus:ring-2 focus:ring-neutral-700"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      {emailerr && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1 }}
                          className="absolute left-0 top-15 text-sm text-red-500"
                        >
                          {emailerr}
                        </motion.div>
                      )}
                      <AnimatePresence>
                        {email && (
                          <>
                            <motion.div
                              initial={{ x: 10, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              exit={{ x: 5, opacity: 0 }}
                              transition={{ duration: 0.5 }}
                              className="absolute right-2 top-6.5"
                            >
                              <Delete size={20} onClick={() => setEmail("")} />
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                  <div className="mt-10 m-5 mb-10">
                    <motion.div
                      initial={{ rotate: 10, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      transition={{ duration: 1, delay: 1.2 }}
                      className="text-xl"
                    >
                      Password
                    </motion.div>
                    <div className="flex items-center relative">
                      <motion.div
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 1, delay: 1.4 }}
                        className="absolute left-2 top-6.5"
                      >
                        {show ? (
                          <>
                            <LockOpen
                              size={20}
                              onClick={() => setShow(!show)}
                            />
                          </>
                        ) : (
                          <>
                            <Lock size={20} onClick={() => setShow(!show)} />
                          </>
                        )}
                      </motion.div>
                      <motion.input
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 1, delay: 1.6 }}
                        className="pl-8 outline-0 border border-neutral-600 w-full h-10 text-sm rounded-lg p-2 mt-4 focus:border-neutral-700 focus:ring-2 focus:ring-neutral-700"
                        type={show ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      {passerr && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1.6 }}
                          className="absolute left-0 top-15 text-sm text-red-500"
                        >
                          {passerr}
                        </motion.div>
                      )}
                      <AnimatePresence>
                        {password && (
                          <>
                            <motion.div
                              initial={{ x: 10, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              exit={{ x: 5, opacity: 0 }}
                              transition={{ duration: 0.5 }}
                              className="absolute right-2 top-6.5"
                            >
                              <Delete
                                size={20}
                                onClick={() => setPassword("")}
                              />
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                  <div className="flex items-center justify-center text-center mb-5">
                    <motion.div
                      onClick={Signin}
                      initial={{ y: -10, rotate: 10, opacity: 0 }}
                      animate={{ y: 0, rotate: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 1.8 }}
                      className="w-[80%] text-lg h-10 rounded-2xl flex items-center justify-center bg-neutral-600"
                    >
                      <div>Signin</div>
                    </motion.div>
                  </div>
                  <motion.div
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 2 }}
                    className="flex items-center w-full gap-5 mt-10 mb-10"
                  >
                    <div className="border-t border-neutral-600 w-full"></div>
                    <div>OR</div>
                    <div className="border-t border-neutral-600 w-full"></div>
                  </motion.div>
                  <div className="flex items-center justify-center gap-5 mb-5">
                    <motion.div
                      onClick={GoogleLogin}
                      initial={{ y: -10, rotate: 10, opacity: 0 }}
                      animate={{ y: 0, rotate: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 2.2 }}
                      className="flex items-center justify-center gap-2 border border-neutral-600 p-2 bg-neutral-600 rounded-lg hover:bg-neutral-700 hover:scale-110"
                    >
                      <Image src={google} alt="" width={20} />
                      <div>Google</div>
                    </motion.div>
                    <motion.div
                      onClick={GithubLogin}
                      initial={{ y: -10, rotate: 10, opacity: 0 }}
                      animate={{ y: 0, rotate: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 2.4 }}
                      className="flex items-center justify-center gap-2 border border-neutral-600 p-2 bg-neutral-600 rounded-lg hover:bg-neutral-700 hover:scale-110"
                    >
                      <Image src={github} alt="" width={20} />
                      <div>Github</div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="md:flex hidden">
        <div className="flex items-center justify-center w-full">
          {change ? (
            <div key="signup">
              <div className="border border-neutral-600 p-2 m-10 rounded-lg w-[500px]">
                <div className="ml-5 mt-2">
                  <Link href="/">
                    <motion.div
                      initial={{ x: -5, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      whileHover={{ rotate: -2, rotateY: -5, y: 2 }}
                      transition={{ duration: 1 }}
                      className="flex items-center gap-2"
                    >
                      Back Home
                      <HomeIcon size={15} />
                    </motion.div>
                  </Link>
                </div>
                <motion.div
                  initial={{ x: -5, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{
                    duration: 1,
                    delay: 0.2,
                  }}
                  className="m-10 text-2xl text-center"
                >
                  Signup
                </motion.div>
                <motion.div
                  initial={{ x: -5, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 1, delay: 0.4 }}
                  className="text-center"
                >
                  Welcome, What's up!
                </motion.div>
                <div>
                  <div className="mt-10 ml-5">
                    <motion.div
                      initial={{ rotate: 10, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      transition={{ duration: 1, delay: 0.6 }}
                      className="text-xl"
                    >
                      Fullname
                    </motion.div>
                    <div className="flex items-center relative">
                      <motion.div
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 1, delay: 0.8 }}
                        className="absolute left-2 top-6.5"
                      >
                        <User2 size={20} />
                      </motion.div>
                      <motion.input
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 1, delay: 1 }}
                        className="pl-8 outline-0 border border-neutral-600 w-[95%] h-10 text-sm rounded-lg p-2 mt-4 focus:border-neutral-700 focus:ring-2 focus:ring-neutral-700"
                        value={first}
                        onChange={(e) => setFirst(e.target.value)}
                      />
                      {firsterr && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1 }}
                          className="absolute left-0 top-15 text-sm text-red-500"
                        >
                          {firsterr}
                        </motion.div>
                      )}
                      <AnimatePresence>
                        {first && (
                          <>
                            <motion.div
                              initial={{ x: 10, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              exit={{ x: 5, opacity: 0 }}
                              transition={{ duration: 0.5 }}
                              className="absolute right-8 top-6.5"
                            >
                              <Delete size={20} onClick={() => setFirst("")} />
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                  <div className="mt-10 m-5">
                    <motion.div
                      initial={{ rotate: 10, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      transition={{ duration: 1, delay: 1.2 }}
                      className="text-xl"
                    >
                      Email
                    </motion.div>
                    <div className="flex items-center relative">
                      <motion.div
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 1, delay: 1.4 }}
                        className="absolute left-2 top-6.5"
                      >
                        <Mail size={20} />
                      </motion.div>
                      <motion.input
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 1, delay: 1.6 }}
                        className="pl-8 outline-0 border border-neutral-600 w-full h-10 text-sm rounded-lg p-2 mt-4 focus:border-neutral-700 focus:ring-2 focus:ring-neutral-700"
                        value={email1}
                        onChange={(e) => setEmail1(e.target.value)}
                      />
                      {emailerr1 && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 2.2 }}
                          className="absolute left-0 top-15 text-sm text-red-500"
                        >
                          {emailerr1}
                        </motion.div>
                      )}
                      <AnimatePresence>
                        {email1 && (
                          <>
                            <motion.div
                              initial={{ x: 10, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              exit={{ x: 5, opacity: 0 }}
                              transition={{ duration: 0.5 }}
                              className="absolute right-2 top-6.5"
                            >
                              <Delete size={20} onClick={() => setEmail1("")} />
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                  <div className="mt-10 m-5 mb-10">
                    <motion.div
                      initial={{ rotate: 10, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      transition={{ duration: 1, delay: 1.8 }}
                      className="text-xl"
                    >
                      Password
                    </motion.div>
                    <div className="flex items-center relative">
                      <motion.div
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 1, delay: 2 }}
                        className="absolute left-2 top-6.5"
                      >
                        {show ? (
                          <>
                            <LockOpen
                              size={20}
                              onClick={() => setShow(!show)}
                            />
                          </>
                        ) : (
                          <>
                            <Lock size={20} onClick={() => setShow(!show)} />
                          </>
                        )}
                      </motion.div>
                      <motion.input
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 1, delay: 2.2 }}
                        className="pl-8 outline-0 border border-neutral-600 w-full h-10 text-sm rounded-lg p-2 mt-4 focus:border-neutral-700 focus:ring-2 focus:ring-neutral-700"
                        type={show ? "text" : "password"}
                        value={password1}
                        onChange={(e) => setPassword1(e.target.value)}
                      />
                      {passerr1 && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 2.8 }}
                          className="absolute left-0 top-15 text-sm text-red-500"
                        >
                          {passerr1}
                        </motion.div>
                      )}
                      <AnimatePresence>
                        {password1 && (
                          <>
                            <motion.div
                              initial={{ x: 10, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              exit={{ x: 5, opacity: 0 }}
                              transition={{ duration: 0.5 }}
                              className="absolute right-2 top-6.5"
                            >
                              <Delete
                                size={20}
                                onClick={() => setPassword1("")}
                              />
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                  <div className="flex items-center justify-center text-center mb-5">
                    <motion.div
                      onClick={Signup}
                      initial={{ y: -10, rotate: 10, opacity: 0 }}
                      animate={{ y: 0, rotate: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 2.4 }}
                      className="w-[80%] text-lg h-10 rounded-2xl flex items-center justify-center bg-neutral-600"
                    >
                      <div>Signup</div>
                    </motion.div>
                  </div>
                  <motion.div
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 2.6 }}
                    className="flex items-center w-full gap-5 mt-10 mb-10"
                  >
                    <div className="border-t border-neutral-600 w-full"></div>
                    <div>OR</div>
                    <div className="border-t border-neutral-600 w-full"></div>
                  </motion.div>
                  <div className="flex items-center justify-center gap-5 mb-5">
                    <motion.div
                      onClick={GoogleLogin}
                      initial={{ y: -10, rotate: 10, opacity: 0 }}
                      animate={{ y: 0, rotate: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 2.8 }}
                      className="flex items-center justify-center gap-2 border border-neutral-600 p-2 bg-neutral-600 rounded-lg hover:bg-neutral-700 hover:scale-110"
                    >
                      <Image src={google} alt="" width={20} />
                      <div>Google</div>
                    </motion.div>
                    <motion.div
                      onClick={GithubLogin}
                      initial={{ y: -10, rotate: 10, opacity: 0 }}
                      animate={{ y: 0, rotate: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 3 }}
                      className="flex items-center justify-center gap-2 border border-neutral-600 p-2 bg-neutral-600 rounded-lg hover:bg-neutral-700 hover:scale-110"
                    >
                      <Image src={github} alt="" width={20} />
                      <div>Github</div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div key="signin">
              <div className="border border-neutral-600 p-2 m-10 rounded-lg w-[500px]">
                <div className="ml-5 mt-2">
                  <Link href="/">
                    <motion.div
                      initial={{ x: -5, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      whileHover={{ rotate: -2, rotateY: -5, y: 2 }}
                      transition={{ duration: 1 }}
                      className="flex items-center gap-2"
                    >
                      Back Home
                      <HomeIcon size={15} />
                    </motion.div>
                  </Link>
                </div>
                <motion.div
                  initial={{ x: -5, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{
                    duration: 1,
                    delay: 0.2,
                  }}
                  className="m-10 text-2xl text-center"
                >
                  Signin
                </motion.div>
                <motion.div
                  initial={{ x: -5, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 1, delay: 0.4 }}
                  className="text-center"
                >
                  Welcome, back!
                </motion.div>
                <div>
                  <div className="mt-10 m-5">
                    <motion.div
                      initial={{ rotate: 10, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      transition={{ duration: 1, delay: 0.6 }}
                      className="text-xl"
                    >
                      Email
                    </motion.div>
                    <div className="flex items-center relative">
                      <motion.div
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 1, delay: 0.8 }}
                        className="absolute left-2 top-6.5"
                      >
                        <Mail size={20} />
                      </motion.div>
                      <motion.input
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 1, delay: 1 }}
                        className="pl-8 outline-0 border border-neutral-600 w-full h-10 text-sm rounded-lg p-2 mt-4 focus:border-neutral-700 focus:ring-2 focus:ring-neutral-700"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      {emailerr && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1 }}
                          className="absolute left-0 top-15 text-sm text-red-500"
                        >
                          {emailerr}
                        </motion.div>
                      )}
                      <AnimatePresence>
                        {email && (
                          <>
                            <motion.div
                              initial={{ x: 10, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              exit={{ x: 5, opacity: 0 }}
                              transition={{ duration: 0.5 }}
                              className="absolute right-2 top-6.5"
                            >
                              <Delete size={20} onClick={() => setEmail("")} />
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                  <div className="mt-10 m-5 mb-10">
                    <motion.div
                      initial={{ rotate: 10, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      transition={{ duration: 1, delay: 1.2 }}
                      className="text-xl"
                    >
                      Password
                    </motion.div>
                    <div className="flex items-center relative">
                      <motion.div
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 1, delay: 1.4 }}
                        className="absolute left-2 top-6.5"
                      >
                        {show ? (
                          <>
                            <LockOpen
                              size={20}
                              onClick={() => setShow(!show)}
                            />
                          </>
                        ) : (
                          <>
                            <Lock size={20} onClick={() => setShow(!show)} />
                          </>
                        )}
                      </motion.div>
                      <motion.input
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 1, delay: 1.6 }}
                        className="pl-8 outline-0 border border-neutral-600 w-full h-10 text-sm rounded-lg p-2 mt-4 focus:border-neutral-700 focus:ring-2 focus:ring-neutral-700"
                        type={show ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      {passerr && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1.6 }}
                          className="absolute left-0 top-15 text-sm text-red-500"
                        >
                          {passerr}
                        </motion.div>
                      )}
                      <AnimatePresence>
                        {password && (
                          <>
                            <motion.div
                              initial={{ x: 10, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              exit={{ x: 5, opacity: 0 }}
                              transition={{ duration: 0.5 }}
                              className="absolute right-2 top-6.5"
                            >
                              <Delete
                                size={20}
                                onClick={() => setPassword("")}
                              />
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                  <div className="flex items-center justify-center text-center mb-5">
                    <motion.div
                      onClick={Signin}
                      initial={{ y: -10, rotate: 10, opacity: 0 }}
                      animate={{ y: 0, rotate: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 1.8 }}
                      className="w-[80%] text-lg h-10 rounded-2xl flex items-center justify-center bg-neutral-600"
                    >
                      <div>Signin</div>
                    </motion.div>
                  </div>
                  <motion.div
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 2 }}
                    className="flex items-center w-full gap-5 mt-10 mb-10"
                  >
                    <div className="border-t border-neutral-600 w-full"></div>
                    <div>OR</div>
                    <div className="border-t border-neutral-600 w-full"></div>
                  </motion.div>
                  <div className="flex items-center justify-center gap-5 mb-5">
                    <motion.div
                      onClick={GoogleLogin}
                      initial={{ y: -10, rotate: 10, opacity: 0 }}
                      animate={{ y: 0, rotate: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 2.2 }}
                      className="flex items-center justify-center gap-2 border border-neutral-600 p-2 bg-neutral-600 rounded-lg hover:bg-neutral-700 hover:scale-110"
                    >
                      <Image src={google} alt="" width={20} />
                      <div>Google</div>
                    </motion.div>
                    <motion.div
                      onClick={GithubLogin}
                      initial={{ y: -10, rotate: 10, opacity: 0 }}
                      animate={{ y: 0, rotate: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 2.4 }}
                      className="flex items-center justify-center gap-2 border border-neutral-600 p-2 bg-neutral-600 rounded-lg hover:bg-neutral-700 hover:scale-110"
                    >
                      <Image src={github} alt="" width={20} />
                      <div>Github</div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
