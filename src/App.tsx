import "./App.css";
import Header from "./components/Header";
import Memory from "./components/Memory";
import MipsCPUDatapath from "./components/MipsCPUDatapath";

function App() {
  return (
    <>
      <div className="h-screen w-full py-4 px-6 flex flex-col pb-12 gap-y-3">
        <Header />
        <div className="h-full bg-to-blue-500 flex flex-1 space-x-2 pb-10">
          <MipsCPUDatapath />
          <Memory />
        </div>
      </div>
    </>
  );
}

export default App;
