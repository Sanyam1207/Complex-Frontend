export default function CustomStepper({ activeStep, steps }: { activeStep: number; steps: string[] }) {
  return (
    <div className="md:w-full flex items-center justify-center gap-2">
      {steps.map((label, index) => {
        const isActive = index + 1 === activeStep || index + 1 <= activeStep;
        return (
          <div
            key={index}
            className={`md:flex-1 rounded-full h-1 ${isActive ? "bg-blue-500 md:w-16 w-5" : "bg-gray-300 w-3"} transition-all`}
          />
        );
      })}
    </div>
  );
}
