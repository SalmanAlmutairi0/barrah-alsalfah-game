// src/app/room/[id]/page.tsx

import RoomClient from "./roomClient";

type PageProps = {
  params: { id: string };
};

export default function Page({ params }: PageProps) {
  const roomKey = params.id;

  return <RoomClient roomKey={roomKey} />;
}
