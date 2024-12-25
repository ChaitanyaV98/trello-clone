import { Client, Account, ID, Databases, Storage } from "appwrite";
const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!); //NEXT_PUBLIC symbolises that this is going to be available on the client, ! makes sue that thsi is only available on server rendered components

const account = new Account(client);
const databases = new Databases(client);
const storage = new Storage(client);

export { client, account, databases, storage, ID };
