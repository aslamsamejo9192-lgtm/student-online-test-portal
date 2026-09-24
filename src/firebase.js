/**
 * Study Hub - Firebase Configuration & Data Access Layer
 * Handles Firebase Authentication, Firestore, and seamless LocalStorage fallback for demo/offline development.
 */

import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged
} from "firebase/auth";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy
} from "firebase/firestore";
import { INITIAL_DEMO_TESTS, INITIAL_DEMO_RESULTS } from "./data/demoData";

// Environment variable reading
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || ""
};

// Check if Firebase credentials have been supplied
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.apiKey.length > 5 &&
  !firebaseConfig.apiKey.includes("MY_") &&
  firebaseConfig.projectId
);

let app = null;
let auth = null;
let db = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (err) {
    console.warn("Firebase initialization warning, falling back to local simulation:", err);
  }
}

export { app, auth, db };

// -------------------------------------------------------------
// LOCAL STORAGE SIMULATION ENGINE (Active when Firebase keys are pending)
// -------------------------------------------------------------
const LS_KEYS = {
  USERS: "studyhub_users",
  CURRENT_USER: "studyhub_curr_user",
  TESTS: "studyhub_tests",
  RESULTS: "studyhub_results"
};

function initLocalStorage() {
  if (typeof window === "undefined") return;

  // Clean up any legacy demo tests
  const existingTests = JSON.parse(localStorage.getItem(LS_KEYS.TESTS) || "[]");
  const cleanedTests = existingTests.filter(
    (t) => t.id !== "mbbs-anatomy-101" && t.id !== "cs-web-dev-201"
  );
  localStorage.setItem(LS_KEYS.TESTS, JSON.stringify(cleanedTests));

  // Clean up any legacy demo results
  const existingResults = JSON.parse(localStorage.getItem(LS_KEYS.RESULTS) || "[]");
  const cleanedResults = existingResults.filter(
    (r) => r.id !== "sample-res-1" && r.userId !== "demo-student-id"
  );
  localStorage.setItem(LS_KEYS.RESULTS, JSON.stringify(cleanedResults));

  // If a demo student was previously cached, remove it so student must register
  const currUser = JSON.parse(localStorage.getItem(LS_KEYS.CURRENT_USER) || "null");
  if (currUser && (currUser.uid === "demo-student-id" || currUser.email === "student@studyhub.com")) {
    localStorage.removeItem(LS_KEYS.CURRENT_USER);
  }

  // Ensure administrator account is available for portal administration
  const existingUsers = JSON.parse(localStorage.getItem(LS_KEYS.USERS) || "[]");
  const cleanedUsers = existingUsers.filter(
    (u) => u.uid !== "demo-student-id" && u.email !== "student@studyhub.com"
  );
  if (!cleanedUsers.some((u) => u.role === "admin")) {
    cleanedUsers.push({
      uid: "admin-default-id",
      name: "System Administrator",
      email: "admin@studyhub.com",
      role: "admin",
      password: "adminPassword123!",
      createdAt: new Date().toISOString()
    });
  }
  localStorage.setItem(LS_KEYS.USERS, JSON.stringify(cleanedUsers));
}

// Run initializer
initLocalStorage();

// -------------------------------------------------------------
// AUTHENTICATION SERVICES
// -------------------------------------------------------------

/**
 * Register a new student or admin
 */
export async function registerUser(name, email, password, role = "student") {
  const cleanEmail = email.trim().toLowerCase();

  if (isFirebaseConfigured && auth && db) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, password);
      const user = userCredential.user;
      
      await updateProfile(user, { displayName: name });

      // Save user profile in Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userData = {
        name: name.trim(),
        email: cleanEmail,
        role: role,
        createdAt: new Date().toISOString()
      };
      await setDoc(userDocRef, userData);

      return {
        uid: user.uid,
        name: name.trim(),
        email: cleanEmail,
        role: role
      };
    } catch (err) {
      console.error("Firebase Registration Error:", err);
      throw new Error(formatAuthError(err));
    }
  }

  // Fallback simulation
  const users = JSON.parse(localStorage.getItem(LS_KEYS.USERS) || "[]");
  if (users.some((u) => u.email === cleanEmail)) {
    throw new Error("This email is already registered. Please login instead.");
  }

  const newUser = {
    uid: "usr-" + Date.now() + "-" + Math.random().toString(36).substring(2, 7),
    name: name.trim(),
    email: cleanEmail,
    role: role,
    password: password,
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  localStorage.setItem(LS_KEYS.USERS, JSON.stringify(users));

  const authUser = {
    uid: newUser.uid,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role
  };
  localStorage.setItem(LS_KEYS.CURRENT_USER, JSON.stringify(authUser));
  triggerLocalAuthSubscribers(authUser);
  return authUser;
}

