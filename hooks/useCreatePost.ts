import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";

export function useCreatePost() {
  const [isUploading, setIsUploading] = useState(false);
  const generateUploadUrl = useMutation(api.posts.generateUploadUrl);
  const createPost = useMutation(api.posts.createPost);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== "granted") {
      throw new Error("Permission to access media library was denied");
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      return result.assets[0];
    }

    return null;
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== "granted") {
      throw new Error("Permission to access camera was denied");
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      return result.assets[0];
    }

    return null;
  };

  const uploadImage = async (imageUri: string) => {
    try {
      // Step 1: Get upload URL
      const uploadUrl = await generateUploadUrl();

      // Step 2: Fetch the image and convert to blob
      const response = await fetch(imageUri);
      const blob = await response.blob();

      // Step 3: Upload to Convex storage
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": blob.type },
        body: blob,
      });

      const { storageId } = await result.json();
      return storageId;
    } catch (error) {
      throw new Error("Failed to upload image");
    }
  };

  const createPostWithImage = async (caption?: string, imageUri?: string) => {
    try {
      setIsUploading(true);

      let storageId;
      if (imageUri) {
        storageId = await uploadImage(imageUri);
      }

      const postId = await createPost({
        caption,
        imageStorageId: storageId,
      });

      return postId;
    } catch (error) {
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    pickImage,
    takePhoto,
    createPostWithImage,
    isUploading,
  };
}
