import axios from "axios";
import { API_URL } from "../../../context/Auth";
import { userStorage } from "../../storage/storage";
import Toast from "react-native-toast-message";

export const fetchMyMessages = async (
    auth,
    sync,
    pageCount,
    pageNumber,
    subject,
    description,
    setMessages,
    setPageCount,
    setPages,
    setCurrentPage,
    setLastSynced,
    setLoading,
    setRefresh,
    setIsError,
) => {
    try {
        !sync && setLoading(true);
        sync && setRefresh(true);
        let userMessagesRaw, userMessages, pageIndex;
        const currentPageRaw = userStorage.getString('MESSAGES-PAGE-NUMBER');
        const currentPage = currentPageRaw ? JSON.parse(currentPageRaw) : null;

        pageIndex = (pageCount && pageNumber) ? (pageCount - pageNumber) + 1 : 1;

        if (pageCount || pageCount > 0 || pageNumber || pageNumber > 0) {
            userMessagesRaw = userStorage.getString(`MESSAGES-${pageNumber}`);
            userMessages = userMessagesRaw ? JSON.parse(userMessagesRaw) : null;
        }

        if (!userMessages || sync) {
            if (!userMessages || userMessages.success === false || sync) {
                const result = await axios.post(`${API_URL}/student/messages`,
                    {
                        reg_no: auth.reg_no,
                        password: auth.password,
                        pageIndex: pageIndex,
                        subject: subject ? subject : "",
                        description: description ? description : ""
                    }
                );
                if (result.data.success) {
                    const pageCountTemp = result.data.data[0].PageCount;
                    const pageNumberTemp = (pageCountTemp - pageIndex) + 1;
                    userStorage.set(`MESSAGES-${pageNumberTemp}`, JSON.stringify(result.data));
                    const pages = [];
                    for (let i = 1; i <= pageCountTemp; i++) {
                        pages.push(i);
                    }
                    userStorage.set("MESSAGES-PAGES", JSON.stringify(pages));
                    userStorage.set("MESSAGES-PAGE-NUMBER", JSON.stringify(pageNumberTemp));
                    setPages(pages.reverse());
                    setCurrentPage(pageNumberTemp);
                    setPageCount(pageCountTemp);
                    setMessages(result.data.data);
                    if(sync || !userMessages) {
                        setLastSynced(result.data.lastSynced);
                    }
                    Toast.show({
                        type: 'success',
                        text1: "Messages Synced",
                        text2: "Your messages have been synced successfully",
                    });
                }
                else {
                    Toast.show({
                        type: 'error',
                        text1: `${result.data.message}`,
                        text2: `${result.data.errorMessage}`,
                    });
                    userStorage.set("MESSAGES-PAGE-NUMBER", JSON.stringify(currentPage));
                }
            }
        } else {
            setMessages(userMessages.data);
            setLastSynced(userMessages.lastSynced);
            setPageCount(userMessages.data[0].PageCount);
            setCurrentPage(pageNumber);
            const pages = [];
            for (let i = 1; i <= userMessages.data[0].PageCount; i++) {
                pages.push(i);
            }
            setPages(pages.reverse());
            userStorage.set("MESSAGES-PAGE-NUMBER", JSON.stringify(userMessages.data[0].PageCount));
        }
        setLoading(false);
        setRefresh(false);
        setIsError(false);
    }
    catch (error) {
        console.error(error);
        let userMessagesRaw = userStorage.getString(`MESSAGES-${pageNumber}`);
        if (userMessagesRaw) {
            let userMessages = JSON.parse(userMessagesRaw);
            setMessages(userMessages.data);
            setLastSynced(userMessages.lastSynced);
            setPageCount(userMessages.data[0].PageCount);
            setCurrentPage(pageNumber);
            const pages = [];
            for (let i = 1; i <= userMessages.data[0].PageCount; i++) {
                pages.push(i);
            }
            userStorage.set("MESSAGES-PAGE-NUMBER", JSON.stringify(userMessages.data[0].PageCount));
            setPages(pages.reverse());
        }
        setLoading(false);
        setRefresh(false);
    }
}