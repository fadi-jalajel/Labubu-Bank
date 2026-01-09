import * as ImagePicker from "expo-image-picker";

interface LabubuInfo {
  username: string;
  password: string;
  displayname?: string;
  image: null | ImagePicker.ImagePickerSuccessResult;
}

interface LabubuSigninInfo {
  username: string;
  password: string;
}

export { LabubuInfo, LabubuSigninInfo };
