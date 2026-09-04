/**
 * A JORNADA DE BONE: EM BUSCA DE TSUYSHI - EDIÇÃO DEFINITIVA (MOBILE & 2 CHEFES)
 * Motor de Jogo - Plataforma 2D
 * 
 * Novidades:
 * - Suporte Touch Completo para Celular (Multi-touch virtual gamepad)
 * - 2 Batalhas de Chefes Épicas:
 *   • Fase 5: O Boto Titã do Pântano (Arena travada, ataques aquáticos e pisadas no topo)
 *   • Fase 10: A Sombra da Maldição (Espírito ancestral das trevas com projéteis mágicos)
 * - Botão de Reinício Total (Reset Completo do Save / Começar do Zero)
 * - Persistência via localStorage e Menu de Seleção das 10 Fases
 */

// ==========================================================
// 1. SISTEMA DE ÁUDIO PROCEDURAL (Web Audio API)
// ==========================================================
class SoundEngine {
    constructor() {
        this.ctx = null;
        this.enabled = true;
    }

    init() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                this.ctx = new AudioContext();
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    toggle() {
        this.enabled = !this.enabled;
        return this.enabled;
    }

    playJump() {
        if (!this.enabled || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(440, now + 0.15);

        gain.gain.setValueAtTime(0.15, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.15);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.16);
    }

    playCollect() {
        if (!this.enabled || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, now);
        osc.frequency.setValueAtTime(880, now + 0.08);

        gain.gain.setValueAtTime(0.18, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.21);
    }

    playEssence() {
        if (!this.enabled || !this.ctx) return;
        const now = this.ctx.currentTime;
        const arpeggio = [440, 554.37, 659.25, 880, 1108.73];
        arpeggio.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const start = now + idx * 0.05;

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, start);

            gain.gain.setValueAtTime(0.18, start);
            gain.gain.exponentialRampToValueAtTime(0.001, start + 0.35);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(start);
            osc.stop(start + 0.36);
        });
    }

    playPowerup() {
        if (!this.enabled || !this.ctx) return;
        const now = this.ctx.currentTime;
        const notes = [330, 440, 554, 659, 880];
        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const start = now + idx * 0.06;

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, start);

            gain.gain.setValueAtTime(0.2, start);
            gain.gain.linearRampToValueAtTime(0.01, start + 0.1);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(start);
            osc.stop(start + 0.11);
        });
    }

    playBounce() {
        if (!this.enabled || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.linearRampToValueAtTime(620, now + 0.12);
        osc.frequency.linearRampToValueAtTime(320, now + 0.25);

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.26);
    }

    playHit() {
        if (!this.enabled || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.linearRampToValueAtTime(70, now + 0.2);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.26);
    }

    playBossDamage() {
        if (!this.enabled || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(280, now);
        osc.frequency.linearRampToValueAtTime(90, now + 0.25);

        gain.gain.setValueAtTime(0.35, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.26);
    }

    playBossDefeat() {
        if (!this.enabled || !this.ctx) return;
        const now = this.ctx.currentTime;
        const chords = [220, 330, 440, 550, 660, 880];
        chords.forEach((f, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const start = now + i * 0.08;

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(f, start);

            gain.gain.setValueAtTime(0.25, start);
            gain.gain.linearRampToValueAtTime(0.01, start + 0.4);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(start);
            osc.stop(start + 0.45);
        });
    }

    playCheckpoint() {
        if (!this.enabled || !this.ctx) return;
        const now = this.ctx.currentTime;
        const chords = [523.25, 659.25, 783.99, 1046.50];
        chords.forEach((freq) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now);

            gain.gain.setValueAtTime(0.12, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.65);
        });
    }

    playStageClear() {
        if (!this.enabled || !this.ctx) return;
        const now = this.ctx.currentTime;
        const notes = [
            { f: 523.25, d: 0.12 },
            { f: 659.25, d: 0.12 },
            { f: 783.99, d: 0.12 },
            { f: 880.00, d: 0.18 },
            { f: 1046.50, d: 0.4 }
        ];
        let off = 0;
        notes.forEach(n => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const t = now + off;

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(n.f, t);

            gain.gain.setValueAtTime(0.2, t);
            gain.gain.linearRampToValueAtTime(0.01, t + n.d);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(t);
            osc.stop(t + n.d + 0.05);
            off += n.d * 0.85;
        });
    }

    playWarning() {
        if (!this.enabled || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.setValueAtTime(110, now + 0.2);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.42);
    }

    playVictory() {
        if (!this.enabled || !this.ctx) return;
        const now = this.ctx.currentTime;
        const melody = [
            { f: 523.25, d: 0.15 },
            { f: 659.25, d: 0.15 },
            { f: 783.99, d: 0.15 },
            { f: 1046.50, d: 0.25 },
            { f: 987.77, d: 0.2 },
            { f: 1046.50, d: 0.6 }
        ];
        let offset = 0;
        melody.forEach(note => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const start = now + offset;

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(note.f, start);

            gain.gain.setValueAtTime(0.25, start);
            gain.gain.linearRampToValueAtTime(0.01, start + note.d);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(start);
            osc.stop(start + note.d + 0.05);

            offset += note.d * 0.9;
        });
    }

    playClick() {
        if (!this.enabled || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(400, now + 0.04);

        gain.gain.setValueAtTime(0.1, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.04);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.05);
    }
}

// ==========================================================
// 2. CONFIGURAÇÕES E ESTADOS GLOBAIS
// ==========================================================
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const audio = new SoundEngine();

const VIEW_WIDTH = 960;
const VIEW_HEIGHT = 540;
const GRAVITY = 0.52;

const GAME_STATE = {
    MENU: 'MENU',
    PLAYING: 'PLAYING',
    PAUSED: 'PAUSED',
    STAGE_CLEAR: 'STAGE_CLEAR',
    INCOMPLETE_HUMANITY: 'INCOMPLETE_HUMANITY',
    GAME_OVER: 'GAME_OVER',
    VICTORY: 'VICTORY'
};
let currentState = GAME_STATE.MENU;

let currentStage = 0;
const TOTAL_STAGES = 10;
let levelWidth = 2000;

// Persistência
let maxUnlockedStage = 0;
let highScore = 0;
let collectedEssenceIds = new Set();
let humanity = 0;

// Câmera & Trava de Arena
const camera = {
    x: 0,
    y: 0,
    targetX: 0,
    isLocked: false,
    lockX: 0
};

// Controles
const keys = {
    left: false,
    right: false,
    jump: false
};

// Partículas
let particles = [];
let fireflies = [];
let bossProjectiles = [];

let score = 0;
let campaignStartTime = 0;
let elapsedPlayTime = 0;

// Jogador
const player = {
    x: 60,
    y: 380,
    width: 32,
    height: 52,
    velX: 0,
    velY: 0,
    baseSpeed: 4.6,
    baseJump: -11.5,
    speed: 4.6,
    jumpForce: -11.5,
    grounded: false,
    facing: 1,
    lives: 3,
    maxLives: 3,
    invulnerableTimer: 0,
    guaranaTimer: 0,
    walkFrame: 0,
    checkpoint: { x: 60, y: 380 }
};

// Princesa Tsuyshi
const princess = {
    x: 2180,
    y: 190,
    width: 38,
    height: 60,
    glowTimer: 0
};

// Estrutura do Chefe da Fase Atual
let currentBoss = null;

// Elementos da Fase Ativa
let platforms = [];
let hazards = [];
let items = [];
let totems = [];
let botos = [];
let boitatas = [];
let stageGoal = { x: 1900, y: 360, width: 60, height: 90, type: 'portal' };

// ==========================================================
// 3. PERSISTÊNCIA LOCAL (localStorage)
// ==========================================================
function loadSavedData() {
    try {
        const savedStage = localStorage.getItem('bone_max_stage');
        if (savedStage !== null) {
            maxUnlockedStage = Math.max(0, Math.min(parseInt(savedStage, 10), TOTAL_STAGES - 1));
        }

        const savedScore = localStorage.getItem('bone_high_score');
        if (savedScore !== null) {
            highScore = parseInt(savedScore, 10) || 0;
        }

        const savedEssences = localStorage.getItem('bone_essences');
        if (savedEssences) {
            const list = JSON.parse(savedEssences);
            collectedEssenceIds = new Set(list);
            humanity = Math.min(100, collectedEssenceIds.size * 5);
        }
    } catch (e) {
        console.warn("Não foi possível carregar dados do localStorage", e);
    }
    updateMenuSaveUI();
}

function saveProgress() {
    try {
        localStorage.setItem('bone_max_stage', maxUnlockedStage);
        localStorage.setItem('bone_high_score', Math.max(highScore, score));
        localStorage.setItem('bone_essences', JSON.stringify(Array.from(collectedEssenceIds)));
    } catch (e) {
        console.warn("Não foi possível salvar no localStorage", e);
    }
    updateMenuSaveUI();
}

function resetAllProgress() {
    audio.playClick();
    if (confirm("Tem certeza que deseja apagar todo o progresso salvo e recomeçar a jornada do zero?")) {
        try {
            localStorage.removeItem('bone_max_stage');
            localStorage.removeItem('bone_high_score');
            localStorage.removeItem('bone_essences');
        } catch (e) {
            console.warn(e);
        }
        maxUnlockedStage = 0;
        highScore = 0;
        collectedEssenceIds.clear();
        humanity = 0;
        score = 0;

        updateMenuSaveUI();
        updateHUDAll();
        returnToMainMenu();
        alert("Progresso apagado com sucesso! Você retornou ao estado original de esqueleto.");
    }
}

function updateMenuSaveUI() {
    const saveBox = document.getElementById('save-status-box');
    const saveStageText = document.getElementById('save-stage-text');
    const saveHighScore = document.getElementById('save-high-score');
    const continueBtn = document.getElementById('btn-continue-game');

    if (maxUnlockedStage > 0 || score > 0 || collectedEssenceIds.size > 0) {
        saveBox.classList.remove('hidden');
        continueBtn.classList.remove('hidden');
        saveStageText.innerText = `Fase ${maxUnlockedStage + 1}/${TOTAL_STAGES}`;
        saveHighScore.innerText = `${Math.max(highScore, score)} pts`;
        continueBtn.innerText = `CONTINUAR JORNADA (FASE ${maxUnlockedStage + 1}) ➔`;
    } else {
        saveBox.classList.add('hidden');
        continueBtn.classList.add('hidden');
    }
}

