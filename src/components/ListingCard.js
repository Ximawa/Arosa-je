import React, { useEffect, useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import {
  View,
  Button,
  StyleSheet,
  Text,
  Image,
  Pressable,
  TextComponent,
} from "react-native"; // Import Image

const ListingCard = ({ id, name, start_date, end_date, onClick, children }) => {
  const [imageSrc, setImageSrc] = useState(null);

  useEffect(() => {
    const getImage = async () => {
      try {
        const response = await axios.get(
          `http://192.168.1.110:8000/get_image/${id}`,
          {
            responseType: "blob", // Change this to 'blob'
          }
        );
        const reader = new FileReader();
        reader.readAsDataURL(response.data);
        reader.onloadend = () => {
          const base64data = reader.result;
          setImageSrc(base64data);
        };
      } catch (error) {
        console.error("Error fetching image:", error);
      }
    };

    getImage();
  }, [id]);

  return (
    <View onPress={() => onClick(id)} style={styles.container}>
      {imageSrc && <Image source={{ uri: imageSrc }} style={styles.image} />}
      <Text style={styles.text}>{name}</Text>
      <Text style={styles.text}>Start Date: {start_date}</Text>
      <Text style={styles.text}>End Date: {end_date}</Text>
      <Pressable
        title="Voir plus"
        onPress={() => onClick(id)}
        style={styles.button}
      >
        <Text style={styles.text}>Voir plus</Text>
      </Pressable>
    </View>
  );
};

ListingCard.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  start_date: PropTypes.string.isRequired,
  end_date: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
    margin: 20,
    backgroundColor: "#063b39",
    border: "1px solid #000",
    borderRadius: 12,
  },
  image: {
    width: 200, // Example width
    height: 200,
    borderRadius: 12, // Example height
  },
  button: {
    marginTop: 5, // Increase the value for more space
    marginBottom: 20, // Increase the value for more space
    backgroundColor: "#977757",
    padding: 10,
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
    textAlign: "center",
  },
  text: {
    color: "white",
  },
});

export default ListingCard;
