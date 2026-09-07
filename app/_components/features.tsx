import { Lock, TabletSmartphone } from "lucide-react";
import StarIcon from "./star-icon";

export default function Features() {
    return (
        <section>
            <h1 className="text-2xl font-semibold lg:text-3xl">Features</h1>
            <div className="mt-2 flex flex-col gap-2 md:flex-row">
                {/* Private/Public Sets */}
                <div className="feature">
                    <div className="feature-icon">
                        <Lock />
                    </div>
                    <h2 className="text-lg">Private Sets</h2>
                    <p>
                        Make flashcard sets private so that only you can see
                        them
                    </p>
                </div>
                {/* Starred Terms */}
                <div className="feature">
                    <div className="feature-icon">
                        <StarIcon />
                    </div>
                    <h2 className="text-lg">Starred Terms</h2>
                    <p>Study select flashcards in any set</p>
                </div>
                {/* Mobile-Friendly User Interface */}
                <div className="feature">
                    <div className="feature-icon">
                        <TabletSmartphone />
                    </div>
                    <h2 className="text-lg">Mobile Friendly</h2>
                    <p>Study your flashcards on the go</p>
                </div>
            </div>
        </section>
    );
}
