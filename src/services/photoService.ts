/**
 * photoService.ts
 *
 * Gerencia o upload da foto de perfil para o Firebase Storage.
 *
 * NOTA: O Firebase Storage precisa estar ativado no plano do Firebase.
 * Enquanto não estiver, a função lançará um erro com mensagem amigável.
 * Quando o Storage for ativado, funcionará automaticamente sem nenhuma
 * alteração de código.
 *
 * Estrutura no Storage:
 *   profile_photos/{uid}/avatar.jpg
 */

import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

// ─── Upload de foto ──────────────────────────────────────────────────────────

/**
 * Faz upload de uma imagem local para o Firebase Storage e retorna a URL pública.
 * Também atualiza o campo `photoURL` no Firestore automaticamente.
 *
 * @param uid   UID do usuário autenticado
 * @param localUri  URI local da imagem (retornado pelo expo-image-picker)
 * @returns URL pública da foto no Storage
 */
export async function uploadProfilePhoto(uid: string, localUri: string): Promise<string> {
  try {
    // Converter URI local para Blob
    const response = await fetch(localUri);
    const blob = await response.blob();

    // Referência no Storage: profile_photos/{uid}/avatar.jpg
    const storage = getStorage();
    const storageRef = ref(storage, `profile_photos/${uid}/avatar.jpg`);

    // Upload
    await uploadBytes(storageRef, blob, {
      contentType: 'image/jpeg',
      customMetadata: { uploadedBy: uid },
    });

    // Obter URL pública
    const downloadURL = await getDownloadURL(storageRef);

    // Persistir no Firestore
    await updateDoc(doc(db, 'usuarios', uid), {
      photoURL: downloadURL,
      updatedAt: serverTimestamp(),
    });

    return downloadURL;
  } catch (err: any) {
    // Verificar se é erro de Storage inativo/sem permissão
    if (
      err?.code === 'storage/unauthorized' ||
      err?.code === 'storage/unknown' ||
      err?.message?.includes('storage')
    ) {
      throw new Error(
        'O armazenamento de fotos ainda não está disponível. Ative o Firebase Storage no seu plano para usar esta funcionalidade.',
      );
    }
    throw err;
  }
}

// ─── Salvar apenas a URL (sem re-upload) ─────────────────────────────────────

export async function savePhotoURL(uid: string, url: string): Promise<void> {
  await updateDoc(doc(db, 'usuarios', uid), {
    photoURL: url,
    updatedAt: serverTimestamp(),
  });
}
