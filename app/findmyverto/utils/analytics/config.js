import { vexo, identifyDevice } from 'vexo-analytics';
import * as SecureStore from 'expo-secure-store';


// Function to retrieve or generate a unique identifier
async function getUniqueIdentifier() {
    try {
        // Attempt to retrieve the reg_no from secure storage
        let identifier = await SecureStore.getItemAsync('REG_NO');

        // If reg_no doesn't exist, check for an anonymous identifier
        if (!identifier) {
            identifier = await SecureStore.getItemAsync('anonymous_id');

            // If no anonymous identifier exists, generate one
            if (!identifier) {
                identifier = "Not_logged_in_" + Date.now();
                await SecureStore.setItemAsync('anonymous_id', identifier);
            }
        }

        return identifier;
    } catch (error) {
        console.error('Error retrieving identifier:', error);
        return null;
    }
}

// Initialize Vexo and identify the user
export async function initializeAnalytics() {
    if (!__DEV__) {
        vexo('8a27e79d-a279-476a-83c8-8e47bbb57d3f');

        const identifier = await getUniqueIdentifier();
        if (identifier) {
            await identifyDevice(identifier);
        }
    }
}

