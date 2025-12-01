# 🐛 Bug Analysis Report - Lumina Mobile Frontend


**Date:** 2025-11-18 
**Analysis Type:** Systematic Codebase Review 
**Goal:** Identify and eliminate all bugs before deployment


---


## 🚨 CRITICAL BUGS 


### **BUG #7: Promise.all Syntax Error - Orphaned Messages**
**Severity:** 🔴 **CRITICAL** 
**Location:** `Lumina-Mobile-FE/components/CustomConversation.jsx` (Lines 53-56)


**Problem:**
```javascript
await Promise.all(
 axios.delete("/conversation/" + id),
 axios.delete("/message/conversation/" + id)
);
```


`Promise.all()` expects an **array** of promises `[...]`, not comma-separated arguments. This code only executes the first delete, leaving orphaned messages in the database.


**Impact:** Messages are NOT deleted when conversations are deleted → database bloat and data integrity issues.


**Fix:**
```javascript
await Promise.all([
 axios.delete("/conversation/" + id),
 axios.delete("/message/conversation/" + id)
]);
```


---


### **BUG #8: Stale Closure - Missing Latest Message**
**Severity:** 🔴 **CRITICAL** 
**Location:** `Lumina-Mobile-FE/app/conversation/[id].jsx` (Lines 104-263)


**Problem:**
```javascript
const getResponse = useCallback(async () => {
 // ...
 const response = await axios.post("/openai", {
   messages: messages,  // ❌ Uses stale `messages` from closure
 });
}, [messages, conversationId, chatbot]);
```


When `getResponse` is called from useEffect, it captures the `messages` value from when the callback was created. The useEffect triggers AFTER a new message is added, but `getResponse` still has the OLD messages array without the latest user message.


**Impact:** GPT-4o receives incomplete conversation history - missing the user's latest message!


**Fix:**
Use functional state update to get the latest messages:
```javascript
const getResponse = useCallback(async () => {
 setMessages((prevMessages) => {
   // Use prevMessages here for API call
   const messagesToSend = prevMessages.filter(msg => msg.content !== "Fetching response...");
  
   axios.post("/openai", { messages: messagesToSend }).then(response => {
     // Handle response...
   });
  
   return [...prevMessages, { content: "Fetching response...", fromSelf: false }];
 });
}, [conversationId, chatbot]);
```


---


### **BUG #4: Broken Favourite Logic - Array Comparison**
**Severity:** 🔴 **HIGH** 
**Locations:**
- `Lumina-Mobile-FE/app/(tabs)/home.jsx` (Line 30)
- `Lumina-Mobile-FE/app/chatbots/discover.jsx` (Line 25)
- `Lumina-Mobile-FE/app/chatbots/favourites.jsx` (Line 25)


**Problem:**
```javascript
if (favouriteChatbots.includes(chatbot)) {
```


`.includes()` compares objects by **reference**, not by value. This will ALWAYS return `false` because `chatbot` is a different object instance than the ones in `favouriteChatbots` array.


**Impact:** Favourite/unfavourite functionality is completely broken - users cannot manage favourites!


**Fix:**
```javascript
if (favouriteChatbots.some((favChatbot) => favChatbot._id === chatbot._id)) {
```


---


### **BUG #6: Race Condition in New Conversation Creation**
**Severity:** 🔴 **HIGH** 
**Location:** `Lumina-Mobile-FE/app/conversation/[id].jsx` (Lines 289-328)


**Problem:**
```javascript
const handleSend = async () => {
 setGenerating(true);
 if (messages.length === 0) {
   const res = await axios.post("conversation/", { ... });
   setConversationId(res.data.conversation._id);
   const currentConversationId = res.data.conversation._id;
  
   await axios.post("/message", {
     conversationId: currentConversationId,  // ✅ Uses local variable
     fromSelf: true,
     content: input,
   });
 } else {
   await axios.post("/message", {
     conversationId: conversationId,  // ⚠️ Uses state variable
     fromSelf: true,
     content: input,
   });
 }
 setMessages([...messages, { content: input, fromSelf: true }]);
 setInput("");
};
```


