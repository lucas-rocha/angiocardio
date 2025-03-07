import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      email: string;
      role: string; // Adicionando a propriedade role aqui
    };
  }

  interface User {
    email: string;
    role: string; // Adicionando a propriedade role aqui
  }
}