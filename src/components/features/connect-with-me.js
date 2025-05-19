import { RocketIcon } from "@/icons";
import Button from "../button";

export default function ConnectWithMe() {
  return (
    <section className="w-full  px-2">
      <div className="container bg-gradient-to-r from-[#cbd5e1] via-[#facc15] to-[#fda4af] rounded-lg  py-12 md:p-12  flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-black">
            {`     Let's Build Something Together`}
          </h2>
          <p className="text-lg text-black mt-2">
            {`     Turning ideas into real life products is my calling. Let's do this.`}
          </p>
        </div>
        <a href="#contact" className="">
          <Button className="!bg-black text-white font-semibold px-6 py-3 rounded-md shadow-md transition-transform flex items-center gap-2">
            <RocketIcon className="w-5 h-5 fill-white" />
            Connect With Me
          </Button>
        </a>
      </div>
    </section>
  );
}
