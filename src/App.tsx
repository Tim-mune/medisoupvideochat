import { useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import { useAppState } from "./state/appstate";
import "./App.css";
import { Home } from "./pages/Home";
import { JoinRoom } from "./pages/JoinRoom";
import { Room } from "./pages/Room";
import { Toaster } from "react-hot-toast";
const App = () => {
  const { initSocketIO } = useAppState();

  useEffect(() => {
    initSocketIO();
  }, []);
  const router = createBrowserRouter([
    { path: "/", element: <Home /> },
    { path: "/join", element: <JoinRoom /> },
    { path: "/room/:name", element: <Room /> },
  ]);
  return (
    <>
      <RouterProvider router={router}></RouterProvider>
      <Toaster />
    </>
  );
};
export default App;