// ==========================================================
// 4. DEFINIÇÃO DAS 10 FASES DA AMAZÔNIA
// ==========================================================
const STAGES_DATA = [
    // --- FASE 1: As Margens do Rio Amazonas ---
    {
        name: "As Margens do Rio",
        desc: "Atravesse as margens do rio e desvie dos primeiros botos!",
        icon: "🌊",
        width: 1900,
        goalType: 'portal',
        goalX: 1780,
        spawn: { x: 60, y: 380 },
        platforms: [
            { x: 0, y: 460, width: 300, height: 80, type: 'ground' },
            { x: 360, y: 430, width: 100, height: 18, type: 'vitoria-regia', baseY: 430, floatOffset: 0 },
            { x: 520, y: 390, width: 100, height: 18, type: 'vitoria-regia', baseY: 390, floatOffset: 1.5 },
            { x: 680, y: 370, width: 100, height: 18, type: 'vitoria-regia', baseY: 370, floatOffset: 3 },
            { x: 840, y: 410, width: 100, height: 18, type: 'vitoria-regia', baseY: 410, floatOffset: 4.5 },
            { x: 1000, y: 460, width: 300, height: 80, type: 'ground' },
            { x: 1360, y: 420, width: 100, height: 18, type: 'vitoria-regia', baseY: 420, floatOffset: 1 },
            { x: 1520, y: 380, width: 100, height: 18, type: 'vitoria-regia', baseY: 380, floatOffset: 2.5 },
            { x: 1680, y: 460, width: 300, height: 80, type: 'ground' }
        ],
        hazards: [
            { x: 300, y: 480, width: 700, height: 60, type: 'water' },
            { x: 1300, y: 480, width: 380, height: 60, type: 'water' }
        ],
        totems: [{ x: 1100, y: 375, width: 34, height: 85, activated: false, label: 'Totem das Águas' }],
        botos: [
            { startX: 480, x: 480, baseY: 480, y: 480, width: 44, height: 24, jumpTimer: 20, jumpInterval: 130, isJumping: false, velY: 0 },
            { startX: 760, x: 760, baseY: 480, y: 480, width: 44, height: 24, jumpTimer: 80, jumpInterval: 140, isJumping: false, velY: 0 }
        ],
        boitatas: [],
        hasBoss: false,
        items: [
            { id: 'e1_1', x: 570, y: 330, type: 'essence', radius: 12, collected: false },
            { id: 'e1_2', x: 1570, y: 320, type: 'essence', radius: 12, collected: false },
            { id: 'a1_1', x: 200, y: 410, type: 'acai', radius: 9, collected: false }
        ]
    },

    // --- FASE 2: O Igarapé Nebuloso ---
    {
        name: "O Igarapé Nebuloso",
        desc: "Névoa densa sobre as águas escuras da Amazônia!",
        icon: "🌫️",
        width: 1950,
        goalType: 'portal',
        goalX: 1820,
        spawn: { x: 60, y: 380 },
        platforms: [
            { x: 0, y: 460, width: 280, height: 80, type: 'ground' },
            { x: 340, y: 410, width: 90, height: 18, type: 'vitoria-regia', baseY: 410, floatOffset: 0.5 },
            { x: 490, y: 370, width: 90, height: 18, type: 'vitoria-regia', baseY: 370, floatOffset: 2 },
            { x: 640, y: 340, width: 90, height: 18, type: 'vitoria-regia', baseY: 340, floatOffset: 3.5 },
            { x: 790, y: 460, width: 260, height: 80, type: 'ground' },
            { x: 1120, y: 400, width: 90, height: 18, type: 'vitoria-regia', baseY: 400, floatOffset: 1.2 },
            { x: 1280, y: 360, width: 90, height: 18, type: 'vitoria-regia', baseY: 360, floatOffset: 2.8 },
            { x: 1440, y: 390, width: 90, height: 18, type: 'vitoria-regia', baseY: 390, floatOffset: 4 },
            { x: 1600, y: 460, width: 350, height: 80, type: 'ground' }
        ],
        hazards: [
            { x: 280, y: 480, width: 510, height: 60, type: 'water' },
            { x: 1050, y: 480, width: 550, height: 60, type: 'water' }
        ],
        totems: [{ x: 880, y: 375, width: 34, height: 85, activated: false, label: 'Totem do Igarapé' }],
        botos: [
            { startX: 560, x: 560, baseY: 480, y: 480, width: 44, height: 24, jumpTimer: 40, jumpInterval: 120, isJumping: false, velY: 0 },
            { startX: 1360, x: 1360, baseY: 480, y: 480, width: 44, height: 24, jumpTimer: 30, jumpInterval: 130, isJumping: false, velY: 0 }
        ],
        boitatas: [],
        hasBoss: false,
        items: [
            { id: 'e2_1', x: 685, y: 280, type: 'essence', radius: 12, collected: false },
            { id: 'e2_2', x: 1325, y: 300, type: 'essence', radius: 12, collected: false },
            { id: 'h2_1', x: 920, y: 410, type: 'heart', radius: 11, collected: false }
        ]
    },

    // --- FASE 3: A Selva dos Cipós Gigantes ---
    {
        name: "Selva dos Cipós",
        desc: "Pule nas alturas com cogumelos e alcance os galhos altos!",
        icon: "🌿",
        width: 2000,
        goalType: 'portal',
        goalX: 1860,
        spawn: { x: 60, y: 380 },
        platforms: [
            { x: 0, y: 460, width: 260, height: 80, type: 'ground' },
            { x: 280, y: 438, width: 45, height: 22, type: 'mushroom' },
            { x: 300, y: 280, width: 160, height: 20, type: 'wood' },
            { x: 520, y: 230, width: 170, height: 20, type: 'wood' },
            { x: 460, y: 460, width: 260, height: 80, type: 'ground' },
            { x: 780, y: 438, width: 45, height: 22, type: 'mushroom' },
            { x: 860, y: 290, width: 160, height: 20, type: 'wood' },
            { x: 1080, y: 240, width: 170, height: 20, type: 'wood' },
            { x: 1020, y: 460, width: 280, height: 80, type: 'ground' },
            { x: 1380, y: 380, width: 140, height: 20, type: 'wood' },
            { x: 1580, y: 320, width: 140, height: 20, type: 'wood' },
            { x: 1680, y: 460, width: 320, height: 80, type: 'ground' }
        ],
        hazards: [
            { x: 260, y: 485, width: 200, height: 55, type: 'spikes' },
            { x: 720, y: 485, width: 300, height: 55, type: 'spikes' },
            { x: 1300, y: 485, width: 380, height: 55, type: 'water' }
        ],
        totems: [{ x: 1120, y: 375, width: 34, height: 85, activated: false, label: 'Totem dos Cipós' }],
        botos: [],
        boitatas: [],
        hasBoss: false,
        items: [
            { id: 'e3_1', x: 605, y: 180, type: 'essence', radius: 12, collected: false },
            { id: 'e3_2', x: 1165, y: 190, type: 'essence', radius: 12, collected: false }
        ]
    },

    // --- FASE 4: A Toca do Curupira ---
    {
        name: "A Toca do Curupira",
        desc: "O espírito guardião protegeu o Guaraná Místico na floresta!",
        icon: "🐾",
        width: 2050,
        goalType: 'portal',
        goalX: 1920,
        spawn: { x: 60, y: 380 },
        platforms: [
            { x: 0, y: 460, width: 280, height: 80, type: 'ground' },
            { x: 320, y: 438, width: 45, height: 22, type: 'mushroom' },
            { x: 380, y: 270, width: 180, height: 20, type: 'wood' },
            { x: 620, y: 220, width: 180, height: 20, type: 'wood' },
            { x: 560, y: 460, width: 280, height: 80, type: 'ground' },
            { x: 900, y: 438, width: 45, height: 22, type: 'mushroom' },
            { x: 980, y: 250, width: 200, height: 20, type: 'wood' },
            { x: 1240, y: 200, width: 180, height: 20, type: 'wood' },
            { x: 1160, y: 460, width: 260, height: 80, type: 'ground' },
            { x: 1500, y: 360, width: 150, height: 20, type: 'wood' },
            { x: 1720, y: 460, width: 330, height: 80, type: 'ground' }
        ],
        hazards: [
            { x: 280, y: 485, width: 280, height: 55, type: 'spikes' },
            { x: 840, y: 485, width: 320, height: 55, type: 'spikes' },
            { x: 1420, y: 485, width: 300, height: 55, type: 'water' }
        ],
        totems: [{ x: 700, y: 375, width: 34, height: 85, activated: false, label: 'Totem do Curupira' }],
        botos: [],
        boitatas: [],
        hasBoss: false,
        items: [
            { id: 'e4_1', x: 710, y: 170, type: 'essence', radius: 12, collected: false },
            { id: 'e4_2', x: 1330, y: 150, type: 'essence', radius: 12, collected: false },
            { id: 'g4_1', x: 1080, y: 200, type: 'guarana', radius: 13, collected: false }
        ]
    },

    // --- FASE 5: O Pântano das Piranhas (CHEFE 1: BOTO TITÃ) ---
    {
        name: "Pântano das Piranhas",
        desc: "⚠️ CHEFE: Derrote o Boto Titã do Pântano para libertar o portal!",
        icon: "🐟",
        width: 2000,
        goalType: 'portal',
        goalX: 1860,
        spawn: { x: 60, y: 380 },
        platforms: [
            { x: 0, y: 460, width: 260, height: 80, type: 'ground' },
            { x: 320, y: 420, width: 90, height: 18, type: 'vitoria-regia', baseY: 420, floatOffset: 0 },
            { x: 480, y: 380, width: 90, height: 18, type: 'vitoria-regia', baseY: 380, floatOffset: 2 },
            { x: 640, y: 460, width: 260, height: 80, type: 'ground' },
            // Arena do Chefe (x: 1000 a 1800)
            { x: 980, y: 460, width: 200, height: 80, type: 'ground' },
            { x: 1240, y: 410, width: 110, height: 18, type: 'vitoria-regia', baseY: 410, floatOffset: 1 },
            { x: 1420, y: 360, width: 110, height: 18, type: 'vitoria-regia', baseY: 360, floatOffset: 2.5 },
            { x: 1580, y: 438, width: 45, height: 22, type: 'mushroom' },
            { x: 1680, y: 460, width: 320, height: 80, type: 'ground' }
        ],
        hazards: [
            { x: 260, y: 480, width: 380, height: 60, type: 'water' },
            { x: 1180, y: 480, width: 500, height: 60, type: 'water' }
        ],
        totems: [{ x: 1040, y: 375, width: 34, height: 85, activated: false, label: 'Totem do Pântano' }],
        botos: [],
        boitatas: [],
        hasBoss: true,
        bossType: 'boto_tita',
        items: [
            { id: 'e5_1', x: 530, y: 330, type: 'essence', radius: 12, collected: false },
            { id: 'e5_2', x: 1740, y: 410, type: 'essence', radius: 12, collected: false }
        ]
    },

    // --- FASE 6: O Desfiladeiro dos Vaga-lumes ---
    {
        name: "Desfiladeiro Vaga-lumes",
        desc: "Penhascos de pedra com plataformas que se movem no abismo!",
        icon: "🌌",
        width: 2100,
        goalType: 'portal',
        goalX: 1960,
        spawn: { x: 60, y: 380 },
        platforms: [
            { x: 0, y: 460, width: 260, height: 80, type: 'stone-ground' },
            { x: 320, y: 410, width: 110, height: 22, type: 'stone-moving', minX: 300, maxX: 480, dir: 1, speed: 1.8 },
            { x: 540, y: 340, width: 120, height: 22, type: 'stone' },
            { x: 720, y: 320, width: 110, height: 22, type: 'stone-moving-y', minY: 200, maxY: 380, dir: 1, speed: 1.6 },
            { x: 900, y: 460, width: 260, height: 80, type: 'stone-ground' },
            { x: 1220, y: 410, width: 110, height: 22, type: 'stone-moving', minX: 1200, maxX: 1380, dir: 1, speed: 2 },
            { x: 1440, y: 330, width: 120, height: 22, type: 'stone' },
            { x: 1620, y: 280, width: 110, height: 22, type: 'stone-moving-y', minY: 180, maxY: 360, dir: 1, speed: 1.7 },
            { x: 1800, y: 460, width: 300, height: 80, type: 'stone-ground' }
        ],
        hazards: [
            { x: 260, y: 480, width: 640, height: 60, type: 'water' },
            { x: 1160, y: 480, width: 640, height: 60, type: 'water' }
        ],
        totems: [{ x: 980, y: 375, width: 34, height: 85, activated: false, label: 'Totem do Desfiladeiro' }],
        botos: [],
        boitatas: [],
        hasBoss: false,
        items: [
            { id: 'e6_1', x: 600, y: 290, type: 'essence', radius: 12, collected: false },
            { id: 'e6_2', x: 1500, y: 270, type: 'essence', radius: 12, collected: false }
        ]
    },

    // --- FASE 7: As Cavernas do Boitatá ---
    {
        name: "Cavernas do Boitatá",
        desc: "A serpente de fogo patrulha as profundezas rochosas!",
        icon: "🔥",
        width: 2100,
        goalType: 'portal',
        goalX: 1980,
        spawn: { x: 60, y: 380 },
        platforms: [
            { x: 0, y: 460, width: 260, height: 80, type: 'stone-ground' },
            { x: 320, y: 420, width: 110, height: 22, type: 'stone-moving', minX: 300, maxX: 480, dir: 1, speed: 2 },
            { x: 540, y: 340, width: 120, height: 22, type: 'stone' },
            { x: 720, y: 460, width: 280, height: 80, type: 'stone-ground' },
            { x: 1060, y: 410, width: 120, height: 22, type: 'stone-moving', minX: 1040, maxX: 1220, dir: 1, speed: 2.2 },
            { x: 1300, y: 330, width: 130, height: 22, type: 'stone' },
            { x: 1500, y: 260, width: 120, height: 22, type: 'stone-moving-y', minY: 180, maxY: 340, dir: 1, speed: 1.8 },
            { x: 1700, y: 460, width: 400, height: 80, type: 'stone-ground' }
        ],
        hazards: [
            { x: 260, y: 480, width: 460, height: 60, type: 'spikes' },
            { x: 1000, y: 480, width: 700, height: 60, type: 'spikes' }
        ],
        totems: [{ x: 800, y: 375, width: 34, height: 85, activated: false, label: 'Totem de Fogo' }],
        botos: [],
        boitatas: [
            { x: 580, y: 300, width: 32, height: 32, minX: 540, maxX: 660, speed: 2, dir: 1, pulseTimer: 0 },
            { x: 1340, y: 290, width: 32, height: 32, minX: 1300, maxX: 1430, speed: 2.2, dir: 1, pulseTimer: 1 }
        ],
        hasBoss: false,
        items: [
            { id: 'e7_1', x: 600, y: 230, type: 'essence', radius: 12, collected: false },
            { id: 'e7_2', x: 1560, y: 200, type: 'essence', radius: 12, collected: false },
            { id: 'g7_1', x: 780, y: 410, type: 'guarana', radius: 13, collected: false }
        ]
    },

    // --- FASE 8: O Templo dos Antigos Pajés ---
    {
        name: "Templo dos Pajés",
        desc: "Ruínas sagradas com runas! Atinja 80% e vire Guerreiro Tribal!",
        icon: "🗿",
        width: 2150,
        goalType: 'portal',
        goalX: 2000,
        spawn: { x: 60, y: 380 },
        platforms: [
            { x: 0, y: 460, width: 260, height: 80, type: 'stone-ground' },
            { x: 300, y: 438, width: 45, height: 22, type: 'mushroom' },
            { x: 380, y: 280, width: 140, height: 22, type: 'stone' },
            { x: 580, y: 220, width: 140, height: 22, type: 'stone' },
            { x: 520, y: 460, width: 260, height: 80, type: 'stone-ground' },
            { x: 840, y: 390, width: 120, height: 22, type: 'stone-moving', minX: 820, maxX: 1000, dir: 1, speed: 1.8 },
            { x: 1080, y: 310, width: 120, height: 22, type: 'stone-moving-y', minY: 200, maxY: 380, dir: 1, speed: 1.5 },
            { x: 1260, y: 460, width: 280, height: 80, type: 'stone-ground' },
            { x: 1600, y: 360, width: 140, height: 22, type: 'stone' },
            { x: 1780, y: 460, width: 370, height: 80, type: 'stone-ground' }
        ],
        hazards: [
            { x: 260, y: 480, width: 260, height: 60, type: 'water' },
            { x: 780, y: 480, width: 480, height: 60, type: 'spikes' },
            { x: 1540, y: 480, width: 240, height: 60, type: 'water' }
        ],
        totems: [{ x: 1340, y: 375, width: 34, height: 85, activated: false, label: 'Totem dos Pajés' }],
        botos: [],
        boitatas: [
            { x: 900, y: 350, width: 32, height: 32, minX: 840, maxX: 980, speed: 2, dir: 1, pulseTimer: 0 }
        ],
        hasBoss: false,
        items: [
            { id: 'e8_1', x: 650, y: 170, type: 'essence', radius: 12, collected: false },
            { id: 'e8_2', x: 1670, y: 300, type: 'essence', radius: 12, collected: false }
        ]
    },

    // --- FASE 9: A Escadaria dos Deuses ---
    {
        name: "Escadaria dos Deuses",
        desc: "A subida íngreme até as nuvens no topo da montanha sagrada!",
        icon: "⛰️",
        width: 2200,
        goalType: 'portal',
        goalX: 2080,
        spawn: { x: 60, y: 380 },
        platforms: [
            { x: 0, y: 460, width: 260, height: 80, type: 'stone-ground' },
            { x: 300, y: 438, width: 45, height: 22, type: 'mushroom' },
            { x: 380, y: 290, width: 130, height: 22, type: 'stone' },
            { x: 560, y: 240, width: 130, height: 22, type: 'stone' },
            { x: 740, y: 190, width: 130, height: 22, type: 'stone' },
            { x: 700, y: 460, width: 260, height: 80, type: 'stone-ground' },
            { x: 1040, y: 410, width: 120, height: 22, type: 'stone-moving', minX: 1020, maxX: 1200, dir: 1, speed: 2 },
            { x: 1260, y: 330, width: 120, height: 22, type: 'stone' },
            { x: 1440, y: 270, width: 120, height: 22, type: 'stone-moving-y', minY: 180, maxY: 340, dir: 1, speed: 1.6 },
            { x: 1640, y: 460, width: 560, height: 80, type: 'temple-altar' }
        ],
        hazards: [
            { x: 260, y: 480, width: 440, height: 60, type: 'spikes' },
            { x: 960, y: 480, width: 680, height: 60, type: 'spikes' }
        ],
        totems: [{ x: 800, y: 375, width: 34, height: 85, activated: false, label: 'Totem da Escadaria' }],
        botos: [],
        boitatas: [],
        hasBoss: false,
        items: [
            { id: 'e9_1', x: 805, y: 140, type: 'essence', radius: 12, collected: false },
            { id: 'e9_2', x: 1320, y: 270, type: 'essence', radius: 12, collected: false },
            { id: 'g9_1', x: 1720, y: 410, type: 'guarana', radius: 13, collected: false }
        ]
    },

    // --- FASE 10: O Santuário Celestial (CHEFE 2: A SOMBRA DA MALDIÇÃO) ---
    {
        name: "Santuário de Tsuyshi",
        desc: "⚠️ CHEFE FINAL: Destrua a Sombra da Maldição para libertar o Altar!",
        icon: "👑",
        width: 2400,
        goalType: 'altar',
        goalX: 2180,
        spawn: { x: 60, y: 380 },
        platforms: [
            { x: 0, y: 460, width: 260, height: 80, type: 'stone-ground' },
            { x: 300, y: 438, width: 45, height: 22, type: 'mushroom' },
            { x: 380, y: 280, width: 130, height: 22, type: 'stone' },
            { x: 560, y: 220, width: 130, height: 22, type: 'stone' },
            { x: 500, y: 460, width: 240, height: 80, type: 'stone-ground' },
            { x: 800, y: 380, width: 120, height: 22, type: 'stone-moving', minX: 780, maxX: 960, dir: 1, speed: 1.8 },
            { x: 1040, y: 300, width: 130, height: 22, type: 'stone-moving-y', minY: 220, maxY: 380, dir: 1, speed: 1.5 },
            { x: 1220, y: 460, width: 260, height: 80, type: 'stone-ground' },
            // Arena do Chefe Final (x: 1400 a 2000)
            { x: 1460, y: 438, width: 45, height: 22, type: 'mushroom' },
            { x: 1540, y: 340, width: 120, height: 22, type: 'stone' },
            { x: 1720, y: 290, width: 120, height: 22, type: 'stone' },
            { x: 1500, y: 460, width: 420, height: 80, type: 'stone-ground' },
            // O Altar Sagrado de Tsuyshi
            { x: 1960, y: 250, width: 440, height: 290, type: 'temple-altar' }
        ],
        hazards: [
            { x: 260, y: 480, width: 240, height: 60, type: 'spikes' },
            { x: 740, y: 480, width: 480, height: 60, type: 'spikes' }
        ],
        totems: [{ x: 1260, y: 375, width: 34, height: 85, activated: false, label: 'Totem Celestial' }],
        botos: [],
        boitatas: [],
        hasBoss: true,
        bossType: 'sombra_maldicao',
        items: [
            { id: 'e10_1', x: 625, y: 170, type: 'essence', radius: 12, collected: false },
            { id: 'e10_2', x: 1600, y: 290, type: 'essence', radius: 12, collected: false },
            { id: 'a10_1', x: 1875, y: 240, type: 'acai', radius: 9, collected: false }
        ]
    }
];

