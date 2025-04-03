// import React, { createContext, useState, useEffect, ReactNode } from "react";
// import { User } from "firebase/auth";
// import { onAuthStateChange, getStoredUser } from "@/hooks/authService"; // Adjust path accordingly

// interface UserContextType {
//   user: User | null;
//   setUser: React.Dispatch<React.SetStateAction<User | null>>;}

// export const UserContext = createContext<UserContextType | undefined>(undefined);

// export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
//   const [user, setUser] = useState<User | null>(null);

//   useEffect(() => {
//     // Load user from AsyncStorage first
//     const checkUser = async () => {
//       const storedUser = await getStoredUser();
//       if (storedUser) {
//         setUser(storedUser);
//       }
//     };

//     // Listen for auth changes
//     const unsubscribe = onAuthStateChange((authUser) => {
//       if (authUser) {
//         setUser(authUser);
//       } else {
//         checkUser();
//       }
//     });
//     return () => unsubscribe();
//   }, []);

//   return (
//     <UserContext.Provider value={{ user, setUser }}>
//       {children}
//     </UserContext.Provider>
//   );
// };
