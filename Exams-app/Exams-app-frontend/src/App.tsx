import Body from "./components/Body";
import { MyFooter } from "./components/Footer";
import Header from "./components/Header";

export default function App() {
  return (
    <main className="flex min-h-screen flex-col items-center gap-2 dark:bg-slate-600">
      <Header />
      <Body />
      <MyFooter />
    </main>
  );
}
