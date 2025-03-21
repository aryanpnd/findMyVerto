import { Dimensions } from "react-native";

export const globalStyles = {

    elevation: {
      shadowColor: "#000000",
      shadowOffset: {
        width: 0,
        height: 10 * 1.8, 
      },
      shadowOpacity: 10 * 0.025, 
      shadowRadius: 10 * 2,      
      elevation: 10,
    },
    elevationMin: {
      shadowColor: "#000000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity:  0.17,
      shadowRadius: 2.54,
      elevation: 3
    },
}

export const WIDTH = (value)=> Dimensions.get('window').width * value / 100;
export const HEIGHT = (value)=> Dimensions.get('window').height * value / 100;

export const blurHash = "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj["
