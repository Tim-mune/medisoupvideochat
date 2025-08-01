import { FaMicrophone, FaVideo } from "react-icons/fa";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { useAppState } from "../state/appstate";

export const Room = () => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const { createTansport, setLocalStream } = useAppState();

  const getUserMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setLocalStream(stream);
      if (localVideoRef.current) {
        (localVideoRef.current as HTMLVideoElement).srcObject = stream;
      }
    } catch (error) {
      toast.error("Please allow Permissions to proceed");
    }
  };

  useEffect(() => {
    getUserMedia();
  }, []);

  // createSendTransport
  useEffect(() => {
    createTansport();
  }, [localVideoRef.current?.srcObject]);

  return (
    <section className="min-h-screen flex flex-col justify-between bg-base-100 p-4 md:p-6">
      <div className="w-full max-w-5xl  h-[60vh] mx-auto aspect-video rounded-xl overflow-hidden shadow-xl relative">
        <video
          ref={localVideoRef}
          className="w-full h-full object-cover"
          autoPlay
          muted
          poster="https://plus.unsplash.com/premium_photo-1753211477530-ac7d65a3119f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw2fHx8ZW58MHx8fHx8"
          playsInline
        />
        <span className="absolute bottom-2 left-2 text-white text-xs sm:text-sm px-3 py-1 bg-black/60 rounded">
          You (Active)
        </span>
      </div>

      <div className="w-full  h-[20vh] max-w-5xl mx-auto mt-4 flex gap-4 overflow-x-auto pb-2">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="aspect-video bg-zinc-400   rounded-xl overflow-hidden shadow-md  relative shrink-0"
          >
            <video
              className="w-full h-full object-cover"
              autoPlay
              muted
              playsInline
            />
            <span className="absolute bottom-2 left-2 text-white text-xs sm:text-sm px-3 py-1 bg-black/60 rounded">
              Speaker {index + 1}
            </span>
          </div>
        ))}
      </div>

      <div className="w-full flex-1 max-w-5xl mx-auto mt-4 flex flex-col sm:flex-row items-center gap-4">
        <input
          type="text"
          placeholder="Type a message"
          className="input input-primary  input-md w-full flex-1"
        />
        <button className="btn btn-primary w-full sm:w-auto">Send DM</button>

        <div className="flex gap-2 sm:gap-4">
          <button className="btn btn-circle btn-outline">
            <FaMicrophone size={20} />
          </button>
          <button className="btn btn-circle btn-outline">
            <FaVideo size={20} />
          </button>
        </div>
      </div>
    </section>
  );
};