// ==========================================================
// 5. SISTEMA DE CHEFES (BOSSES)
// ==========================================================
function initBoss(type) {
    if (type === 'boto_tita') {
        return {
            type: 'boto_tita',
            name: "BOTO TITÃ DO PÂNTANO",
            x: 1350,
            y: 470,
            baseY: 470,
            width: 76,
            height: 44,
            hp: 3,
            maxHp: 3,
            velX: 2.2,
            velY: 0,
            dir: 1,
            minX: 1180,
            maxX: 1650,
            state: 'SWIMMING', // SWIMMING, LEAPING, VULNERABLE
            timer: 0,
            hitFlashTimer: 0,
            defeated: false
        };
    } else if (type === 'sombra_maldicao') {
        return {
            type: 'sombra_maldicao',
            name: "A SOMBRA DA MALDIÇÃO",
            x: 1650,
            y: 220,
            baseY: 220,
            width: 60,
            height: 60,
            hp: 4,
            maxHp: 4,
            velX: 2.0,
            velY: 0,
            dir: -1,
            minX: 1480,
            maxX: 1860,
            state: 'HOVERING', // HOVERING, SWOOPING, SHOOTING
            timer: 0,
            shootTimer: 0,
            hitFlashTimer: 0,
            defeated: false
        };
    }
    return null;
}

function updateBoss() {
    if (!currentBoss || currentBoss.defeated) return;

    if (currentBoss.hitFlashTimer > 0) {
        currentBoss.hitFlashTimer--;
    }

    if (currentBoss.type === 'boto_tita') {
        // Lógica do Boto Titã
        currentBoss.timer++;

        if (currentBoss.state === 'SWIMMING') {
            currentBoss.x += currentBoss.dir * currentBoss.velX;
            if (currentBoss.x > currentBoss.maxX || currentBoss.x < currentBoss.minX) {
                currentBoss.dir *= -1;
            }

            if (currentBoss.timer > 140) {
                // Iniciar Salto Gigante
                currentBoss.state = 'LEAPING';
                currentBoss.velY = -11.5;
                currentBoss.timer = 0;
                spawnParticles(currentBoss.x + currentBoss.width / 2, currentBoss.baseY, 15, '#3498db', 1.8);
            }
        } else if (currentBoss.state === 'LEAPING') {
            currentBoss.y += currentBoss.velY;
            currentBoss.velY += 0.4;

            // Retorno à água
            if (currentBoss.y >= currentBoss.baseY) {
                currentBoss.y = currentBoss.baseY;
                currentBoss.velY = 0;
                currentBoss.state = 'VULNERABLE';
                currentBoss.timer = 0;
                spawnParticles(currentBoss.x + currentBoss.width / 2, currentBoss.baseY, 20, '#3498db', 2.2);
            }
        } else if (currentBoss.state === 'VULNERABLE') {
            // Fica flutuando na superfície exibindo sua coroa/ponto fraco
            currentBoss.y = currentBoss.baseY - 18 + Math.sin(Date.now() * 0.005) * 4;

            if (currentBoss.timer > 180) {
                currentBoss.state = 'SWIMMING';
                currentBoss.y = currentBoss.baseY;
                currentBoss.timer = 0;
            }
        }

        // Dano no Jogador vs Pisada no Chefe
        checkBossCollisions();

    } else if (currentBoss.type === 'sombra_maldicao') {
        // Lógica da Sombra da Maldição
        currentBoss.timer++;
        currentBoss.shootTimer++;

        // Movimento flutuante em onda
        currentBoss.x += currentBoss.dir * currentBoss.velX;
        currentBoss.y = currentBoss.baseY + Math.sin(Date.now() * 0.004) * 35;

        if (currentBoss.x > currentBoss.maxX || currentBoss.x < currentBoss.minX) {
            currentBoss.dir *= -1;
        }

        // Disparo de Esferas de Fogo Sombrio
        if (currentBoss.shootTimer > 120) {
            currentBoss.shootTimer = 0;
            const shootDir = (player.x < currentBoss.x) ? -1 : 1;
            bossProjectiles.push({
                x: currentBoss.x + currentBoss.width / 2,
                y: currentBoss.y + currentBoss.height / 2,
                vx: shootDir * 3.8,
                vy: (player.y - currentBoss.y) * 0.015,
                radius: 9,
                life: 160
            });
            spawnParticles(currentBoss.x + currentBoss.width / 2, currentBoss.y + currentBoss.height / 2, 8, '#e74c3c', 1.2);
        }

        // Partículas de fumaça das trevas
        if (Math.random() < 0.35) {
            particles.push({
                x: currentBoss.x + Math.random() * currentBoss.width,
                y: currentBoss.y + Math.random() * currentBoss.height,
                vx: (Math.random() - 0.5) * 1.5,
                vy: -Math.random() * 2,
                color: Math.random() < 0.5 ? '#8e44ad' : '#ff4757',
                radius: Math.random() * 3 + 2,
                life: 0.6,
                decay: 0.05
            });
        }

        checkBossCollisions();
    }

    // Atualizar projéteis do chefe
    updateBossProjectiles();
}

