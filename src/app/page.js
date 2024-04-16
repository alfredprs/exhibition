import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen min-w-full flex-col bg-white text-black">
      <div className="md:container min-w-full">
        <div className="rmc-logo absolute ml-6 mt-6">
        <Image
              src="/rmc logo.jpg"
              alt="Logo RMC"
              className=""
              width={219}
              height={80}
              priority
              quality={100}
            />
        </div>
        <div className="company-logo absolute mr-6 mt-6 right-0 top-0">
        <Image
              src="/dna logo.jpg"
              alt="Logo Perusahaan"
              className=""
              width={100}
              height={139}
              priority
              quality={100}
            />
        </div>
      </div>
      <div className="md:container min-w-full">
        <div className="flex ml-6 mt-40">
          <h2 className="welcome text-2xl font-bold">Welcome to Rizqi Semesta</h2>
        </div>
        <div className="flex ml-6 mt-">
          <h3 className="data-update font-semibold">Data Update: 2024-02-21 15:00:03</h3>
        </div>
        <div className="ribbon absolute mt-40 right-0 top-0" style={{width:"700px", height:"50px"}}>
          <Image
              src="/ribbon.jpg"
              alt="Logo Perusahaan"
              className="object-cover object-center"
              priority
              quality={100}
              fill={true}
            />
        </div>
      </div>
    </main>
  );
}
