
import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";

const SubmitButton = () => {
    const { pending } = useFormStatus();
    
    return (
        <>
            <Button
                className={`w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 transition duration-300 ${pending ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={pending}
                type="submit"
            >
                {pending ? "Submitting.." : "Submit"}
            </Button>
        </>
    );
};

export default SubmitButton;
