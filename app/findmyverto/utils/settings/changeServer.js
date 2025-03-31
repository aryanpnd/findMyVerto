import axios from "axios";
import { appStorage } from "../storage/storage";

/*
  This file contains functions to change the server URL in the app.
  The functions are used in the settings screen to change the server URL.
  appStorage Keys used: 
  SERVERS = list of global servers,
  CUSTOM_SERVERS = list of custom servers,
  IS_CUSTOM_SERVER_SELECTED = boolean to check if custom server is selected
  SELECTED_CUSTOM_SERVER = selected custom server

*/

export const loadServers = () => {
  const servers = appStorage.getString("SERVERS");
  if (servers) {
    const serversArray = JSON.parse(servers);
    return serversArray;
  } else {
    const savedServers = [
      {
        name: "Server 1",
        url: "https://findmyverto-dndxdgfsezc0gben.centralindia-01.azurewebsites.net/api/v2",
        original: true
      }
    ]
    appStorage.set("SERVERS", JSON.stringify(savedServers));
    return savedServers;
  }
}

export const fetchServers = async () => {
  await axios.get("https://fmv-servers-git-main-aryanpnds-projects.vercel.app/").then((res) => {
    if (res.data) {
      appStorage.set("SERVERS", JSON.stringify(res.data));
      return res.data;
    }
  }).catch((err) => {
    console.log(err);
    const servers = loadServers();
    return servers;
  });
}

export const loadCustomServers = () => {
  const servers = appStorage.getString("CUSTOM_SERVERS");
  if (servers) {
    const serversArray = JSON.parse(servers);
    return serversArray;
  }
  return [];
}


export const addCustomServer = async (server, setLoading) => {
  const servers = loadCustomServers();

  // const trimmedUrl = trimToRootUrl(server.url);
  // server.url = trimmedUrl;

  const existingServer = servers.find((s) => s.url === server.url+ "/api/v2");
  if (existingServer) {
    return { success: false, message: "Server already exists" };
  }

  try {
    setLoading(true);
    const response = await axios.get(server.url + "/status");
    if (response.status !== 200) {
      setLoading(false);
      
      return { success: false, message: "Check your URL, It should be the root url (eg: xyz.com)" };
    }
  } catch (err) {
    setLoading(false);
    console.log(server.url);
    console.log(err);
    return { success: false, message: "Check your URL, It should be the root url (eg: xyz.com)" };
  }
  setLoading(false);
  server.url = server.url + "/api/v2";
  servers.push(server);
  appStorage.set("CUSTOM_SERVERS", JSON.stringify(servers));
  return { success: true, message: "Server added successfully" };
};


export const deleteCustomServer = (server) => {
  const servers = loadCustomServers();
  const newServers = servers.filter((s) => s.url !== server.url);
  appStorage.set("CUSTOM_SERVERS", JSON.stringify(newServers));
}



const trimToRootUrl = (url) => {
  try {
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = "https://" + url;
    }
    const parsedUrl = new URL(url);
    return parsedUrl.origin;
  } catch (error) {
    return url;
  }
};
