import DetailsCard from "./DetailsCard"
import placeholderImage from "@/assets/images/destination.png"

const placeHolder = {
    image: placeholderImage,
    hotelName: "Sherpa hotel",
    star: "4",
    dest: "Rishikesh",
    rating: "4.5",
    roomNumber: "2",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos dicta perferendis laudantium.",
    price: 2500
}

const DetailsCardfPage = () => {
    return (
        <>
            <DetailsCard placeHolder={placeHolder} />
        </>
    )
}

export default DetailsCardfPage