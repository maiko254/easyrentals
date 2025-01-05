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
    </div>
  )
}