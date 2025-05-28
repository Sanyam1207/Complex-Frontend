export default function CustomStepper({
  activeStep,
  steps,
}: {
  activeStep: number;
  steps: string[];
}) {
  // Predefined max widths per index (adjust as needed)
  const widthClasses = ["w-[4rem]", "w-[2.313rem]", "w-[1.188rem]", "w-[0.625rem]", "w-[0.375rem]", "w-[0.275rem]"];

  return (
    <div className="md:w-full flex items-center justify-center gap-1">
      {steps.map((label, index) => {
        const isActive = index + 1 <= activeStep;
        const widthClass = widthClasses[index] || "md:w-16"; // Fallback for extra steps
        return (
          <div
            key={index}
            className={`h-1 rounded-full ${widthClass} w-5 ${
              isActive ? "bg-[#0A84FF]" : "bg-[#353537]"
            } transition-all`}
          />
        );
      })}
    </div>
  );
}
