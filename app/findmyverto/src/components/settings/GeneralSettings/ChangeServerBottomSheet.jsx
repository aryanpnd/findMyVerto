import React, {
  useMemo,
  useRef,
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
  useContext,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { colors } from '../../../constants/colors';
import { Entypo, FontAwesome6 } from '@expo/vector-icons';
import { AuthContext } from '../../../../context/Auth';
import { loadCustomServers, loadServers } from '../../../../utils/settings/changeServer';

const ChangeServerBottomSheet = forwardRef((props, ref) => {
  const bottomSheetModalRef = useRef(null);
  const [globalServers, setGlobalServers] = useState([]);
  const [customServers, setCustomServers] = useState([]);
  const [selectedGlobalServer, setSelectedGlobalServer] = useState({});

  const { auth,setAuth } = useContext(AuthContext);

  // Define the snap points for the bottom sheet
  const snapPoints = useMemo(() => ['25%', '50%'], []);

  // Expose open and close methods via the ref
  useImperativeHandle(ref, () => ({
    open: () => {
      bottomSheetModalRef.current?.present();
    },
    close: () => {
      bottomSheetModalRef.current?.dismiss();
    },
  }));

  useEffect(() => {
    setSelectedGlobalServer(auth.server);
  }, [auth.server]);

  // Load servers when the component mounts
  useEffect(() => {
    const servers = loadServers();
    setGlobalServers(servers);

    const custom = loadCustomServers();
    setCustomServers(custom);
  }, []);

  // When a server is selected, update the auth state and close the bottom sheet
  const handleServerSelect = (server) => {
    setAuth({ server });
    bottomSheetModalRef.current?.dismiss();
  };

  // Handler for the "Add a Server" button.
  // You could, for example, open another modal to add a custom server.
  const handleAddServer = () => {
    if (props.onAddServer) {
      props.onAddServer();
    }
  };

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={1}
      snapPoints={snapPoints}
    >
      <BottomSheetView style={styles.contentContainer}>
        <View style={styles.header}>
          <FontAwesome6 name="server" size={18} color="black" />
          <Text style={styles.title}>Change Server</Text>
        </View>

        {/* Global Servers Section */}
        <View style={styles.subCategory}>
          <View style={styles.subCategoryHeader}>
            <View style={styles.subCategoryTitleContainer}>
              <Entypo name="globe" size={13} color="grey" />
              <Text style={styles.subCategoryTitle}>Global Servers</Text>
            </View>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {globalServers.map((server, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.serverItem,
                  selectedGlobalServer.name===server.name&&{backgroundColor:colors.primary, borderColor:colors.primary}
                ]}
                onPress={() => handleServerSelect(server)}
              >
                <Text style={[
                  styles.serverName,
                  selectedGlobalServer.name===server.name&&{color:'white'}
                  ]}>{server.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Custom Servers Section */}
        <View style={styles.subCategory}>
          <View style={styles.subCategoryHeader}>
            <View style={styles.subCategoryTitleContainer}>
              <FontAwesome6 name="computer" size={13} color="grey" />
              <Text style={styles.subCategoryTitle}>Custom Servers</Text>
            </View>
            <TouchableOpacity onPress={handleAddServer}>
              <Text style={{ color: colors.primary }}>Add a Server</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {customServers.length > 0 ? (
              customServers.map((server, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.serverItem}
                  onPress={() => handleServerSelect(server)}
                >
                  <Text style={styles.serverName}>{server.name}</Text>
                  <Text style={styles.serverUrl}>{server.url}</Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.emptyText}>No custom servers available</Text>
            )}
          </ScrollView>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

export default ChangeServerBottomSheet;

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subCategory: {
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  subCategoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  subCategoryTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  subCategoryTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: 'grey',
  },
  serverItem: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'grey',
    marginRight: 10,
    alignItems: 'center',
  },
  serverName: {
    fontSize: 13
  },
  serverUrl: {
    fontSize: 12,
    color: 'grey',
  },
  emptyText: {
    fontStyle: 'italic',
    color: 'grey',
    alignSelf: 'center',
  },
});