function updateBossProjectiles() {
    for (let i = bossProjectiles.length - 1; i >= 0; i--) {
        const p = bossProjectiles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life--;

        // Checar colisão com jogador
        if (player.invulnerableTimer === 0) {
            const dx = (player.x + player.width / 2) - p.x;
            const dy = (player.y + player.height / 2) - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < player.width / 2 + p.radius) {
                playerTakeDamage();
                bossProjectiles.splice(i, 1);
                continue;
            }
        }

        if (p.life <= 0 || p.x < camera.x - 50 || p.x > camera.x + VIEW_WIDTH + 50) {
            bossProjectiles.splice(i, 1);
        }
    }
}

function checkBossCollisions() {
    if (!currentBoss || currentBoss.defeated) return;

    // Verificar se o jogador pisou na cabeça/núcleo do chefe
    const isStomp = (
        player.velY > 0 &&
        player.y + player.height <= currentBoss.y + 26 &&
        player.x + player.width > currentBoss.x + 8 &&
        player.x < currentBoss.x + currentBoss.width - 8
    );

    if (isStomp) {
        // Dano no chefe!
        currentBoss.hp--;
        currentBoss.hitFlashTimer = 18;
        audio.playBossDamage();
        player.velY = -12.5; // Impulso para o alto
        spawnParticles(player.x + player.width / 2, player.y + player.height, 22, '#ffd700', 2);

        // Atualizar barra de HP
        updateBossHUD();

        if (currentBoss.hp <= 0) {
            defeatBoss();
        }
        return;
    }

    // Colisão comum (dano no jogador)
    if (player.invulnerableTimer === 0) {
        if (
            player.x < currentBoss.x + currentBoss.width - 6 &&
            player.x + player.width > currentBoss.x + 6 &&
            player.y < currentBoss.y + currentBoss.height &&
            player.y + player.height > currentBoss.y
        ) {
            playerTakeDamage();
        }
    }
}

function defeatBoss() {
    if (!currentBoss) return;
    currentBoss.defeated = true;
    audio.playBossDefeat();

    // Explosão de partículas de vitória
    for (let i = 0; i < 60; i++) {
        spawnParticles(
            currentBoss.x + Math.random() * currentBoss.width,
            currentBoss.y + Math.random() * currentBoss.height,
            2,
            '#ffd700',
            3
        );
    }

    // Destravar arena
    camera.isLocked = false;
    hideBossHUD();

    score += 500;
    updateHUDScore();
}

function showBossHUD(name, hp, maxHp) {
    const hud = document.getElementById('boss-hud');
    const nameEl = document.getElementById('boss-name');
    nameEl.innerText = name;
    updateBossHUD();
    hud.classList.remove('hidden');
}

function updateBossHUD() {
    if (!currentBoss) return;
    const fillEl = document.getElementById('boss-hp-bar-fill');
    const pct = Math.max(0, Math.min(100, (currentBoss.hp / currentBoss.maxHp) * 100));
    fillEl.style.width = `${pct}%`;
}

function hideBossHUD() {
    document.getElementById('boss-hud').classList.add('hidden');
}

// ==========================================================
// 6. CARREGAMENTO E TRANSIÇÃO DE FASES
// ==========================================================
function loadStage(index, preserveStats = true) {
    currentStage = Math.max(0, Math.min(index, TOTAL_STAGES - 1));
    const stageData = STAGES_DATA[currentStage];

    levelWidth = stageData.width;
    stageGoal = {
        x: stageData.goalX,
        y: 360,
        width: 60,
        height: 100,
        type: stageData.goalType
    };

    player.x = stageData.spawn.x;
    player.y = stageData.spawn.y;
    player.velX = 0;
    player.velY = 0;
    player.checkpoint = { ...stageData.spawn };
    player.grounded = false;

    if (!preserveStats) {
        score = 0;
        player.lives = player.maxLives;
        campaignStartTime = Date.now();
    }

    platforms = JSON.parse(JSON.stringify(stageData.platforms));
    hazards = JSON.parse(JSON.stringify(stageData.hazards));
    totems = JSON.parse(JSON.stringify(stageData.totems));
    botos = JSON.parse(JSON.stringify(stageData.botos));
    boitatas = JSON.parse(JSON.stringify(stageData.boitatas));

    items = JSON.parse(JSON.stringify(stageData.items)).map(item => {
        if (collectedEssenceIds.has(item.id)) {
            item.collected = true;
        }
        return item;
    });

    // Reset de Câmera e Arena
    camera.x = 0;
    camera.targetX = 0;
    camera.isLocked = false;
    bossProjectiles = [];

    // Chefe da Fase
    if (stageData.hasBoss) {
        currentBoss = initBoss(stageData.bossType);
        hideBossHUD(); // Só mostra ao entrar na arena
    } else {
        currentBoss = null;
        hideBossHUD();
    }

    updateHUDAll();
    initFireflies();
}

function advanceToNextStage() {
    if (currentStage < TOTAL_STAGES - 1) {
        maxUnlockedStage = Math.max(maxUnlockedStage, currentStage + 1);
        saveProgress();
        loadStage(currentStage + 1, true);
        document.getElementById('stage-clear-screen').classList.add('hidden');
        currentState = GAME_STATE.PLAYING;
    }
}

function openStageSelectModal() {
    audio.playClick();
    const grid = document.getElementById('stages-grid');
    grid.innerHTML = '';

    STAGES_DATA.forEach((stage, idx) => {
        const isUnlocked = idx <= maxUnlockedStage;
        const card = document.createElement('div');
        card.className = `stage-card-btn ${isUnlocked ? '' : 'locked'}`;

        let collectedCount = 0;
        stage.items.forEach(it => {
            if (it.type === 'essence' && collectedEssenceIds.has(it.id)) {
                collectedCount++;
            }
        });

        card.innerHTML = `
            <div class="stage-card-icon">${isUnlocked ? stage.icon : '🔒'}</div>
            <div class="stage-card-info">
                <span class="stage-card-num">FASE ${idx + 1} ${stage.hasBoss ? '👑 CHEFE' : ''}</span>
                <span class="stage-card-name">${stage.name}</span>
                <span class="stage-card-status">${isUnlocked ? `${collectedCount}/2 ✨ Essências` : 'Bloqueada'}</span>
            </div>
        `;

        if (isUnlocked) {
            card.addEventListener('click', () => {
                audio.playClick();
                document.getElementById('modal-select-stage').classList.add('hidden');
                document.getElementById('main-menu').classList.add('hidden');
                document.getElementById('pause-menu').classList.add('hidden');
                document.getElementById('stage-clear-screen').classList.add('hidden');
                document.getElementById('game-over-screen').classList.add('hidden');
                document.getElementById('incomplete-humanity-screen').classList.add('hidden');

                loadStage(idx, true);
                currentState = GAME_STATE.PLAYING;
            });
        }

        grid.appendChild(card);
    });

    document.getElementById('modal-select-stage').classList.remove('hidden');
}

function getHumanityFormName(h) {
    if (h < 26) return "Esqueleto Amaldiçoado";
    if (h < 51) return "Músculo & Folhas Vivas";
    if (h < 76) return "Guerreiro em Metamorfose";
    return "Guerreiro Humano Restaurado";
}

function initFireflies() {
    fireflies = [];
    for (let i = 0; i < 35; i++) {
        fireflies.push({
            x: Math.random() * levelWidth,
            y: 80 + Math.random() * 340,
            radius: 1.5 + Math.random() * 2,
            glow: Math.random() * Math.PI * 2,
            glowSpeed: 0.04 + Math.random() * 0.05,
            vx: (Math.random() - 0.5) * 0.6,
            vy: (Math.random() - 0.5) * 0.4
        });
    }
}

// ==========================================================
// 7. SISTEMA DE PARTÍCULAS
// ==========================================================
function spawnParticles(x, y, count, color, speedMultiplier = 1) {
    for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = (Math.random() * 3 + 1) * speedMultiplier;
        particles.push({
            x: x,
            y: y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 1.5,
            color: color,
            radius: Math.random() * 3 + 2,
            life: 1.0,
            decay: 0.02 + Math.random() * 0.03
        });
    }
}

function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.12;
        p.life -= p.decay;

        if (p.life <= 0) {
            particles.splice(i, 1);
        }
    }

    fireflies.forEach(f => {
        f.x += f.vx;
        f.y += f.vy;
        f.glow += f.glowSpeed;

        if (f.y < 80) f.vy = Math.abs(f.vy);
        if (f.y > 450) f.vy = -Math.abs(f.vy);
    });
}

