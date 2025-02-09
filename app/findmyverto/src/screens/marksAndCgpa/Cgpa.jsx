import CgpaScreen from "../../components/marksAndCgpa/CgpaScreen";
import { AuthContext } from "../../../context/Auth";
import { useContext, useEffect, useState } from "react";
import { fetchCgpa } from "../../../utils/fetchUtils/userData/handleMarksAndCgpaFetch";

export default function Cgpa({navigation}) {
    const { auth } = useContext(AuthContext)
    const [cgpa, setCgpa] = useState({})
    const [cgpaLoading, setCgpaLoading] = useState(true)
    const [cgpaRefresh, setCgpaRefresh] = useState(false)
    const [isError, setIsError] = useState(false);
    const [lastSynced, setLastSynced] = useState("")

    const handleCgpaFetch = async (sync) => {
        await fetchCgpa(auth, sync, setCgpa, setLastSynced, setCgpaLoading, setCgpaRefresh, setIsError)
    }

    useEffect(() => {
        handleCgpaFetch()
    }, [])
    return (
        <>
            <CgpaScreen cgpa={cgpa} cgpaLoading={cgpaLoading} cgpaRefresh={cgpaRefresh} isError={isError} lastSynced={lastSynced} handleCgpaFetch={handleCgpaFetch} navigation={navigation}/>
        </>
    );
}