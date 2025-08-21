'use client';

import { Section, Cell, List, Text, Divider } from '@telegram-apps/telegram-ui';
import { Page } from '@/components/Page';
import { JumpingGame } from '@/components/JumpingGame/JumpingGame';

export default function Home() {
  return (
    <Page back={false}>
      <JumpingGame />

      <Divider />
      
      <List>
        <Section
          header="🌟 Терапевтическая игра для детей"
          footer="Специально разработано для детей с аутизмом"
        >
          <Cell>
            <div style={{ padding: '10px 0' }}>
              <Text style={{ fontSize: '16px', marginBottom: '8px', display: 'block' }}>
                🎮 <strong>Управление:</strong> Наклоны телефона (гироскоп)
              </Text>
              <Text style={{ fontSize: '16px', marginBottom: '8px', display: 'block' }}>
                🎵 <strong>Обратная связь:</strong> Музыка и звуки при успехе
              </Text>
              <Text style={{ fontSize: '16px', marginBottom: '8px', display: 'block' }}>
                🌈 <strong>Дизайн:</strong> Яркие цвета и плавные анимации
              </Text>
              <Text style={{ fontSize: '16px', marginBottom: '8px', display: 'block' }}>
                🧠 <strong>Цель:</strong> Развитие координации и сенсорной интеграции
              </Text>
              <Text style={{ fontSize: '16px', display: 'block' }}>
                💝 <strong>Особенности:</strong> Адаптировано для особых потребностей
              </Text>
            </div>
          </Cell>
        </Section>
      </List>
    </Page>
  );
}
