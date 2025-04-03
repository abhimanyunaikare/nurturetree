// import React, { useState } from "react";
// import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
// import { useRouter } from "expo-router";
// import { signUp, logIn, logOut } from "@/hooks/authService";
// import * as Google from "expo-auth-session/providers/google";
// import { auth } from "@/constants/firebaseConfig";



// const AuthScreen: React.FC = () => {
//   const router = useRouter();
//   const [email, setEmail] = useState<string>("");
//   const [password, setPassword] = useState<string>("");
//   const [isLogin, setIsLogin] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [name, setName] = useState(""); // New state for name


//   const [request, response, promptAsync] = Google.useAuthRequest({
//       expoClientId: "YOUR_EXPO_CLIENT_ID",
//       androidClientId: "YOUR_ANDROID_CLIENT_ID",
//   });



//   useEffect(() => {
//       if (response?.type === "success") {
//           const { id_token } = response.params;
//           const credential = GoogleAuthProvider.credential(id_token);
//           signInWithCredential(auth, credential);
//       }
//   }, [response]);

//   const handleAuth = async () => {
//     setError(null);
//     try {
//       if (isLogin) {
//         await logIn(email, password);
//       } else {
//         await signUp(email, password);
//       }
//       router.replace("/"); // Redirect after successful login/signup
//     } catch (err: any) {
//       setError(err.message);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>{isLogin ? "Login" : "Sign Up"}</Text>
//       {error && <Text style={styles.errorText}>{error}</Text>}

      
//         <TextInput
//           style={styles.input}
//           placeholder="Name"
//           value={name}
//           onChangeText={setName}
//         />
      

//       <TextInput
//         style={styles.input}
//         placeholder="Email"
//         value={email}
//         onChangeText={setEmail}
//         keyboardType="email-address"
//         autoCapitalize="none"
//       />

//       <TextInput
//         style={styles.input}
//         placeholder="Password"
//         value={password}
//         onChangeText={setPassword}
//         secureTextEntry
//       />

//       <TouchableOpacity style={styles.googleButton} onPress={() => promptAsync()}>
//                 <Text style={styles.buttonText}>Sign in with Google</Text>
//             </TouchableOpacity>
//       <TouchableOpacity style={styles.button} onPress={handleAuth}>

//         <Text style={styles.buttonText}>{isLogin ? "Login" : "Sign Up"}</Text>
//       </TouchableOpacity>

//       <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
//         <Text style={styles.toggleText}>
//           {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
//         </Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 20,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 20,
//   },
//   input: {
//     width: "100%",
//     padding: 12,
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 8,
//     marginBottom: 12,
//   },
//   button: {
//     backgroundColor: "#007bff",
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//     borderRadius: 8,
//     marginTop: 10,
//   },
//   buttonText: {
//     color: "#fff",
//     fontSize: 16,
//   },
//   toggleText: {
//     marginTop: 10,
//     color: "#007bff",
//   },
//   errorText: {
//     color: "red",
//     marginBottom: 10,
//   },
// });

// export default AuthScreen;
