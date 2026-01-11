import * as THREE from 'three';

type FireCallback = (screenPosition: THREE.Vector2) => void;
type MoveCallback = (screenPosition: THREE.Vector2) => void;

export class InputManager {
  private element: HTMLElement;
  private currentPosition: THREE.Vector2 = new THREE.Vector2();
  private isPressed = false;

  // Callbacks
  public onFire: FireCallback | null = null;
  public onMove: MoveCallback | null = null;

  // Bound handlers for cleanup
  private boundMouseMove: (e: MouseEvent) => void;
  private boundMouseDown: (e: MouseEvent) => void;
  private boundMouseUp: (e: MouseEvent) => void;
  private boundTouchStart: (e: TouchEvent) => void;
  private boundTouchMove: (e: TouchEvent) => void;
  private boundTouchEnd: (e: TouchEvent) => void;
  private boundContextMenu: (e: Event) => void;

  constructor(element: HTMLElement) {
    this.element = element;

    // Bind handlers
    this.boundMouseMove = this.handleMouseMove.bind(this);
    this.boundMouseDown = this.handleMouseDown.bind(this);
    this.boundMouseUp = this.handleMouseUp.bind(this);
    this.boundTouchStart = this.handleTouchStart.bind(this);
    this.boundTouchMove = this.handleTouchMove.bind(this);
    this.boundTouchEnd = this.handleTouchEnd.bind(this);
    this.boundContextMenu = (e) => e.preventDefault();

    // Add listeners
    element.addEventListener('mousemove', this.boundMouseMove);
    element.addEventListener('mousedown', this.boundMouseDown);
    element.addEventListener('mouseup', this.boundMouseUp);
    element.addEventListener('touchstart', this.boundTouchStart, { passive: false });
    element.addEventListener('touchmove', this.boundTouchMove, { passive: false });
    element.addEventListener('touchend', this.boundTouchEnd);
    element.addEventListener('contextmenu', this.boundContextMenu);
  }

  private updatePosition(clientX: number, clientY: number): void {
    const rect = this.element.getBoundingClientRect();
    this.currentPosition.set(
      clientX - rect.left,
      clientY - rect.top
    );
  }

  private handleMouseMove(e: MouseEvent): void {
    this.updatePosition(e.clientX, e.clientY);
    this.onMove?.(this.currentPosition.clone());
  }

  private handleMouseDown(e: MouseEvent): void {
    if (e.button !== 0) return; // Left click only

    this.isPressed = true;
    this.updatePosition(e.clientX, e.clientY);
    this.onFire?.(this.currentPosition.clone());
  }

  private handleMouseUp(e: MouseEvent): void {
    if (e.button !== 0) return;
    this.isPressed = false;
  }

  private handleTouchStart(e: TouchEvent): void {
    e.preventDefault();
    if (e.touches.length === 0) return;

    const touch = e.touches[0];
    this.isPressed = true;
    this.updatePosition(touch.clientX, touch.clientY);
    this.onFire?.(this.currentPosition.clone());
  }

  private handleTouchMove(e: TouchEvent): void {
    e.preventDefault();
    if (e.touches.length === 0) return;

    const touch = e.touches[0];
    this.updatePosition(touch.clientX, touch.clientY);
    this.onMove?.(this.currentPosition.clone());
  }

  private handleTouchEnd(): void {
    this.isPressed = false;
  }

  public getPosition(): THREE.Vector2 {
    return this.currentPosition.clone();
  }

  public dispose(): void {
    this.element.removeEventListener('mousemove', this.boundMouseMove);
    this.element.removeEventListener('mousedown', this.boundMouseDown);
    this.element.removeEventListener('mouseup', this.boundMouseUp);
    this.element.removeEventListener('touchstart', this.boundTouchStart);
    this.element.removeEventListener('touchmove', this.boundTouchMove);
    this.element.removeEventListener('touchend', this.boundTouchEnd);
    this.element.removeEventListener('contextmenu', this.boundContextMenu);
  }
}
