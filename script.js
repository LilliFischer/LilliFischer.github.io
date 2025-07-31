let currentScene = 0;
let personalityScore = 0;

const clickSound = new Audio("sounds/click.mp3");
const typeSound = new Audio("sounds/keyboard.mp3");


const scenes = [
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
      { text: "You ask another tech-savvy volunteer for help", score: 2, reaction: "You stay calm and escalate smart. Help comes in and fixes it fast."}
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
      { text: "Stall the audience", score: 2, reaction: "You improvise with jokes and facts. You’re not a speaker, but you survive." },
      { text: "Quietly panic backstage", score: 0, reaction: "You hyperventilate for 20 seconds. Then someone else saves the day." }
    ]
  },
  {
    text: "Someone approaches you during the conference and asks for directions to room XVIIa. How do you respond?",
    img: "walking.png",
    choices: [
      { text: "Give clear, detailed directions", score: 2, reaction: "You confidently guide them to the room. They thank you and seem relieved." },
      { text: "Point vaguely and hope for the best", score: 0, reaction: "You gesture vaguely and hope they figure it out. Hopefully, they don’t get lost!" }
    ]
  },
  {
    text: "Final event: The IFTR Closing Party! Your energy is low, but cake is high.",
    img: "dancing.png",
    choices: [
      { text: "Hit the dance floor", score: 1, reaction: "You unleash your inner rhythm. People cheer. You feel alive." },
      { text: "Sneak out with a Kölsch", score: 0, reaction: "You escape the noise and drink your Kölsch alone. No regrets."}
    ]
  }
];

const startScreen = document.getElementById('start-screen');
const game = document.getElementById('game');
const textElem = document.getElementById('text');
const choicesElem = document.getElementById('choices');
const energyBar = document.getElementById('energy-bar');

