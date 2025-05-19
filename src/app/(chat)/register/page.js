// "use client";
// import { useForm } from "react-hook-form";
// import { useRouter } from "next/navigation";
// import { ref, set } from "firebase/database";
// import {
//   createUserWithEmailAndPassword,
//   sendEmailVerification,
// } from "firebase/auth";
// import Link from "next/link";
// import { FirebaseAuth, realTimeDb } from "@/lib/firebase";
// import InputField from "@/components/input-field";
// import Button from "@/components/button";
// import { EmailIcon, UserIcon, SpinnerIcon } from "@/icons";
// import { toast } from "react-hot-toast";

// export default function RegisterPage() {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//     reset,
//   } = useForm({ mode: "all" });

//   const router = useRouter();

//   const onSubmit = async (data) => {
//     const { name, email, password } = data;

//     try {
//       const userCred = await createUserWithEmailAndPassword(
//         FirebaseAuth,
//         email,
//         password
//       );
//       await sendEmailVerification(userCred.user);

//       const userId = userCred.user.uid;

//       await set(ref(realTimeDb, `users/${userId}`), {
//         id: userId,
//         name,
//         email,
//       });

//       toast.success("Registered successfully. Please verify your email.");
//       reset();
//       router.push(`/login`);
//     } catch (error) {
//       console.error("error", error);
//       toast.error(error.message || "Registration failed");
//     }
//   };

//   return (
//     <section className="min-h-screen w-full flex justify-center items-center">
//       <form
//         onSubmit={handleSubmit(onSubmit)}
//         className="w-full shadow-lg dark:bg-ghost md:max-w-md py-8 px-6 md:px-8 rounded-md mx-auto"
//       >
//         <InputField
//           name="email"
//           icon={<EmailIcon className="fill-black dark:fill-white" />}
//           label="Email"
//           placeholder="johndoe@gmail.com"
//           type="email"
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
//           name="name"
//           icon={<UserIcon className="fill-black dark:fill-white" />}
//           label="Name"
//           placeholder="John Doe"
//           type="text"
//           register={register("name", { required: "Name is required" })}
//           errors={errors}
//         />

//         <InputField
//           name="password"
//           icon={<UserIcon className="fill-black dark:fill-white" />}
//           label="Password"
//           placeholder="********"
//           type="password"
//           register={register("password", {
//             required: "Password is required",
//             minLength: {
//               value: 6,
//               message: "Password must be at least 6 characters",
//             },
//           })}
//           errors={errors}
//         />

//         <Button type="submit" className="w-full !shadow-2xl !mt-12">
//           {isSubmitting ? <SpinnerIcon /> : "Register"}
//         </Button>

//         <div className="text-sm text-center mt-4">
//           <Link href="/login" className="text-blue-600 hover:underline">
//             Already have an account? Login
//           </Link>
//         </div>
//       </form>
//     </section>
//   );
// }
