import Header from "./_components/header";
import Features from "./_components/features";
import Testimonials from "./_components/testimonials";
import Pricing from "./_components/pricing";
import CallToAction from "./_components/call-to-action";

export default function Home() {
    return (
        <div className="flex flex-col items-center gap-2 p-2">
            <div className="md:w-2xl lg:w-4xl">
                <Header />
                <Features />
                <Testimonials />
                <Pricing />
                <CallToAction />
            </div>
        </div>
    );
}