The code correctly uses a local variable for new conversations, but there's still a timing issue: the message is added to the database BEFORE being added to the UI state. If the database save fails, the UI won't show the message, but if it succeeds and then the state update fails, the message is in the database but not in the UI.


**Impact:** Messages might appear in database but not in UI, or vice versa → inconsistent state.


**Fix:** Add message to UI state first, then save to database in background (same pattern as the infinite loop fix).


---


## ⚠️ MEDIUM SEVERITY BUGS


### **BUG #1: Missing Dependency - home.jsx**
**Severity:** 🟡 **MEDIUM** 
**Location:** `Lumina-Mobile-FE/app/(tabs)/home.jsx` (Lines 97-99)


**Problem:**
```javascript
useEffect(() => {
 fetchChatbots();
}, []);
```


`fetchChatbots` depends on `email` from context, but `email` is not in the dependency array.


**Impact:** If email changes after component mount, chatbots won't be refetched.


**Fix:**
```javascript
useEffect(() => {
 if (email) {
   fetchChatbots();
 }
}, [email]);
```


---


### **BUG #2: Missing Dependency - conversation-history.jsx**
**Severity:** 🟡 **MEDIUM** 
**Location:** `Lumina-Mobile-FE/app/(tabs)/conversation-history.jsx` (Lines 49-52)


**Problem:**
```javascript
React.useEffect(() => {
 fetchConversations();
}, []);
```


Same issue - `fetchConversations` depends on `email`.


**Fix:**
```javascript
React.useEffect(() => {
 if (email) {
   fetchConversations();
 }
}, [email]);
```


---


### **BUG #3: Missing Dependency - chatbots/[id].jsx**
**Severity:** 🟡 **MEDIUM** 
**Location:** `Lumina-Mobile-FE/app/chatbots/[id].jsx` (Lines 98-100)


**Problem:**
```javascript
useEffect(() => {
 fetchDetails();
}, []);
```


`fetchDetails` depends on `params.id` and `favouriteChatbots`.


**Fix:**
```javascript
useEffect(() => {
 if (params.id) {
   fetchDetails();
 }
}, [params.id]);
```


---


### **BUG #9: Missing Error Handling in Authentication**
**Severity:** 🟡 **MEDIUM** 
**Location:** `Lumina-Mobile-FE/app/index.jsx` (Lines 90-138)


**Problem:**
Nested promises with only one `.catch()` at the end. If user creation fails, the app might still try to navigate.


**Impact:** User might be logged in without being created in database.


**Fix:** Add proper error handling at each step of the promise chain.


---


## 🔵 LOW SEVERITY BUGS


### **BUG #5: Missing const Keyword**
**Severity:** 🔵 **LOW** 
**Location:** `Lumina-Mobile-FE/app/chatbots/[id].jsx` (Line 17)


**Problem:**
```javascript
handleBack = () => {
 router.back();
};
```


Missing `const` keyword creates a global variable.


**Impact:** Pollutes global scope, violates best practices.


**Fix:**
```javascript
const handleBack = () => {
 router.back();
};
```


---


## 📊 SUMMARY TABLE


| Bug # | Severity | File | Issue | Impact |
|-------|----------|------|-------|--------|
| 7 | 🔴 CRITICAL | CustomConversation.jsx | Promise.all syntax error | Orphaned messages in DB |
| 8 | 🔴 CRITICAL | conversation/[id].jsx | Stale closure | GPT-4o missing latest message |
| 4 | 🔴 HIGH | home.jsx, discover.jsx, favourites.jsx | Array comparison | Favourites broken |
| 6 | 🔴 HIGH | conversation/[id].jsx | Race condition | Inconsistent state |
| 1 | 🟡 MEDIUM | home.jsx | Missing dependency | Chatbots not refetching |
| 2 | 🟡 MEDIUM | conversation-history.jsx | Missing dependency | Conversations not refetching |
| 3 | 🟡 MEDIUM | chatbots/[id].jsx | Missing dependency | Details not updating |
| 9 | 🟡 MEDIUM | index.jsx | Missing error handling | Auth flow issues |
| 5 | 🔵 LOW | chatbots/[id].jsx | Missing const | Global scope pollution |


-