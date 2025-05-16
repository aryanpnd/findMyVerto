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
  TextInput,
  Alert,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { colors } from '../../../constants/colors';
import { AntDesign, Entypo, FontAwesome5, FontAwesome6, Octicons } from '@expo/vector-icons';
import { AuthContext } from '../../../../context/Auth';
import {
  loadCustomServers,
  loadServers,
  addCustomServer,
  deleteCustomServer,
} from '../../../../utils/settings/changeServer';
import { appStorage } from '../../../../utils/storage/storage';
import { WIDTH } from '../../../constants/styles';
import { useCustomAlert } from '../../miscellaneous/CustomAlert';
import LottieView from 'lottie-react-native';
import ButtonV1 from '../../miscellaneous/buttons/ButtonV1';

const ChangeServerBottomSheet = forwardRef((props, ref) => {
  const bottomSheetModalRef = useRef(null);
  const [globalServers, setGlobalServers] = useState([]);
  const [customServers, setCustomServers] = useState([]);
  const [addServerButtonLoading, setAddServerButtonLoading] = useState(false);

  // State to manage add server form
  const [isAddingServer, setIsAddingServer] = useState(false);
  const [newServerName, setNewServerName] = useState('');
  const [newServerUrl, setNewServerUrl] = useState('');

  const { auth, setAuth } = useContext(AuthContext);
  const customAlert = useCustomAlert();

  // Define the snap points for the bottom sheet
  const snapPoints = useMemo(() => ['55%', '55%', '80%'], []);

  // Expose open and close methods via the ref
  useImperativeHandle(ref, () => ({
    open: () => {
      bottomSheetModalRef.current?.present();
    },
    close: () => {
      bottomSheetModalRef.current?.dismiss();
    },
  }));


  // Load servers when the component mounts
  useEffect(() => {
    const servers = loadServers();
    setGlobalServers(servers);

    const custom = loadCustomServers();
    setCustomServers(custom);
  }, []);

  // When a server is selected, update the auth state and close the bottom sheet
  const handleServerSelect = (server, isCustom) => {
    if (isCustom) {
      appStorage.set('IS_CUSTOM_SERVER_SELECTED', true);
      appStorage.set('SELECTED_CUSTOM_SERVER', JSON.stringify(server));
      setAuth({ server });
    } else {
      appStorage.set('IS_CUSTOM_SERVER_SELECTED', false);
      setAuth({ server });
    }
    bottomSheetModalRef.current?.dismiss();
  };

  // Show the add server form
  const handleAddServer = () => {
    setIsAddingServer(true);
  };

  // Save the new server to custom servers list
  const handleSaveNewServer = async () => {
    if (!newServerName || !newServerUrl) {
      customAlert.show('Error', 'Please fill in all fields');
      return;
    }
    const newServer = {
      name: newServerName,
      url: newServerUrl,
      original: false,
    };
    // Persist the new server
    const response = await addCustomServer(newServer, setAddServerButtonLoading);
    if (response.success) {
      const custom = loadCustomServers();
      setCustomServers(custom);
      setNewServerName('');
      setNewServerUrl('');
      setIsAddingServer(false);
    } else {
      customAlert.show(
        'Invalid server URL',
        `${response.message}, refer to the documentation to host your own server`,
        [
          {
            text: 'Documentaion',
            color: colors.primary,
            textColor: 'white',
            onPress: () => Linking.openURL('https://github.com/aryanpnd/findmyverto'),
          },
          {
            text: 'OK',
            color: "black",
            textColor: 'white',
            onPress: () => console.log('OK Pressed'),
          },
        ]
      );
    }
  };

  // Cancel adding a new server
  const handleCancelAddServer = () => {
    setNewServerName('');
    setNewServerUrl('');
    setIsAddingServer(false);
  };

  const handleDeleteServer = (server) => {
    customAlert.show(
      "Delete Server",
      "Are you sure you want to delete this server?",
      [
        {
          text: "Delete",
          color: colors.red,
          textColor: "white",
          onPress: () => {
            deleteCustomServer(server);
            const custom = loadCustomServers();
            setCustomServers(custom);
          },
        },
        {
          text: "Cancel",
          color: "white",
          textColor: "black",
          onPress: () => console.log("Cancel Pressed"),
        },
      ]
    );
  }

  function handleHelp() {
    customAlert.show(
      "Help",
      "You can switch between servers or add a custom one by specifying a name and its root URL. Ensure the root URL does not include any paths—it should be the server's base URL. For example, if the server is hosted at xyz.com, the root URL should be xyz.com. If you're setting up your own server, refer to the documentation for proper configuration. (Note: Global servers rotate periodically to balance the load.)",
      [
        {
          text: "Documentaion",
          color: colors.primary,
          textColor: "white",
          onPress: () => Linking.openURL('https://github.com/aryanpnd/findmyverto')
        },
        {
          text: "OK",
          color: colors.primary,
          textColor: "white",
          onPress: () => console.log("OK Pressed"),
        },
      ]
    );
  }

  return (
    <BottomSheetModal 
    backdropComponent={(props) => (
      <BottomSheetBackdrop {...props} opacity={0.4} disappearsOnIndex={-1} />
    )}
    ref={bottomSheetModalRef} index={1} snapPoints={snapPoints}>
      <BottomSheetView style={styles.contentContainer}>
        <View style={styles.header}>
          <FontAwesome6 name="server" size={18} color="black" />
          <Text style={styles.title}>Change Server</Text>

          <TouchableOpacity onPress={handleHelp} style={{ marginLeft: 'auto' }}>
            <FontAwesome5 name="question-circle" size={24} color="black" />
          </TouchableOpacity>
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
                  auth.server.name === server.name && {
                    backgroundColor: colors.primary,
                    borderColor: colors.primary,
                  },
                ]}
                onPress={() => handleServerSelect(server)}
              >
                <Text
                  style={[
                    styles.serverName,
                    auth.server.name === server.name && { color: 'white' },
                  ]}
                >
                  {server.name}
                </Text>
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
            {!isAddingServer && (
              <TouchableOpacity onPress={handleAddServer}>
                <Text style={{ color: colors.primary }}>Add a Server</Text>
              </TouchableOpacity>
            )}
          </View>
          {isAddingServer && (
            <View style={styles.addServerForm}>
              <TextInput
                style={styles.input}
                placeholder="Server Name (eg: My Server)"
                value={newServerName}
                onChangeText={setNewServerName}
              />
              <TextInput
                style={styles.input}
                placeholder="Server root URL (eg: xyz.com)"
                value={newServerUrl}
                onChangeText={setNewServerUrl}
              />
              <View style={styles.formButtons}>
                <ButtonV1 disabled={addServerButtonLoading}
                  style={styles.saveButton} onPress={handleSaveNewServer}>
                  {addServerButtonLoading ?
                    <ActivityIndicator color="white" /> :
                    <Text style={styles.buttonText}>Save</Text>
                  }
                </ButtonV1>
                <ButtonV1 style={styles.cancelButton} onPress={handleCancelAddServer}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </ButtonV1>
              </View>
            </View>
          )}
          <ScrollView showsHorizontalScrollIndicator={false}>
            {customServers.length > 0 ? (
              customServers.map((server, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.customServerItem,
                    auth.server.name === server.name && {
                      backgroundColor: colors.primary,
                      borderColor: colors.primary,
                    },
                  ]}
                  onPress={() => handleServerSelect(server, true)}
                >
                  <View style={styles.customServerSubItem}>
                    <Text
                      numberOfLines={1} ellipsizeMode='middle'
                      style={[
                        styles.serverName,
                        { maxWidth: WIDTH(50) },
                        auth.server.name === server.name && { color: 'white' },
                      ]}
                    >
                      {server.name}
                    </Text>
                    <Text
                      style={[
                        styles.serverUrl,
                        auth.server.name === server.name && { color: 'white' },
                      ]}
                    >
                      {server.url}
                    </Text>
                  </View>

                  {auth.server.name !== server.name ?
                    <TouchableOpacity onPress={() => handleDeleteServer(server)} style={styles.customServerSubItem}>
                      <AntDesign name="delete" size={24} color={
                        auth.server.name === server.name ? 'white' : colors.red
                      } />
                    </TouchableOpacity>
                    :
                    <Octicons name="dot-fill" size={24} color={colors.green} />
                  }
                </TouchableOpacity>
              ))
            ) : (
              !isAddingServer && (
                <View style={{ alignItems: 'center', marginTop: 10 }}>
                  <LottieView
                    source={require('../../../../assets/lotties/empty.json')}
                    autoPlay
                    loop
                    style={{ width: 80, height: 80 }}
                  />
                  <Text style={styles.emptyText}>No custom servers available</Text>
                  <Text style={styles.emptyText}>Add a custom server</Text>
                  <TouchableOpacity onPress={() => Linking.openURL('https://github.com/aryanpnd/findmyverto')}>
                    <Text style={styles.emptyTextLink}>You can make one by following this documentation</Text>
                  </TouchableOpacity>
                </View>
              )
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
    marginTop: 10,
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
  customServerItem: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'grey',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    width: "100%"
  },
  customServerSubItem: {
    justifyContent: 'center',
  },
  serverName: {
    fontSize: 13,
  },
  serverUrl: {
    fontSize: 12,
    color: 'grey',
    maxWidth: WIDTH(50)
  },
  emptyText: {
    fontSize: 15,
    fontStyle: 'italic',
    color: 'grey',
    alignSelf: 'center',
  },
  emptyTextLink: {
    fontSize: 13,
    fontStyle: 'italic',
    color: colors.primary,
    alignSelf: 'center',
  },
  input: {
    height: 40,
    borderColor: 'grey',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  addServerForm: {
    marginBottom: 10,
  },
  formButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  saveButton: {
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
  },
  cancelButton: {
    backgroundColor: 'grey',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
});