// ==========================================================
// 8. ATUALIZAÇÃO DA LÓGICA (UPDATE)
// ==========================================================
function update() {
    if (currentState !== GAME_STATE.PLAYING) return;

    elapsedPlayTime = Math.floor((Date.now() - campaignStartTime) / 1000);

    if (player.guaranaTimer > 0) {
        player.guaranaTimer--;
        player.speed = player.baseSpeed * 1.55;
        player.jumpForce = player.baseJump * 1.18;

        const secondsLeft = Math.ceil(player.guaranaTimer / 60);
        document.getElementById('buff-timer').innerText = `${secondsLeft}s`;

        if (Math.random() < 0.4) {
            particles.push({
                x: player.x + (player.facing > 0 ? 4 : player.width - 4),
                y: player.y + player.height - 10 + Math.random() * 8,
                vx: -player.facing * (Math.random() * 2 + 1),
                vy: (Math.random() - 0.5) * 2,
                color: '#ffd700',
                radius: Math.random() * 2.5 + 1.5,
                life: 0.8,
                decay: 0.04
            });
        }

        if (player.guaranaTimer === 0) {
            document.getElementById('buff-indicator').classList.add('hidden');
            player.speed = player.baseSpeed;
            player.jumpForce = player.baseJump;
        }
    }

    if (player.invulnerableTimer > 0) {
        player.invulnerableTimer--;
    }

    if (keys.right) {
        player.velX = player.speed;
        player.facing = 1;
        player.walkFrame += 0.25;
    } else if (keys.left) {
        player.velX = -player.speed;
        player.facing = -1;
        player.walkFrame += 0.25;
    } else {
        player.velX = 0;
        player.walkFrame = 0;
    }

    if (keys.jump && player.grounded) {
        player.velY = player.jumpForce;
        player.grounded = false;
        audio.playJump();
        spawnParticles(player.x + player.width / 2, player.y + player.height, 6, '#4ade80', 0.8);
    }

    player.velY += GRAVITY;

    // Atualização de Plataformas
    platforms.forEach(plat => {
        if (plat.type === 'vitoria-regia') {
            plat.floatOffset += 0.04;
            plat.y = plat.baseY + Math.sin(plat.floatOffset) * 5;
        } else if (plat.type === 'stone-moving') {
            plat.x += plat.dir * plat.speed;
            if (plat.x > plat.maxX || plat.x < plat.minX) {
                plat.dir *= -1;
            }
        } else if (plat.type === 'stone-moving-y') {
            plat.y += plat.dir * plat.speed;
            if (plat.y > plat.maxY || plat.y < plat.minY) {
                plat.dir *= -1;
            }
        }
    });

    player.x += player.velX;

    // Se a arena estiver travada, limitar jogador na arena
    if (camera.isLocked) {
        if (player.x < camera.lockX) player.x = camera.lockX;
        if (player.x + player.width > camera.lockX + VIEW_WIDTH) player.x = camera.lockX + VIEW_WIDTH - player.width;
    } else {
        if (player.x < 0) player.x = 0;
        if (player.x + player.width > levelWidth) player.x = levelWidth - player.width;
    }

    player.y += player.velY;
    player.grounded = false;

    // Colisão AABB com Plataformas
    for (let plat of platforms) {
        if (
            player.x < plat.x + plat.width &&
            player.x + player.width > plat.x &&
            player.y + player.height >= plat.y &&
            player.y + player.height <= plat.y + plat.height + Math.max(player.velY, 8) &&
            player.velY >= 0
        ) {
            if (plat.type === 'mushroom') {
                player.velY = -15.5;
                audio.playBounce();
                spawnParticles(plat.x + plat.width / 2, plat.y, 14, '#2ecc71', 1.6);
            } else {
                player.grounded = true;
                player.velY = 0;
                player.y = plat.y - player.height;

                if (plat.type === 'stone-moving') {
                    player.x += plat.dir * plat.speed;
                }
            }
        }
    }

    // Coleta de Itens & Essências
    items.forEach(item => {
        if (!item.collected) {
            const centerX = player.x + player.width / 2;
            const centerY = player.y + player.height / 2;
            const dx = centerX - item.x;
            const dy = centerY - item.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < player.width / 2 + item.radius) {
                item.collected = true;

                if (item.type === 'essence') {
                    collectedEssenceIds.add(item.id);
                    humanity = Math.min(100, collectedEssenceIds.size * 5);
                    score += 50;
                    audio.playEssence();
                    spawnParticles(item.x, item.y, 25, '#00cec9', 2);
                    updateHUDHumanity();
                    saveProgress();
                } else if (item.type === 'acai') {
                    score += 10;
                    audio.playCollect();
                    spawnParticles(item.x, item.y, 10, '#9b59b6', 1.2);
                } else if (item.type === 'guarana') {
                    score += 50;
                    player.guaranaTimer = 60 * 9;
                    document.getElementById('buff-indicator').classList.remove('hidden');
                    audio.playPowerup();
                    spawnParticles(item.x, item.y, 25, '#ffd700', 2);
                } else if (item.type === 'heart') {
                    if (player.lives < player.maxLives) {
                        player.lives++;
                        updateHUDHearts();
                    }
                    score += 25;
                    audio.playCollect();
                    spawnParticles(item.x, item.y, 15, '#e74c3c', 1.5);
                }

                updateHUDScore();
            }
        }
    });

    // Checkpoints
    totems.forEach(totem => {
        if (!totem.activated) {
            if (
                player.x < totem.x + totem.width + 20 &&
                player.x + player.width > totem.x - 20 &&
                player.y < totem.y + totem.height &&
                player.y + player.height > totem.y
            ) {
                totem.activated = true;
                player.checkpoint = { x: totem.x, y: totem.y + totem.height - player.height };
                audio.playCheckpoint();
                spawnParticles(totem.x + totem.width / 2, totem.y + 20, 30, '#55ff55', 2);
            }
        }
    });

    // Botos comuns
    botos.forEach(boto => {
        boto.jumpTimer++;
        if (boto.jumpTimer >= boto.jumpInterval) {
            boto.isJumping = true;
            boto.velY = -9.5;
            boto.jumpTimer = 0;
            spawnParticles(boto.x + boto.width / 2, boto.baseY, 8, '#3498db', 1);
        }

        if (boto.isJumping) {
            boto.y += boto.velY;
            boto.velY += 0.35;

            if (player.invulnerableTimer === 0) {
                if (
                    player.x < boto.x + boto.width &&
                    player.x + player.width > boto.x &&
                    player.y < boto.y + boto.height &&
                    player.y + player.height > boto.y
                ) {
                    playerTakeDamage();
                }
            }

            if (boto.y >= boto.baseY) {
                boto.y = boto.baseY;
                boto.isJumping = false;
                spawnParticles(boto.x + boto.width / 2, boto.baseY, 8, '#3498db', 1);
            }
        }
    });

    // Boitatás
    boitatas.forEach(boi => {
        boi.x += boi.dir * boi.speed;
        if (boi.x > boi.maxX || boi.x < boi.minX) {
            boi.dir *= -1;
        }
        boi.pulseTimer += 0.08;

        if (Math.random() < 0.3) {
            particles.push({
                x: boi.x + boi.width / 2,
                y: boi.y + boi.height / 2,
                vx: (Math.random() - 0.5) * 1.5,
                vy: -Math.random() * 2,
                color: Math.random() < 0.5 ? '#e67e22' : '#f1c40f',
                radius: Math.random() * 3 + 2,
                life: 0.6,
                decay: 0.05
            });
        }

        if (player.invulnerableTimer === 0) {
            if (
                player.x < boi.x + boi.width &&
                player.x + player.width > boi.x &&
                player.y < boi.y + boi.height &&
                player.y + player.height > boi.y
            ) {
                playerTakeDamage();
            }
        }
    });

    // Perigos (Água / Espinhos)
    for (let haz of hazards) {
        if (
            player.x < haz.x + haz.width &&
            player.x + player.width > haz.x &&
            player.y + player.height >= haz.y + 10
        ) {
            spawnParticles(player.x + player.width / 2, player.y + player.height, 20, '#3498db', 2);
            playerTakeDamage(true);
            break;
        }
    }

    if (player.y > VIEW_HEIGHT + 60) {
        playerTakeDamage(true);
    }

    // ==========================================================
    // ATIVAÇÃO E CONTROLE DOS CHEFES (FASES 5 E 10)
    // ==========================================================
    if (currentBoss && !currentBoss.defeated) {
        // Checar entrada na arena
        if (currentStage === 4 && player.x > 1050 && !camera.isLocked) {
            // Fase 5: Trava de arena do Boto Titã
            camera.isLocked = true;
            camera.lockX = 1000;
            showBossHUD(currentBoss.name, currentBoss.hp, currentBoss.maxHp);
        } else if (currentStage === 9 && player.x > 1420 && !camera.isLocked) {
            // Fase 10: Trava de arena da Sombra da Maldição
            camera.isLocked = true;
            camera.lockX = 1380;
            showBossHUD(currentBoss.name, currentBoss.hp, currentBoss.maxHp);
        }

        updateBoss();
    }

    // ==========================================================
    // FINAL DA FASE (PORTAL OU ALTAR)
    // ==========================================================
    if (currentStage < TOTAL_STAGES - 1) {
        // Só permite avançar se o chefe estiver derrotado (se a fase tiver chefe)
        const canAdvance = !currentBoss || currentBoss.defeated;
        if (
            canAdvance &&
            player.x < stageGoal.x + stageGoal.width &&
            player.x + player.width > stageGoal.x &&
            player.y < stageGoal.y + stageGoal.height &&
            player.y + player.height > stageGoal.y
        ) {
            triggerStageClear();
        }
    } else {
        // FASE 10: O Altar Sagrado de Tsuyshi
        // Só permite alcançar a Princesa após derrotar a Sombra
        if (
            (!currentBoss || currentBoss.defeated) &&
            player.x < princess.x + princess.width &&
            player.x + player.width > princess.x &&
            player.y < princess.y + princess.height &&
            player.y + player.height > princess.y
        ) {
            if (humanity >= 100) {
                triggerVictory();
            } else {
                triggerIncompleteHumanity();
            }
        }
    }

    // Câmera
    if (camera.isLocked) {
        camera.targetX = camera.lockX;
    } else {
        camera.targetX = player.x - VIEW_WIDTH * 0.35;
        camera.targetX = Math.max(0, Math.min(camera.targetX, levelWidth - VIEW_WIDTH));
    }
    camera.x += (camera.targetX - camera.x) * 0.12;

    updateHUDProgress();
    updateParticles();
}

// ==========================================================
// 9. TELAS ESPECIAIS & EVENTOS
// ==========================================================
function triggerStageClear() {
    currentState = GAME_STATE.STAGE_CLEAR;
    audio.playStageClear();

    maxUnlockedStage = Math.max(maxUnlockedStage, currentStage + 1);
    saveProgress();

    const titleEl = document.getElementById('stage-clear-title');
    const descEl = document.getElementById('stage-clear-desc');
    const humEl = document.getElementById('stage-clear-humanity');
    const scoreEl = document.getElementById('stage-clear-score');
    const formEl = document.getElementById('stage-clear-form');

    titleEl.innerText = `FASE ${currentStage + 1} CONCLUÍDA!`;
    descEl.innerText = STAGES_DATA[currentStage].desc;
    humEl.innerText = `${humanity}%`;
    scoreEl.innerText = score;
    formEl.innerText = getHumanityFormName(humanity);

    spawnParticles(VIEW_WIDTH / 2, VIEW_HEIGHT / 2, 40, '#00cec9', 3);
    document.getElementById('stage-clear-screen').classList.remove('hidden');
}

function triggerIncompleteHumanity() {
    currentState = GAME_STATE.INCOMPLETE_HUMANITY;
    audio.playWarning();

    document.getElementById('warn-humanity-pct').innerText = `${humanity}%`;
    document.getElementById('warn-bar-fill').style.width = `${humanity}%`;

    player.x = princess.x - 120;
    player.velX = 0;

    document.getElementById('incomplete-humanity-screen').classList.remove('hidden');
}

function triggerVictory() {
    currentState = GAME_STATE.VICTORY;
    audio.playVictory();
    saveProgress();

    document.getElementById('vic-score').innerText = score;
    const minutes = String(Math.floor(elapsedPlayTime / 60)).padStart(2, '0');
    const seconds = String(elapsedPlayTime % 60).padStart(2, '0');
    document.getElementById('vic-time').innerText = `${minutes}:${seconds}`;

    for (let i = 0; i < 60; i++) {
        spawnParticles(princess.x + Math.random() * 60, princess.y - 40 + Math.random() * 80, 2, '#ffd700', 3);
    }

    document.getElementById('victory-screen').classList.remove('hidden');
}

function playerTakeDamage(respawnAtCheckpoint = false) {
    player.lives--;
    audio.playHit();
    updateHUDHearts();

    if (player.lives <= 0) {
        triggerGameOver();
        return;
    }

    if (respawnAtCheckpoint) {
        player.x = player.checkpoint.x;
        player.y = player.checkpoint.y;
        player.velX = 0;
        player.velY = 0;
    }

    player.invulnerableTimer = 80;
    spawnParticles(player.x + player.width / 2, player.y + player.height / 2, 16, '#e74c3c', 1.8);
}

function triggerGameOver() {
    currentState = GAME_STATE.GAME_OVER;
    camera.isLocked = false;
    hideBossHUD();

    document.getElementById('go-stage').innerText = `${currentStage + 1}/${TOTAL_STAGES}`;
    document.getElementById('go-humanity').innerText = `${humanity}%`;
    document.getElementById('go-score').innerText = score;
    document.getElementById('game-over-screen').classList.remove('hidden');
}

// ==========================================================
// 10. ATUALIZAÇÕES DO HUD
// ==========================================================
function updateHUDAll() {
    document.getElementById('hud-stage').innerText = `${currentStage + 1}/${TOTAL_STAGES}`;
    document.getElementById('hud-goal-icon').innerText = (currentStage === TOTAL_STAGES - 1) ? '👑' : '🌀';
    updateHUDHearts();
    updateHUDScore();
    updateHUDHumanity();
    updateHUDProgress();
}

function updateHUDHearts() {
    const hearts = document.querySelectorAll('#lives-display .heart');
    hearts.forEach((heartEl, idx) => {
        if (idx < player.lives) {
            heartEl.classList.remove('lost');
        } else {
            heartEl.classList.add('lost');
        }
    });
}

function updateHUDScore() {
    document.getElementById('hud-score').innerText = score;
}

function updateHUDHumanity() {
    const fillEl = document.getElementById('humanity-bar-fill');
    const textEl = document.getElementById('humanity-text');
    const iconEl = document.getElementById('humanity-icon');

    if (fillEl && textEl && iconEl) {
        fillEl.style.width = `${humanity}%`;
        textEl.innerText = `${humanity}%`;

        if (humanity < 26) {
            iconEl.innerText = '💀';
        } else if (humanity < 51) {
            iconEl.innerText = '🌿';
        } else if (humanity < 76) {
            iconEl.innerText = '🧬';
        } else {
            iconEl.innerText = '🧑';
        }
    }
}

function updateHUDProgress() {
    const goalX = (currentStage === TOTAL_STAGES - 1) ? princess.x : stageGoal.x;
    const progressRatio = Math.max(0, Math.min(1, player.x / goalX));
    const fillEl = document.getElementById('progress-bar-fill');
    const pinEl = document.getElementById('progress-pin');

    if (fillEl && pinEl) {
        fillEl.style.width = `${progressRatio * 100}%`;
        pinEl.style.left = `${progressRatio * 100}%`;
    }
}

