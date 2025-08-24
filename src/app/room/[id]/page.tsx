import React from "react";
import WaitingRoom from "../components/waitingRoom";

type PageProps = {
  params: { id: string };
};

export default function page({ params }: PageProps) {
    const { id } = params;

      const players = [
        { id: 1, name: "احمد", isHost: true },
        { id: 1, name: "احمد", isHost: false },
      ];
  return (
    <div className="">
      <WaitingRoom players={players} />
    </div>
  );
}
