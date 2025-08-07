import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  updateDoc, 
  doc, 
  getDoc,
  orderBy,
  limit,
  Timestamp 
} from 'firebase/firestore';
import { db } from './firebase';
import { caesarEncrypt, generateSubmissionId, getTodayKey } from './crypto';
import { marsCrypto } from './mars-crypto';

export interface Message {
  id?: string;
  originalText: string;
  encryptedText: string;
  submissionId: string;
  timestamp: Timestamp;
  claimed: boolean;
  claimedBy?: string;
  claimedAt?: Timestamp;
  encryptionType?: 'mars'; // Only Mars encryption supported
}

export interface UserTurns {
  id?: string;
  userId: string;
  date: string;
  turnsUsed: number;
  maxTurns: number;
}

// Submit a new message with Mars encryption (default)
export async function submitMessage(text: string, useMarsEncryption: boolean = true): Promise<string> {
  const submissionId = generateSubmissionId();
  
  // Always use Mars encryption unless explicitly disabled
  const encryptedText = await marsCrypto.encrypt(text);
  const encryptionType = 'mars';
  
  const message: Omit<Message, 'id'> = {
    originalText: text,
    encryptedText,
    submissionId,
    timestamp: Timestamp.now(),
    claimed: false,
    encryptionType,
  };

  await addDoc(collection(db, 'messages'), message);
  return submissionId;
}

// Get user's turns for today
export async function getUserTurnsToday(userId: string): Promise<UserTurns> {
  const today = getTodayKey();
  const maxTurns = parseInt(process.env.NEXT_PUBLIC_TURNS_PER_DAY || '1');
  
  const q = query(
    collection(db, 'userTurns'),
    where('userId', '==', userId),
    where('date', '==', today)
  );
  
  const querySnapshot = await getDocs(q);
  
  if (querySnapshot.empty) {
    // Create new turns record for today
    const newTurns: Omit<UserTurns, 'id'> = {
      userId,
      date: today,
      turnsUsed: 0,
      maxTurns,
    };
    
    const docRef = await addDoc(collection(db, 'userTurns'), newTurns);
    return { id: docRef.id, ...newTurns };
  }
  
  const doc = querySnapshot.docs[0];
  return { id: doc.id, ...doc.data() as Omit<UserTurns, 'id'> };
}

// Get a random unclaimed message
export async function getRandomUnclaimedMessage(): Promise<Message | null> {
  const q = query(
    collection(db, 'messages'),
    where('claimed', '==', false),
    orderBy('timestamp'),
    limit(50) // Get recent unclaimed messages
  );
  
  const querySnapshot = await getDocs(q);
  
  if (querySnapshot.empty) {
    return null;
  }
  
  const messages = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Message));
  
  // Randomly select one message
  const randomIndex = Math.floor(Math.random() * messages.length);
  return messages[randomIndex];
}

// Claim a message for a user
export async function claimMessage(messageId: string, userId: string): Promise<void> {
  const messageRef = doc(db, 'messages', messageId);
  await updateDoc(messageRef, {
    claimed: true,
    claimedBy: userId,
    claimedAt: Timestamp.now(),
  });
}

// Use a turn and get a message
export async function useUserTurn(userId: string): Promise<{ message: Message | null; turnsLeft: number }> {
  const userTurns = await getUserTurnsToday(userId);
  
  if (userTurns.turnsUsed >= userTurns.maxTurns) {
    return { message: null, turnsLeft: 0 };
  }
  
  const message = await getRandomUnclaimedMessage();
  
  if (!message) {
    return { message: null, turnsLeft: userTurns.maxTurns - userTurns.turnsUsed };
  }
  
  // Claim the message and update turns
  await claimMessage(message.id!, userId);
  
  const turnsRef = doc(db, 'userTurns', userTurns.id!);
  await updateDoc(turnsRef, {
    turnsUsed: userTurns.turnsUsed + 1,
  });
  
  return { 
    message, 
    turnsLeft: userTurns.maxTurns - userTurns.turnsUsed - 1 
  };
}

// Get user's claimed messages
export async function getUserClaimedMessages(userId: string): Promise<Message[]> {
  const q = query(
    collection(db, 'messages'),
    where('claimedBy', '==', userId),
    orderBy('claimedAt', 'desc')
  );
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Message));
}
