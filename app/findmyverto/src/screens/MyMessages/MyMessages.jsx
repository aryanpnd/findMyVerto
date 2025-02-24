import { useContext, useEffect, useState } from 'react';
import { fetchMyMessages } from '../../../utils/fetchUtils/userData/myMessagesFetch';
import { userStorage } from '../../../utils/storage/storage';
import MyMessagesScreen from '../../components/myMessages/MyMessagesScreen';
import { AuthContext } from '../../../context/Auth';

export default function MyMessages({ navigation }) {
    const { auth } = useContext(AuthContext);
    const [messages, setMessages] = useState({});
    const [pageCount, setPageCount] = useState(0);
    const [pages, setPages] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [lastSynced, setLastSynced] = useState("");
    const [loading, setLoading] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [isError, setIsError] = useState(false);

    const handleMessagesFetch = async (sync, pageCount, pageNumber, subject, description) => {
        await fetchMyMessages(auth, sync, pageCount, pageNumber, subject, description, setMessages, setPageCount, setPages, setCurrentPage,setLastSynced, setLoading, setRefresh, setIsError);
    }

    useEffect(() => {
        const pageNumberRaw = userStorage.getString('MESSAGES-PAGE-NUMBER');
        const pageNumber = pageNumberRaw ? JSON.parse(pageNumberRaw) : null;
        const pageCountRaw = userStorage.getString('MESSAGES-PAGES');
        const pageCount = pageCountRaw ? JSON.parse(pageCountRaw).length : null;
        handleMessagesFetch(false, pageCount, pageNumber, "", "");
    }, []);

    return (
        <MyMessagesScreen
            messages={messages}
            setMessages={setMessages}
            pageCount={pageCount}
            pages={pages}
            currentPage={currentPage}
            loading={loading}
            refresh={refresh}
            isError={isError}
            handleMessagesFetch={handleMessagesFetch}
            navigation={navigation}
        />
  );
}