/**
 * Login user with email & password
 */
export async function loginUser(email, password) {
  const cleanEmail = email.trim().toLowerCase();

  if (isFirebaseConfigured && auth && db) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, password);
      const user = userCredential.user;

      // Fetch user role from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      let role = "student";
      let name = user.displayName || "User";

      if (userDoc.exists()) {
        const data = userDoc.data();
        role = data.role || "student";
        name = data.name || name;
      } else {
        // Create user document if missing
        await setDoc(doc(db, "users", user.uid), {
          name: name,
          email: user.email,
          role: "student",
          createdAt: new Date().toISOString()
        });
      }

      return {
        uid: user.uid,
        name: name,
        email: user.email,
        role: role
      };
    } catch (err) {
      console.error("Firebase Login Error:", err);
      throw new Error(formatAuthError(err));
    }
  }

  // Fallback simulation
  const users = JSON.parse(localStorage.getItem(LS_KEYS.USERS) || "[]");
  const found = users.find((u) => u.email === cleanEmail);

  if (!found) {
    throw new Error("No user found with this email. Please register first.");
  }
  if (found.password && found.password !== password) {
    throw new Error("Incorrect password. Please try again.");
  }

  const authUser = {
    uid: found.uid,
    name: found.name,
    email: found.email,
    role: found.role || "student"
  };
  localStorage.setItem(LS_KEYS.CURRENT_USER, JSON.stringify(authUser));
  triggerLocalAuthSubscribers(authUser);
  return authUser;
}

/**
 * Logout currently signed in user
 */
export async function logoutUser() {
  if (isFirebaseConfigured && auth) {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("SignOut error:", err);
    }
  }
  localStorage.removeItem(LS_KEYS.CURRENT_USER);
  triggerLocalAuthSubscribers(null);
}

/**
 * Send password reset email
 */
export async function resetPassword(email) {
  const cleanEmail = email.trim().toLowerCase();
  if (isFirebaseConfigured && auth) {
    try {
      await sendPasswordResetEmail(auth, cleanEmail);
      return true;
    } catch (err) {
      console.error("Password reset error:", err);
      throw new Error(formatAuthError(err));
    }
  }

  // Local simulation check
  const users = JSON.parse(localStorage.getItem(LS_KEYS.USERS) || "[]");
  const found = users.some((u) => u.email === cleanEmail);
  if (!found) {
    throw new Error("No user found with this email address.");
  }
  return true;
}

/**
 * Update user profile
 */
export async function updateUserProfile(uid, { name, role }) {
  if (isFirebaseConfigured && auth && db) {
    try {
      if (name && auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: name });
      }
      const userRef = doc(db, "users", uid);
      const updates = {};
      if (name) updates.name = name;
      if (role) updates.role = role;
      await updateDoc(userRef, updates);
      return true;
    } catch (err) {
      console.error("Profile update error:", err);
      throw err;
    }
  }

  // Local fallback
  const users = JSON.parse(localStorage.getItem(LS_KEYS.USERS) || "[]");
  const updatedUsers = users.map((u) => {
    if (u.uid === uid) {
      return { ...u, name: name || u.name, role: role || u.role };
    }
    return u;
  });
  localStorage.setItem(LS_KEYS.USERS, JSON.stringify(updatedUsers));

  const curr = JSON.parse(localStorage.getItem(LS_KEYS.CURRENT_USER) || "null");
  if (curr && curr.uid === uid) {
    const updatedCurr = { ...curr, name: name || curr.name, role: role || curr.role };
    localStorage.setItem(LS_KEYS.CURRENT_USER, JSON.stringify(updatedCurr));
    triggerLocalAuthSubscribers(updatedCurr);
  }
  return true;
}

// -------------------------------------------------------------
// AUTH STATE LISTENER HOOK HELPER
// -------------------------------------------------------------
const localAuthSubscribers = new Set();
function triggerLocalAuthSubscribers(user) {
  localAuthSubscribers.forEach((cb) => {
    try {
      cb(user);
    } catch (e) {
      console.error(e);
    }
  });
}

