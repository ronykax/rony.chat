"use client";

import React from "react";
import Message from "./Message";
import getTimestamp from "@/functions/getTimestamp";

import { messagesRef } from "@/config/firebase";
import { onSnapshot, query, orderBy, DocumentData } from "firebase/firestore";

function Messages() {
  const [loading, setLoading] = React.useState(true);
  const [messages, setMessages] = React.useState<DocumentData>([]);

  React.useEffect(() => {
    const queryMessages = query(messagesRef, orderBy("createdAt"));

    onSnapshot(queryMessages, (snapshot) => {
      let messages: DocumentData[] = [];

      snapshot.forEach((doc) => {
        messages.push({ ...doc.data(), msgId: doc.id });
      });

      setMessages(messages);
      setLoading(false);
    });
  }, []);

  return (
    loading ? (
      <main className="w-screen h-screen flex justify-center items-center">
        <p className="text-lightgray">Loading ...</p>
      </main>
    ) : (
      <main className="flex flex-col-reverse w-screen h-screen overflow-y-auto custom-scrollbar pt-18 pb-18">
        {messages.map((data: DocumentData) => <Message content={data.content} displayName={data.displayName} msgId={data.msgId} photoURL={data.photoURL} timestamp={getTimestamp(data.timestamp, false)} uId={data.uId} key={data.msgId} />)}
      </main>
    )
  )
}

export default Messages;