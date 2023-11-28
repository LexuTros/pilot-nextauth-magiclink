import NextAuth from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { TableStorageAdapter } from "@auth/azure-tables-adapter";
import { AzureNamedKeyCredential, TableClient } from "@azure/data-tables";


const credential = new AzureNamedKeyCredential(
  process.env.AZURE_ACCOUNT, // = storage account name
  process.env.AZURE_ACCESS_KEY // access key to the storage account
)
const authClient = new TableClient(
  process.env.AZURE_TABLES_ENDPOINT, // must be of form: https://$AZURE_ACCOUNT.table.core.windows.net
  "auth", // must refer to an existing table of the storage account!
  credential
)

export const authOptions = {
  providers: [
    EmailProvider({
      // uses and requires nodemailer, info of smtp server
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
  ],
  adapter: TableStorageAdapter(authClient),
  // callbacks: {
  //   async signIn({ user, account, email }) {
  //     // Check if a user with the entered mail exists (would contain code to check if email is in CRM System)
  //     await db.connect();
  //     const userExists = await User.findOne({
  //       email: user.email,  //the user object has an email property, which contains the email the user entered.
  //     });
  //
  //     if (userExists) {
  //       return true;   //if the email exists in the User collection, email them a magic login link
  //     } else {
  //       return "/register"; // or just deny access
  //     }
  //   },
  // },
};

export default NextAuth(authOptions);