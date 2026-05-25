import { BrowserRouter, Routes, Route } from "react-router-dom";
export default function App() {
  return (
    <>
      <div
        className="
      w-full 
      h-screen
      bg-background
      border-Im2
      border-10
      rounded-4xl
      text-font
      font-Jungle
      flex
      justify-center
      items-center
      "
      >
        <BrowserRouter>
          <Routes>
            <Route path="/" element={LogInAndReges}/>
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}
