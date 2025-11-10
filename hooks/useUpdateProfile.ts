import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";

export function useUpdateProfile() {
  const [isUpdating, setIsUpdating] = useState(false);
  const generateAvatarUploadUrl = useMutation(api.users.generateAvatarUploadUrl);
  const updateProfile = useMutation(api.users.updateProfile);

  const pickAvatar = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== "granted") {
      throw new Error("Permission to access media library was denied");
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      return result.assets[0];
    }

    return null;
  };

  const uploadAvatar = async (imageUri: string) => {
    try {
      // Step 1: Get upload URL
      const uploadUrl = await generateAvatarUploadUrl();

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
      throw new Error("Failed to upload avatar");
    }
  };

  const updateUserProfile = async (data: {
    name?: string;
    username?: string;
    bio?: string;
    avatarUri?: string;
  }) => {
    try {
      setIsUpdating(true);

      let avatarStorageId;
      if (data.avatarUri) {
        avatarStorageId = await uploadAvatar(data.avatarUri);
      }

      await updateProfile({
        name: data.name,
        username: data.username,
        bio: data.bio,
        avatarStorageId,
      });
    } catch (error) {
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    pickAvatar,
    updateUserProfile,
    isUpdating,
  };
}
