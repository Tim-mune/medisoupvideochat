import { Link } from "react-router";

export const Home = () => {
  return (
    <main className="h-screen flex items-center justify-center bg-black">
      <div className="flex flex-col gap-2">
        <h1 className="text-6xl text-zinc-400 font-black">
          Chat with anyone! Anywhere
        </h1>
        <Link to={"/join"} className="btn btn-primary xl:w-1/3 w-full ">
          Continue
        </Link>
      </div>
    </main>
  );
};
