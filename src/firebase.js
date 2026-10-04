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
import { MEDICO_MDCAT_TEST } from "./data/medicoMcatTest";

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
  RESULTS: "studyhub_results",
  PAYMENTS: "studyhub_payments",
  CLEAN_SLATE: "studyhub_clean_slate_v1"
};

function initLocalStorage() {
  if (typeof window === "undefined") return;

  // Perform one-time clean slate reset to remove all old tests, student accounts, results, and payments
  if (localStorage.getItem(LS_KEYS.CLEAN_SLATE) !== "done") {
    localStorage.setItem(LS_KEYS.TESTS, JSON.stringify([]));
    localStorage.setItem(LS_KEYS.RESULTS, JSON.stringify([]));
    localStorage.setItem(LS_KEYS.PAYMENTS, JSON.stringify([]));
    localStorage.setItem(
      LS_KEYS.USERS,
      JSON.stringify([
        {
          uid: "admin-aslam-samejo",
          name: "Aslam Samejo",
          email: ADMIN_EMAIL,
          role: "admin",
          password: ADMIN_PASSWORD,
          status: "Active",
          createdAt: new Date().toISOString()
        }
      ])
    );

    const cachedUser = JSON.parse(localStorage.getItem(LS_KEYS.CURRENT_USER) || "null");
    if (cachedUser && (cachedUser.email || "").toLowerCase() !== ADMIN_EMAIL) {
      localStorage.removeItem(LS_KEYS.CURRENT_USER);
    }

    localStorage.setItem(LS_KEYS.CLEAN_SLATE, "done");
  }

  // Ensure storage arrays exist and remove any pre-seeded demo tests
  const existingTests = JSON.parse(localStorage.getItem(LS_KEYS.TESTS) || "[]");
  const cleanedTests = existingTests.filter(
    (t) =>
      t.id !== "mbbs-anatomy-101" &&
      t.id !== "cs-web-dev-201" &&
      t.id !== MEDICO_MDCAT_TEST.id
  );
  localStorage.setItem(LS_KEYS.TESTS, JSON.stringify(cleanedTests));

  // Initialize payments storage if empty
  if (!localStorage.getItem(LS_KEYS.PAYMENTS)) {
    localStorage.setItem(LS_KEYS.PAYMENTS, JSON.stringify([]));
  }

  // Clean up any legacy demo results
  const existingResults = JSON.parse(localStorage.getItem(LS_KEYS.RESULTS) || "[]");
  const cleanedResults = existingResults.filter(
    (r) => r.id !== "sample-res-1" && r.userId !== "demo-student-id"
  );
  localStorage.setItem(LS_KEYS.RESULTS, JSON.stringify(cleanedResults));

  // Ensure exclusive administrator account (aslamsamejo9192@gmail.com / samejo45)
  const existingUsers = JSON.parse(localStorage.getItem(LS_KEYS.USERS) || "[]");
  const cleanedUsers = existingUsers.filter(
    (u) =>
      u.uid !== "demo-student-id" &&
      u.email !== "student@studyhub.com" &&
      u.uid !== "admin-default-id" &&
      u.email !== "admin@studyhub.com"
  );

  let adminFound = false;
  cleanedUsers.forEach((u) => {
    if ((u.email || "").toLowerCase() === ADMIN_EMAIL) {
      u.role = "admin";
      u.password = ADMIN_PASSWORD;
      u.name = u.name || "Aslam Samejo";
      adminFound = true;
    } else {
      u.role = "student";
    }
  });

  if (!adminFound) {
    cleanedUsers.push({
      uid: "admin-aslam-samejo",
      name: "Aslam Samejo",
      email: ADMIN_EMAIL,
      role: "admin",
      password: ADMIN_PASSWORD,
      status: "Active",
      createdAt: new Date().toISOString()
    });
  }
  localStorage.setItem(LS_KEYS.USERS, JSON.stringify(cleanedUsers));

  // Validate cached current user
  const currUser = JSON.parse(localStorage.getItem(LS_KEYS.CURRENT_USER) || "null");
  if (currUser) {
    if (
      currUser.uid === "demo-student-id" ||
      currUser.email === "student@studyhub.com" ||
      currUser.email === "admin@studyhub.com"
    ) {
      localStorage.removeItem(LS_KEYS.CURRENT_USER);
    } else if ((currUser.email || "").toLowerCase() === ADMIN_EMAIL) {
      currUser.role = "admin";
      localStorage.setItem(LS_KEYS.CURRENT_USER, JSON.stringify(currUser));
    } else {
      currUser.role = "student";
      localStorage.setItem(LS_KEYS.CURRENT_USER, JSON.stringify(currUser));
    }
  }
}