// ==========================================================
// 11. RENDERIZAÇÃO GRÁFICA (CANVAS DRAW)
// ==========================================================
function draw() {
    ctx.clearRect(0, 0, VIEW_WIDTH, VIEW_HEIGHT);

    drawParallaxBackground();

    ctx.save();
    ctx.translate(-Math.floor(camera.x), 0);

    drawFireflies();
    drawPlatforms();
    drawHazards();
    drawTotems();
    drawStageGoal();
    drawItems();
    drawEnemies();
    drawBoss();
    drawPlayer();
    drawParticles();

    ctx.restore();
}

function drawParallaxBackground() {
    const skyGrad = ctx.createLinearGradient(0, 0, 0, VIEW_HEIGHT);

    if (currentStage <= 2) {
        skyGrad.addColorStop(0, '#06170d');
        skyGrad.addColorStop(0.5, '#0b2616');
        skyGrad.addColorStop(1, '#020b05');
    } else if (currentStage <= 5) {
        skyGrad.addColorStop(0, '#051b11');
        skyGrad.addColorStop(0.5, '#0e3a24');
        skyGrad.addColorStop(1, '#021008');
    } else if (currentStage <= 7) {
        skyGrad.addColorStop(0, '#1a0b06');
        skyGrad.addColorStop(0.5, '#2e150d');
        skyGrad.addColorStop(1, '#0c0503');
    } else {
        skyGrad.addColorStop(0, '#0a1a1f');
        skyGrad.addColorStop(0.5, '#122c34');
        skyGrad.addColorStop(1, '#051014');
    }
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, VIEW_WIDTH, VIEW_HEIGHT);

    // Lua Cheia Mística
    ctx.fillStyle = '#fffae6';
    ctx.beginPath();
    ctx.arc(VIEW_WIDTH - 120, 85, 36, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(255, 250, 230, 0.08)';
    ctx.beginPath();
    ctx.arc(VIEW_WIDTH - 120, 85, 60, 0, Math.PI * 2);
    ctx.fill();

    // Copas Distantes
    ctx.fillStyle = (currentStage >= 6 && currentStage <= 7) ? '#1f0d07' : '#061a0f';
    const offsetFar = (camera.x * 0.15) % 300;
    for (let x = -offsetFar - 300; x < VIEW_WIDTH + 300; x += 220) {
        ctx.beginPath();
        ctx.arc(x + 100, 360, 150, Math.PI, 0);
        ctx.fill();
    }

    // Camada Média
    ctx.fillStyle = (currentStage >= 6 && currentStage <= 7) ? '#2e1309' : '#0a2e1a';
    const offsetMid = (camera.x * 0.35) % 400;
    for (let x = -offsetMid - 400; x < VIEW_WIDTH + 400; x += 180) {
        ctx.fillRect(x + 50, 180, 28, 360);
        ctx.beginPath();
        ctx.arc(x + 64, 180, 50, 0, Math.PI * 2);
        ctx.fill();
    }
}

function drawFireflies() {
    fireflies.forEach(f => {
        const opacity = (Math.sin(f.glow) + 1) / 2 * 0.8 + 0.2;
        ctx.fillStyle = (currentStage >= 6 && currentStage <= 7) ? `rgba(255, 140, 50, ${opacity})` : `rgba(180, 255, 100, ${opacity})`;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2);
        ctx.fill();
    });
}

