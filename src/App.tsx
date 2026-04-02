import React, { useState, useEffect } from 'react';
import { 
  auth, 
  db, 
  googleProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  where
} from './firebase';
import { 
  UserProfile, 
  StudentQuery, 
  BlinkitRequest, 
  BuddyPost, 
  Notification, 
  QueryReply,
  Message,
  ChatSession
} from './types';
import Layout from './components/Layout';
import Feed from './components/Feed';
import BuddyFinder from './components/BuddyFinder';
import Medical from './components/Medical';
import Support from './components/Support';
import Laundry from './components/Laundry';
import FoodCourt from './components/FoodCourt';
import Notifications from './components/Notifications';
import Profile from './components/Profile';
import MyQueries from './components/MyQueries';
import Messaging from './components/Messaging';
import AdminPanel from './components/AdminPanel';
import NotificationsPage from './components/NotificationsPage';
import Login from './components/Login';
import Loading from './components/Loading';
import Welcome from './components/Welcome';
import PostModal from './components/PostModal';
import ErrorBoundary from './components/ErrorBoundary';
import { NotificationsProvider, useNotifications } from './components/NotificationsContext';
import NotificationsManager from './components/NotificationsManager';
import { GoogleGenAI } from "@google/genai";

// Firestore Error Handler
enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

