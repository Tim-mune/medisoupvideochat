import { useState } from "react";
import "./App.css";
import { useAppState } from "./state/appstate";

const App = () => {
  const [roomState, setRoomState] = useState<{ name: string; room: string }>({
    name: "",
    room: "",
  });
  const { joinRoom } = useAppState();
  return (
    <main className="min-h-screen bg-amber-100 p-6 md:p-12 flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="text"
          onChange={(e) => setRoomState({ ...roomState, name: e.target.value })}
          className="input input-primary w-full sm:w-auto"
          placeholder="Your Name"
        />
        <input
          type="text"
          onChange={(e) => setRoomState({ ...roomState, room: e.target.value })}
          className="input input-primary w-full sm:w-auto"
          placeholder="Room ID"
        />
        <button
          onClick={() =>
            joinRoom({ name: roomState?.name, room: roomState.room })
          }
          className="btn btn-neutral w-full sm:w-auto"
        >
          Join Call
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6 flex-1">
        <div className="flex-1 bg-black rounded-2xl shadow-lg overflow-hidden relative">
          <video
            className="w-full h-full object-cover"
            autoPlay
            muted
            playsInline
          ></video>
          <span className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-sm px-2 py-1 rounded">
            Speaker Name
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 md:w-1/3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-black rounded-xl overflow-hidden relative shadow-md aspect-video"
            >
              <video
                className="w-full h-full object-cover"
                autoPlay
                muted
                playsInline
              ></video>
              <span className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-1 py-0.5 rounded">
                Speaker {i}
              </span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default App;
