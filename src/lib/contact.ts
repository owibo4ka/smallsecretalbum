import { prisma } from "@/lib/prisma";

export async function createContactMessage(data: {
  name: string;
  email: string;
  subject: string | null;
  message: string;
}) {
  return prisma.contactMessage.create({ data });
}

export async function getContactMessages() {
  return prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });
}

export async function getUnreadMessageCount() {
  return prisma.contactMessage.count({ where: { read: false } });
}

export async function setMessageRead(id: string, read: boolean) {
  return prisma.contactMessage.update({ where: { id }, data: { read } });
}

export async function deleteContactMessage(id: string) {
  return prisma.contactMessage.delete({ where: { id } });
}
