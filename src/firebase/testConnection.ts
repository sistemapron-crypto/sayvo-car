import { collection, getDocs } from 'firebase/firestore';
import { db } from './firestore';

export async function testFirebaseConnection(): Promise<void> {
  const snapshot = await getDocs(collection(db, 'produtos'));

  console.log(
    `Firebase conectado. Veículos encontrados: ${snapshot.size}`
  );
}