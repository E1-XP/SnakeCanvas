import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCnMrAfDOOfFaJjVoVmyWc9USyZpZBDX-c",
  authDomain: "ralfiksnake.firebaseapp.com",
  projectId: "ralfiksnake",
  storageBucket: "ralfiksnake.appspot.com",
  messagingSenderId: "107660310983",
  appId: "1:107660310983:web:0a367569d9ef33fc9181e2",
  measurementId: "G-NZRC39392L",
};

export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);