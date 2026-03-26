import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

function RootLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default RootLayout;
