import Image from 'next/image'

export default function Hero() {
    return (
        <>
            <div className="w-full h-[90vh] flex items-center justify-center bg-background px-20">
                <div className="w-full h-[90vh] flex items-center justify-between">
                    <div className="w-[50%] h-[90vh] flex flex-col items-start justify-center  ">
                        <h1 className=" text-7xl font-semibold text-primary tracking-wide font-poorStory">Halwaai</h1>
                        <h2 className="text-5xl font-semibold text-primary font-poppins">The Thali Experience Like Never Before!</h2>
                    </div>
                    <div className="w-[50%] h-[90vh] flex items-center justify-center relative">
                        <Image className="absolute top-0 left-0" src="/images/thali1.png" alt="Thali1" width={300} height={300}/>
                        <Image src="/images/thali3.png" alt="Thali1" width={300} height={300}/>
                        <Image src="/images/thali3.png" alt="Thali1" width={300} height={300}/>
                    </div>
                </div>
            </div>
        </>
    )
}