import { Button } from "@mui/material"
import { useRouter } from "next/navigation"

const Checkout: React.FC = () => {
    const router = useRouter();
    return (
        <div className="mt-32 mb-4">
            <div className="flex justify-between">
                <div className="flex flex-col justify-between">
                    <p className="text-xs">Trip Cost</p>
                    <h1 className="font-bold text-carrot-orange text-3xl">6500 for 2 adults</h1>
                </div>

                <Button
                    variant="contained"
                    className={`p-2 rounded-md flex items-center justify-center my-2 bg-[#FF8B02] text-white`}
                    onClick={() => {
                        // Redirect to checkout page
                        router.push('/trip-details/checkout')
                    }}
                >
                    Book Now
                </Button>
            </div>

        </div>
    )

}

export default Checkout