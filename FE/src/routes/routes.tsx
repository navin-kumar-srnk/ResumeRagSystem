import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "../components/MainLayout";
import IngestView from "../pages/Upload";
import ChatView from "../pages/Chat";
export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />, // Parent Layout
    children: [
      {
        index: true,
        element: <Navigate to="/upload" replace />,
      },
      {
        path: "upload",
        element: <IngestView />,
      },
      {
        path: "chat",
        element: <ChatView />,
      },
    ],
  },
]);
