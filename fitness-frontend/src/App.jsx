// import { Box, Button, Typography } from "@mui/material";
// import { useContext, useEffect, useState } from "react";
// import { AuthContext } from "react-oauth2-code-pkce";
// import { useDispatch } from "react-redux";
// import { BrowserRouter as Router, Navigate, Route, Routes, useLocation } from "react-router";
// import { setCredentials } from "./store/authSlice";
// import ActivityForm from "./components/ActivityForm";
// import ActivityList from "./components/ActivityList";
// import ActivityDetail from "./components/ActivityDetail";

// const ActvitiesPage = () => {
//   return (<Box sx={{ p: 2, border: '1px dashed grey' }}>
//     <ActivityForm onActivityAdded = {() => window.location.reload()} />
//     <ActivityList />
//   </Box>);
// }

// function App() {
//   const { token, tokenData, logIn, logOut, isAuthenticated } = useContext(AuthContext);
//   const dispatch = useDispatch();
//   const [authReady, setAuthReady] = useState(false);
  
//   useEffect(() => {
//     if (token) {
//       dispatch(setCredentials({token, user: tokenData}));
//       setAuthReady(true);
//     }
//   }, [token, tokenData, dispatch]);

//   return (
//     <Router>
//       {!token ? (
//       <Box
//       sx={{
//         height: "100vh",
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         justifyContent: "center",
//         textAlign: "center",
//       }}
//     >
//       <Typography variant="h4" gutterBottom>
//         Welcome to the Fitness Tracker App
//       </Typography>
//       <Typography variant="subtitle1" sx={{ mb: 3 }}>
//         Please login to access your activities
//       </Typography>
//       <Button variant="contained" color="primary" size="large" onClick={() => {
//                 logIn();
//               }}>
//         LOGIN
//       </Button>
//     </Box>
//             ) : (
//               // <div>
//               //   <pre>{JSON.stringify(tokenData, null, 2)}</pre>
//               //   <pre>{JSON.stringify(token, null, 2)}</pre>
//               // </div>

             

//               <Box sx={{ p: 2, border: '1px dashed grey' }}>
//                  <Button variant="contained" color="secondary" onClick={logOut}>
//                   Logout
//                 </Button>
//               <Routes>
//                 <Route path="/activities" element={<ActvitiesPage />}/>
//                 <Route path="/activities/:id" element={<ActivityDetail />}/>

//                 <Route path="/" element={token ? <Navigate to="/activities" replace/> : <div>Welcome! Please Login.</div>} />
//               </Routes>
//             </Box>
//             )}
//     </Router>
//   )
// }

// export default App




// App.jsx
import { Box, Button, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "react-oauth2-code-pkce";
import { useDispatch } from "react-redux";
import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router";
import { setCredentials } from "./store/authSlice";
import ActivityForm from "./components/ActivityForm";
import ActivityList from "./components/ActivityList";
import ActivityDetail from "./components/ActivityDetail";
import { registerUserProfile } from "./services/api"; // ✅ import

const ActvitiesPage = () => (
  <Box sx={{ p: 2, border: "1px dashed grey" }}>
    <ActivityForm onActivityAdded={() => window.location.reload()} />
    <ActivityList />
  </Box>
);

function App() {
  const { token, tokenData, logIn, logOut } = useContext(AuthContext);
  const dispatch = useDispatch();
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    // only run when we have a token and haven't finished bootstrap
    if (!token || !tokenData || authReady) return;

    const bootstrapUser = async () => {
      try {
        // 1) Store token for axios interceptor
        localStorage.setItem("token", token);

        // 2) Build payload for /api/users/register
        const keycloakId = tokenData.sub; // Keycloak user id
        const email = tokenData.email;
        const firstName =
          tokenData.given_name ||
          (tokenData.name ? tokenData.name.split(" ")[0] : "");
        const lastName =
          tokenData.family_name ||
          (tokenData.name ? tokenData.name.split(" ").slice(1).join(" ") : "");

        // NOTE: you do NOT know the real password here.
        // If UserService never uses password for login (only Keycloak does),
        // you can store a placeholder/random value:
        const password = keycloakId; // or any random string

        const payload = {
          email,
          password,
          keycloakId,
          firstName,
          lastName,
        };

        // 3) Call your user-service register endpoint via gateway
        const { data: user } = await registerUserProfile(payload);

        // 4) Save userId so it’s added to X-User-ID by the interceptor
        localStorage.setItem("userId", user.id);

        // 5) Let Redux know about auth
        dispatch(setCredentials({ token, user: tokenData, userId: user.id }));

        setAuthReady(true);
      } catch (err) {
        console.error("Error bootstrapping user profile:", err);
        // you may optionally handle UI error here
      }
    };

    bootstrapUser();
  }, [token, tokenData, authReady, dispatch]);

  return (
    <Router>
      {!token || !authReady ? (
        // 🔐 Not logged in, or still bootstrapping user in DB
        <Box
          sx={{
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <Typography variant="h4" gutterBottom>
            Welcome to the Fitness Tracker App
          </Typography>
          <Typography variant="subtitle1" sx={{ mb: 3 }}>
            Please login to access your activities
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => logIn()}
          >
            LOGIN
          </Button>
        </Box>
      ) : (
        // ✅ Logged in and user registered in your DB
        <Box sx={{ p: 2, border: "1px dashed grey" }}>
          <Button variant="contained" color="secondary" onClick={logOut}>
            Logout
          </Button>
          <Routes>
            <Route path="/activities" element={<ActvitiesPage />} />
            <Route path="/activities/:id" element={<ActivityDetail />} />
            <Route
              path="/"
              element={<Navigate to="/activities" replace />}
            />
          </Routes>
        </Box>
      )}
    </Router>
  );
}

export default App;