function drawPlatforms() {
    platforms.forEach(plat => {
        if (plat.type === 'ground' || plat.type === 'stone-ground') {
            ctx.fillStyle = plat.type === 'ground' ? '#2c1a0e' : '#1f2421';
            ctx.fillRect(plat.x, plat.y, plat.width, plat.height);

            ctx.fillStyle = plat.type === 'ground' ? '#27ae60' : '#2ecc71';
            ctx.fillRect(plat.x, plat.y, plat.width, 12);

            ctx.fillStyle = 'rgba(0,0,0,0.25)';
            for (let i = 15; i < plat.width - 15; i += 35) {
                ctx.fillRect(plat.x + i, plat.y + 12, 6, 18);
            }
        } else if (plat.type === 'vitoria-regia') {
            const cx = plat.x + plat.width / 2;
            const cy = plat.y + plat.height / 2;

            ctx.fillStyle = '#145a32';
            ctx.beginPath();
            ctx.ellipse(cx, cy, plat.width / 2, plat.height, 0, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#229954';
            ctx.beginPath();
            ctx.ellipse(cx, cy - 2, plat.width / 2 - 4, plat.height - 4, 0, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#f78fb3';
            ctx.beginPath();
            ctx.arc(plat.x + 18, plat.y - 2, 6, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(plat.x + 18, plat.y - 2, 3, 0, Math.PI * 2);
            ctx.fill();
        } else if (plat.type === 'wood') {
            ctx.fillStyle = '#4a2311';
            ctx.fillRect(plat.x, plat.y, plat.width, plat.height);
            ctx.fillStyle = '#27ae60';
            ctx.fillRect(plat.x, plat.y, plat.width, 5);
        } else if (plat.type.startsWith('stone')) {
            ctx.fillStyle = '#34495e';
            ctx.fillRect(plat.x, plat.y, plat.width, plat.height);
            ctx.fillStyle = '#1abc9c';
            ctx.fillRect(plat.x + 10, plat.y + 7, plat.width - 20, 4);
        } else if (plat.type.startsWith('temple')) {
            ctx.fillStyle = '#2c3e50';
            ctx.fillRect(plat.x, plat.y, plat.width, plat.height);
            ctx.fillStyle = '#f1c40f';
            ctx.fillRect(plat.x, plat.y, plat.width, 8);
            ctx.fillStyle = '#e67e22';
            for (let k = 10; k < plat.width - 10; k += 25) {
                ctx.fillRect(plat.x + k, plat.y + 14, 12, 6);
            }
        } else if (plat.type === 'mushroom') {
            ctx.fillStyle = '#ecf0f1';
            ctx.fillRect(plat.x + 16, plat.y + 6, 13, 16);

            ctx.fillStyle = '#2ecc71';
            ctx.beginPath();
            ctx.ellipse(plat.x + plat.width / 2, plat.y + 6, plat.width / 2, 10, 0, Math.PI, 0);
            ctx.fill();

            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(plat.x + 14, plat.y + 4, 3, 0, Math.PI * 2);
            ctx.arc(plat.x + 30, plat.y + 3, 3, 0, Math.PI * 2);
            ctx.fill();
        }
    });
}

function drawHazards() {
    hazards.forEach(haz => {
        if (haz.type === 'water') {
            const waveOffset = (Date.now() * 0.003) % (Math.PI * 2);
            const waterGrad = ctx.createLinearGradient(0, haz.y, 0, haz.y + haz.height);
            waterGrad.addColorStop(0, '#0b3954');
            waterGrad.addColorStop(1, '#041520');
            ctx.fillStyle = waterGrad;
            ctx.fillRect(haz.x, haz.y, haz.width, haz.height);

            ctx.fillStyle = 'rgba(100, 200, 255, 0.4)';
            for (let i = 0; i < haz.width; i += 24) {
                const waveH = Math.sin(waveOffset + i * 0.1) * 3;
                ctx.fillRect(haz.x + i, haz.y + waveH, 18, 4);
            }
        } else if (haz.type === 'spikes') {
            ctx.fillStyle = '#78281f';
            for (let i = 0; i < haz.width; i += 12) {
                ctx.beginPath();
                ctx.moveTo(haz.x + i, haz.y + haz.height);
                ctx.lineTo(haz.x + i + 6, haz.y);
                ctx.lineTo(haz.x + i + 12, haz.y + haz.height);
                ctx.fill();
            }
        }
    });
}

function drawTotems() {
    totems.forEach(totem => {
        ctx.fillStyle = '#3d2314';
        ctx.fillRect(totem.x, totem.y, totem.width, totem.height);

        ctx.fillStyle = totem.activated ? '#2ecc71' : '#7f8c8d';
        ctx.fillRect(totem.x + 6, totem.y + 15, 6, 6);
        ctx.fillRect(totem.x + 22, totem.y + 15, 6, 6);
        ctx.fillRect(totem.x + 6, totem.y + 45, 6, 6);
        ctx.fillRect(totem.x + 22, totem.y + 45, 6, 6);

        ctx.fillRect(totem.x + 10, totem.y + 28, 14, 5);
        ctx.fillRect(totem.x + 10, totem.y + 58, 14, 5);

        if (totem.activated) {
            ctx.fillStyle = 'rgba(46, 204, 113, 0.15)';
            ctx.beginPath();
            ctx.arc(totem.x + totem.width / 2, totem.y + 30, 45, 0, Math.PI * 2);
            ctx.fill();
        }
    });
}

function drawStageGoal() {
    if (currentStage < TOTAL_STAGES - 1) {
        // Se houver chefe vivo na fase, o portal fica inativo / cinza
        const isBossActive = currentBoss && !currentBoss.defeated;

        const time = Date.now() * 0.004;
        const cx = stageGoal.x + stageGoal.width / 2;
        const cy = stageGoal.y + stageGoal.height / 2;

        ctx.strokeStyle = isBossActive ? '#7f8c8d' : '#00cec9';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.ellipse(cx, cy, 32, 50, Math.sin(time) * 0.2, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = isBossActive ? 'rgba(120, 120, 120, 0.2)' : 'rgba(0, 206, 201, 0.35)';
        ctx.beginPath();
        ctx.ellipse(cx, cy, 24, 42, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = isBossActive ? '#555555' : '#27ae60';
        ctx.fillRect(stageGoal.x - 6, stageGoal.y - 10, 10, stageGoal.height + 20);
        ctx.fillRect(stageGoal.x + stageGoal.width - 4, stageGoal.y - 10, 10, stageGoal.height + 20);
        ctx.fillRect(stageGoal.x - 6, stageGoal.y - 10, stageGoal.width + 12, 10);
    } else {
        drawPrincess();
    }
}

function drawPrincess() {
    princess.glowTimer += 0.05;
    const glowScale = Math.sin(princess.glowTimer) * 6;

    // Se o chefe da Fase 10 ainda estiver vivo, Altar trancado
    const isBossDefeated = !currentBoss || currentBoss.defeated;

    if (!isBossDefeated || humanity < 100) {
        ctx.fillStyle = 'rgba(231, 76, 60, 0.25)';
        ctx.strokeStyle = '#e74c3c';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(princess.x + princess.width / 2, princess.y + 25, 55 + glowScale, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#ff7675';
        ctx.font = '16px monospace';
        ctx.fillText(!isBossDefeated ? '⚔️ DERROTE O CHEFE' : '🔒 100%', princess.x - 30, princess.y - 45);
    } else {
        ctx.fillStyle = 'rgba(255, 215, 0, 0.3)';
        ctx.strokeStyle = '#f1c40f';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(princess.x + princess.width / 2, princess.y + 25, 55 + glowScale, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#ffd700';
        ctx.font = '16px monospace';
        ctx.fillText('✨ RITUAL!', princess.x - 18, princess.y - 45);
    }

    ctx.fillStyle = '#e84393';
    ctx.beginPath();
    ctx.moveTo(princess.x + princess.width / 2, princess.y + 15);
    ctx.lineTo(princess.x + princess.width + 5, princess.y + princess.height);
    ctx.lineTo(princess.x - 5, princess.y + princess.height);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#f1c40f';
    ctx.fillRect(princess.x, princess.y + 36, princess.width, 5);

    ctx.fillStyle = '#e0a96d';
    ctx.beginPath();
    ctx.arc(princess.x + princess.width / 2, princess.y + 14, 11, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#1e272e';
    ctx.fillRect(princess.x + 6, princess.y + 5, 26, 12);

    ctx.fillStyle = '#ffd700';
    ctx.beginPath();
    ctx.moveTo(princess.x + 4, princess.y + 6);
    ctx.lineTo(princess.x + 10, princess.y - 6);
    ctx.lineTo(princess.x + 19, princess.y + 2);
    ctx.lineTo(princess.x + 28, princess.y - 6);
    ctx.lineTo(princess.x + 34, princess.y + 6);
    ctx.fill();

    ctx.fillStyle = '#000000';
    ctx.fillRect(princess.x + 14, princess.y + 13, 2, 2);
    ctx.fillRect(princess.x + 22, princess.y + 13, 2, 2);
}

// ==========================================================
// RENDERIZAÇÃO DOS CHEFES (BOSS DRAW)
// ==========================================================
function drawBoss() {
    if (!currentBoss || currentBoss.defeated) return;

    ctx.save();
    ctx.translate(currentBoss.x + currentBoss.width / 2, currentBoss.y + currentBoss.height / 2);

    // Piscar branco quando atingido
    const isFlashing = currentBoss.hitFlashTimer > 0 && Math.floor(currentBoss.hitFlashTimer / 3) % 2 === 0;

    if (currentBoss.type === 'boto_tita') {
        // --- DESENHO DO BOTO TITÃ ---
        if (currentBoss.dir === -1) {
            ctx.scale(-1, 1);
        }

        // Aura Titã
        ctx.fillStyle = 'rgba(52, 152, 219, 0.25)';
        ctx.beginPath();
        ctx.ellipse(0, 0, currentBoss.width / 1.6, currentBoss.height / 1.5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Corpo
        ctx.fillStyle = isFlashing ? '#ffffff' : '#ff7597';
        ctx.beginPath();
        ctx.ellipse(0, 0, currentBoss.width / 2, currentBoss.height / 2, 0, 0, Math.PI * 2);
        ctx.fill();

        // Ventre mais claro
        ctx.fillStyle = isFlashing ? '#ffffff' : '#ffafcc';
        ctx.beginPath();
        ctx.ellipse(2, 6, currentBoss.width / 2.5, currentBoss.height / 3.5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Focinho forte
        ctx.fillStyle = isFlashing ? '#ffffff' : '#ff7597';
        ctx.fillRect(currentBoss.width / 2 - 8, -6, 20, 12);

        // Nadadeira dorsal
        ctx.beginPath();
        ctx.moveTo(-10, -currentBoss.height / 2);
        ctx.lineTo(4, -currentBoss.height / 2 - 14);
        ctx.lineTo(14, -currentBoss.height / 2);
        ctx.fill();

        // Cauda
        ctx.beginPath();
        ctx.moveTo(-currentBoss.width / 2, 0);
        ctx.lineTo(-currentBoss.width / 2 - 16, -14);
        ctx.lineTo(-currentBoss.width / 2 - 16, 14);
        ctx.fill();

        // PONTO FRACO (Coroa de Coral Sagrada na cabeça do Boto)
        ctx.fillStyle = '#ffd700';
        ctx.beginPath();
        ctx.arc(8, -currentBoss.height / 2 + 2, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#e74c3c';
        ctx.fillRect(5, -currentBoss.height / 2 - 4, 6, 6);

        // Olho bravo
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(16, -6, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ff4757';
        ctx.fillRect(17, -8, 2, 2);

    } else if (currentBoss.type === 'sombra_maldicao') {
        // --- DESENHO DA SOMBRA DA MALDIÇÃO ---
        // Domo de sombra pulsante
        ctx.fillStyle = isFlashing ? '#ffffff' : 'rgba(44, 11, 35, 0.85)';
        ctx.beginPath();
        ctx.arc(0, 0, currentBoss.width / 2, 0, Math.PI * 2);
        ctx.fill();

        // Chamas sombrias exteriores
        ctx.fillStyle = 'rgba(142, 68, 173, 0.4)';
        ctx.beginPath();
        ctx.arc(0, 0, currentBoss.width / 1.6, 0, Math.PI * 2);
        ctx.fill();

        // Asas / Tentáculos de fumaça
        ctx.fillStyle = isFlashing ? '#ffffff' : '#1e0822';
        for (let a = -1; a <= 1; a += 2) {
            ctx.beginPath();
            ctx.moveTo(a * 15, -10);
            ctx.lineTo(a * 35, -28);
            ctx.lineTo(a * 30, 10);
            ctx.closePath();
            ctx.fill();
        }

        // Núcleo / Ponto Fraco (Olho Sagrado da Maldição no topo)
        ctx.fillStyle = '#f1c40f';
        ctx.beginPath();
        ctx.arc(0, -currentBoss.height / 4, 12, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#e74c3c';
        ctx.beginPath();
        ctx.arc(0, -currentBoss.height / 4, 6, 0, Math.PI * 2);
        ctx.fill();

        // Pupila demoníaca
        ctx.fillStyle = '#000000';
        ctx.fillRect(-2, -currentBoss.height / 4 - 6, 4, 12);
    }

    ctx.restore();

    // Desenhar projéteis do chefe
    bossProjectiles.forEach(p => {
        ctx.fillStyle = '#ff4757';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffd700';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 0.5, 0, Math.PI * 2);
        ctx.fill();
    });
}

function drawItems() {
    const time = Date.now() * 0.005;
    items.forEach(item => {
        if (!item.collected) {
            const hoverY = item.y + Math.sin(time + item.x) * 4;

            if (item.type === 'essence') {
                ctx.fillStyle = 'rgba(0, 206, 201, 0.35)';
                ctx.beginPath();
                ctx.arc(item.x, hoverY, item.radius * 1.5, 0, Math.PI * 2);
                ctx.fill();

                ctx.fillStyle = '#00cec9';
                ctx.beginPath();
                ctx.arc(item.x, hoverY, item.radius, 0, Math.PI * 2);
                ctx.fill();

                ctx.fillStyle = '#ffffff';
                ctx.beginPath();
                ctx.arc(item.x - 3, hoverY - 3, item.radius * 0.45, 0, Math.PI * 2);
                ctx.fill();
            } else if (item.type === 'acai') {
                ctx.fillStyle = '#4a0e4e';
                ctx.beginPath();
                ctx.arc(item.x, hoverY, item.radius, 0, Math.PI * 2);
                ctx.fill();

                ctx.fillStyle = '#bb68c8';
                ctx.beginPath();
                ctx.arc(item.x - 3, hoverY - 3, item.radius * 0.35, 0, Math.PI * 2);
                ctx.fill();

                ctx.fillStyle = '#2ecc71';
                ctx.fillRect(item.x - 2, hoverY - item.radius - 3, 4, 4);
            } else if (item.type === 'guarana') {
                ctx.fillStyle = '#c0392b';
                ctx.beginPath();
                ctx.arc(item.x, hoverY, item.radius, 0, Math.PI * 2);
                ctx.fill();

                ctx.fillStyle = '#ffffff';
                ctx.beginPath();
                ctx.arc(item.x, hoverY, item.radius * 0.65, 0, Math.PI * 2);
                ctx.fill();

                ctx.fillStyle = '#000000';
                ctx.beginPath();
                ctx.arc(item.x, hoverY, item.radius * 0.35, 0, Math.PI * 2);
                ctx.fill();

                ctx.fillStyle = 'rgba(241, 196, 15, 0.35)';
                ctx.beginPath();
                ctx.arc(item.x, hoverY, item.radius * 1.6, 0, Math.PI * 2);
                ctx.fill();
            } else if (item.type === 'heart') {
                ctx.fillStyle = '#e74c3c';
                ctx.font = '20px sans-serif';
                ctx.fillText('❤️', item.x - 10, hoverY + 8);
            }
        }
    });
}

function drawEnemies() {
    botos.forEach(boto => {
        if (boto.isJumping) {
            ctx.save();
            ctx.translate(boto.x + boto.width / 2, boto.y + boto.height / 2);
            const angle = Math.atan2(boto.velY, 5) * 0.5;
            ctx.rotate(angle);

            ctx.fillStyle = '#ff99c8';
            ctx.beginPath();
            ctx.ellipse(0, 0, boto.width / 2, boto.height / 2, 0, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillRect(14, -3, 10, 6);

            ctx.beginPath();
            ctx.moveTo(-6, -boto.height / 2);
            ctx.lineTo(2, -boto.height / 2 - 8);
            ctx.lineTo(8, -boto.height / 2);
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(-boto.width / 2, 0);
            ctx.lineTo(-boto.width / 2 - 10, -8);
            ctx.lineTo(-boto.width / 2 - 10, 8);
            ctx.fill();

            ctx.fillStyle = '#000';
            ctx.beginPath();
            ctx.arc(10, -4, 2.5, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
        }
    });

    boitatas.forEach(boi => {
        ctx.fillStyle = '#e67e22';
        ctx.beginPath();
        ctx.arc(boi.x + boi.width / 2, boi.y + boi.height / 2, boi.width / 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#f1c40f';
        ctx.beginPath();
        ctx.arc(boi.x + boi.width / 2, boi.y + boi.height / 2, boi.width / 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#c0392b';
        ctx.beginPath();
        ctx.arc(boi.x + (boi.dir > 0 ? 22 : 10), boi.y + 12, 3, 0, Math.PI * 2);
        ctx.fill();
    });
}

// ==========================================================
// 13. DESENHO DO JOGADOR (METAMORFOSE VISUAL PROGRESSIVA)
// ==========================================================
function drawPlayer() {
    if (player.invulnerableTimer > 0 && Math.floor(player.invulnerableTimer / 4) % 2 === 0) {
        return;
    }

    ctx.save();
    ctx.translate(player.x + player.width / 2, player.y + player.height / 2);
    if (player.facing === -1) {
        ctx.scale(-1, 1);
    }

    const legOffset = Math.sin(player.walkFrame) * 6;

    if (player.guaranaTimer > 0) {
        ctx.fillStyle = 'rgba(255, 215, 0, 0.35)';
        ctx.beginPath();
        ctx.arc(0, 0, 32, 0, Math.PI * 2);
        ctx.fill();
    }

    if (humanity < 26) {
        // Estágio 1: Esqueleto Puro
        ctx.fillStyle = '#f5f6fa';
        ctx.beginPath();
        ctx.arc(0, -16, 11, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillRect(-6, -7, 12, 6);

        ctx.fillStyle = '#2ecc71';
        ctx.fillRect(1, -18, 4, 5);
        ctx.fillRect(6, -18, 4, 5);

        ctx.fillStyle = '#dcdde1';
        ctx.fillRect(-2, -1, 4, 18);
        ctx.fillRect(-8, 3, 16, 3);
        ctx.fillRect(-7, 8, 14, 3);
        ctx.fillRect(-6, 13, 12, 3);

        ctx.fillStyle = '#f5f6fa';
        ctx.fillRect(-6, 2, 3, 14);
        ctx.fillRect(4, 2, 3, 14);

        if (player.grounded) {
            ctx.fillRect(-6, 17, 4, 10 + legOffset);
            ctx.fillRect(2, 17, 4, 10 - legOffset);
        } else {
            ctx.fillRect(-6, 17, 4, 8);
            ctx.fillRect(2, 17, 4, 8);
        }
    } else if (humanity < 51) {
        // Estágio 2: Músculo e Folhas Vivas
        ctx.fillStyle = '#d89b62';
        ctx.beginPath();
        ctx.arc(0, -16, 11, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#f39c12';
        ctx.fillRect(2, -18, 4, 4);

        ctx.fillStyle = '#27ae60';
        ctx.beginPath();
        ctx.moveTo(-10, -5);
        ctx.lineTo(10, -5);
        ctx.lineTo(12, 18);
        ctx.lineTo(-12, 18);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#c0392b';
        ctx.fillRect(-4, 0, 8, 14);

        ctx.fillStyle = '#d89b62';
        ctx.fillRect(-7, 2, 4, 14);
        ctx.fillRect(4, 2, 4, 14);

        if (player.grounded) {
            ctx.fillRect(-6, 17, 4, 10 + legOffset);
            ctx.fillRect(2, 17, 4, 10 - legOffset);
        } else {
            ctx.fillRect(-6, 17, 4, 8);
            ctx.fillRect(2, 17, 4, 8);
        }
    } else if (humanity < 76) {
        // Estágio 3: Guerreiro em Metamorfose
        ctx.fillStyle = '#c68642';
        ctx.beginPath();
        ctx.arc(0, -16, 11, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#1e272e';
        ctx.fillRect(-10, -26, 20, 10);

        ctx.fillStyle = '#e74c3c';
        ctx.fillRect(2, -16, 6, 3);

        ctx.fillStyle = '#000';
        ctx.fillRect(4, -18, 3, 3);

        ctx.fillStyle = '#1e824c';
        ctx.fillRect(-8, -2, 16, 18);
        ctx.fillStyle = '#f1c40f';
        ctx.fillRect(-8, 8, 16, 4);

        ctx.fillStyle = '#c68642';
        ctx.fillRect(-7, 2, 4, 14);
        ctx.fillRect(4, 2, 4, 14);

        ctx.fillStyle = '#5c3a21';
        if (player.grounded) {
            ctx.fillRect(-6, 17, 4, 10 + legOffset);
            ctx.fillRect(2, 17, 4, 10 - legOffset);
        } else {
            ctx.fillRect(-6, 17, 4, 8);
            ctx.fillRect(2, 17, 4, 8);
        }
    } else {
        // Estágio 4: Guerreiro Humano Pleno
        ctx.fillStyle = 'rgba(0, 206, 201, 0.2)';
        ctx.beginPath();
        ctx.arc(0, 0, 30, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#b57434';
        ctx.beginPath();
        ctx.arc(0, -16, 11, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#0f1416';
        ctx.fillRect(-11, -26, 22, 12);
        ctx.fillRect(-11, -14, 5, 14);

        ctx.fillStyle = '#f1c40f';
        ctx.fillRect(-10, -22, 20, 3);
        ctx.fillStyle = '#e74c3c';
        ctx.fillRect(-10, -29, 3, 7);

        ctx.fillStyle = '#000000';
        ctx.fillRect(3, -17, 3, 3);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(4, -18, 1, 1);

        ctx.fillStyle = '#27ae60';
        ctx.fillRect(-9, -2, 18, 18);
        ctx.fillStyle = '#e67e22';
        ctx.fillRect(-9, 6, 18, 5);

        ctx.fillStyle = '#f39c12';
        ctx.beginPath();
        ctx.arc(0, -3, 5, 0, Math.PI);
        ctx.stroke();

        ctx.fillStyle = '#b57434';
        ctx.fillRect(-8, 2, 4, 14);
        ctx.fillRect(5, 2, 4, 14);

        ctx.fillStyle = '#2c3e50';
        if (player.grounded) {
            ctx.fillRect(-6, 17, 5, 10 + legOffset);
            ctx.fillRect(2, 17, 5, 10 - legOffset);
        } else {
            ctx.fillRect(-6, 17, 5, 8);
            ctx.fillRect(2, 17, 5, 8);
        }
    }

    ctx.restore();
}

function drawParticles() {
    particles.forEach(p => {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
    });
    ctx.globalAlpha = 1.0;
}

// ==========================================================
// 14. LOOP PRINCIPAL DO JOGO
// ==========================================================
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// ==========================================================
// 15. GESTÃO DE TELAS, CONTROLES TOUCH E EVENTOS
// ==========================================================
function togglePause() {
    if (currentState === GAME_STATE.PLAYING) {
        currentState = GAME_STATE.PAUSED;
        document.getElementById('pause-stage').innerText = `${currentStage + 1}/${TOTAL_STAGES}`;
        document.getElementById('pause-humanity').innerText = `${humanity}%`;
        document.getElementById('pause-menu').classList.remove('hidden');
    } else if (currentState === GAME_STATE.PAUSED) {
        currentState = GAME_STATE.PLAYING;
        document.getElementById('pause-menu').classList.add('hidden');
    }
}

function returnToMainMenu() {
    currentState = GAME_STATE.MENU;
    document.getElementById('pause-menu').classList.add('hidden');
    document.getElementById('stage-clear-screen').classList.add('hidden');
    document.getElementById('incomplete-humanity-screen').classList.add('hidden');
    document.getElementById('game-over-screen').classList.add('hidden');
    document.getElementById('victory-screen').classList.add('hidden');
    document.getElementById('modal-select-stage').classList.add('hidden');
    document.getElementById('main-menu').classList.remove('hidden');
    camera.isLocked = false;
    hideBossHUD();
    updateMenuSaveUI();
}

function startNewGame() {
    audio.init();
    audio.playClick();
    document.getElementById('main-menu').classList.add('hidden');
    document.getElementById('pause-menu').classList.add('hidden');
    document.getElementById('stage-clear-screen').classList.add('hidden');
    document.getElementById('incomplete-humanity-screen').classList.add('hidden');
    document.getElementById('game-over-screen').classList.add('hidden');
    document.getElementById('victory-screen').classList.add('hidden');

    loadStage(0, false);
    currentState = GAME_STATE.PLAYING;
}

function continueSavedGame() {
    audio.init();
    audio.playClick();
    document.getElementById('main-menu').classList.add('hidden');
    document.getElementById('pause-menu').classList.add('hidden');
    document.getElementById('stage-clear-screen').classList.add('hidden');
    document.getElementById('incomplete-humanity-screen').classList.add('hidden');
    document.getElementById('game-over-screen').classList.add('hidden');
    document.getElementById('victory-screen').classList.add('hidden');

    loadStage(maxUnlockedStage, true);
    currentState = GAME_STATE.PLAYING;
}

// ----------------------------------------------------------
// CONTROLES TOUCH VIRTUAIS (CELULAR E COMPUTADOR)
// ----------------------------------------------------------
function setupTouchControls() {
    const btnLeft = document.getElementById('touch-btn-left');
    const btnRight = document.getElementById('touch-btn-right');
    const btnJump = document.getElementById('touch-btn-jump');

    function bindTouch(btn, onDown, onUp) {
        // Touch
        btn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            audio.init();
            btn.classList.add('active');
            onDown();
        }, { passive: false });

        btn.addEventListener('touchend', (e) => {
            e.preventDefault();
            btn.classList.remove('active');
            onUp();
        }, { passive: false });

        btn.addEventListener('touchcancel', (e) => {
            e.preventDefault();
            btn.classList.remove('active');
            onUp();
        }, { passive: false });

        // Mouse (para testar cliques no PC)
        btn.addEventListener('mousedown', (e) => {
            e.preventDefault();
            audio.init();
            btn.classList.add('active');
            onDown();
        });

        btn.addEventListener('mouseup', (e) => {
            e.preventDefault();
            btn.classList.remove('active');
            onUp();
        });

        btn.addEventListener('mouseleave', (e) => {
            btn.classList.remove('active');
            onUp();
        });
    }

    bindTouch(btnLeft, () => { keys.left = true; }, () => { keys.left = false; });
    bindTouch(btnRight, () => { keys.right = true; }, () => { keys.right = false; });
    bindTouch(btnJump, () => { keys.jump = true; }, () => { keys.jump = false; });
}

// Teclado
window.addEventListener('keydown', (e) => {
    if (e.code === 'KeyD' || e.code === 'ArrowRight') keys.right = true;
    if (e.code === 'KeyA' || e.code === 'ArrowLeft') keys.left = true;
    if (e.code === 'Space' || e.code === 'KeyW' || e.code === 'ArrowUp') {
        keys.jump = true;
        if (e.code === 'Space' || e.code.startsWith('Arrow')) {
            e.preventDefault();
        }
    }

    if (e.code === 'Escape' || e.code === 'KeyP') {
        if (currentState === GAME_STATE.PLAYING || currentState === GAME_STATE.PAUSED) {
            togglePause();
        }
    }
});

window.addEventListener('keyup', (e) => {
    if (e.code === 'KeyD' || e.code === 'ArrowRight') keys.right = false;
    if (e.code === 'KeyA' || e.code === 'ArrowLeft') keys.left = false;
    if (e.code === 'Space' || e.code === 'KeyW' || e.code === 'ArrowUp') keys.jump = false;
});

// Botões do Menu Principal
document.getElementById('btn-start-game').addEventListener('click', startNewGame);
document.getElementById('btn-continue-game').addEventListener('click', continueSavedGame);
document.getElementById('btn-select-stage').addEventListener('click', () => {
    audio.init();
    openStageSelectModal();
});
document.getElementById('btn-close-stages').addEventListener('click', () => {
    audio.playClick();
    document.getElementById('modal-select-stage').classList.add('hidden');
});
document.getElementById('btn-back-from-stages').addEventListener('click', () => {
    audio.playClick();
    document.getElementById('modal-select-stage').classList.add('hidden');
});

// Reset do Zero
document.getElementById('btn-menu-reset-all').addEventListener('click', resetAllProgress);
document.getElementById('btn-vic-reset-all').addEventListener('click', resetAllProgress);

// Modais Informativos
document.getElementById('btn-how-to-play').addEventListener('click', () => {
    audio.init();
    audio.playClick();
    document.getElementById('modal-how-to-play').classList.remove('hidden');
});
document.getElementById('btn-close-how').addEventListener('click', () => {
    document.getElementById('modal-how-to-play').classList.add('hidden');
});
document.getElementById('btn-ok-how').addEventListener('click', () => {
    document.getElementById('modal-how-to-play').classList.add('hidden');
});

document.getElementById('btn-story').addEventListener('click', () => {
    audio.init();
    audio.playClick();
    document.getElementById('modal-story').classList.remove('hidden');
});
document.getElementById('btn-close-story').addEventListener('click', () => {
    document.getElementById('modal-story').classList.add('hidden');
});
document.getElementById('btn-ok-story').addEventListener('click', () => {
    document.getElementById('modal-story').classList.add('hidden');
});

// Pausa
document.getElementById('btn-pause').addEventListener('click', () => {
    audio.init();
    audio.playClick();
    togglePause();
});
document.getElementById('btn-resume').addEventListener('click', () => {
    audio.playClick();
    togglePause();
});
document.getElementById('btn-restart-level').addEventListener('click', () => {
    audio.playClick();
    document.getElementById('pause-menu').classList.add('hidden');
    loadStage(currentStage, true);
    currentState = GAME_STATE.PLAYING;
});
document.getElementById('btn-pause-select-stage').addEventListener('click', () => {
    audio.playClick();
    openStageSelectModal();
});
document.getElementById('btn-quit-to-menu').addEventListener('click', () => {
    audio.playClick();
    returnToMainMenu();
});

// Transições de Fase
document.getElementById('btn-next-stage').addEventListener('click', () => {
    audio.playClick();
    advanceToNextStage();
});
document.getElementById('btn-clear-to-stages').addEventListener('click', () => {
    audio.playClick();
    document.getElementById('stage-clear-screen').classList.add('hidden');
    openStageSelectModal();
});

// Alerta de Humanidade Incompleta na Fase 10
document.getElementById('btn-retry-stage10').addEventListener('click', () => {
    audio.playClick();
    document.getElementById('incomplete-humanity-screen').classList.add('hidden');
    currentState = GAME_STATE.PLAYING;
});
document.getElementById('btn-warn-select-stage').addEventListener('click', () => {
    audio.playClick();
    document.getElementById('incomplete-humanity-screen').classList.add('hidden');
    openStageSelectModal();
});

// Áudio Toggle
function handleAudioToggle() {
    audio.init();
    const enabled = audio.toggle();
    document.getElementById('btn-sound-toggle').innerText = enabled ? '🔊' : '🔇';
    document.getElementById('btn-pause-sound').innerText = enabled ? 'ÁUDIO: ATIVADO' : 'ÁUDIO: DESATIVADO';
}
document.getElementById('btn-sound-toggle').addEventListener('click', handleAudioToggle);
document.getElementById('btn-pause-sound').addEventListener('click', handleAudioToggle);

// Game Over & Vitória
document.getElementById('btn-retry-checkpoint').addEventListener('click', () => {
    audio.playClick();
    document.getElementById('game-over-screen').classList.add('hidden');
    player.x = player.checkpoint.x;
    player.y = player.checkpoint.y;
    player.velX = 0;
    player.velY = 0;
    player.lives = player.maxLives;
    updateHUDHearts();
    currentState = GAME_STATE.PLAYING;
});
document.getElementById('btn-restart-game').addEventListener('click', () => {
    audio.playClick();
    document.getElementById('game-over-screen').classList.add('hidden');
    loadStage(currentStage, true);
    currentState = GAME_STATE.PLAYING;
});
document.getElementById('btn-go-to-stages').addEventListener('click', () => {
    audio.playClick();
    document.getElementById('game-over-screen').classList.add('hidden');
    openStageSelectModal();
});
document.getElementById('btn-go-to-menu').addEventListener('click', () => {
    audio.playClick();
    returnToMainMenu();
});
document.getElementById('btn-play-again').addEventListener('click', () => {
    audio.playClick();
    startNewGame();
});
document.getElementById('btn-vic-to-stages').addEventListener('click', () => {
    audio.playClick();
    document.getElementById('victory-screen').classList.add('hidden');
    openStageSelectModal();
});
document.getElementById('btn-vic-to-menu').addEventListener('click', () => {
    audio.playClick();
    returnToMainMenu();
});

// Inicialização
setupTouchControls();
loadSavedData();
loadStage(0, false);
gameLoop();