function typeWriter(text, callback) {
    const textElem = document.getElementById("text");
    textElem.textContent = "";
    let i = 0;
  
    
  typeSound.volume = 0.4;
  typeSound.currentTime = 3;
  typeSound.play().catch((e) => {
    // In modernen Browsern muss ein User zuerst interagieren
    console.warn("Autoplay prevented:", e);
  });

  
    function type() {
      if (i < text.length) {
        textElem.textContent += text.charAt(i);
        i++;
        setTimeout(type, 40); // Tippgeschwindigkeit
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
    
  // Counter aktualisieren
  const counterElem = document.getElementById("counter");
  if (counterElem) {
    counterElem.textContent = `${currentScene + 1} / ${scenes.length}`;
  }
  
  // Bild anzeigen
  const img = document.createElement("img");
  img.src = `images/${scene.img}`;
  img.alt = "scene";
  img.id = "scene-image";
  img.style.width = "300px";
  img.style.marginTop = "1rem";
  game.appendChild(img);

  typeWriter(scene.text, () => {
    showChoicesSequentially(scene.choices);
  });
}

function showChoicesSequentially(choices) {
  choices.forEach((choice, index) => {
    const btn = document.createElement("button");
    btn.textContent = choice.text;
    btn.onclick = () => {
        clickSound.currentTime = 0,5; // Startet den Sound von Anfang
        clickSound.play();
      personalityScore += choice.score;
      showReaction(choice.reaction);
    };
    choicesElem.appendChild(btn);
    setTimeout(() => {
      btn.classList.add("visible");
    }, 300 * index);
  });
}

function showReaction(reactionText) {
  choicesElem.innerHTML = "";
  typeWriter(reactionText, () => {
    const continueBtn = document.createElement("button");
    continueBtn.textContent = "Continue";
    continueBtn.classList.add("visible");
    continueBtn.onclick = () => {
        clickSound.currentTime = 0,5; // Startet den Sound von Anfang
        clickSound.play();
      currentScene++;
      if (currentScene < scenes.length) {
        showScene();
      } else {
        showProfile();
      }
    };
    choicesElem.appendChild(continueBtn);
  });

}

function showProfile() {
    textElem.innerHTML = "";
    choicesElem.textContent = ""; // sicherer als innerHTML = ""
  
    const img = document.getElementById("scene-image");
    if (img) img.remove();
  
    let title = "";
    let description = "";
    let profileImg = "";
  
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
  
    // Button manuell erstellen (nicht über innerHTML)
    const playAgainBtn = document.createElement("button");
    playAgainBtn.textContent = "Play Again";
    playAgainBtn.classList.add("visible");
  
    playAgainBtn.onclick = () => {
      clickSound.currentTime = 0,5;
      clickSound.play().catch((e) => {
        console.warn("Click sound couldn't play:", e);
      });
  
      setTimeout(() => {
        restartGame();
      }, 700);
    };
  
    choicesElem.appendChild(playAgainBtn);
  }
  

function restartGame() {
  currentScene = 0;
  personalityScore = 0;
  showScene();
}

function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  sidebar.classList.toggle("open");
}
document.querySelectorAll(".sidebar-content a").forEach(link => {
  link.addEventListener("click", () => {
    document.getElementById("sidebar").classList.remove("open");
  });
});





  
  let isMuted = false;
  const muteIcon = document.getElementById("mute-icon");


function toggleMute() {
  isMuted = !isMuted;
  // Icon wechseln
  muteIcon.src = isMuted ? "images/soundoff.png" : "images/sound.png";

  // Alle Sounds muten/unmuten
  clickSound.muted = isMuted;
  typeSound.muted = isMuted;
  

  alert(`Sound ${isMuted ? "off" : "on"}`);
}

function goToStartScreen() {
  if (!isMuted) {
    clickSound.currentTime = 0.5;
    clickSound.play();
  }

  // Gehe zurück zum Startscreen
  startScreen.style.display = "block";
  game.style.display = "none";

  // Optional: Game-Reset
  currentScene = 0;
  personalityScore = 0;
}
// Navigation zu Unterseiten wie "About", "Credits", "Why"
document.querySelectorAll(".sidebar-content a").forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault(); // Standardlink verhindern
    
    const targetId = link.getAttribute("href").substring(1);

    // Alle Abschnitte ausblenden
    ["start-screen", "game", "why", "about", "credits", "counter"].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = "none";
    });

    // Gewählten Abschnitt anzeigen
    const targetEl = document.getElementById(targetId);
    if (targetEl) targetEl.style.display = "block";

    // Counter nur im Spiel anzeigen
    const counter = document.getElementById("counter");
    if (counter) counter.style.display = (targetId === "game") ? "block" : "none";

    // Sidebar schließen
    document.getElementById("sidebar").classList.remove("open");
  });
});

// Start-Button im Startscreen
document.getElementById('start-btn').onclick = () => {
  clickSound.currentTime = 0.5;
  clickSound.play().catch(() => {});
  
  setTimeout(() => {
    // Startscreen ausblenden
    startScreen.style.display = "none";
    // Spiel anzeigen
    game.style.display = "block";
    // Counter anzeigen
    const counter = document.getElementById("counter");
    if (counter) counter.style.display = "block";
    // Warum-Sektion ausblenden
    const why = document.getElementById("why");
    if (why) why.style.display = "none";
    restartGame();
  }, 300);
};



function goToStartScreen() {
  if (!isMuted) {
    clickSound.currentTime = 0.5;
    clickSound.play();
  }

  // Alle anderen Sektionen ausblenden
  ["why", "credits", "game", "counter"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = "none";
  });

  // Startscreen anzeigen
  const startScreen = document.getElementById("start-screen");
  if (startScreen) startScreen.style.display = "block";

  // Game ausblenden (zur Sicherheit)
  const game = document.getElementById("game");
  if (game) game.style.display = "none";

  // Reset ggf.
  currentScene = 0;
  personalityScore = 0;
}

