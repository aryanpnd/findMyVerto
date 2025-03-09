import { appStorage } from "../storage/storage";

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


// export const addServer = (server) => {
//   const servers = loadServers();
//   servers.push(server);
//   appStorage.set("SERVERS", JSON.stringify(servers));
// }

export const loadCustomServers = () => {
  const servers = appStorage.getString("CUSTOM_SERVERS");
  if (servers) {
    const serversArray = JSON.parse(servers);
    return serversArray;
  }
  return [];
}

export const addCustomServer = (server) => {
  const servers = loadCustomServers();
  servers.push(server);
  appStorage.set("CUSTOM_SERVERS", JSON.stringify(servers));
}
