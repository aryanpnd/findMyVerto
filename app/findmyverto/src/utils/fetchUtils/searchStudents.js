import axios from "axios"
import { API_URL } from "../../../context/Auth"

export async function searchStudents(auth, query, setSearch, setLoading, setStudents, setfriends, setfriendsRequests, setSentFriendRequests) {
    setSearch(true)
    setLoading(true)
    await axios.get(`${API_URL}/student/search?q=${query}&r=${auth.reg_no}&p=${auth.password}`, { query: query })
        .then(async (result) => {
            if (result.data.status) {
                setStudents(result.data.students)
                setfriends(result.data.friends)
                setfriendsRequests(result.data.friendRequests)
                setSentFriendRequests(result.data.sentFriendRequests)
            }else{
                setStudents(result.data.students)
                setfriends([])
                setfriendsRequests([])
                setSentFriendRequests([])
            }
        }).catch((err) => {
            Toast.show({
                type: 'error',
                text1: 'Error while searching',
                text2: `${err.message}`,
            });
            console.log(err);
        })
    setLoading(false)
    // setSearch(false)
}