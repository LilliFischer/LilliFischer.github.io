// Volunteer Simulator – IFTR 2025
// ================================
// JavaScript Steuerlogik für Spielverlauf, UI-Interaktion & Sound

// ------------------------
// Globale Variablen
// ------------------------
let currentScene = 0;
let personalityScore = 0;
let isMuted = false;

const clickSound = new Audio("sounds/click.mp3");
const typeSound = new Audio("sounds/keyboard.mp3");
const muteIcon = document.getElementById("mute-icon");

const startScreen = document.getElementById("start-screen");
const game = document.getElementById("game");
const textElem = document.getElementById("text");
const choicesElem = document.getElementById("choices");

// ------------------------
// Szenen-Daten
// ------------------------
const scenes = [
  // Jede Szene enthält Text, Bild, Auswahlmöglichkeiten
  {
    text: "Your first task as an IFTR volunteer! Do you want to help at the coffee table or at registration?",
    img: "coffee.png",
    choices: [
      { text: "Coffee Table", score: 1, reaction: "You hand out coffee with shaky hands but a big smile. People are grateful." },
      { text: "Registration", score: 2, reaction: "You find a way to alphabetize chaos. Somehow, you enjoy it." }
    ]
  },
  {
    text: "A projector stops working right before a panel. What do you do?",
    img: "running.png",
    choices: [
      { text: "Try to fix it yourself", score: 1, reaction: "You fiddle with cables like a wizard. It works… kind of." },
      { text: "You ask another tech-savvy volunteer for help", score: 2, reaction: "You stay calm. Help comes in and fixes it fast." }
    ]
  },
  {
    text: "You are invited on stage at the opening ceremony to sing a Kölsche song. What do you do?",
    img: "dance.png",
    choices: [
      { text: "Sing loudly and proudly", score: 3, reaction: "You rock the stage! The crowd loves your Kölsche spirit and energy." },
      { text: "Sing quietly and hope no one notices", score: 1, reaction: "You mumble the lyrics, but at least you didn’t embarrass yourself too much." }
    ]
  },
  {
    text: "A speaker doesn’t show up. You’re the only volunteer nearby.",
    img: "zen.png",
    choices: [
      { text: "Entertain the audience", score: 2, reaction: "You improvise with jokes and facts. You’re not a speaker, but you survive." },
      { text: "Quietly panic", score: 0, reaction: "You get a bit flustered, but manage to stay calm until help arrives." }
    ]
  },
  {
    text: "Someone asks for directions to room XVIIa. How do you respond?",
    img: "walking.png",
    choices: [
      { text: "Give clear and detailed directions", score: 2, reaction: "You confidently guide them. They thank you and seem relieved." },
      { text: "Point vaguely and hope for the best", score: 0, reaction: "You gesture vaguely. Hopefully, they don’t get lost!" }
    ]
  },
  {
    text: "Final event: The IFTR Closing Party! Your energy is low, but the Kölsch is flowing.",
    img: "dancing.png",
    choices: [
      { text: "Hit the dance floor", score: 1, reaction: "You unleash your inner rhythm. People cheer." },
      { text: "Sneak out with a Kölsch", score: 0, reaction: "You escape the noise and drink your Kölsch alone. No regrets." }
    ]
  }
];

// ------------------------
// UI & Spielmechanik
// ------------------------
function typeWriter(text, callback) {
  textElem.textContent = "";
  let i = 0;
  typeSound.volume = 0.4;
  typeSound.currentTime = 3;
  typeSound.play().catch(() => {});

  function type() {
    if (i < text.length) {
      textElem.textContent += text.charAt(i);
      i++;
      setTimeout(type, 40);
    } else {
      typeSound.pause();
      typeSound.currentTime = 0;
      if (callback) callback();
    }
  }

  type();
}

function showScene() {
  choicesElem.innerHTML = "";
  textElem.textContent = "";

  const existingImg = document.getElementById("scene-image");
  if (existingImg) existingImg.remove();

  const scene = scenes[currentScene];
  const counterElem = document.getElementById("counter");
  if (counterElem) counterElem.textContent = `${currentScene + 1} / ${scenes.length}`;

  const img = document.createElement("img");
  img.src = `images/${scene.img}`;
  img.alt = "scene";
  img.id = "scene-image";
  img.style.width = "300px";
  img.style.marginTop = "1rem";
  game.appendChild(img);

  typeWriter(scene.text, () => showChoicesSequentially(scene.choices));
}

