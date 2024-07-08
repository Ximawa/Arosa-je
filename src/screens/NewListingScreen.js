import React, { useEffect, useState } from "react";
import axios from "axios";
import MapView, { Marker } from "react-native-maps";
import mime from "mime";
import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Pressable,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";
import DateTimePicker from "@react-native-community/datetimepicker";
import MapComponent from "../components/MapComponent";

const NewListingScreen = ({ navigation }) => {
  const [id_user, setIdUser] = useState(-1);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [markers, setMarkers] = useState([]); // [{ position: [latitude, longitude], title: "Title", description: "Description" }
  const [longitude, setLongitude] = useState(0);
  const [latitude, setLatitude] = useState(0);
  const [showMap, setShowMap] = useState(false);

  const [startDate, setStartDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const [file, setFile] = useState(null);

  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await SecureStore.getItemAsync("userToken");
        if (token) {
          const decoded = jwtDecode(token);
          setIdUser(decoded.id);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const onChangeStartDate = (event, selectedDate) => {
    const currentDate = selectedDate || startDate;
    setStartDate(currentDate);
    setShowStartDatePicker(false);
  };

  const onChangeEndDate = (event, selectedDate) => {
    const currentDate = selectedDate || endDate;
    setEndDate(currentDate);
    setShowEndDatePicker(false);
  };

  const onChangeStartTime = (event, selectedTime) => {
    const currentTime = selectedTime || startTime;
    setStartTime(currentTime);
    setShowStartTimePicker(false);
  };

  const onChangeEndTime = (event, selectedTime) => {
    const currentTime = selectedTime || endTime;
    setEndTime(currentTime);
    setShowEndTimePicker(false);
  };

  const handleCreateListing = async (e) => {
    const year = startDate.getFullYear();
    const month = startDate.getMonth();
    const day = startDate.getDate();
    const hours = startTime.getHours();
    const minutes = startTime.getMinutes();
    const endYear = endDate.getFullYear();
    const endMonth = endDate.getMonth();
    const endDay = endDate.getDate();
    const endHours = endTime.getHours();
    const endMinutes = endTime.getMinutes();
    const startDateTime = new Date(year, month, day, hours, minutes);
    const endDateTime = new Date(
      endYear,
      endMonth,
      endDay,
      endHours,
      endMinutes
    );

    e.preventDefault();
    try {
      const token = await SecureStore.getItemAsync("userToken");

      const response = await axios.post(
        "http://192.168.1.110:8000/CreateListing",
        {
          id_user: id_user,
          name: name,
          description: description,
          start_date: startDateTime
            .toISOString()
            .slice(0, -8)
            .replace("T", " "),
          end_date: endDateTime.toISOString().slice(0, -8).replace("T", " "),
          photo: file.fileName || "defaut.jpg",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.id) {
        const addressResponse = await axios.post(
          "http://192.168.1.110:8000/addAddress/",
          {
            listing_id: response.data.id,
            street: street,
            city: city,
            zipcode: zipcode,
            latitude: latitude,
            longitude: longitude,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!addressResponse.data.id) {
          throw new Error("Error adding address.");
        }
      }

      if (file && response.data.id) {
        const newImageUri = "file:///" + file.uri.split("file:/").join("");
        const formData = new FormData();
        formData.append("file", {
          uri: newImageUri,
          type: mime.getType(newImageUri),
          name: newImageUri.split("/").pop(),
        });

        console.log(formData);

        try {
          const uploadResponse = await fetch(
            `http://192.168.1.110:8000/upload/${response.data.id}`,
            {
              method: "POST",
              body: formData,
              headers: {
                accept: "application/json",
              },
            }
          );

          if (!uploadResponse.ok) {
            throw new Error(
              `Erreur HTTP : ${uploadResponse.status} - ${uploadResponse.statusText}`
            );
          }

          console.log("Fichier envoyé avec succès.");
          navigation.navigate("Listing");
        } catch (error) {
          console.error("Erreur lors de l'envoi du fichier:", error.message); // Show error message // Show stack trace
        }
      } else {
        console.error("File or response.data.id is not defined.");
      }
    } catch (error) {
      console.error("Error creating listing:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const handleGetLocation = async () => {
    const address = `${street}, ${city}, ${zipcode}`;
    const apiKey = "240a3a6dd9d4406598fa23bfdfb31f69"; // Make sure to replace this with your actual API key

    try {
      const response = await axios.get(
        "https://api.opencagedata.com/geocode/v1/json",
        {
          params: {
            q: address,
            key: apiKey,
          },
        }
      );

      const data = response.data;
      if (data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry;
        setLatitude(lat);
        setLongitude(lng);
        setMarkers([
          {
            position: [lat, lng],
            title: "Title",
            description: "Description",
          },
        ]);
        setShowMap(true);
      } else {
        console.log("No results found.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleHideMap = () => {
    setShowMap(false);
  };

  const handleChoosePhoto = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("You've refused to allow this app to access your photos!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setFile(result.assets[0]);
    }
  };

  const handleTakePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("You've refused to allow this app to access your camera!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      console.log("photo taken: ", result.assets[0]);
      setFile(result.assets[0]);
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        {error !== "" && <Text style={styles.errorText}>{error}</Text>}
        <TextInput
          placeholder="Name"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
        <TextInput
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          style={styles.input}
        />
        <TextInput
          placeholder="Street"
          onChangeText={setStreet}
          value={street}
          style={styles.input}
        />
        <TextInput
          placeholder="City"
          onChangeText={setCity}
          value={city}
          style={styles.input}
        />
        <TextInput
          placeholder="Zipcode"
          onChangeText={setZipcode}
          value={zipcode}
          style={styles.input}
        />
        <Button title="Valider la location" onPress={handleGetLocation} />
        <View style={styles.buttonContainer}>
          <Button
            onPress={() => setShowStartDatePicker(true)}
            title="Choose Start Date"
          />
          {showStartDatePicker && (
            <DateTimePicker
              testID="dateTimePicker"
              value={startDate}
              mode="date"
              is24Hour={true}
              display="default"
              onChange={onChangeStartDate}
            />
          )}
          <Button
            onPress={() => setShowStartTimePicker(true)}
            title="Choose start time"
          />
          {showStartTimePicker && (
            <DateTimePicker
              testID="dateTimePicker"
              value={startTime}
              mode="time"
              is24Hour={true}
              display="default"
              onChange={onChangeStartTime}
            />
          )}
        </View>
        <View style={styles.buttonContainer}>
          <Button
            onPress={() => setShowEndDatePicker(true)}
            title="Choose End Date"
          />
          {showEndDatePicker && (
            <DateTimePicker
              testID="dateTimePicker"
              value={endDate}
              mode="date"
              is24Hour={true}
              display="default"
              onChange={onChangeEndDate}
            />
          )}
          <Button
            onPress={() => setShowEndTimePicker(true)}
            title="Choose end time"
          />
          {showEndTimePicker && (
            <DateTimePicker
              testID="dateTimePicker"
              value={endTime}
              mode="time"
              is24Hour={true}
              display="default"
              onChange={onChangeEndTime}
            />
          )}
        </View>
        <View style={styles.buttonContainer}>
          <Button title="Choose Photo" onPress={handleChoosePhoto} />
          <Button title="Take Photo" onPress={handleTakePhoto} />
        </View>
        {file && (
          <Image source={{ uri: file.uri }} style={styles.previewImage} />
        )}
        {showMap && (
          <MapComponent
            latitude={latitude}
            longitude={longitude}
            markers={markers}
          />
        )}
        {showMap ? (
          <>
            <Pressable style={styles.button} onPress={handleHideMap}>
              <Text style={styles.text}>Fermer la carte</Text>
            </Pressable>
          </>
        ) : (
          <Pressable style={styles.button} onPress={handleCreateListing}>
            <Text style={styles.text}>Ajouter une annonce</Text>
          </Pressable>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  input: {
    width: "100%",
    margin: 10,
    borderWidth: 1,
    padding: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  previewImage: {
    width: 100,
    height: 100,
    marginTop: 20,
  },
  button: {
    marginTop: 20,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#3B543B",
  },
  text: {
    color: "white",
  },
  errorText: {
    color: "red",
    marginBottom: 12,
    textAlign: "center",
  },
});

export default NewListingScreen;
