"use client";

import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useForm } from "react-hook-form";
import { FirebaseAuth } from "@/lib/firebase";
import Link from "next/link";
import { setCookie } from "cookies-next";
import { EmailIcon, SpinnerIcon, UserIcon } from "@/icons";
import InputField from "@/components/input-field";
import Button from "@/components/button";
import toast from "react-hot-toast";

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ mode: "all" });

  const router = useRouter();

  const onSubmit = async (data) => {

    try {
      const userCredential = await signInWithEmailAndPassword(
        FirebaseAuth,
        data.email,
        data.password
      );
      const user = userCredential.user;
      console.log("Logged in:", user);

      setCookie("USER", user.uid);
      toast.success("sucesss");
      router.push("/conversation");
    } catch (error) {
      toast.error(error.message);
      console.log(error.message);
    }
  };

  return (
    <section className="min-h-screen w-full  flex justify-center items-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={`w-full  shadow-lg dark:bg-ghost  "w-full md:max-w-md py-8 px-6 md:px-8  rounded-md  mx-auto `}
      >
        <InputField
          name="email"
          icon={<EmailIcon className="fill-black dark:fill-white" />}
          label={"Email"}
          placeholder={"johndoe@gmail.com"}
          type="text"
          register={register("email", {
            required: "Email is required",
            pattern: {
              value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/,
              message: "Invalid email address",
            },
          })}
          errors={errors}
        />

        <InputField
          name="password"
          type={"text"}
          icon={<UserIcon className="fill-black dark:fill-white" />}
          label={"Password"}
          placeholder={"********"}
          register={register("password", { required: "password is required" })}
          errors={errors}
        />

        <Button type="submit" className={" w-full !shadow-2xl !mt-12 "}>
          {isSubmitting ? <SpinnerIcon /> : "Login"}
        </Button>

        <div className="text-sm text-center mt-4">
          <Link href="/register" className="text-blue-600 hover:underline">
            Don’t have an account? Register
          </Link>
        </div>
      </form>
    </section>
  );
}
