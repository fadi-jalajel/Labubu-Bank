import * as ImagePicker from "expo-image-picker";

interface LabubuInfo {
  username: string;
  password: string;
  displayname?: string;
  //imageUri: null | string;
  //imageUri: null | ImagePicker.ImagePickerSuccessResult;
  // imageUri: ImagePicker.ImagePickerAsset[] | null;
  image: ImagePicker.ImagePickerAsset | null;
}

interface LabubuSigninInfo {
  username: string;
  password: string;
}

export { LabubuInfo, LabubuSigninInfo };
