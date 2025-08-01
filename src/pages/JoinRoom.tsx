import { FormEvent } from "react";
import { Input } from "../components/Input";
import { useAppState } from "../state/appstate";
import { useNavigate } from "react-router";

export const JoinRoom = () => {
  const navigation = useNavigate();
  const { joinRoom } = useAppState();

  const handleJoinRoom = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    // @ts-ignore
    const data = Object.fromEntries(formData);
    // @ts-ignore

    const response = joinRoom({
      roomName: data?.roomName.trim(),
      userName: data?.userName,
    })
      .then((response) => {
        if (response === "Error") {
          return;
        }
        navigation(`/room/${response}`);
      })
      .catch((err) => console.log("err"));
  };

  const handleJoinOngoingRoom = () => {
    return "todo";
  };
  return (
    <section className="h-screen bg-black flex flex-col gap-8 pt-[24px] text-zinc-400">
      <form
        onSubmit={handleJoinRoom}
        className="lg:w-[30%] md:w-[60%] w-[90%] absolute bottom-[48px] self-center flex flex-col gap-4"
      >
        <Input name="roomName" placeholder="room name" />
        <Input name="userName" placeholder="user name" />
        <button className="btn ">Join Room</button>
      </form>
      <h5 className="font-black text-center text-2xl">Join Trending Rooms</h5>
      {/* map all available rooms here for user to join for fun */}
      <button onClick={() => navigation("/room/yy")}>Try</button>
    </section>
  );
};
