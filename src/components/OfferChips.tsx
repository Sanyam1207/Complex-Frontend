import Image from "next/image";
import React, { useState } from "react";
interface OfferChipsProps {
    features: {
        label: string;
        icon: string;
    }[];
}

const OfferChips: React.FC<OfferChipsProps> = ({ features }) => {
    const [expanded, setExpanded] = useState(false);

    // Show either all features or the first 6
    const visibleFeatures = expanded ? features : features.slice(0, 6);

    return (
        <div>
            <div className="flex flex-wrap gap-2">
                {visibleFeatures.map((feature, idx) => (
                    <div
                        key={idx}
                        className="inline-flex items-center px-3 py-1.5 font-medium bg-[#F4F4F4] text-[#2C3C4E] rounded-full text-xs"
                    >
                        <span><Image src={feature.icon} alt="feature" height={12} width={12} className="object-scale-down mr-2 text-[#2C3C4E]" /></span>{feature.label}
                    </div>
                ))}
            </div>

            {/* Show the link only if there are more than 6 features and not expanded yet */}
            {features.length > 6 && !expanded && (
                <a
                    href="#"
                    className="text-blue-600 text-sm mt-3 inline-block"
                    onClick={(e) => {
                        e.preventDefault();
                        setExpanded(true);
                    }}
                >
                    Show more
                </a>
            )}
        </div>
    );
};

export default OfferChips;