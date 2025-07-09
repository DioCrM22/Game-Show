// Estado global da batalha
const battleState = new Map(); // Usando Map para armazenar múltiplas batalhas

export const initBattle = (player1Id, player2Id) => {
  const battleId = `${player1Id}-${player2Id}`;
  battleState.set(battleId, {
    player1: { attacks: 0, specialReady: false },
    player2: { attacks: 0, specialReady: false }
  });
  return battleId;
};

export const updateAttackCount = (battleId, player) => {
  const state = battleState.get(battleId);
  if (!state) return false;

  state[player].attacks++;
  if (state[player].attacks >= 3) {
    state[player].specialReady = true;
  }
  return state[player].specialReady;
};

export const useSpecial = (battleId, player) => {
  const state = battleState.get(battleId);
  if (!state || !state[player].specialReady) return false;

  state[player].attacks = 0;
  state[player].specialReady = false;
  return true;
};