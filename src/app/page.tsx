import Link from "next/link";

export default function Home() {
  return (
    <>
      <main className="flex w-full h-screen justify-center items-center">
        <Link href="/estadio">
          <h1 className="underline hover:text-gray-400">Go to estadio</h1>
        </Link>
      </main>
    </>
  );
}
