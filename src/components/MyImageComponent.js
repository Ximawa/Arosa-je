import React from "react";
import { Image } from "react-native";

const MyImageComponent = ({ imageUrl }) => (
  <Image source={{ uri: imageUrl }} style={{ width: 200, height: 200 }} />
);