function showChoicesSequentially(choices) {
  choices.forEach((choice, index) => {
    const btn = document.createElement("button");
    btn.textContent = choice.text;
    btn.onclick = () => {
      clickSound.currentTime = 0.5;
      clickSound.play();
      personalityScore += choice.score;
      showReaction(choice.reaction);
    };
    choicesElem.appendChild(btn);
    setTimeout(() => btn.classList.add("visible"), 300 * index);
  });
}

function showReaction(reactionText) {
  choicesElem.innerHTML = "";
  typeWriter(reactionText, () => {
    const continueBtn = document.createElement("button");
    continueBtn.textContent = "Continue";
    continueBtn.classList.add("visible");
    continueBtn.onclick = () => {
      clickSound.currentTime = 0.5;
      clickSound.play();
      currentScene++;
      currentScene < scenes.length ? showScene() : showProfile();
    };
    choicesElem.appendChild(continueBtn);
  });
}

function showProfile() {
  textElem.innerHTML = "";
  choicesElem.textContent = "";

  const img = document.getElementById("scene-image");
  if (img) img.remove();

  let title = "", description = "", profileImg = "";

  if (personalityScore >= 8) {
    title = "The Professional";
    description = "Calm, structured, and always one step ahead. A reliable presence in the eye of the conference storm.";
    profileImg = "levitate.png";
  } else if (personalityScore >= 4) {
    title = "The Improviser";
    description = "You tackle problems with spontaneity, humor, and a touch of chaos. Somehow, it always works out.";
    profileImg = "running2.png";
  } else {
    title = "The Ghost";
    description = "You prefer to observe from the sidelines—but your silence carries weight. The mystery Volunteer.";
    profileImg = "reading2.png";
  }

  textElem.innerHTML = `<strong>${title}</strong><br><br>${description}`;
  const profile = document.createElement("img");
  profile.src = `images/${profileImg}`;
  profile.alt = profileImg;
  profile.style.width = "300px";
  profile.style.marginTop = "1rem";
  profile.id = "scene-image";
  game.appendChild(profile);

  const playAgainBtn = document.createElement("button");
  playAgainBtn.textContent = "Play Again";
  playAgainBtn.classList.add("visible");
  playAgainBtn.onclick = () => {
    clickSound.currentTime = 0.5;
    clickSound.play();
    setTimeout(restartGame, 700);
  };
  choicesElem.appendChild(playAgainBtn);
}

function restartGame() {
  currentScene = 0;
  personalityScore = 0;
  showScene();
}

// ------------------------
// UI Steuerung (Sidebar, Ton, Navigation)
// ------------------------
function toggleSidebar() {
  document.getElementById("sidebar").classList.toggle("open");
}

document.querySelectorAll(".sidebar-content a").forEach(link => {
  link.addEventListener("click", () => document.getElementById("sidebar").classList.remove("open"));
});

function toggleMute() {
  isMuted = !isMuted;
  muteIcon.src = isMuted ? "images/soundoff.png" : "images/sound.png";
  clickSound.muted = isMuted;
  typeSound.muted = isMuted;
  alert(`Sound ${isMuted ? "off" : "on"}`);
}

function goToStartScreen() {
  if (!isMuted) {
    clickSound.currentTime = 0.5;
    clickSound.play();
  }

  ["why", "credits", "game", "counter", "impressum"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = "none";
  });

  startScreen.style.display = "block";
  game.style.display = "none";
  currentScene = 0;
  personalityScore = 0;
}

// Navigation auf andere Seiten
const navLinks = document.querySelectorAll(".sidebar-content a, footer a");
navLinks.forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    const targetId = link.getAttribute("href").substring(1);
    ["start-screen", "game", "why", "about", "credits", "counter", "impressum"].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = "none";
    });
    const targetEl = document.getElementById(targetId);
    if (targetEl) targetEl.style.display = "block";
    document.getElementById("counter").style.display = (targetId === "game") ? "block" : "none";
    document.getElementById("sidebar").classList.remove("open");
  });
});

// Start-Button starten
const startBtn = document.getElementById("start-btn");
startBtn.onclick = () => {
  clickSound.currentTime = 0.5;
  clickSound.play();

  setTimeout(() => {
    startScreen.style.display = "none";
    game.style.display = "block";
    document.getElementById("counter").style.display = "block";
    document.getElementById("why").style.display = "none";
    restartGame();
  }, 300);
};
