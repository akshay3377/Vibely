// "use client";

// import { useRouter } from "next/navigation";
// // import { signInWithEmailAndPassword } from "firebase/auth";

// import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// import { useForm } from "react-hook-form";
// import { FirebaseAuth } from "@/lib/firebase";
// import Link from "next/link";
// import { setCookie } from "cookies-next";
// import { EmailIcon, SpinnerIcon, UserIcon } from "@/icons";
// import InputField from "@/components/input-field";
// import Button from "@/components/button";
// import toast from "react-hot-toast";

// export default function LoginPage() {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//   } = useForm({ mode: "all" });

//   const router = useRouter();

//   const onSubmit = async (data) => {

//     try {
//       const userCredential = await signInWithEmailAndPassword(
//         FirebaseAuth,
//         data.email,
//         data.password
//       );
//       const user = userCredential.user;
//       console.log("Logged in:", user);

//       setCookie("USER", user.uid);
//       toast.success("sucesss");
//       router.push("/conversation");
//     } catch (error) {
//       toast.error(error.message);
//       console.log(error.message);
//     }
//   };

//   return (
//     <section className="min-h-screen w-full  flex justify-center items-center">
//       <form
//         onSubmit={handleSubmit(onSubmit)}
//         className={`w-full  shadow-lg dark:bg-ghost  "w-full md:max-w-md py-8 px-6 md:px-8  rounded-md  mx-auto `}
//       >
//         <InputField
//           name="email"
//           icon={<EmailIcon className="fill-black dark:fill-white" />}
//           label={"Email"}
//           placeholder={"johndoe@gmail.com"}
//           type="text"
//           register={register("email", {
//             required: "Email is required",
//             pattern: {
//               value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/,
//               message: "Invalid email address",
//             },
//           })}
//           errors={errors}
//         />

//         <InputField
//           name="password"
//           type={"text"}
//           icon={<UserIcon className="fill-black dark:fill-white" />}
//           label={"Password"}
//           placeholder={"********"}
//           register={register("password", { required: "password is required" })}
//           errors={errors}
//         />

//         <Button type="submit" className={" w-full !shadow-2xl !mt-12 "}>
//           {isSubmitting ? <SpinnerIcon /> : "Login"}
//         </Button>

//         <div className="text-sm text-center mt-4">
//           <Link href="/register" className="text-blue-600 hover:underline">
//             Don’t have an account? Register
//           </Link>
//         </div>
//       </form>
//     </section>
//   );
// }

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { FirebaseAuth } from "@/lib/firebase"; // your initialized Firebase Auth
import { setCookie } from "cookies-next";
import { toast } from "react-hot-toast";
import { ref, set } from "firebase/database";
import { realTimeDb } from "@/lib/firebase"; // your initialized Realtime DB

export default function LoginPage() {
  const router = useRouter();

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();

    try {
      const userCredential = await signInWithPopup(FirebaseAuth, provider);
      const user = userCredential.user;

      console.log("Google login success:", user);

      console.log("user.providerData[0].uid", user.providerData[0].uid);

      const data = {
        name: user.providerData[0].displayName,
        email: user.providerData[0].email,
        photoURL: user.providerData[0].photoURL,
        providerId: user.providerData[0].providerId,
        id: user.uid,
      };

      console.log("data", data);
      // Optional: Get Firebase ID token
      const token = await user.getIdToken();

      const userRef = ref(realTimeDb, `users/${user.uid}`);

      await set(userRef, {
       ...data
      });

      // Store UID or token in cookie
      setCookie("USER", JSON.stringify('USER'))

      toast.success("Login successful!");
      router.push("/conversation");
    } catch (error) {
      console.error("Google login error:", error.message);
      toast.error(error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen ">
      <div className=" p-8 rounded-xl shadow-md text-center">
        <h1 className="text-2xl font-bold mb-6">Login</h1>
        <button
          onClick={handleGoogleLogin}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
