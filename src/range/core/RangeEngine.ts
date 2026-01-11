import * as THREE from 'three';
import { Scene } from './Scene';
import { Camera } from './Camera';
import { Renderer } from './Renderer';
import { GameLoop } from './GameLoop';
import { GameState, GameStats, GameMode } from './GameState';
import { ImpactSystem } from '../systems/ImpactSystem';
import { InputManager } from '../interaction/InputManager';
import { RaycastManager } from '../interaction/RaycastManager';
import { GameModeBase } from '../modes/GameModeBase';
import { GridshotMode } from '../modes/GridshotMode';
import { SpidershotMode } from '../modes/SpidershotMode';
import { MicroshotMode } from '../modes/MicroshotMode';
import type { HitResult } from '../types';

export class RangeEngine {
  private container: HTMLElement;
  private scene: Scene;
  private camera: Camera;
  private renderer: Renderer;
  private gameLoop: GameLoop;

  // Game state
  public gameState: GameState;

  // Current mode
  private currentMode: GameModeBase | null = null;
  private modes: Map<GameMode, GameModeBase>;

  // Systems
  private impactSystem: ImpactSystem;

  // Interaction
  private inputManager: InputManager;
  private raycastManager: RaycastManager;

  // Callbacks for React
  public onStatsUpdate: ((stats: GameStats) => void) | null = null;
  public onGameEnd: ((stats: GameStats) => void) | null = null;

  constructor(container: HTMLElement) {
    this.container = container;

    // Initialize core
    this.scene = new Scene();
    this.camera = new Camera(container);
    this.renderer = new Renderer(container);

    // Attach canvas to DOM
    container.appendChild(this.renderer.domElement);

    // Initialize game state
    this.gameState = new GameState();
    this.gameState.onStateChange = (stats) => this.onStatsUpdate?.(stats);
    this.gameState.onGameEnd = (stats) => {
      this.currentMode?.stop();
      this.onGameEnd?.(stats);
    };

    // Initialize modes
    this.modes = new Map<GameMode, GameModeBase>([
      ['gridshot', new GridshotMode(this.scene.instance, this.gameState)],
      ['spidershot', new SpidershotMode(this.scene.instance, this.gameState)],
      ['microshot', new MicroshotMode(this.scene.instance, this.gameState)],
    ]);

    // Set initial visible bounds for all modes
    this.updateModeBounds();

    // Initialize systems
    this.impactSystem = new ImpactSystem(this.scene.instance);

    // Initialize interaction
    this.inputManager = new InputManager(this.renderer.domElement);
    this.raycastManager = new RaycastManager(this.camera.instance);

    // Game loop
    this.gameLoop = new GameLoop(this.update.bind(this));

    // Wire up events
    this.setupEvents();
  }

  private setupEvents(): void {
    this.inputManager.onFire = (screenPos) => this.handleFire(screenPos);
  }

  private handleFire(screenPos: THREE.Vector2): void {
    if (this.gameState.status !== 'playing' || !this.currentMode) return;

    // Get hit test objects from current mode
    const hitObjects = this.currentMode.getHitTestObjects();

    // Cast ray
    const hit = this.raycastManager.cast(screenPos, hitObjects);

    if (hit) {
      this.onHit(hit);
    } else {
      this.onMiss();
    }

    // Camera shake for feedback
    this.camera.shake(0.012, 0.06);
  }

  private onHit(hit: HitResult): void {
    if (!this.currentMode) return;

    // Trigger impact effects
    this.impactSystem.trigger(hit.point);

    // Notify mode
    this.currentMode.onHit(hit.targetId, hit.point);
  }

  private onMiss(): void {
    if (!this.currentMode) return;
    this.currentMode.onMiss();
  }

  private update(deltaTime: number): void {
    // Update game state
    this.gameState.update(deltaTime);

    // Update current mode
    if (this.currentMode && this.gameState.status === 'playing') {
      this.currentMode.update(deltaTime);
    }

    // Update effects
    this.impactSystem.update(deltaTime);

    // Render
    this.renderer.render(this.scene.instance, this.camera.instance);
  }

  // Public API for React components
  public setMode(mode: GameMode): void {
    this.gameState.setMode(mode);
    this.currentMode = this.modes.get(mode) ?? null;
  }

  public startGame(): void {
    if (!this.currentMode) {
      this.setMode('gridshot'); // Default
    }

    // Stop any existing game
    this.currentMode?.stop();

    // Start fresh
    this.gameState.startRound();
    this.currentMode?.start();
  }

  public stopGame(): void {
    this.currentMode?.stop();
    this.gameState.status = 'idle';
  }

  public start(): void {
    this.gameLoop.start();
  }

  public resize(): void {
    this.camera.resize(this.container);
    this.renderer.resize(this.container);
    this.updateModeBounds();
  }

  private updateModeBounds(): void {
    const bounds = this.camera.getVisibleBounds(0.8); // 80% of visible area
    for (const mode of this.modes.values()) {
      mode.setVisibleBounds(bounds);
    }
  }

  public dispose(): void {
    this.gameLoop.stop();
    this.inputManager.dispose();
    for (const mode of this.modes.values()) {
      mode.stop();
    }
    this.impactSystem.dispose();
    this.scene.dispose();
    this.renderer.dispose();
  }
}
