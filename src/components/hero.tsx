import Image from 'next/image'
import { Button } from './ui/button'

export default function Hero() {
    return (
        <>
            <div className="w-full min-h-[80vh] h-auto flex items-center justify-center bg-background px-4 sm:px-8 md:px-20 sm:py-16 md:py-0 py-10">
    <div className="w-full h-[90vh] flex flex-col-reverse md:flex-row items-center justify-between">
        <div className="w-full md:w-[50%] h-[90vh] flex flex-col items-start justify-center lg:text-left text-center">
            {/* Responsive Heading */}
            <h1 className="w-full text-5xl md:text-7xl font-semibold text-primary tracking-wide font-poorStory">
                Halwaai
            </h1>
            <h2 className="text-3xl sm:text-2xl md:text-5xl font-semibold text-primary font-poppins">
                The Thali Experience Like Never Before!
            </h2>
            
            {/* Thali images for smaller screens */}
            <div className="w-full h-[90vh] flex items-center justify-center md:hidden">
                <Image src="/images/combined3.png" alt="Thali1" width={300} height={300}/>
            </div>
            
            <div className="flex gap-4 mt-8 flex-wrap">
                <Button className="bg-black font-bold w-full sm:w-[90%] md:w-auto" variant="default" size="lg">
                    Customize your Thali
                </Button>
                <Button className="bg-accent font-bold border-[2px] border-[black] w-full sm:w-[90%] md:w-auto" variant="secondary" size="lg">
                    Order Predefined Thali
                </Button>
            </div>

        </div>

        {/* Thali images for larger screens */}
        <div className="w-full md:w-[50%] h-[90vh] flex items-center justify-center md:inline-block hidden mt-40 " >
            <Image src="/images/combined3.png" alt="Thali1" width={600} height={600}/>
        </div>
    </div>
</div>

        </>
    )
}
