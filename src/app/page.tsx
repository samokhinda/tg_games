'use client';

import { Page } from '@/components/Page';
import { JumpingGame } from '@/components/JumpingGame/JumpingGame';

export default function Home() {
  return (
    <Page back={false}>
      <JumpingGame />
    </Page>
  );
}
