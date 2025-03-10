import axios from "axios";
import { auth } from "../../../context/Auth";
import { userStorage } from "../../storage/storage";
import Toast from "react-native-toast-message";
import { MyMessagesSyncTime } from "../../settings/SyncAndRetryLimits";

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
        if (!sync) setLoading(true);
        if (sync) setRefresh(true);

        // If syncing, clear stored messages.
        if (sync) {
            const pagesRaw = userStorage.getString("MESSAGES-PAGES");
            if (pagesRaw) {
                const pages = JSON.parse(pagesRaw);
                pages.forEach((page) => {
                    userStorage.delete(`MESSAGES-${page}`);
                });
            }
            userStorage.delete("MESSAGES-PAGE-NUMBER");
            userStorage.delete("MESSAGES-PAGES");
        }

        let userMessagesRaw, userMessages, pageIndex;
        const currentPageRaw = userStorage.getString('MESSAGES-PAGE-NUMBER');
        const currentPage = currentPageRaw ? JSON.parse(currentPageRaw) : null;

        // Calculate page index (if paging is used)
        pageIndex = (pageCount && pageNumber) ? (pageCount - pageNumber) + 1 : 1;

        if (pageCount || pageCount > 0 || pageNumber || pageNumber > 0) {
            userMessagesRaw = userStorage.getString(`MESSAGES-${pageNumber}`);
            userMessages = userMessagesRaw ? JSON.parse(userMessagesRaw) : null;
        }

        // Retrieve sync interval for messages.
        const syncInterval = MyMessagesSyncTime();
        const autoSyncEnabled = syncInterval > 0;
        let isOutdated = false;
        if (userMessages && userMessages.lastSynced) {
            isOutdated = (new Date().getTime() - new Date(userMessages.lastSynced).getTime() > syncInterval);
        }

        // Decide whether to fetch new data:
        // - Fetch if no stored data exists.
        // - Or if a forced sync is requested.
        // - Or if auto-sync is enabled and stored data is outdated.
        // If auto-sync is off (syncInterval === 0) and data exists, use stored data unless sync is forced.
        if (!userMessages || sync || (autoSyncEnabled && isOutdated)) {
            if (syncInterval === 0 && !sync && userMessages) {
                // Auto-sync off: use stored data.
            } else {
                if (autoSyncEnabled && isOutdated) {
                    setRefresh(true);
                    setLoading(false);
                    Toast.show({
                        type: 'info',
                        text1: "Auto-Syncing Messages"
                    });
                }
                const result = await axios.post(`${auth.server.url}/student/messages`, {
                    reg_no: auth.reg_no,
                    password: auth.password,
                    pageIndex: pageIndex,
                    subject: subject ? subject : "",
                    description: description ? description : ""
                });
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
                    if (sync || !userMessages) {
                        setLastSynced(result.data.lastSynced);
                    }
                    Toast.show({
                        type: 'success',
                        text1: "Messages Synced",
                        text2: "Your messages have been synced successfully",
                    });
                    setIsError(false);
                    // Update local reference.
                    userMessages = result.data;
                } else {
                    Toast.show({
                        type: 'error',
                        text1: `${result.data.message}`,
                        text2: `${result.data.errorMessage}`,
                    });
                    // Restore previous page if available.
                    userStorage.set("MESSAGES-PAGE-NUMBER", JSON.stringify(currentPage));
                    setIsError(true);
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
            setIsError(false);
        }
        setLoading(false);
        setRefresh(false);
    } catch (error) {
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
        } else {
            setIsError(true);
            Toast.show({
                type: 'error',
                text1: "Error fetching Messages",
                text2: `${error.message}`
            });
        }
        setLoading(false);
        setRefresh(false);
    }
};

export const searchMyMessages = async (
    auth,
    pageCount,
    pageNumber,
    subject,
    description,
    cachedMessages,
    setMessages,
    setPageCount,
    setPages,
    setCurrentPage,
    setLastSynced,
    setLoading,
    setIsError,
) => {
    try {
        setLoading(true);

        const pageIndex = (pageCount && pageNumber) ? (pageCount - pageNumber) + 1 : 1;
        const cachedData = cachedMessages ? cachedMessages[pageNumber] : null;

        if (!cachedData) {
            const result = await axios.post(`${auth.server.url}/student/messages`, {
                reg_no: auth.reg_no,
                password: auth.password,
                pageIndex: pageIndex,
                subject: subject || "",
                description: description || ""
            });

            if (result.data.success) {
                const pageCountTemp = result.data.data[0].PageCount;
                const pageNumberTemp = (pageCountTemp - pageIndex) + 1;

                const pages = [];
                for (let i = 1; i <= pageCountTemp; i++) {
                    pages.push(i);
                }
                setPages(pages.reverse());
                setCurrentPage(pageNumberTemp);
                setPageCount(pageCountTemp);

                setMessages(prevState => ({
                    ...prevState,
                    [pageNumberTemp]: result.data
                }));

                setLastSynced(result.data.lastSynced);

                Toast.show({
                    type: 'success',
                    text1: "Messages Synced",
                    text2: "Your messages have been synced successfully",
                });
            } else {
                Toast.show({
                    type: 'error',
                    text1: `${result.data.message}`,
                    text2: `${result.data.errorMessage}`,
                });
            }
        } else {
            setCurrentPage(pageNumber);
            setPageCount(cachedData.data[0].PageCount);
            const pages = [];
            for (let i = 1; i <= cachedData.data[0].PageCount; i++) {
                pages.push(i);
            }
            setPages(pages.reverse());
            setLastSynced(cachedData.lastSynced);
        }

        setLoading(false);
        setIsError(false);
    } catch (error) {
        console.error(error);

        if (cachedMessages && cachedMessages[pageNumber]) {
            const cachedData = cachedMessages[pageNumber];
            setCurrentPage(pageNumber);
            setPageCount(cachedData.data[0].PageCount);
            const pages = [];
            for (let i = 1; i <= cachedData.data[0].PageCount; i++) {
                pages.push(i);
            }
            setPages(pages.reverse());
            setLastSynced(cachedData.lastSynced);
        }
        setLoading(false);
        setIsError(true);
    }
};

