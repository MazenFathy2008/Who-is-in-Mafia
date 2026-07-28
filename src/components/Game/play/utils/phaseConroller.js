import { set, ref, onValue, get, remove } from "firebase/database";
import { PHASES } from "./phases";
import { db } from "../../../../config/firebase";
import { vote } from "./gameEvents";
export async function startGame(roomId) {
  await set(ref(db, `rooms/${roomId}/phase`), PHASES.SHOW_ROLE);
}

export const GAME_FLOW = {
  [PHASES.SHOW_ROLE]: {
    next: PHASES.EVERYONE_WAKE,
    duration: 5000,
    event: false,
  },
  [PHASES.EVERYONE_WAKE]: {
    next: PHASES.EVERYONE_SLEEP,
    duration: 15000,
    event: false,
  },
  [PHASES.EVERYONE_SLEEP]: {
    next: PHASES.MAFIA_WAKE,
    duration: 10000,
    event: false,
  },
  [PHASES.MAFIA_WAKE]: {
    next: PHASES.MAFIA_SLEEP,
    duration: 15000,
    event: true,
  },
  [PHASES.MAFIA_SLEEP]: {
    next: PHASES.DOCTOR_WAKE,
    duration: 4000,
    event: false,
  },
  [PHASES.DOCTOR_WAKE]: {
    next: PHASES.DOCTOR_SLEEP,
    duration: 15000,
    event: true,
  },
  [PHASES.DOCTOR_SLEEP]: {
    next: PHASES.SHOW_RESULT,
    duration: 4000,
    event: false,
  },
  [PHASES.SHOW_RESULT]: {
    next: PHASES.DISCUSSION,
    duration: 25000,
    event: true,
  },
  [PHASES.DISCUSSION]: {
    next: PHASES.VOTING,
    duration: 30000,
    event: false,
  },
  [PHASES.VOTING]: {
    next: PHASES.REVEAL_VOTE,
    duration: 20000,
    event: true,
  },
  [PHASES.REVEAL_VOTE]: {
    next: PHASES.EVERYONE_WAKE,
    duration: 18000,
    event: true,
  },
};
export const startGameloop = (roomId) => {
  const phaseRef = ref(db, `rooms/${roomId}/phase`);
  let time = null;
  const currentPhaseShot = onValue(phaseRef, async (snapshot) => {
    clearTimeout(time);
    const currentPhase = snapshot.val();
    if (currentPhase != PHASES.GAME_OVER && currentPhase) {
      if (!GAME_FLOW[currentPhase].event) {
        time = setTimeout(async () => {
          if (currentPhase === PHASES.MAFIA_SLEEP) {
            const doctorKilled = (
              await get(ref(db, `rooms/${roomId}/doctorKilled`))
            ).val();
            if (doctorKilled) {
              set(phaseRef, PHASES.SHOW_RESULT);
              return;
            }
          }
          set(phaseRef, GAME_FLOW[currentPhase].next);
        }, GAME_FLOW[currentPhase].duration);
      } else {
        if (currentPhase === PHASES.MAFIA_WAKE) {
          mafiaTurn(roomId, phaseRef, currentPhase);
        } else if (currentPhase === PHASES.DOCTOR_WAKE) {
          doctorTurn(roomId, phaseRef, currentPhase);
        } else if (currentPhase === PHASES.SHOW_RESULT) {
          time = ShowResults(roomId, phaseRef, currentPhase);
        } else if (currentPhase === PHASES.VOTING) {
          await votes(roomId, phaseRef, currentPhase);
        } else if (currentPhase === PHASES.REVEAL_VOTE) {
          time = await revealvote(roomId, phaseRef, currentPhase);
        }
      }
    }
  });
  return () => {
    currentPhaseShot();
  };
};

