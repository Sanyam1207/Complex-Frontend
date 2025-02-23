import React from 'react'
import CustomStepper from './Stepper'

const CreateListingStepper = ({steps, activeStep, handleBackButton} : {steps: string[], activeStep: number, handleBackButton: () => void}) => {
    
    return (
        <div className="bg-[#1c1c1c] flex flex-col items-center p-6 mb-3 space-y-10">
            {/* Stepper */}
            <CustomStepper steps={steps} activeStep={activeStep} />

            {/* Back button + Step label */}
            <div className="flex flex-row items-center md:w-1/2 max-w-3xl text-white">
                <button
                    onClick={handleBackButton}
                    className="bg-[#353537] px-4 py-2 mr-10 md:mr-40 rounded-full hover:bg-gray-600 transition"
                >
                    Back
                </button>
                <h1 className="text-sm font-semibold">
                    {steps[activeStep - 1]}
                </h1>
            </div>
        </div>
    )
}

export default CreateListingStepper