const AppContent: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isNewUser, setIsNewUser] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  
  const [queries, setQueries] = useState<StudentQuery[]>([]);
  const [blinkitRequests, setBlinkitRequests] = useState<BlinkitRequest[]>([]);
  const [buddyPosts, setBuddyPosts] = useState<BuddyPost[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  
  const { addNotification, notifications, markAsRead, clearAll } = useNotifications();

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Check university suffix (e.g., .edu)
        const email = firebaseUser.email || '';
        // For this demo, we'll accept any email but log the requirement
        // In a real app: if (!email.endsWith('.edu')) { signOut(auth); return; }
        
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          setUser(userDoc.data() as UserProfile);
        } else {
          const newUser: UserProfile = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || 'Student',
            photoURL: firebaseUser.photoURL || undefined,
            universitySuffix: email.split('@')[1] || '',
            createdAt: Date.now(),
            subscriptions: {
              gym: true,
              foodCourt: true,
              laundry: true,
              system: true,
            }
          };
          await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
          
          // Create public profile
          await setDoc(doc(db, 'profiles', firebaseUser.uid), {
            uid: firebaseUser.uid,
            displayName: newUser.displayName,
            photoURL: newUser.photoURL,
            universitySuffix: newUser.universitySuffix,
            createdAt: newUser.createdAt
          });

          setUser(newUser);
          setIsNewUser(true);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Data Listeners
  useEffect(() => {
    if (!user) return;

    const qQueries = query(collection(db, 'queries'), orderBy('createdAt', 'desc'));
    const unsubscribeQueries = onSnapshot(qQueries, (snapshot) => {
      setQueries(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as StudentQuery)));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'queries'));

    const qBlinkit = query(collection(db, 'blinkit_requests'), orderBy('createdAt', 'desc'));
    const unsubscribeBlinkit = onSnapshot(qBlinkit, (snapshot) => {
      setBlinkitRequests(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlinkitRequest)));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'blinkit_requests'));

    const qBuddy = query(collection(db, 'buddy_posts'), orderBy('createdAt', 'desc'));
    const unsubscribeBuddy = onSnapshot(qBuddy, (snapshot) => {
      setBuddyPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BuddyPost)));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'buddy_posts'));

    const qMessages = query(
      collection(db, 'messages'),
      where('participants', 'array-contains', user.uid),
      orderBy('createdAt', 'asc')
    );
    const unsubscribeMessages = onSnapshot(qMessages, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message)));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'messages'));

    const qSessions = query(
      collection(db, 'chat_sessions'),
      where('participants', 'array-contains', user.uid),
      orderBy('updatedAt', 'desc')
    );
    const unsubscribeSessions = onSnapshot(qSessions, (snapshot) => {
      setChatSessions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ChatSession)));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'chat_sessions'));

    const qUsers = query(collection(db, 'profiles'));
    const unsubscribeUsers = onSnapshot(qUsers, (snapshot) => {
      setAllUsers(snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as UserProfile)));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'profiles'));

    // Auto-expire Blinkit requests
    const interval = setInterval(() => {
      const now = Date.now();
      blinkitRequests.forEach(async (req) => {
        if (req.status === 'active' && req.expiresAt < now) {
          await updateDoc(doc(db, 'blinkit_requests', req.id), { status: 'expired' });
        }
      });
    }, 60000);

    return () => {
      unsubscribeQueries();
      unsubscribeBlinkit();
      unsubscribeBuddy();
      unsubscribeMessages();
      unsubscribeSessions();
      unsubscribeUsers();
      clearInterval(interval);
    };
  }, [user]);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const handleLogout = () => signOut(auth);

  const handlePostQuery = async (content: string, imageUrl?: string) => {
    if (!user) return;
    const newQuery: Omit<StudentQuery, 'id'> = {
      authorUid: user.uid,
      authorName: user.displayName,
      authorPhoto: user.photoURL,
      content,
      imageUrl,
      upvotes: [],
      status: 'pending',
      createdAt: Date.now(),
    };
    try {
      await addDoc(collection(db, 'queries'), newQuery);
      // No self-notification as requested
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'queries');
    }
  };

  const handlePostBlinkit = async (item: string, window: number) => {
    if (!user) return;
    const expiresAt = Date.now() + (window * 60 * 1000);
    const newRequest: Omit<BlinkitRequest, 'id'> = {
      authorUid: user.uid,
      authorName: user.displayName,
      authorPhoto: user.photoURL,
      itemDescription: item,
      windowMinutes: window,
      expiresAt,
      joinedUids: [user.uid],
      participants: [{
        uid: user.uid,
        displayName: user.displayName,
        photoURL: user.photoURL
      }],
      status: 'active',
      createdAt: Date.now(),
    };
    try {
      await addDoc(collection(db, 'blinkit_requests'), newRequest);
      // No self-notification as requested
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'blinkit_requests');
    }
  };

  const handleUpvote = async (id: string) => {
    if (!user) return;
    const qRef = doc(db, 'queries', id);
    const qSnap = await getDoc(qRef);
    if (qSnap.exists()) {
      const data = qSnap.data() as StudentQuery;
      let upvotes = [...data.upvotes];
      
      if (upvotes.includes(user.uid)) {
        upvotes = upvotes.filter(uid => uid !== user.uid);
      } else {
        upvotes.push(user.uid);
        // Upvote notifications disabled as requested
      }
      
      await updateDoc(qRef, { upvotes });
    }
  };

  const handleReply = async (id: string, content: string) => {
    if (!user) return;
    const qRef = doc(db, 'queries', id);
    const qSnap = await getDoc(qRef);
    if (qSnap.exists()) {
      const data = qSnap.data() as StudentQuery;
      const newReply: QueryReply = {
        id: Math.random().toString(36).substr(2, 9),
        authorUid: user.uid,
        authorName: user.displayName,
        authorPhoto: user.photoURL,
        content,
        createdAt: Date.now(),
      };
      const replies = [...(data.replies || []), newReply];
      await updateDoc(qRef, { replies });
      
      // Notify author
      if (data.authorUid !== user.uid) {
        addNotification({
          recipientUid: data.authorUid,
          senderUid: user.uid,
          senderName: user.displayName,
          senderPhoto: user.photoURL,
          title: 'New Reply!',
          message: `${user.displayName} replied to your query.`,
          type: 'reply'
        });
      }
    }
  };

  const handleJoinBlinkit = async (id: string) => {
    if (!user) return;
    const bRef = doc(db, 'blinkit_requests', id);
    const bSnap = await getDoc(bRef);
    if (bSnap.exists()) {
      const data = bSnap.data() as BlinkitRequest;
      if (!data.joinedUids.includes(user.uid) && data.expiresAt > Date.now()) {
        const newParticipant = {
          uid: user.uid,
          displayName: user.displayName,
          photoURL: user.photoURL
        };
        await updateDoc(bRef, {
          joinedUids: [...data.joinedUids, user.uid],
          participants: [...(data.participants || []), newParticipant]
        });
        // No self-notification
        // Notify author
        if (data.authorUid !== user.uid) {
          addNotification({
            recipientUid: data.authorUid,
            senderUid: user.uid,
            senderName: user.displayName,
            senderPhoto: user.photoURL,
            title: 'Someone Joined!',
            message: `${user.displayName} joined your order request.`,
            type: 'blinkit'
          });
        }
      }
    }
  };

  const handlePostBuddy = async (category: BuddyPost['category'], title: string, description: string) => {
    if (!user) return;
    const newPost: Omit<BuddyPost, 'id'> = {
      authorUid: user.uid,
      authorName: user.displayName,
      authorPhoto: user.photoURL,
      category,
      title,
      description,
      createdAt: Date.now(),
    };
    try {
      await addDoc(collection(db, 'buddy_posts'), newPost);
      addNotification({
        recipientUid: user.uid,
        title: 'Buddy Request Posted!',
        message: `Your ${category} buddy request is now visible.`,
        type: 'buddy'
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'buddy_posts');
    }
  };

  const handleUpdateSubscription = async (key: keyof UserProfile['subscriptions'], value: boolean) => {
    if (!user) return;
    const uRef = doc(db, 'users', user.uid);
    const newSubscriptions = { ...user.subscriptions, [key]: value };
    await updateDoc(uRef, { subscriptions: newSubscriptions });
    setUser({ ...user, subscriptions: newSubscriptions as any });
  };

  const handleDeleteUser = async (uid: string) => {
    await deleteDoc(doc(db, 'users', uid));
  };

  const handleDeleteQuery = async (id: string) => {
    await deleteDoc(doc(db, 'queries', id));
  };

  const handleDeleteBlinkit = async (id: string) => {
    await deleteDoc(doc(db, 'blinkit_requests', id));
  };

  const handleCloseBlinkit = async (id: string) => {
    await updateDoc(doc(db, 'blinkit_requests', id), { status: 'expired' });
  };

  const handleResolveQuery = async (id: string) => {
    const qRef = doc(db, 'queries', id);
    const qSnap = await getDoc(qRef);
    if (qSnap.exists()) {
      const data = qSnap.data() as StudentQuery;
      await updateDoc(qRef, { status: 'resolved' });
      // Notify author
      addNotification({
        recipientUid: data.authorUid,
        title: 'Query Resolved!',
        message: 'Your query has been marked as resolved.',
        type: 'query'
      });
    }
  };

  const handleUpdateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;
    const uRef = doc(db, 'users', user.uid);
    await updateDoc(uRef, updates);
    
    // Update public profile if relevant fields changed
    const publicFields = ['displayName', 'photoURL', 'universitySuffix'];
    const publicUpdates: any = {};
    publicFields.forEach(field => {
      if (field in updates) {
        publicUpdates[field] = (updates as any)[field];
      }
    });
    if (Object.keys(publicUpdates).length > 0) {
      await updateDoc(doc(db, 'profiles', user.uid), publicUpdates);
    }

    setUser({ ...user, ...updates });
  };

  const handleSendMessage = async (recipientUid: string, content: string) => {
    if (!user) return;
    const newMessage: Omit<Message, 'id'> = {
      senderUid: user.uid,
      recipientUid,
      participants: [user.uid, recipientUid],
      content,
      createdAt: Date.now(),
      read: false,
    };
    await addDoc(collection(db, 'messages'), newMessage);

    // Update or create session
    const sessionId = [user.uid, recipientUid].sort().join('_');
    const sRef = doc(db, 'chat_sessions', sessionId);
    const sSnap = await getDoc(sRef);
    if (sSnap.exists()) {
      await updateDoc(sRef, {
        lastMessage: content,
        lastMessageAt: Date.now(),
        updatedAt: Date.now(),
      });
    } else {
      await setDoc(sRef, {
        participants: [user.uid, recipientUid],
        lastMessage: content,
        lastMessageAt: Date.now(),
        updatedAt: Date.now(),
      });
    }

    addNotification({
      recipientUid,
      senderUid: user.uid,
      senderName: user.displayName,
      senderPhoto: user.photoURL,
      title: 'New Message',
      message: `${user.displayName} sent you a message.`,
      type: 'system'
    });
  };

  const handleConnectBuddy = async (post: BuddyPost) => {
    if (!user) return;
    // Notify author
    if (post.authorUid !== user.uid) {
      addNotification({
        recipientUid: post.authorUid,
        senderUid: user.uid,
        senderName: user.displayName,
        senderPhoto: user.photoURL,
        title: 'New Connection Request!',
        message: `${user.displayName} wants to connect for your ${post.category} request.`,
        type: 'buddy'
      });
      // Automatically start a chat session
      setActiveTab('messages');
    }
  };

  const handleAskAI = async (prompt: string) => {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: "You are a helpful medical assistant for university students. Provide clear, concise, and empathetic advice. Always include a disclaimer that you are an AI and not a doctor. If symptoms sound serious, advise them to contact the campus nurse or emergency services immediately."
      }
    });
    return response.text || "I'm sorry, I couldn't generate a response.";
  };

  if (loading) return <Loading />;
  if (!user) return <Login onLogin={handleLogin} isLoading={false} />;
  if (isNewUser) return <Welcome onGetStarted={() => setIsNewUser(false)} userName={user.displayName} />;

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <Feed 
            queries={queries} 
            blinkitRequests={blinkitRequests}
            onUpvote={handleUpvote}
            onReply={handleReply}
            onJoinBlinkit={handleJoinBlinkit}
            onCloseBlinkit={handleCloseBlinkit}
            onDeleteBlinkit={handleDeleteBlinkit}
            onOpenPostModal={() => setIsPostModalOpen(true)}
            currentUserId={user.uid}
          />
        );
      case 'my-queries':
        return (
          <MyQueries 
            userQueries={queries.filter(q => q.authorUid === user.uid)} 
            onReply={handleReply}
            onResolve={handleResolveQuery}
          />
        );
      case 'messages':
        return (
          <Messaging 
            user={user}
            messages={messages}
            sessions={chatSessions}
            onSendMessage={handleSendMessage}
          />
        );
      case 'notifications':
        return (
          <NotificationsPage 
            notifications={notifications}
            user={user}
            onMarkAsRead={markAsRead}
            onClearAll={clearAll}
            onUpdateSubscription={handleUpdateSubscription}
          />
        );
      case 'admin':
        return (
          <AdminPanel 
            queries={queries}
            blinkitRequests={blinkitRequests}
            users={allUsers}
            onDeleteQuery={handleDeleteQuery}
            onDeleteBlinkit={handleDeleteBlinkit}
            onResolveQuery={handleResolveQuery}
            onDeleteUser={handleDeleteUser}
          />
        );
      case 'find-buddy':
        return (
          <BuddyFinder 
            posts={buddyPosts} 
            onPostBuddy={handlePostBuddy} 
            onConnect={handleConnectBuddy}
            currentUserId={user.uid} 
          />
        );
      case 'medical':
        return <Medical onAskAI={handleAskAI} />;
      case 'support':
        return <Support />;
      case 'laundry':
        return <Laundry />;
      case 'food-court':
        return <FoodCourt />;
      case 'profile':
        return (
          <Profile 
            profile={user} 
            onUpdateProfile={handleUpdateProfile}
            onLogout={handleLogout} 
          />
        );
      default:
        return <Feed queries={queries} blinkitRequests={blinkitRequests} onUpvote={handleUpvote} onReply={handleReply} onJoinBlinkit={handleJoinBlinkit} onOpenPostModal={() => setIsPostModalOpen(true)} currentUserId={user.uid} />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} user={user} onLogout={handleLogout}>
      {renderContent()}
      <PostModal 
        isOpen={isPostModalOpen} 
        onClose={() => setIsPostModalOpen(false)} 
        onPostQuery={handlePostQuery}
        onPostBlinkit={handlePostBlinkit}
      />
      <NotificationsManager onNavigateToAll={() => setActiveTab('notifications')} />
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <NotificationsProvider>
        <AppContent />
      </NotificationsProvider>
    </ErrorBoundary>
  );
};

export default App;
