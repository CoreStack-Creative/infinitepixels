const fs = require('fs');

// Read the current games.json
const gamesData = JSON.parse(fs.readFileSync('games.json', 'utf8'));

// Define control schemes for different game types
const controlSchemes = {
  shooter: {
    "WASD": "Move around",
    "Mouse": "Look around and aim",
    "Left Click": "Shoot weapon",
    "Right Click": "Aim down sights",
    "R": "Reload weapon",
    "Space": "Jump",
    "Shift": "Run/Sprint",
    "Ctrl": "Crouch"
  },
  
  racing: {
    "Arrow Keys / WASD": "Steer car",
    "Up Arrow / W": "Accelerate",
    "Down Arrow / S": "Brake/Reverse",
    "Left Arrow / A": "Turn left",
    "Right Arrow / D": "Turn right",
    "Space": "Handbrake",
    "N": "Nitro boost"
  },
  
  platformer: {
    "Arrow Keys / WASD": "Move",
    "Space": "Jump",
    "Shift": "Run/Sprint",
    "Ctrl": "Crouch/Slide"
  },
  
  clicker: {
    "Mouse": "Click to interact",
    "Left Click": "Primary action",
    "Space": "Pause/Resume"
  },
  
  twoPlayer: {
    "Player 1": "WASD keys to move",
    "Player 2": "Arrow keys to move",
    "Space": "Start/Pause game"
  },
  
  basketball: {
    "Player 1": "Use W key to jump and shoot",
    "Player 2": "Use Up Arrow to jump and shoot",
    "Space": "Start/Pause game",
    "Auto Movement": "Players move automatically"
  },
  
  sports: {
    "Arrow Keys / WASD": "Move player",
    "Space": "Action/Jump",
    "Mouse": "Aim and interact"
  },
  
  puzzle: {
    "Mouse": "Click and drag",
    "Left Click": "Select/Interact",
    "Arrow Keys": "Navigate"
  },
  
  io: {
    "Mouse": "Move and aim",
    "Left Click": "Primary action",
    "Right Click": "Secondary action",
    "Space": "Special ability"
  },
  
  bike: {
    "Arrow Keys / WASD": "Control bike",
    "Up Arrow / W": "Accelerate",
    "Down Arrow / S": "Brake",
    "Left/Right Arrows": "Lean/Turn",
    "Space": "Handbrake"
  },
  
  stickman: {
    "Arrow Keys / WASD": "Move",
    "Space": "Jump/Action",
    "Mouse": "Aim and attack",
    "Left Click": "Attack"
  },
  
  simulator: {
    "WASD": "Move around",
    "Mouse": "Look around",
    "Left Click": "Interact",
    "E": "Use/Enter",
    "Tab": "Menu"
  },
  
  horror: {
    "WASD": "Move around",
    "Mouse": "Look around",
    "Left Click": "Interact",
    "E": "Use/Pick up",
    "Shift": "Run",
    "F": "Flashlight",
    "Tab": "Inventory"
  },
  
  adventure: {
    "WASD": "Move around",
    "Mouse": "Look around and aim",
    "Left Click": "Attack/Interact",
    "E": "Use/Pick up",
    "Space": "Jump",
    "Shift": "Run"
  },
  
  fishing: {
    "Mouse": "Cast line and reel",
    "Left Click": "Cast",
    "Hold and Release": "Reel in fish",
    "Space": "Use bait"
  },
  
  drawing: {
    "Mouse": "Draw lines",
    "Left Click": "Start drawing",
    "Drag": "Draw path",
    "Right Click": "Erase"
  },
  
  multiplayer: {
    "WASD": "Move around",
    "Mouse": "Look and aim",
    "Left Click": "Primary action",
    "Right Click": "Secondary action",
    "Space": "Jump/Special",
    "Enter": "Chat"
  },
  
  endless: {
    "Arrow Keys / WASD": "Move",
    "Space": "Jump",
    "Mouse": "Steer/Control"
  },
  
  runner: {
    "Arrow Keys / WASD": "Move left/right",
    "Space": "Jump",
    "Down Arrow / S": "Slide",
    "Mouse": "Steer"
  },
  
  strategy: {
    "Mouse": "Select and command",
    "Left Click": "Select",
    "Right Click": "Command",
    "Arrow Keys": "Navigate map"
  }
};

// Function to determine control scheme based on game tags
function getControlsForGame(game) {
  const tags = game.tags || [];
  
  // Specific game mappings
  if (game.name === "Basket Random") {
    return controlSchemes.basketball;
  }
  
  if (game.name === "Cookie Clicker") {
    return {
      "Mouse": "Click cookie to earn points",
      "Left Click": "Click cookie",
      "Upgrades": "Click to purchase upgrades",
      "Auto": "Upgrades work automatically"
    };
  }
  
  // Check for specific control patterns based on tags
  if (tags.includes("2 player")) {
    if (tags.includes("basketball") || tags.includes("sports")) {
      return controlSchemes.basketball;
    }
    return controlSchemes.twoPlayer;
  }
  
  if (tags.includes("shooter")) {
    return controlSchemes.shooter;
  }
  
  if (tags.includes("racing") || tags.includes("cars")) {
    return controlSchemes.racing;
  }
  
  if (tags.includes("bike")) {
    return controlSchemes.bike;
  }
  
  if (tags.includes("horror")) {
    return controlSchemes.horror;
  }
  
  if (tags.includes("clicker")) {
    return controlSchemes.clicker;
  }
  
  if (tags.includes("platformer")) {
    return controlSchemes.platformer;
  }
  
  if (tags.includes("puzzle")) {
    return controlSchemes.puzzle;
  }
  
  if (tags.includes("io")) {
    return controlSchemes.io;
  }
  
  if (tags.includes("stickman")) {
    return controlSchemes.stickman;
  }
  
  if (tags.includes("simulator")) {
    return controlSchemes.simulator;
  }
  
  if (tags.includes("adventure")) {
    return controlSchemes.adventure;
  }
  
  if (tags.includes("fishing")) {
    return controlSchemes.fishing;
  }
  
  if (tags.includes("drawing")) {
    return controlSchemes.drawing;
  }
  
  if (tags.includes("sports")) {
    return controlSchemes.sports;
  }
  
  if (tags.includes("runner") || tags.includes("endless")) {
    return controlSchemes.runner;
  }
  
  if (tags.includes("strategy")) {
    return controlSchemes.strategy;
  }
  
  if (tags.includes("multiplayer")) {
    return controlSchemes.multiplayer;
  }
  
  // Default controls for unspecified games
  return {
    "Mouse": "Interact with game",
    "Left Click": "Primary action",
    "Arrow Keys / WASD": "Move/Navigate",
    "Space": "Jump/Action"
  };
}

// Add controls to each game
gamesData.forEach(game => {
  if (!game.controls) {
    game.controls = getControlsForGame(game);
  }
});

// Write the updated JSON back to file
fs.writeFileSync('games.json', JSON.stringify(gamesData, null, 1));

console.log('Controls added to all games successfully!');
