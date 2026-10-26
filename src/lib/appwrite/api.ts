// cspell:ignore appwrite
import { ID, Query, OAuthProvider } from "appwrite";
import { account, appwriteConfig, avatars, databases } from "./config";
import type { INewUser } from "@/types";

export async function createUserAccount(user: INewUser) {
  try {
    const newAccount = await account.create({
      userId: ID.unique(),
      email: user.email,
      password: user.password,
      name: user.username,
    });

    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(newAccount.name);

    const newUser = await saveUserToDB({
      accountId: newAccount.$id,
      name: newAccount.name,
      email: newAccount.email,
      username: user.username,
      imageUrl: avatarUrl,
    });

    return newUser;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function saveUserToDB(user: {
  accountId: string;
  email: string;
  name: string;
  imageUrl: string;
  username?: string;
}) {
  try {
    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      user,
    );

    return newUser;
  } catch (error) {
    console.log(error);
    return error;
  }
}

//  just login
export async function signInUserAccount(user: {
  email: string;
  password: string;
}) {
  try {
    const session = await account.createEmailPasswordSession(
      user.email,
      user.password,
    );

    console.log("session", session);

    return session;
  } catch (error) {
    console.log(error);
  }
}

//get the current user

export async function getAccount() {
  try {
    const user = await account.get();
    console.log("user", user);

    return user;
  } catch (error) {
    console.log(error);
  }
}

export async function getCurrentAccount() {
  try {
    const currentAccount = await getAccount();
    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)],
    );

    if (currentUser.documents.length === 0) {
      return await saveUserToDB({
        accountId: currentAccount.$id,
        name: currentAccount.name,
        email: currentAccount.email,
        username: currentAccount.email,
        imageUrl: avatars.getInitials(currentAccount.name),
      });
    }

    console.log("currentUser", currentUser);

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function signinWithGoogle() {
  try {
    account.createOAuth2Session({
      provider: OAuthProvider.Google,
      success: "http://localhost:5173",
      failure: "http://localhost:5173/sign-up",
    });
  } catch (error) {
    console.log(error);
  }
}

export async function signinWithGithub() {
  try {
    account.createOAuth2Session({
      provider: OAuthProvider.Github,
      success: "http://localhost:5173",
      failure: "http://localhost:5173/sign-up",
    });
  } catch (error) {
    console.log(error);
  }
}