const mafiaTurn = async (roomId, phaseRef, currentPhase) => {
  await remove(ref(db, `rooms/${roomId}/eliminatedPlayer`));
  const mafiaTargetRef = ref(db, `rooms/${roomId}/mafiaTarget`);
  const unsubMafiaTarget = onValue(mafiaTargetRef, async (snapshot) => {
    if (snapshot.exists()) {
      await set(phaseRef, GAME_FLOW[currentPhase].next);
      unsubMafiaTarget();
    }
  });
};
const doctorTurn = async (roomId, phaseRef, currentPhase) => {
  const doctorTargetRef = ref(db, `rooms/${roomId}/doctorTarget`);
  const unsubDoctorTarget = onValue(doctorTargetRef, async (snapshot) => {
    if (snapshot.exists()) {
      await set(phaseRef, GAME_FLOW[currentPhase].next);
      unsubDoctorTarget();
    }
  });
};
const ShowResults = async (roomId, phaseRef, currentPhase) => {
  const mafiaTargetRef = ref(db, `rooms/${roomId}/mafiaTarget`);
  const doctorTargetRef = ref(db, `rooms/${roomId}/doctorTarget`);
  const revealTargetRef = ref(db, `rooms/${roomId}/reveal-target`);
  const mafiaTarget = (await get(mafiaTargetRef)).val();
  const doctorTarget = (await get(doctorTargetRef)).val();
  if (mafiaTarget !== doctorTarget) {
    const doctorRef = ref(db, `rooms/${roomId}/doctor/id`);
    const doctor = (await get(doctorRef)).val();
    if (doctor === mafiaTarget) {
      await set(ref(db, `rooms/${roomId}/doctorKilled`), true);
    }
    await set(ref(db, `rooms/${roomId}/players/${mafiaTarget}/killed`), true);
  }
  if (mafiaTarget) {
    await set(revealTargetRef, {
      doctorTarget: doctorTarget || null,
      mafiaTarget: mafiaTarget,
    });
  }
  const continueGame = await chekIfgameOverAfterResults(roomId, phaseRef);
  if (!continueGame) {
    return;
  }
  return setTimeout(async () => {
    try {
      await remove(doctorTargetRef);
      await remove(mafiaTargetRef);
      await set(phaseRef, GAME_FLOW[currentPhase].next);
    } catch {
      set(phaseRef, currentPhase);
    }
  }, GAME_FLOW[currentPhase].duration);
};
const chekIfgameOverAfterResults = async (roomId, phaseRef) => {
  const playersRef = ref(db, `rooms/${roomId}/players`);
  const players = (await get(playersRef)).val();
  const alivePlayers = Object.keys(players).reduce((acc, id) => {
    if (players[id].killed) {
      return acc;
    } else {
      return acc + 1;
    }
  }, 0);
  if (alivePlayers <= 2) {
    const mafia = (await get(ref(db,`rooms/${roomId}/mafia/id`))).val();
    const doctor = (await get(ref(db,`rooms/${roomId}/doctor/id`))).val();
    await set(ref(db, `rooms/${roomId}/winner`), {
      whoWin: "mafia",
      mafia: mafia,
      doctor: doctor,
    });
    set(phaseRef, PHASES.GAME_OVER);
    return false;
  }
  return true;
};
const votes = async (roomId, phaseRef, currentPhase) => {
  const votesRef = ref(db, `rooms/${roomId}/votes`);
  const unSubVotes = onValue(votesRef, async (snapshot) => {
    if (!snapshot.exists()) return;
    const votesData = snapshot.val();
    const players = (await get(ref(db, `rooms/${roomId}/players`))).val();
    const alivePlayers = Object.keys(players).filter(
      (id) => !players[id].killed,
    );
    if (votesData.sum === alivePlayers.length) {
      await set(phaseRef, GAME_FLOW[currentPhase].next);
      unSubVotes();
    }
  });
};
const revealvote = async (roomId, phaseRef, currentPhase) => {
  const playersRef = ref(db, `rooms/${roomId}/players`);
  const players = await get(playersRef);
  const continueGame = await chekIfgameOver(roomId, phaseRef, players.val());
  if (continueGame) {
    return setTimeout(async () => {
      await set(phaseRef, GAME_FLOW[currentPhase].next);
    }, GAME_FLOW[currentPhase].duration);
  }
};
const chekIfgameOver = async (roomId, phaseRef, players) => {
  const votesRef = ref(db, `rooms/${roomId}/votes`);
  const mostVotedref = ref(db, `rooms/${roomId}/votes/votedOn`);
  const mafiaRef = ref(db, `rooms/${roomId}/mafia/id`);
  const mafia = (await get(mafiaRef)).val();
  const doctorRef = ref(db, `rooms/${roomId}/doctor/id`);
  const doctor = (await get(doctorRef)).val();
  const votes = (await get(mostVotedref)).val();
  const revealTargetRef = ref(db, `rooms/${roomId}/reveal-target`);
  const duration = 20000;
  await remove(revealTargetRef);
  let maxVotes = 0;
  let choosedOne;
  Object.keys(votes || {}).forEach((id) => {
    if (votes[id] > maxVotes) {
      maxVotes = votes[id];
      choosedOne = id;
    } else if (votes[id] === maxVotes) {
      choosedOne = false;
    }
  });
  await set(
    ref(db, `rooms/${roomId}/eliminatedPlayer`),
    choosedOne
      ? {
          id: choosedOne,
          votes: maxVotes,
          isMafia: choosedOne === mafia,
          isDoctor: choosedOne === doctor,
        }
      : "tie",
  );

  if (choosedOne === mafia) {
    await set(ref(db, `rooms/${roomId}/winner`), {
      whoWin: "city",
      mafia: mafia,
      doctor: doctor,
    });
    setTimeout(() => {
      set(phaseRef, PHASES.GAME_OVER);
    }, duration);
    return;
  }
  if (choosedOne === doctor) {
    await set(ref(db, `rooms/${roomId}/doctorKilled`), true);
  }
  const playersRef = ref(db, `rooms/${roomId}/players`);

  if (!choosedOne) {
    await remove(votesRef);
    Object.keys(players).forEach((id) => {
      players[id].voted = null;
    });
    await set(playersRef, players);
    return true;
  }
  players[choosedOne].killed = true;
  Object.keys(players).forEach((id) => {
    players[id].voted = null;
  });
  const totalAlive = Object.keys(players).reduce((acc, curr) => {
    if (!players[curr].killed) {
      return acc + 1;
    }
    return acc;
  }, 0);
  if (totalAlive <= 2) {
    await set(ref(db, `rooms/${roomId}/winner`), {
      whoWin: "mafia",
      mafia: mafia,
      doctor: doctor,
    });
    setTimeout(() => {
      set(phaseRef, PHASES.GAME_OVER);
    }, duration);
    return;
  }
  await set(playersRef, players);
  await remove(votesRef);
  return true;
};
