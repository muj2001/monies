import * as Google from 'expo-auth-session/providers/google';
import * as SecureStore from 'expo-secure-store';
import * as WebBrowser from 'expo-web-browser';
import { useCallback, useEffect, useState } from 'react';

WebBrowser.maybeCompleteAuthSession();

const SHEET_ID = process.env.EXPO_PUBLIC_SHEET_ID;
const TAB = 'Expenses';
const TOKEN_KEY = 'google_token';

export function useSheets() {
  const [token, setToken] = useState<string | null>(null);

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_ID,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_ID,
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_ID,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  // Restore saved token on launch
  useEffect(() => {
    SecureStore.getItemAsync(TOKEN_KEY).then(setToken);
  }, []);

  // Save token after sign-in
  useEffect(() => {
    if (response?.type === 'success') {
      const t = response.authentication?.accessToken ?? null;
      if (t) {
        setToken(t);
        SecureStore.setItemAsync(TOKEN_KEY, t);
      }
    }
  }, [response]);

  const signOut = useCallback(async () => {
    setToken(null);
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  }, []);

  const call = useCallback(async (url: string, init: RequestInit = {}) => {
    const res = await fetch(url, {
      ...init,
      headers: { ...init.headers, Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    });
    if (res.status === 401) { await signOut(); throw new Error('Session expired, sign in again'); }
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }, [token, signOut]);

  const addExpense = (amount: number, category: string, note: string) =>
    call(
      `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${TAB}!A:D:append?valueInputOption=USER_ENTERED`,
      { method: 'POST', body: JSON.stringify({ values: [[new Date().toISOString(), amount, category, note]] }) }
    );

  const listExpenses = async () =>
    (await call(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${TAB}!A:D`)).values ?? [];

  return { signedIn: !!token, signIn: () => promptAsync(), ready: !!request, signOut, addExpense, listExpenses };
}