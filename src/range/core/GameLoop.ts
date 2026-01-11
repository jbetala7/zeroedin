import { TIMING } from '../utils/constants';

type UpdateCallback = (deltaTime: number) => void;

export class GameLoop {
  private isRunning = false;
  private lastTime = 0;
  private rafId: number | null = null;
  private updateFn: UpdateCallback;

  // Fixed timestep accumulator
  private accumulator = 0;
  private readonly frameTime = TIMING.FRAME_TIME;

  // Performance monitoring
  private frameCount = 0;
  private fpsTime = 0;
  public currentFps = 60;

  constructor(updateFn: UpdateCallback) {
    this.updateFn = updateFn;
  }

  public start(): void {
    if (this.isRunning) return;

    this.isRunning = true;
    this.lastTime = performance.now();
    this.fpsTime = this.lastTime;
    this.tick();
  }

  public stop(): void {
    this.isRunning = false;

    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  private tick = (): void => {
    if (!this.isRunning) return;

    const currentTime = performance.now();
    // Cap delta to prevent spiral of death
    const deltaTime = Math.min(currentTime - this.lastTime, 100);
    this.lastTime = currentTime;

    // Accumulate time
    this.accumulator += deltaTime;

    // Fixed timestep updates
    while (this.accumulator >= this.frameTime) {
      this.updateFn(this.frameTime / 1000); // Convert to seconds
      this.accumulator -= this.frameTime;
    }

    // FPS calculation
    this.frameCount++;
    if (currentTime - this.fpsTime >= 1000) {
      this.currentFps = this.frameCount;
      this.frameCount = 0;
      this.fpsTime = currentTime;
    }

    this.rafId = requestAnimationFrame(this.tick);
  };
}