export function subscribeToAuthChanges(callback) {
  if (isFirebaseConfigured && auth && db) {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          let role = "student";
          let name = firebaseUser.displayName || "User";
          if (userDoc.exists()) {
            const data = userDoc.data();
            role = data.role || "student";
            name = data.name || name;
          }
          callback({
            uid: firebaseUser.uid,
            name: name,
            email: firebaseUser.email,
            role: role
          });
        } catch (e) {
          console.error("Error reading user doc on auth change:", e);
          callback({
            uid: firebaseUser.uid,
            name: firebaseUser.displayName || "User",
            email: firebaseUser.email,
            role: "student"
          });
        }
      } else {
        callback(null);
      }
    });
    return unsubscribe;
  }

  // Simulation mode
  localAuthSubscribers.add(callback);
  const current = JSON.parse(localStorage.getItem(LS_KEYS.CURRENT_USER) || "null");
  callback(current);
  return () => {
    localAuthSubscribers.delete(callback);
  };
}

// -------------------------------------------------------------
// TESTS CRUD SERVICES
// -------------------------------------------------------------

/**
 * Fetch all tests
 */
export async function getTests() {
  if (isFirebaseConfigured && db) {
    try {
      const q = query(collection(db, "tests"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const tests = [];
      snapshot.forEach((docSnap) => {
        tests.push({ id: docSnap.id, ...docSnap.data() });
      });
      if (tests.length > 0) return tests;
    } catch (err) {
      console.warn("Firestore getTests error, falling back:", err);
    }
  }

  // Local fallback
  initLocalStorage();
  const tests = JSON.parse(localStorage.getItem(LS_KEYS.TESTS) || "[]");
  return tests;
}

/**
 * Fetch single test by ID
 */
export async function getTestById(id) {
  if (isFirebaseConfigured && db) {
    try {
      const docSnap = await getDoc(doc(db, "tests", id));
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
    } catch (err) {
      console.warn("Firestore getTestById error:", err);
    }
  }

  // Local fallback
  initLocalStorage();
  const tests = JSON.parse(localStorage.getItem(LS_KEYS.TESTS) || "[]");
  return tests.find((t) => t.id === id) || null;
}

/**
 * Create a new test (Admin only)
 */
export async function createTest(testData) {
  const preparedData = {
    ...testData,
    createdAt: new Date().toISOString()
  };

  if (isFirebaseConfigured && db) {
    try {
      const docRef = await addDoc(collection(db, "tests"), preparedData);
      return { id: docRef.id, ...preparedData };
    } catch (err) {
      console.error("Firestore createTest error:", err);
      throw err;
    }
  }

  // Local fallback
  initLocalStorage();
  const tests = JSON.parse(localStorage.getItem(LS_KEYS.TESTS) || "[]");
  const newTest = {
    id: "test-" + Date.now() + "-" + Math.random().toString(36).substring(2, 6),
    ...preparedData
  };
  tests.unshift(newTest);
  localStorage.setItem(LS_KEYS.TESTS, JSON.stringify(tests));
  return newTest;
}

/**
 * Update an existing test
 */
export async function updateTest(id, testData) {
  if (isFirebaseConfigured && db) {
    try {
      const testRef = doc(db, "tests", id);
      await updateDoc(testRef, testData);
      return { id, ...testData };
    } catch (err) {
      console.error("Firestore updateTest error:", err);
      throw err;
    }
  }

  // Local fallback
  initLocalStorage();
  const tests = JSON.parse(localStorage.getItem(LS_KEYS.TESTS) || "[]");
  const updated = tests.map((t) => (t.id === id ? { ...t, ...testData } : t));
  localStorage.setItem(LS_KEYS.TESTS, JSON.stringify(updated));
  return { id, ...testData };
}

/**
 * Delete a test
 */
export async function deleteTest(id) {
  if (isFirebaseConfigured && db) {
    try {
      await deleteDoc(doc(db, "tests", id));
      return true;
    } catch (err) {
      console.error("Firestore deleteTest error:", err);
      throw err;
    }
  }

  // Local fallback
  initLocalStorage();
  const tests = JSON.parse(localStorage.getItem(LS_KEYS.TESTS) || "[]");
  const filtered = tests.filter((t) => t.id !== id);
  localStorage.setItem(LS_KEYS.TESTS, JSON.stringify(filtered));
  return true;
}

// -------------------------------------------------------------
// RESULTS CRUD SERVICES
// -------------------------------------------------------------

/**
 * Save test attempt result
 */
export async function saveResult(resultData) {
  const preparedData = {
    ...resultData,
    createdAt: new Date().toISOString()
  };

  if (isFirebaseConfigured && db) {
    try {
      const docRef = await addDoc(collection(db, "results"), preparedData);
      return { id: docRef.id, ...preparedData };
    } catch (err) {
      console.error("Firestore saveResult error:", err);
      throw err;
    }
  }

  // Local fallback
  initLocalStorage();
  const results = JSON.parse(localStorage.getItem(LS_KEYS.RESULTS) || "[]");
  const newResult = {
    id: "res-" + Date.now() + "-" + Math.random().toString(36).substring(2, 6),
    ...preparedData
  };
  results.unshift(newResult);
  localStorage.setItem(LS_KEYS.RESULTS, JSON.stringify(results));
  return newResult;
}

/**
 * Fetch results for a student
 */
export async function getUserResults(userId) {
  if (isFirebaseConfigured && db) {
    try {
      const q = query(
        collection(db, "results"),
        where("userId", "==", userId)
      );
      const snapshot = await getDocs(q);
      const results = [];
      snapshot.forEach((docSnap) => {
        results.push({ id: docSnap.id, ...docSnap.data() });
      });
      // Sort client-side by date descending
      results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return results;
    } catch (err) {
      console.warn("Firestore getUserResults error, falling back:", err);
    }
  }

  // Local fallback
  initLocalStorage();
  const results = JSON.parse(localStorage.getItem(LS_KEYS.RESULTS) || "[]");
  return results
    .filter((r) => r.userId === userId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

/**
 * Fetch all results (Admin)
 */
export async function getAllResults() {
  if (isFirebaseConfigured && db) {
    try {
      const q = query(collection(db, "results"));
      const snapshot = await getDocs(q);
      const results = [];
      snapshot.forEach((docSnap) => {
        results.push({ id: docSnap.id, ...docSnap.data() });
      });
      results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return results;
    } catch (err) {
      console.warn("Firestore getAllResults error, falling back:", err);
    }
  }

  // Local fallback
  initLocalStorage();
  const results = JSON.parse(localStorage.getItem(LS_KEYS.RESULTS) || "[]");
  return results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

/**
 * Fetch single result by ID
 */
export async function getResultById(id) {
  if (isFirebaseConfigured && db) {
    try {
      const docSnap = await getDoc(doc(db, "results", id));
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
    } catch (err) {
      console.warn("Firestore getResultById error:", err);
    }
  }

  // Local fallback
  initLocalStorage();
  const results = JSON.parse(localStorage.getItem(LS_KEYS.RESULTS) || "[]");
  return results.find((r) => r.id === id) || null;
}

/**
 * Get all students for admin dashboard metrics
 */
export async function getAllStudents() {
  if (isFirebaseConfigured && db) {
    try {
      const q = query(collection(db, "users"), where("role", "==", "student"));
      const snapshot = await getDocs(q);
      const students = [];
      snapshot.forEach((docSnap) => {
        students.push({ id: docSnap.id, ...docSnap.data() });
      });
      return students;
    } catch (err) {
      console.warn("Firestore getAllStudents error:", err);
    }
  }

  // Local fallback
  initLocalStorage();
  const users = JSON.parse(localStorage.getItem(LS_KEYS.USERS) || "[]");
  return users.filter((u) => u.role === "student");
}

// -------------------------------------------------------------
// USER FRIENDLY ERROR HELPER
// -------------------------------------------------------------
function formatAuthError(error) {
  const code = error?.code || "";
  switch (code) {
    case "auth/email-already-in-use":
      return "This email address is already in use by another account.";
    case "auth/invalid-email":
      return "The provided email address is invalid.";
    case "auth/operation-not-allowed":
      return "Email/password accounts are not enabled. Please enable them in your Firebase console.";
    case "auth/weak-password":
      return "Password is too weak. Please use at least 6 characters.";
    case "auth/user-disabled":
      return "This user account has been disabled.";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Invalid email or password. Please verify your credentials.";
    case "auth/too-many-requests":
      return "Access temporarily locked due to many failed login attempts. Please reset your password or try again later.";
    case "auth/network-request-failed":
      return "Network connection error. Please check your internet connection.";
    default:
      return error?.message || "An unexpected authentication error occurred.";
  }
}
