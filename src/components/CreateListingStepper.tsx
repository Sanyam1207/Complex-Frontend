import React from 'react'
import CustomStepper from './Stepper'

const CreateListingStepper = ({steps, activeStep, handleBackButton} : {steps: string[], activeStep: number, handleBackButton: () => void}) => {
    
    return (
        <div className="bg-[#1c1c1c] flex flex-col md:items-center p-6 md:p-0 mb-3 space-y-10">
            
            {/* Stepper */}
            <CustomStepper steps={steps} activeStep={activeStep} />

            {/* Back button + Step label */}
            <div className="flex md:p-6 flex-row items-center md:w-1/2 max-w-3xl text-white">
                <button
                    onClick={handleBackButton}
                    className="bg-[#353537] hidden md:block px-4 py-2 mr-10 md:mr-40 rounded-full hover:bg-gray-600 transition"
                >
                    Back
                </button>
                <h1 className="text-xl font-medium">
                    {steps[activeStep - 1]} <br />
                    {activeStep === 3 ? (<div className='mt-2 text-sm font-normal'>Enter the nearest intersection if you <br /> prefer not to share your exact address</div>) : ''}
                </h1>
            </div>
        </div>
    )
}

export default CreateListingStepper