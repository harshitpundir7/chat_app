"use client";
import React, { useState } from "react";
import { MessageCircleDashed } from "lucide-react";
import {
  isUsernameAllowed,
  handleEmailValidation,
  CreateAccount,
} from "@/lib/actions";
import { useForm, SubmitHandler } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { UserSignUp } from "@/lib/schema";

export default function SignUp() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<UserSignUp>();
  const [userName, setUserName] = useState(true);
  const [otpValue, setOtpValue] = useState();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
    return true;
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };
  const onSubmit: SubmitHandler<UserSignUp> = async (data: UserSignUp) => {
    const error = await handleEmailValidation(data);
    const loadingToast = toast.loading("Loading...");
    if (error) {
      toast.error(String(error), {
        id: loadingToast,
      });
    } else {
      toast.success("OTP send Successfully", {
        id: loadingToast,
      });
      handleOpenDialog();
    }
  };

  async function validateOtp(userData: UserSignUp) {
    const otp: number = Number(otpValue);
    const errorWhileCreating = await CreateAccount(userData, otp);
    const loadingToast = toast.loading("Loading...");
    if (errorWhileCreating) {
      toast.error(String(errorWhileCreating), {
        id: loadingToast,
      });
    } else {
      toast.success("Account Successfully Created", {
        id: loadingToast,
      });
      handleCloseDialog();
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <section className="bg-gray-50 min-h-screen dark:bg-gray-900">
          <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            <a
              href="#"
              className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
            >
              <MessageCircleDashed size={50} />
              Mingle
            </a>
            <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
              <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                  Create an account
                </h1>
                <div className="space-y-4 md:space-y-6">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      {...register("firstname", { required: true })}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="lastName"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      {...register("lastname")}
                    />
                  </div>
                  <div>
                    <label htmlFor="username">username</label>
                    <input
                      type="text"
                      id="username"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      {...register("username", {
                        required: true,
                        validate: async (value) => {
                          const isAllowed = await isUsernameAllowed(value);
                          setUserName(isAllowed);
                          return isAllowed || "Username is already taken";
                        },
                      })}
                    />
                    {userName ? (
                      ""
                    ) : (
                      <p className="text-red-500 p-2">
                        username already exists
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Your email
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="name@company.com"
                      {...register("email", { required: true })}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="password"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      placeholder="••••••••"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-500 dark:focus:border-purple-500"
                      {...register("password", { required: true })}
                    />
                  </div>
                  <div>
                    <button
                      type="submit"
                      className="w-full text-white bg-purple-600 hover:bg-purple-700 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-800 disabled:bg-gray-500 disabled:cursor-not-allowed"
                      disabled={!userName}
                    >
                      Verify your email
                    </button>
                    <Dialog open={isDialogOpen}>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Verify Your Email</DialogTitle>
                          <DialogDescription>
                            enter you one time password (OTP)
                          </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                          <InputOTP
                            maxLength={4}
                            value={otpValue}
                            onChange={(value) => setOtpValue(value)}
                          >
                            <InputOTPGroup>
                              <InputOTPSlot index={0} />
                            </InputOTPGroup>
                            <InputOTPGroup>
                              <InputOTPSlot index={1} />
                            </InputOTPGroup>
                            <InputOTPSeparator />
                            <InputOTPGroup>
                              <InputOTPSlot index={2} />
                            </InputOTPGroup>
                            <InputOTPGroup>
                              <InputOTPSlot index={3} />
                            </InputOTPGroup>
                          </InputOTP>
                        </div>
                        <DialogFooter>
                          <DialogClose asChild>
                            <button
                              type="button"
                              onClick={handleSubmit(validateOtp)}
                            >
                              Verify
                            </button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                    Already have an account?{" "}
                    <a
                      href="/login"
                      className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                    >
                      Login here
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </form>
      <Toaster />
    </div>
  );
}
