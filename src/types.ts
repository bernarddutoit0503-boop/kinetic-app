export type Screen = 'feed' | 'ai' | 'gear' | 'hub' | 'saved';

export interface GameEvent {
  event_name: string;
  description?: string;
  subtitle?: string;
}

export interface LiveEvents {
  destiny2: GameEvent;
  phasmophobia: GameEvent;
  theisle: GameEvent;
  rainbow6siege: GameEvent;
  forhonor: GameEvent;
  dota2: GameEvent;
  helldivers2: GameEvent;
  marvelrivals: GameEvent;
  poe2: GameEvent;
}
