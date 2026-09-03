import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, loading }) {
  const userData = useSelector((state) => state.user.userData);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F6F2]">
        <div className="flex items-center gap-2 font-[IBM_Plex_Mono,monospace] text-sm text-black/40">
          <span className="w-1.5 h-1.5 rounded-full bg-[#1E7A56] motion-safe:animate-[blink_1.2s_ease-in-out_infinite]" />
          checking session…
        </div>
      </div>
    );
  }

  if (!userData) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;