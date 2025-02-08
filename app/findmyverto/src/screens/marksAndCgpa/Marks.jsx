import MarksScreen from "../../components/marksAndCgpa/MarksScreen";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/Auth";
import { fetchMarks } from "../../../utils/fetchUtils/handleMarksAndCgpaFetch";

export default function Marks({navigation}) {
    const { auth } = useContext(AuthContext)
    const [Marks, setMarks] = useState({})
    const [marksLoading, setMarksLoading] = useState(true)
    const [markRefresh, setMarkRefresh] = useState(false)
    const [isError, setIsError] = useState(false);
    const [lastSynced, setLastSynced] = useState("")

    const handleMarksFetch = async (sync) => {
        await fetchMarks(auth, sync, setMarks, setLastSynced, setMarksLoading, setMarkRefresh, setIsError)
    }
    useEffect(() => {
        handleMarksFetch()
    }, [])

    return (
        <>
            <MarksScreen marks={Marks} marksLoading={marksLoading} markRefresh={markRefresh} isError={isError} lastSynced={lastSynced} handleMarksFetch={handleMarksFetch} navigation={navigation}/>
        </>
    );
}