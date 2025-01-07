import Image from "next/image";

export default function Hero() {
  return (
    <div className="relative h-[70vh] bg-gray-900 text-white">
      <Image
        src="/apartment_Interior.jpg"
        alt="Picture of apartment"
        layout="fill"
        objectFit="cover"
      />
      <div className="absolute inset-0 bg-black bg-opacity-50" />
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
        <h1 className="mb-4 text-4xl font-bold sm:text-5xl md:text-6xl">Find Your Perfect Home</h1>
        <p className="mb-8 text-xl sm:text-2xl">Discover the best rental properties in your area</p>
      </div>
    </div>
  )
}