// -------------------------------------------------------------
// ACCESS CONTROL & DESIGNATED ADMIN ACCOUNT
// -------------------------------------------------------------
export const ADMIN_EMAIL = "aslamsamejo9192@gmail.com";
export const ADMIN_PASSWORD = "samejo45";
export const SUPER_ADMIN_EMAILS = [ADMIN_EMAIL];
export const ADMIN_SECURITY_CODE = "Aslam-56";

// Run initializer
initLocalStorage();

// -------------------------------------------------------------
// AUTHENTICATION SERVICES
// -------------------------------------------------------------

/**
 * Register a new student (or authenticate admin if using admin email + password).
 * STRICT SECURITY: Only aslamsamejo9192@gmail.com with password samejo45 can be admin.
 */
export async function registerUser(name, email, password, role = "student", extraData = {}) {
  const cleanEmail = email.trim().toLowerCase();

  // If the admin uses his email and password on the registration form, sign him in as Admin
  if (cleanEmail === ADMIN_EMAIL) {
    if (password !== ADMIN_PASSWORD) {
      throw new Error("Incorrect administrator password.");
    }
    const adminUser = {
      uid: "admin-aslam-samejo",
      name: name.trim() || "Aslam Samejo",
      email: ADMIN_EMAIL,
      role: "admin",
      status: "Active"
    };
    localStorage.setItem(LS_KEYS.CURRENT_USER, JSON.stringify(adminUser));
    triggerLocalAuthSubscribers(adminUser);
    return adminUser;
  }

  // All other accounts are strictly students
  const targetRole = "student";

  if (isFirebaseConfigured && auth && db) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, password);
      const user = userCredential.user;
      
      await updateProfile(user, { displayName: name });

      // Save complete user profile in Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userData = {
        name: name.trim(),
        email: cleanEmail,
        role: targetRole,
        rollNo: extraData.rollNo ? extraData.rollNo.trim() : "",
        phone: extraData.phone ? extraData.phone.trim() : "",
        department: extraData.department ? extraData.department.trim() : "",
        status: "Active",
        createdAt: new Date().toISOString()
      };
      await setDoc(userDocRef, userData);

      return {
        uid: user.uid,
        name: name.trim(),
        email: cleanEmail,
        role: targetRole,
        rollNo: userData.rollNo,
        phone: userData.phone,
        department: userData.department,
        status: "Active"
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
    role: targetRole,
    rollNo: extraData.rollNo ? extraData.rollNo.trim() : "",
    phone: extraData.phone ? extraData.phone.trim() : "",
    department: extraData.department ? extraData.department.trim() : "",
    status: "Active",
    password: password,
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  localStorage.setItem(LS_KEYS.USERS, JSON.stringify(users));

  const authUser = {
    uid: newUser.uid,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
    rollNo: newUser.rollNo,
    phone: newUser.phone,
    department: newUser.department,
    status: newUser.status
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

  // Exclusive Admin Authentication Check (aslamsamejo9192@gmail.com / samejo45)
  if (cleanEmail === ADMIN_EMAIL) {
    if (password !== ADMIN_PASSWORD) {
      throw new Error("Incorrect administrator password.");
    }
    const adminUser = {
      uid: "admin-aslam-samejo",
      name: "Aslam Samejo",
      email: ADMIN_EMAIL,
      role: "admin",
      status: "Active"
    };
    localStorage.setItem(LS_KEYS.CURRENT_USER, JSON.stringify(adminUser));
    triggerLocalAuthSubscribers(adminUser);
    return adminUser;
  }

  if (isFirebaseConfigured && auth && db) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, password);
      const user = userCredential.user;

      // Fetch user role from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const role = "student";
      let name = user.displayName || "User";

      if (userDoc.exists()) {
        const data = userDoc.data();
        name = data.name || name;
      } else {
        // Create user document if missing
        await setDoc(doc(db, "users", user.uid), {
          name: name,
          email: user.email,
          role: role,
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
    role: "student"
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
          const isSuperAdmin = SUPER_ADMIN_EMAILS.includes((firebaseUser.email || "").toLowerCase());
          let role = isSuperAdmin ? "admin" : "student";
          let name = firebaseUser.displayName || "User";
          if (userDoc.exists()) {
            const data = userDoc.data();
            role = isSuperAdmin ? "admin" : data.role || "student";
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
          const isSuperAdmin = SUPER_ADMIN_EMAILS.includes((firebaseUser.email || "").toLowerCase());
          callback({
            uid: firebaseUser.uid,
            name: firebaseUser.displayName || "User",
            email: firebaseUser.email,
            role: isSuperAdmin ? "admin" : "student"
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
 * Get all students for admin dashboard metrics & student management directory
 */
export async function getAllStudents() {
  if (isFirebaseConfigured && db) {
    try {
      const q = query(collection(db, "users"), where("role", "==", "student"));
      const snapshot = await getDocs(q);
      const students = [];
      snapshot.forEach((docSnap) => {
        students.push({ id: docSnap.id, uid: docSnap.id, ...docSnap.data() });
      });
      students.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      return students;
    } catch (err) {
      console.warn("Firestore getAllStudents error:", err);
    }
  }

  // Local fallback
  initLocalStorage();
  const users = JSON.parse(localStorage.getItem(LS_KEYS.USERS) || "[]");
  return users
    .filter((u) => u.role === "student")
    .map((u) => ({ id: u.uid, ...u }))
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
}

/**
 * Delete a student record (Admin only)
 */
export async function deleteStudent(studentId) {
  if (isFirebaseConfigured && db) {
    try {
      await deleteDoc(doc(db, "users", studentId));
      return true;
    } catch (err) {
      console.error("Firestore deleteStudent error:", err);
      throw err;
    }
  }

  // Local fallback
  const users = JSON.parse(localStorage.getItem(LS_KEYS.USERS) || "[]");
  const filtered = users.filter((u) => u.uid !== studentId && u.id !== studentId);
  localStorage.setItem(LS_KEYS.USERS, JSON.stringify(filtered));
  return true;
}

// -------------------------------------------------------------
// PAYMENT & ACCESS UNLOCK SERVICES (EasyPaisa & JazzCash)
// -------------------------------------------------------------

/**
 * Save payment transaction (EasyPaisa / JazzCash) and unlock test for student
 */
export async function savePayment(paymentData) {
  const preparedData = {
    ...paymentData,
    amount: Number(paymentData.amount) || 10,
    status: paymentData.status || "Verified",
    createdAt: paymentData.createdAt || new Date().toISOString()
  };

  if (isFirebaseConfigured && db) {
    try {
      const docRef = await addDoc(collection(db, "payments"), preparedData);
      // Also update user's unlocked tests list in firestore if userId available
      if (paymentData.studentId && paymentData.testId) {
        try {
          const userRef = doc(db, "users", paymentData.studentId);
          const uDoc = await getDoc(userRef);
          if (uDoc.exists()) {
            const currUnlocked = uDoc.data().unlockedTests || [];
            if (!currUnlocked.includes(paymentData.testId)) {
              await updateDoc(userRef, {
                unlockedTests: [...currUnlocked, paymentData.testId]
              });
            }
          }
        } catch (uErr) {
          console.warn("Could not update user doc for unlockedTests:", uErr);
        }
      }
      return { id: docRef.id, ...preparedData };
    } catch (err) {
      console.warn("Firestore savePayment error, falling back:", err);
    }
  }

  // Local fallback
  initLocalStorage();
  const payments = JSON.parse(localStorage.getItem(LS_KEYS.PAYMENTS) || "[]");
  const newPayment = {
    id: "pay-" + Date.now() + "-" + Math.random().toString(36).substring(2, 7),
    ...preparedData
  };
  payments.unshift(newPayment);
  localStorage.setItem(LS_KEYS.PAYMENTS, JSON.stringify(payments));

  // Unlock test in local users array and current user session
  if (paymentData.studentId && paymentData.testId) {
    const users = JSON.parse(localStorage.getItem(LS_KEYS.USERS) || "[]");
    const uIndex = users.findIndex(
      (u) => u.uid === paymentData.studentId || u.id === paymentData.studentId
    );
    if (uIndex !== -1) {
      users[uIndex].unlockedTests = users[uIndex].unlockedTests || [];
      if (!users[uIndex].unlockedTests.includes(paymentData.testId)) {
        users[uIndex].unlockedTests.push(paymentData.testId);
      }
      localStorage.setItem(LS_KEYS.USERS, JSON.stringify(users));
    }

    const curr = JSON.parse(localStorage.getItem(LS_KEYS.CURRENT_USER) || "null");
    if (curr && (curr.uid === paymentData.studentId || curr.id === paymentData.studentId)) {
      curr.unlockedTests = curr.unlockedTests || [];
      if (!curr.unlockedTests.includes(paymentData.testId)) {
        curr.unlockedTests.push(paymentData.testId);
      }
      localStorage.setItem(LS_KEYS.CURRENT_USER, JSON.stringify(curr));
      triggerLocalAuthSubscribers(curr);
    }
  }

  return newPayment;
}

/**
 * Get all payment records for administrative verification
 */
export async function getPayments() {
  if (isFirebaseConfigured && db) {
    try {
      const q = query(collection(db, "payments"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const payments = [];
      snapshot.forEach((d) => payments.push({ id: d.id, ...d.data() }));
      if (payments.length > 0) return payments;
    } catch (err) {
      console.warn("Firestore getPayments error:", err);
    }
  }

  initLocalStorage();
  const payments = JSON.parse(localStorage.getItem(LS_KEYS.PAYMENTS) || "[]");
  return payments;
}

/**
 * Check if a test is unlocked for a user
 */
export function isTestUnlocked(test, user) {
  if (!test) return true;
  // If test is free, unlocked for all
  if (!test.isPaid || test.price === 0) return true;

  // Administrators always have full complimentary access
  if (user?.role === "admin") return true;
  if (SUPER_ADMIN_EMAILS.includes((user?.email || "").toLowerCase())) return true;

  if (!user) return false;

  // Check if testId is in user's unlockedTests array
  if (user.unlockedTests && user.unlockedTests.includes(test.id)) {
    return true;
  }

  // Check in payments storage for any matching verified payment
  try {
    const payments = JSON.parse(localStorage.getItem(LS_KEYS.PAYMENTS) || "[]");
    const hasPaid = payments.some(
      (p) =>
        (p.studentId === user.uid ||
          (p.studentEmail && p.studentEmail.toLowerCase() === (user.email || "").toLowerCase())) &&
        p.testId === test.id &&
        p.status === "Verified"
    );
    if (hasPaid) return true;
  } catch (e) {
    // ignore
  }

  return false;
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
      return "Password is too weak. Please choose a stronger password.";
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
